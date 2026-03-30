"use client";

import { useState, useEffect, Suspense } from "react";
import { useAccount, useWriteContract, useConnect } from "wagmi";
import { injected } from "wagmi/connectors";
import { parseEther } from "viem";
import { ABI, CONTRACT_ADDRESS } from "@/lib/contract";
import { arcTestnet } from "@/lib/wagmi";
import { Navbar } from "@/components/Navbar";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const POOL_TYPES = [
  { id: "starter",  label: "Starter",  durationLabel: "7 days",  duration: 7  * 86400, penalty: 10, minAmount: 10,  desc: "Low pressure, low penalty" },
  { id: "standard", label: "Standard", durationLabel: "30 days", duration: 30 * 86400, penalty: 20, minAmount: 100, desc: "Best for habit-building" },
  { id: "hardcore", label: "Hardcore", durationLabel: "60 days", duration: 60 * 86400, penalty: 35, minAmount: 500, desc: "For serious diamond hands" },
];

function CreateForm() {
  const searchParams = useSearchParams();
  const typeParam = searchParams.get("type");

  const defaultType = POOL_TYPES.find(p => p.id === typeParam) ?? POOL_TYPES[1];
  const [selected, setSelected] = useState(defaultType);

  useEffect(() => {
    const t = POOL_TYPES.find(p => p.id === typeParam);
    if (t) setSelected(t);
  }, [typeParam]);

  const { isConnected } = useAccount();
  const { connect } = useConnect();
  const { writeContract, isPending, isSuccess, error } = useWriteContract();

  return (
    <main style={{ maxWidth: 580, margin: "0 auto", padding: "60px 32px 80px" }}>

      {/* Header */}
      <div style={{ marginBottom: 48 }}>
        <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.3em", color: "rgba(255,255,255,0.4)", marginBottom: 12 }}>
          New Pool
        </div>
        <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)", fontWeight: 600, letterSpacing: "-0.02em", marginBottom: 10 }}>
          Create a Pool
        </h1>
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.95rem" }}>
          Choose a pool type. Quitters fund your bonus.
        </p>
      </div>

      {/* Pool type selector */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)", marginBottom: 12 }}>
          Pool type
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {POOL_TYPES.map((type) => {
            const active = selected.id === type.id;
            return (
              <button
                key={type.id}
                onClick={() => setSelected(type)}
                style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "16px 20px", borderRadius: 16, textAlign: "left",
                  border: `1px solid ${active ? "rgba(52,211,153,0.5)" : "rgba(255,255,255,0.1)"}`,
                  background: active ? "rgba(52,211,153,0.08)" : "rgba(255,255,255,0.04)",
                  cursor: "pointer", transition: "all 0.15s",
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, color: active ? "#6ee7b7" : "#fff", fontSize: "0.95rem" }}>
                    {type.label}
                  </div>
                  <div style={{ marginTop: 3, fontSize: "0.8rem", color: "rgba(255,255,255,0.5)" }}>
                    {type.desc}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)" }}>{type.durationLabel}</div>
                  <div style={{ fontSize: "0.8rem", color: active ? "#6ee7b7" : "rgba(255,255,255,0.5)", marginTop: 2 }}>
                    {type.penalty}% penalty
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Summary */}
      <div style={{
        borderRadius: 20, border: "1px solid rgba(255,255,255,0.1)",
        background: "rgba(255,255,255,0.05)", padding: 24, marginBottom: 28,
      }}>
        <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.2em", color: "rgba(255,255,255,0.4)", marginBottom: 16 }}>
          Pool summary
        </div>
        {[
          { label: "Pool type",           value: selected.label,             color: "#fff" },
          { label: "Lock period",         value: selected.durationLabel,     color: "#fff" },
          { label: "Early exit penalty",  value: `${selected.penalty}%`,     color: "#f87171" },
          { label: "Minimum deposit",     value: `${selected.minAmount} USDC`, color: "#6ee7b7" },
        ].map(({ label, value, color }) => (
          <div key={label} style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.07)",
          }}>
            <span style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.55)" }}>{label}</span>
            <span style={{ fontWeight: 600, fontSize: "0.9rem", color }}>{value}</span>
          </div>
        ))}
        <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.6, marginTop: 14 }}>
          After creating, go to{" "}
          <Link href="/pools" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "underline" }}>Pools</Link>{" "}
          to deposit and share.
        </p>
      </div>

      {/* Action */}
      {!isConnected ? (
        <button
          onClick={() => connect({ connector: injected(), chainId: arcTestnet.id })}
          style={{
            width: "100%", borderRadius: 9999,
            background: "#34d399", padding: "14px 24px",
            fontSize: "0.9rem", fontWeight: 600,
            color: "#0a0a0a", border: "none", cursor: "pointer",
          }}
        >
          Connect Wallet to Continue
        </button>
      ) : (
        <button
          onClick={() => writeContract({
            address: CONTRACT_ADDRESS,
            abi: ABI,
            functionName: "createPool",
            args: [BigInt(selected.duration), BigInt(selected.penalty * 100), parseEther(String(selected.minAmount))],
          })}
          disabled={isPending}
          style={{
            width: "100%", borderRadius: 9999,
            background: isPending ? "rgba(52,211,153,0.5)" : "#34d399",
            padding: "14px 24px", fontSize: "0.9rem", fontWeight: 600,
            color: "#0a0a0a", border: "none",
            cursor: isPending ? "not-allowed" : "pointer",
            transition: "background 0.2s",
          }}
        >
          {isPending ? "Creating..." : `Create ${selected.label} Pool`}
        </button>
      )}

      {isSuccess && (
        <div style={{
          marginTop: 16, borderRadius: 16,
          background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.3)",
          padding: "20px 24px", display: "flex", flexDirection: "column", gap: 14,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: "1.1rem" }}>✓</span>
            <span style={{ fontWeight: 600, color: "#6ee7b7", fontSize: "0.95rem" }}>
              Pool created successfully!
            </span>
          </div>
          <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.55)", margin: 0, lineHeight: 1.5 }}>
            Your pool is live. Now head to Pools and deposit to lock in your stake.
          </p>
          <Link href="/pools">
            <button style={{
              width: "100%", borderRadius: 9999,
              background: "#34d399", padding: "12px 24px",
              fontSize: "0.9rem", fontWeight: 600,
              color: "#0a0a0a", border: "none", cursor: "pointer",
            }}>
              Go deposit now →
            </button>
          </Link>
        </div>
      )}

      {error && (
        <div style={{
          marginTop: 16, padding: "14px 18px", borderRadius: 12,
          background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.25)",
          fontSize: "0.825rem", color: "#f87171",
        }}>
          {error.message.slice(0, 140)}
        </div>
      )}
    </main>
  );
}

export default function CreatePage() {
  return (
    <div style={{ color: "#fff", position: "relative" }}>
      <div style={{
        position: "fixed", inset: 0, zIndex: -1,
        background: "radial-gradient(circle at top, rgba(99,102,241,0.22), transparent 35%), radial-gradient(circle at 80% 30%, rgba(16,185,129,0.14), transparent 25%), linear-gradient(to bottom, #0a0a0a, #111827)",
      }} />
      <Navbar />
      <Suspense fallback={null}>
        <CreateForm />
      </Suspense>
    </div>
  );
}
