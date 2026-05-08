/* Kernel contributions index */
const SS_K = window.SS_DATA;

const KernelRow = ({ k, i }) => (
  <div style={{
    display: "grid", gridTemplateColumns: "60px 220px 1fr 280px",
    gap: 20, padding: "32px 0",
    borderTop: i === 0 ? "1px solid var(--line-hi)" : "1px solid var(--line)",
    alignItems: "start",
  }}>
    <Mono color="var(--signal-2)" size={12}>0{i+1}</Mono>
    <Mono color="var(--fg)" size={14}>{k.subsystem}</Mono>
    <div>
      <div style={{ fontSize: 17, color: "var(--fg)", lineHeight: 1.5, letterSpacing: "-0.005em" }}>{k.vuln}</div>
    </div>
    <Mono color="var(--fg-2)" size={12} style={{ lineHeight: 1.6 }}>{k.status}</Mono>
  </div>
);

const KernelPage = () => (
  <div style={{ background: "var(--bg)", color: "var(--fg)", fontFamily: "var(--f-grot)", minHeight: "100vh" }}>
    <SiteNav active="research" />
    <HeroFrame
      eyebrow={<>linux kernel<br/>mainline<br/>2025–2026</>}
      title={<>kernel<br/><span style={{color:"var(--fg-3)"}}>contributions.</span></>}
      meta={<>5 mainline patches<br/>standard maintainer process<br/>backports where applicable</>}
      lede={<>Five vulnerabilities found, fixed, and merged through the standard maintainer process. <span style={{color:"var(--fg-2)"}}>io_uring/zcrx (a user_ref race producing a double-free that escalated to an OOB write), net/tipc, Bluetooth, RDMA/ionic, and net/rtnetlink. No drama, no out-of-tree patches — just the slow path: report, debug, propose, iterate, merge.</span></>}
      cta={<><CTA primary href="https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/log/?qt=author&q=aizen">git log on torvalds tree →</CTA><CTA href="/cves">cve ledger →</CTA></>}
    />

    <Section id="patches" label="01 · patches" hint="Subsystem · vulnerability class · ship status. All five upstream."
      title="5 mainline patches.">
      {SS_K.kernel.map((k, i) => <KernelRow key={k.subsystem} k={k} i={i} />)}
    </Section>

    <Section id="approach" sink label="02 · approach"
      hint="Kernel work is its own sub-discipline. Different cadence, different etiquette, different success criteria."
      title="how kernel work goes.">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
        {[
          ["Read the syzbot reports", "Most of these started by reading what syzbot already found and looking at the surrounding subsystem with a bit more care. The kernel community has the world's best fuzzer pointing at it 24/7. The job is filling in the part the fuzzer can't reason about — the lifecycle and protocol logic between crashes."],
          ["Reproduce in a VM, not on hardware", "QEMU + kernel-under-test + a minimal initramfs. Faster iteration, no kernel panics on the development laptop, easier to share a reproducer with the maintainer."],
          ["Patch first, writeup later", "If you have a patch ready when you report, the maintainer's job is review instead of triage. The fix lands faster and you don't end up arguing about scope with someone who has 200 other things to do."],
          ["No security theater in commit messages", "Commit messages describe what the patch does and why, not how cool the bug is. The maintainer cares about the diff, not the marketing."],
        ].map(([t, d], i) => (
          <div key={i} style={{ padding: "24px 0", borderTop: i < 2 ? "1px solid var(--line-hi)" : "1px solid var(--line)" }}>
            <div style={{ fontSize: 18, fontWeight: 500, color: "var(--fg)", letterSpacing: "-0.01em" }}>{t}</div>
            <p style={{ margin: "10px 0 0", fontSize: 14, color: "var(--fg-2)", lineHeight: 1.6 }}>{d}</p>
          </div>
        ))}
      </div>
    </Section>

    <SiteFooter section="kernel" />
  </div>
);

Object.assign(window, { KernelPage });
