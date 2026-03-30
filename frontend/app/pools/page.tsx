"use client";

import { useReadContract, useWriteContract, useAccount, useConnect } from "wagmi";
import { injected } from "wagmi/connectors";
import { parseEther, formatEther } from "viem";
import { useState } from "react";
import { ABI, CONTRACT_ADDRESS } from "@/lib/contract";
import { arcTestnet } from "@/lib/wagmi";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";

function timeLeft(lockEnd: bigint): string {
  const diff = Number(lockEnd) - Math.floor(Date.now() / 1000);
  if (diff <= 0) return "Matured";
  const days = Math.floor(diff / 86400);
  const hours = Math.floor((diff % 86400) / 3600);
  return `${days}d ${hours}h remaining`;
}

function PoolCard({ poolId }: { poolId: number }) {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { writeContract, isPending, isSuccess } = useWriteContract();
  const [depositAmt, setDepositAmt] = useState("");
  const [showDeposit, setShowDeposit] = useState(false);

  const { data: pool } = useReadContract({
    address: CONTRACT_ADDRESS, abi: ABI, functionName: "getPool",
    args: [BigInt(poolId)],
  });

  const { data: userStake } = useReadContract({
    address: CONTRACT_ADDRESS, abi: ABI, functionName: "getStake",
    args: [BigInt(poolId), address ?? "0x0000000000000000000000000000000000000000"],
    query: { enabled: !!address },
  });

  if (!pool || pool.creator === "0x0000000000000000000000000000000000000000") return null;

  const isMatured = Date.now() / 1000 >= Number(pool.lockEnd);
  const penalty = Number(pool.penaltyBps) / 100;
  const minDepositUsdc = parseFloat(formatEther(pool.minDeposit));

  return (
    <div style={{
      borderRadius: 28, border: "1px solid rgba(255,255,255,0.1)",
      background: "rgba(255,255,255,0.05)", padding: 24,
      display: "flex", flexDirection: "column", gap: 20,
      backdropFilter: "blur(8px)",
    }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)", fontWeight: 500 }}>
          Pool #{poolId + 1}
        </span>
        <div style={{
          borderRadius: 9999, padding: "4px 12px", fontSize: "0.75rem", fontWeight: 500,
          border: `1px solid ${isMatured ? "rgba(52,211,153,0.3)" : "rgba(255,255,255,0.15)"}`,
          color: isMatured ? "#6ee7b7" : "rgba(255,255,255,0.7)",
          background: isMatured ? "rgba(52,211,153,0.1)" : "rgba(255,255,255,0.05)",
        }}>
          {timeLeft(pool.lockEnd)}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
        {[
          { label: "Locked", value: `${parseFloat(formatEther(pool.totalStake)).toFixed(2)} USDC`, color: "#fff" },
          { label: "Bonus pool", value: `${parseFloat(formatEther(pool.bonusPool)).toFixed(2)} USDC`, color: "#6ee7b7" },
          { label: "Penalty", value: `${penalty}%`, color: "#f87171" },
          { label: "Min deposit", value: `${minDepositUsdc} USDC`, color: "rgba(255,255,255,0.7)" },
        ].map(({ label, value, color }) => (
          <div key={label} style={{
            borderRadius: 12, border: "1px solid rgba(255,255,255,0.07)",
            background: "rgba(255,255,255,0.03)", padding: "12px 10px", textAlign: "center",
            display: "flex", flexDirection: "column", justifyContent: "space-between",
          }}>
            <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.45)", minHeight: "2em", display: "flex", alignItems: "center", justifyContent: "center" }}>{label}</div>
            <div style={{ fontSize: "0.9rem", fontWeight: 600, color }}>{value}</div>
          </div>
        ))}
      </div>

      {/* User stake */}
      {address && userStake !== undefined && userStake > 0n && (
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "10px 14px", borderRadius: 10,
          border: "1px solid rgba(52,211,153,0.2)",
          background: "rgba(52,211,153,0.07)",
          fontSize: "0.875rem",
        }}>
          <span style={{ color: "rgba(255,255,255,0.6)" }}>Your stake</span>
          <span style={{ fontWeight: 600, color: "#6ee7b7" }}>
            {parseFloat(formatEther(userStake)).toFixed(2)} USDC
          </span>
        </div>
      )}

      {/* Actions */}
      {!isConnected ? (
        <button
          onClick={() => connect({ connector: injected(), chainId: arcTestnet.id })}
          style={{
            width: "100%", borderRadius: 9999,
            border: "1px solid rgba(255,255,255,0.15)",
            background: "rgba(255,255,255,0.05)",
            padding: "12px", fontSize: "0.875rem", fontWeight: 500,
            color: "#fff", cursor: "pointer",
          }}
        >
          Connect to join
        </button>
      ) : isMatured ? (
        <button
          onClick={() => writeContract({ address: CONTRACT_ADDRESS, abi: ABI, functionName: "claim", args: [BigInt(poolId)] })}
          disabled={isPending}
          style={{
            width: "100%", borderRadius: 9999,
            background: "#34d399", padding: "12px",
            fontSize: "0.875rem", fontWeight: 600,
            color: "#0a0a0a", border: "none",
            cursor: isPending ? "not-allowed" : "pointer",
            opacity: isPending ? 0.6 : 1,
          }}
        >
          {isPending ? "Claiming..." : "Claim winnings"}
        </button>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {!showDeposit ? (
            <button
              onClick={() => setShowDeposit(true)}
              style={{
                width: "100%", borderRadius: 9999,
                background: "#34d399", padding: "12px",
                fontSize: "0.875rem", fontWeight: 600,
                color: "#0a0a0a", border: "none", cursor: "pointer",
              }}
            >
              Join Pool
            </button>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  type="number"
                  placeholder={`Min ${minDepositUsdc} USDC`}
                  value={depositAmt}
                  onChange={(e) => setDepositAmt(e.target.value)}
                  style={{
                    flex: 1, padding: "11px 14px",
                    borderRadius: 12, fontSize: "0.875rem",
                    border: `1px solid ${depositAmt && Number(depositAmt) < minDepositUsdc ? "rgba(248,113,113,0.5)" : "rgba(255,255,255,0.15)"}`,
                    background: "rgba(255,255,255,0.05)",
                    color: "#fff", outline: "none",
                  }}
                />
                <button
                  onClick={() => {
                    if (!depositAmt || Number(depositAmt) <= 0) return;
                    if (Number(depositAmt) < minDepositUsdc) return;
                    writeContract({ address: CONTRACT_ADDRESS, abi: ABI, functionName: "deposit", args: [BigInt(poolId)], value: parseEther(depositAmt) });
                  }}
                  disabled={isPending || !depositAmt || Number(depositAmt) < minDepositUsdc}
                  style={{
                    borderRadius: 12, background: "#34d399",
                    padding: "11px 18px", fontSize: "0.875rem", fontWeight: 600,
                    color: "#0a0a0a", border: "none", cursor: "pointer",
                    opacity: (isPending || !depositAmt || Number(depositAmt) < minDepositUsdc) ? 0.4 : 1,
                  }}
                >
                  {isPending ? "..." : "Deposit"}
                </button>
              </div>
              {depositAmt && Number(depositAmt) < minDepositUsdc && (
                <span style={{ fontSize: "0.75rem", color: "#f87171", paddingLeft: 4 }}>
                  Minimum deposit is {minDepositUsdc} USDC
                </span>
              )}
            </div>
          )}

          {isSuccess && (
            <div style={{
              padding: "12px 16px", borderRadius: 12,
              background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.3)",
              fontSize: "0.875rem", color: "#6ee7b7", textAlign: "center",
            }}>
              Deposit successful! Your stake is locked.
            </div>
          )}

          {userStake !== undefined && userStake > 0n && (
            <button
              onClick={() => writeContract({ address: CONTRACT_ADDRESS, abi: ABI, functionName: "rageQuit", args: [BigInt(poolId)] })}
              disabled={isPending}
              style={{
                width: "100%", padding: "11px", borderRadius: 9999,
                background: "rgba(248,113,113,0.08)",
                border: "1px solid rgba(248,113,113,0.25)",
                color: "#f87171", fontWeight: 500, fontSize: "0.875rem",
                cursor: "pointer", transition: "background 0.2s",
              }}
            >
              Rage Quit — lose {penalty}%
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function PoolsPage() {
  const { data: poolCount } = useReadContract({
    address: CONTRACT_ADDRESS, abi: ABI, functionName: "poolCount",
  });

  const count = poolCount !== undefined ? Number(poolCount) : 0;

  return (
    <div style={{ color: "#fff", position: "relative" }}>
      <div style={{
        position: "fixed", inset: 0, zIndex: -1,
        background: "radial-gradient(circle at top, rgba(99,102,241,0.22), transparent 35%), radial-gradient(circle at 80% 30%, rgba(16,185,129,0.14), transparent 25%), linear-gradient(to bottom, #0a0a0a, #111827)",
      }} />
      <Navbar />

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 32px 80px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 48 }}>
          <div>
            <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.3em", color: "rgba(255,255,255,0.4)", marginBottom: 12 }}>
              Pools
            </div>
            <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)", fontWeight: 600, letterSpacing: "-0.02em" }}>
              Active Pools
            </h1>
          </div>
          <Link href="/create">
            <button style={{
              borderRadius: 9999, background: "#34d399",
              padding: "11px 24px", fontSize: "0.875rem", fontWeight: 600,
              color: "#0a0a0a", border: "none", cursor: "pointer",
            }}>
              + Create Pool
            </button>
          </Link>
        </div>

        {count === 0 ? (
          <div style={{
            textAlign: "center", padding: "100px 24px",
            borderRadius: 24, border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(255,255,255,0.03)",
          }}>
            <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: 24, fontSize: "0.95rem" }}>
              No pools yet. Be the first.
            </p>
            <Link href="/create">
              <button style={{
                borderRadius: 9999, background: "#34d399",
                padding: "12px 28px", fontSize: "0.875rem", fontWeight: 600,
                color: "#0a0a0a", border: "none", cursor: "pointer",
              }}>
                Create First Pool
              </button>
            </Link>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 }}>
            {Array.from({ length: count }, (_, i) => (
              <PoolCard key={i} poolId={i} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
