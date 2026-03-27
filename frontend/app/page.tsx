"use client";

import Link from "next/link";
import { useReadContract } from "wagmi";
import { ABI, CONTRACT_ADDRESS } from "@/lib/contract";

export default function HomePage() {
  const { data: poolCount } = useReadContract({ address: CONTRACT_ADDRESS, abi: ABI, functionName: "poolCount" });
  const count = poolCount !== undefined ? Number(poolCount) : null;

  return (
    <div style={{ color: "#fff", minHeight: "100vh" }}>
      {/* Background */}
      <div style={{
        position: "fixed", inset: 0, zIndex: -1,
        background: "radial-gradient(circle at top, rgba(99,102,241,0.22), transparent 35%), radial-gradient(circle at 80% 30%, rgba(16,185,129,0.14), transparent 25%), linear-gradient(to bottom, #0a0a0a, #111827)",
      }} />

      {/* ── Header ── */}
      <header style={{
        maxWidth: 1280, margin: "0 auto",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "24px 32px",
      }}>
        <div>
          <div style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.35em", color: "rgba(167,243,208,0.8)" }}>
            Live on Arc Testnet
          </div>
          <div style={{ marginTop: 4, fontSize: "1.35rem", fontWeight: 600 }}>
            Rage Quit Saving
          </div>
        </div>

        <nav style={{ display: "flex", gap: 32 }}>
          {[["Home", "/"], ["How it works", "/how-it-works"], ["Pools", "/pools"], ["Create", "/create"]].map(([label, href]) => (
            <Link key={href} href={href} style={{
              fontSize: "0.9rem", color: "rgba(255,255,255,0.7)",
              textDecoration: "none", transition: "color 0.2s",
            }}>
              {label}
            </Link>
          ))}
        </nav>

        <Link href="/pools">
          <button style={{
            borderRadius: 9999, border: "1px solid rgba(255,255,255,0.15)",
            background: "rgba(255,255,255,0.1)", padding: "8px 18px",
            fontSize: "0.875rem", fontWeight: 500, color: "#fff",
            cursor: "pointer", backdropFilter: "blur(8px)",
          }}>
            Launch App
          </button>
        </Link>
      </header>

      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 32px 80px" }}>

        {/* ── Hero ── */}
        <section style={{ display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: 48, alignItems: "center" }}>

          {/* Left */}
          <div>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              borderRadius: 9999, border: "1px solid rgba(52,211,153,0.2)",
              background: "rgba(52,211,153,0.1)", padding: "4px 12px",
              fontSize: "0.875rem", color: "#a7f3d0",
            }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#6ee7b7" }} />
              Lock it. Hold it. Win it.
            </div>

            <h1 style={{
              marginTop: 24, fontSize: "clamp(2.6rem, 4.5vw, 4.5rem)",
              fontWeight: 600, lineHeight: 1.08, letterSpacing: "-0.03em", maxWidth: 680,
            }}>
              A Savings Pool Where Patience Pays and Losers Fund Winners
            </h1>

            <p style={{
              marginTop: 24, fontSize: "1.1rem", lineHeight: 1.75,
              color: "rgba(255,255,255,0.7)", maxWidth: 560,
            }}>
              Lock USDC with others. Whoever holds until the end splits the penalty fees from everyone who quit early. The longer you hold, the more you earn.
            </p>

            <div style={{ display: "flex", gap: 16, marginTop: 32, flexWrap: "wrap" }}>
              <Link href="/create">
                <button style={{
                  borderRadius: 9999, background: "#34d399",
                  padding: "13px 28px", fontSize: "0.9rem", fontWeight: 600,
                  color: "#0a0a0a", border: "none", cursor: "pointer",
                }}>
                  Start a Pool
                </button>
              </Link>
              <Link href="/pools">
                <button style={{
                  borderRadius: 9999, border: "1px solid rgba(255,255,255,0.15)",
                  background: "rgba(255,255,255,0.05)", padding: "13px 28px",
                  fontSize: "0.9rem", fontWeight: 600, color: "#fff", cursor: "pointer",
                }}>
                  View Pools
                </button>
              </Link>
            </div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginTop: 40, maxWidth: 480 }}>
              {[
                ["12,480 USDC", "Locked now"],
                ["842 USDC", "Quit penalties"],
                ["1,284", "Still holding"],
              ].map(([value, label]) => (
                <div key={label} style={{
                  borderRadius: 16, border: "1px solid rgba(255,255,255,0.1)",
                  background: "rgba(255,255,255,0.05)", padding: 16, backdropFilter: "blur(8px)",
                }}>
                  <div style={{ fontSize: "1.1rem", fontWeight: 600, whiteSpace: "nowrap" }}>{value}</div>
                  <div style={{ marginTop: 4, fontSize: "0.8rem", color: "rgba(255,255,255,0.6)" }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — pool card */}
          <div style={{ position: "relative" }}>
            <div style={{
              position: "absolute", inset: -24, borderRadius: 32,
              background: "rgba(52,211,153,0.1)", filter: "blur(48px)", pointerEvents: "none",
            }} />
            <div style={{
              position: "relative", borderRadius: 32,
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.05)", padding: 20,
              backdropFilter: "blur(20px)", boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
            }}>
              <div style={{
                borderRadius: 24, border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(17,17,17,0.9)", padding: 20,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.5)" }}>Standard Pool</div>
                    <div style={{ marginTop: 4, fontSize: "1.4rem", fontWeight: 600 }}>30-Day Hold</div>
                  </div>
                  <div style={{
                    borderRadius: 9999, border: "1px solid rgba(52,211,153,0.2)",
                    background: "rgba(52,211,153,0.1)", padding: "4px 12px",
                    fontSize: "0.8rem", color: "#a7f3d0",
                  }}>Live</div>
                </div>

                <div style={{
                  marginTop: 24, borderRadius: 16,
                  background: "linear-gradient(135deg, rgba(52,211,153,0.2), rgba(6,182,212,0.1))",
                  padding: 20,
                }}>
                  <div style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.6)" }}>Your projected return</div>
                  <div style={{ marginTop: 8, fontSize: "2.8rem", fontWeight: 600, lineHeight: 1 }}>112.8 USDC</div>
                  <div style={{ marginTop: 8, fontSize: "0.85rem", color: "#6ee7b7" }}>+12.8 USDC if current quit rate holds</div>
                </div>

                <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 10 }}>
                  {[
                    ["Min deposit", "100 USDC"],
                    ["Early exit penalty", "20%"],
                    ["Players still in", "482"],
                    ["Days remaining", "14"],
                  ].map(([label, value]) => (
                    <div key={label} style={{
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      borderRadius: 12, border: "1px solid rgba(255,255,255,0.06)",
                      background: "rgba(255,255,255,0.03)", padding: "12px 16px",
                    }}>
                      <span style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.875rem" }}>{label}</span>
                      <span style={{ fontWeight: 500, fontSize: "0.875rem" }}>{value}</span>
                    </div>
                  ))}
                </div>

                <Link href="/create" style={{ display: "block", marginTop: 20 }}>
                  <button style={{
                    width: "100%", borderRadius: 16, background: "#fff",
                    padding: "14px 20px", fontSize: "0.875rem", fontWeight: 600,
                    color: "#0a0a0a", border: "none", cursor: "pointer",
                  }}>
                    Join the pool
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── How it works ── */}
        <section id="how" style={{ marginTop: 96 }}>
          <div style={{ maxWidth: 560, marginBottom: 40 }}>
            <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.3em", color: "rgba(255,255,255,0.4)" }}>
              How it works
            </div>
            <h2 style={{ marginTop: 12, fontSize: "clamp(1.8rem, 3vw, 2.4rem)", fontWeight: 600, letterSpacing: "-0.01em" }}>
              Three simple steps.
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
            {[
              ["01", "Lock your USDC", "Deposit into a pool with a fixed duration and visible early-exit penalty."],
              ["02", "Hold to maturity", "Track the countdown while quitters add penalties to the winner pool."],
              ["03", "Claim your rewards", "When the timer ends, survivors split the penalty pool automatically."],
            ].map(([num, title, desc]) => (
              <div key={title} style={{
                borderRadius: 28, border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.05)", padding: 24,
              }}>
                <div style={{ fontSize: "0.85rem", color: "#6ee7b7" }}>{num}</div>
                <h3 style={{ marginTop: 16, fontSize: "1.15rem", fontWeight: 600 }}>{title}</h3>
                <p style={{ marginTop: 12, color: "rgba(255,255,255,0.65)", lineHeight: 1.7, fontSize: "0.9rem" }}>{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Pool types ── */}
        <section id="pools" style={{ marginTop: 96 }}>
          <div style={{ marginBottom: 40 }}>
            <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.3em", color: "rgba(255,255,255,0.4)" }}>
              Pool types
            </div>
            <h2 style={{ marginTop: 12, fontSize: "clamp(1.6rem, 2.5vw, 2.2rem)", fontWeight: 600, letterSpacing: "-0.01em", whiteSpace: "nowrap" }}>
              Choose your commitment level.
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
            {[
              ["Starter", "7 days", "Low pressure, low penalty", "10 USDC", "10%"],
              ["Standard", "30 days", "Best for habit-building", "100 USDC", "20%"],
              ["Hardcore", "60 days", "For serious diamond hands", "500 USDC", "35%"],
            ].map(([name, length, desc, min, penalty]) => (
              <div key={name} style={{
                borderRadius: 28,
                border: "1px solid rgba(255,255,255,0.1)",
                background: "linear-gradient(to bottom, rgba(255,255,255,0.08), rgba(255,255,255,0.03))",
                padding: 24, display: "flex", flexDirection: "column",
              }}>
                <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)" }}>{length}</div>
                <div style={{ marginTop: 8, fontSize: "1.4rem", fontWeight: 600 }}>{name}</div>
                <p style={{ marginTop: 10, color: "rgba(255,255,255,0.65)", fontSize: "0.875rem", lineHeight: 1.6 }}>{desc}</p>
                <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 10 }}>
                  {[["Minimum", min], ["Penalty", penalty]].map(([label, value]) => (
                    <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem" }}>
                      <span style={{ color: "rgba(255,255,255,0.55)" }}>{label}</span>
                      <span style={{ fontWeight: 500 }}>{value}</span>
                    </div>
                  ))}
                </div>
                <Link href={`/create?type=${name.toLowerCase()}`} style={{ display: "block", marginTop: "auto", paddingTop: 24 }}>
                  <button style={{
                    width: "100%", borderRadius: 16,
                    border: "1px solid rgba(255,255,255,0.12)",
                    background: "rgba(255,255,255,0.06)",
                    padding: "12px 16px", fontSize: "0.875rem", fontWeight: 500,
                    color: "#fff", cursor: "pointer",
                  }}>
                    Choose {name}
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* ── Why it works ── */}
        <section style={{
          marginTop: 96, borderRadius: 32,
          border: "1px solid rgba(255,255,255,0.1)",
          background: "rgba(255,255,255,0.05)", padding: "40px 48px",
        }}>
          <div style={{ display: "flex", gap: 32, justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.3em", color: "rgba(255,255,255,0.4)" }}>
                Why it works
              </div>
              <h2 style={{ marginTop: 12, fontSize: "1.5rem", fontWeight: 600, letterSpacing: "-0.01em", whiteSpace: "nowrap" }}>
                Every quitter increases the upside for everyone who stays.
              </h2>
              <p style={{ marginTop: 12, color: "rgba(255,255,255,0.65)", lineHeight: 1.6, fontSize: "0.9rem", whiteSpace: "nowrap" }}>
                No verification. No complicated scoring. Just a simple behavioral rule powered entirely on-chain on Arc.
              </p>
            </div>
            <div style={{ borderRadius: 24, background: "rgba(10,10,10,0.7)", padding: "20px 36px", textAlign: "center", flexShrink: 0 }}>
              <div style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.5)" }}>Current survivor APY vibe</div>
              <div style={{ marginTop: 8, fontSize: "2.8rem", fontWeight: 600, color: "#6ee7b7" }}>+12.8%</div>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section id="faq" style={{ marginTop: 96, display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 16 }}>
          {[
            ["Can I withdraw early?", "Yes. But you pay the pool penalty, and that penalty is distributed to the users who stay until the end."],
            ["Do I need to prove anything?", "No. This product is fully on-chain. The only rule is whether you hold until maturity or quit early."],
            ["How are rewards split?", "Rewards are distributed proportionally to your stake among all users who remain until pool maturity."],
            ["Why Arc?", "Fast finality and USDC as native gas make the app feel instant and predictable for everyday users."],
          ].map(([q, a]) => (
            <div key={q} style={{
              borderRadius: 24, border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.05)", padding: 24,
            }}>
              <h3 style={{ fontSize: "1rem", fontWeight: 600 }}>{q}</h3>
              <p style={{ marginTop: 12, color: "rgba(255,255,255,0.65)", lineHeight: 1.7, fontSize: "0.875rem" }}>{a}</p>
            </div>
          ))}
        </section>

      </main>
    </div>
  );
}
