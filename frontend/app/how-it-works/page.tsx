import Link from "next/link";
import { Navbar } from "@/components/Navbar";

const steps = [
  { num: "01", title: "Lock your USDC", desc: "Create or join a pool. Choose the lock duration and deposit your USDC. Funds are secured in the smart contract on Arc." },
  { num: "02", title: "Hold to maturity", desc: "The countdown begins. Every second you hold, you keep your share of the bonus pool. Watch others crack under pressure." },
  { num: "03", title: "Quitters pay the penalty", desc: "Early exits pay a penalty (e.g. 20%). That penalty goes directly into the bonus pool for everyone who stays in." },
  { num: "04", title: "Claim your reward", desc: "When the lock ends, claim your original stake plus your proportional share of all penalty fees collected." },
];

export default function HowItWorksPage() {
  return (
    <div style={{ color: "#fff", position: "relative" }}>
      <div style={{
        position: "fixed", inset: 0, zIndex: -1,
        background: "radial-gradient(circle at top, rgba(99,102,241,0.22), transparent 35%), radial-gradient(circle at 80% 30%, rgba(16,185,129,0.14), transparent 25%), linear-gradient(to bottom, #0a0a0a, #111827)",
      }} />
      <Navbar />

      <main style={{ maxWidth: 860, margin: "0 auto", padding: "60px 32px 80px" }}>
        <div style={{ marginBottom: 64 }}>
          <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 600, letterSpacing: "-0.02em", marginBottom: 16 }}>How it works</h1>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "1rem", lineHeight: 1.7 }}>Four phases. One rule: Don&apos;t rage quit.</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {steps.map((step) => (
            <div key={step.num} style={{
              borderRadius: 24, border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.05)", padding: 24,
              display: "flex", gap: 24, alignItems: "flex-start",
            }}>
              <div style={{ fontSize: "0.85rem", color: "#6ee7b7", minWidth: 28, paddingTop: 2 }}>{step.num}</div>
              <div>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 600, marginBottom: 8 }}>{step.title}</h3>
                <p style={{ color: "rgba(255,255,255,0.65)", lineHeight: 1.75, fontSize: "0.9rem" }}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Example */}
        <div style={{ marginTop: 56 }}>
          <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.3em", color: "rgba(255,255,255,0.4)", marginBottom: 20 }}>Example</div>
          <div style={{ borderRadius: 24, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", padding: 28 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 24 }}>
              {[
                { user: "Player A", stake: "100 USDC", result: "Holds", color: "#6ee7b7" },
                { user: "Player B", stake: "200 USDC", result: "Rage Quits", color: "#f87171" },
                { user: "Player C", stake: "700 USDC", result: "Holds", color: "#6ee7b7" },
              ].map(({ user, stake, result, color }) => (
                <div key={user} style={{
                  textAlign: "center", padding: "16px 12px", borderRadius: 16,
                  border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)",
                }}>
                  <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>{user}</div>
                  <div style={{ fontSize: "1rem", fontWeight: 600, marginBottom: 6 }}>{stake}</div>
                  <div style={{ fontSize: "0.75rem", fontWeight: 600, color }}>{result}</div>
                </div>
              ))}
            </div>
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 20, display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                ["Player B penalty (20% of 200)", "— 40 USDC", "#f87171"],
                ["Player A claims", "105 USDC", "#6ee7b7"],
                ["Player C claims", "735 USDC", "#6ee7b7"],
              ].map(([label, value, color]) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem" }}>
                  <span style={{ color: "rgba(255,255,255,0.6)" }}>{label}</span>
                  <span style={{ color, fontWeight: 600 }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: 56 }}>
          <Link href="/create">
            <button style={{
              borderRadius: 9999, background: "#34d399", padding: "13px 36px",
              fontSize: "0.875rem", fontWeight: 600, color: "#0a0a0a", border: "none", cursor: "pointer",
            }}>
              Start a Pool
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
}
