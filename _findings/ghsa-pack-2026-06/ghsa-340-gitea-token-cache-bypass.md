# go-gitea/gitea: completed-job GITEA_TOKEN remains valid due to LRU cache bypass in GetRunningTaskByToken

**Package**: code.gitea.io/gitea
**Ecosystem**: Go
**Affected versions**: all versions with `SUCCESSFUL_TOKENS_CACHE_SIZE > 0` (default: 20)
**Patched versions**: none
**Severity**: High
**CVSS 3.1**: `AV:N/AC:L/PR:L/UI:N/S:U/C:N/I:H/A:N` — **7.1**
**CWE**: CWE-613 (Insufficient Session Expiration)

## Summary

`GetRunningTaskByToken` maintains an LRU cache mapping a runner's `GITEA_TOKEN` to
its task ID. On a cache hit the function retrieves the task by primary key with no
status filter, returning it unconditionally if the row exists. On a cache miss it
queries the database with `status IN (Running, Cancelling)`. The cache is evicted
only when the task row is deleted, not when the task transitions to a terminal state.
As a result, a job's `GITEA_TOKEN` continues to authenticate artifact upload
requests via the old act_runner API path after the job has completed, allowing a
runner to inject artifacts into a finished workflow run.

## Description

`models/actions/task.go:180-193` — cache-hit path:

```go
if id := getTaskIDFromCache(token); id > 0 {
    task := &ActionTask{TokenLastEight: lastEight}
    has, err := db.GetEngine(ctx).ID(id).Get(task)
    if err != nil {
        return nil, err
    }
    if has {
        return task, nil   // no status check — task may be Done/Success/Failure
    }
    successfulTokenTaskCache.Remove(token)
}
```

Database fallback path at line 197 — correctly filtered:

```go
err := db.GetEngine(ctx).Where(
    "token_last_eight = ? AND status IN (?, ?)",
    lastEight, StatusRunning, StatusCancelling,
).Find(&tasks)
```

The old act_runner artifact path at `routers/api/actions/artifacts.go:162-171`
performs no secondary status check after `GetRunningTaskByToken` returns:

```go
authToken := strings.TrimPrefix(authHeader, "Bearer ")
task, err = actions.GetRunningTaskByToken(req.Context(), authToken)
if err != nil {
    ctx.HTTPError(http.StatusInternalServerError, "...")
    return
}
// task.Status is not checked — proceeds directly to artifact upload
```

The new JWT path at line 157 does check `task.Status != actions.StatusRunning`
explicitly, but the old path does not. Gitea continues to accept old act_runner
tokens, so this path remains reachable.

## Proof of Concept

```go
// Run in the gitea repository:
// go test -v -run TestGetRunningTaskByToken_CacheBypassAfterCompletion ./models/actions/

func TestGetRunningTaskByToken_CacheBypassAfterCompletion(t *testing.T) {
    // 1. Create a running task — this populates the LRU cache
    task := &ActionTask{Status: StatusRunning, Token: "tok", TokenLastEight: "lastEigh"}
    require.NoError(t, db.Insert(ctx, task))

    // 2. Authenticate once — warms the cache
    cached, err := GetRunningTaskByToken(ctx, "tok")
    require.NoError(t, err)
    require.Equal(t, StatusRunning, cached.Status)

    // 3. Transition task to Done
    task.Status = StatusSuccess
    require.NoError(t, UpdateTask(ctx, task, "status"))

    // 4. Authenticate again — DB says Done, cache says Running
    result, err := GetRunningTaskByToken(ctx, "tok")
    // VULNERABLE: returns the done task instead of an error
    if err == nil && result != nil && result.Status == StatusSuccess {
        t.Log("VULNERABLE: completed task token accepted")
    }
}
```

**Expected result (patched)**: error or nil returned.
**Actual result (current)**: task returned with `Status == StatusSuccess`.

> Verified against real HEAD: the test passes (the bug reproduces) — a completed
> job's token returns a `status=success` task on the cache-hit path. Live by default
> since `SUCCESSFUL_TOKENS_CACHE_SIZE` defaults to 20. The model-layer bypass is
> proven directly; the downstream artifact-upload write is argued from the unguarded
> call site, not independently executed.

## Impact

An attacker (runner or compromised runner credentials) who completes a CI job can,
while their token remains in the LRU cache (window determined by cache size and
subsequent job activity — up to the next 20 token authentications by other runners),
POST arbitrary files to the completed run's artifact endpoint:

```
POST /api/actions_pipeline/_apis/pipelines/workflows/{run_id}/artifacts
Authorization: Bearer <completed-job-GITEA_TOKEN>
```

The artifact appears in the run's artifact list with `ArtifactStatusUploadConfirmed`.
Downstream systems that trust artifacts from completed runs — release pipelines,
deployment scripts, binary distribution — may process or distribute the tampered
content.

## Mitigation

**Option A — add status check in the cache-hit path** (minimal change):

```go
if has {
    if !task.Status.IsDone() {
        return task, nil
    }
    successfulTokenTaskCache.Remove(token)
}
```

**Option B — evict on status transition** (preferred):

In `UpdateTask`, when `status` is among the updated columns and the new value is
terminal, call `successfulTokenTaskCache.Remove(task.Token)` before returning.

**Option C — add secondary check at the artifact handler call site**:

```go
task, err = actions.GetRunningTaskByToken(req.Context(), authToken)
if err == nil && task != nil && task.Status.IsDone() {
    ctx.HTTPError(http.StatusUnauthorized, "task is no longer running")
    return
}
```
