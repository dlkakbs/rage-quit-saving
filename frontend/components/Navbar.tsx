"use client";

import Link from "next/link";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";
import { arcTestnet } from "@/lib/wagmi";

export function Navbar() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  return (
    <header style={{
      maxWidth: 1280, margin: "0 auto",
      display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center",
      padding: "24px 32px",
    }}>
      <div />
      <nav style={{ display: "flex", gap: 32 }}>
        {[["Home", "/"], ["How it works", "/how-it-works"], ["Pools", "/pools"], ["Create", "/create"]].map(([label, href]) => (
          <Link key={href} href={href} style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.7)", textDecoration: "none", transition: "color 0.2s" }}>
            {label}
          </Link>
        ))}
      </nav>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
      {isConnected ? (
        <button
          onClick={() => disconnect()}
          style={{
            borderRadius: 9999,
            border: "1px solid rgba(255,255,255,0.15)",
            background: "rgba(255,255,255,0.1)",
            padding: "8px 16px",
            fontSize: "0.875rem",
            fontWeight: 500,
            color: "#fff",
            cursor: "pointer",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#6ee7b7", display: "inline-block" }} />
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </button>
      ) : (
        <button
          onClick={() => connect({ connector: injected(), chainId: arcTestnet.id })}
          style={{
            borderRadius: 9999,
            border: "1px solid rgba(255,255,255,0.15)",
            background: "rgba(255,255,255,0.1)",
            padding: "8px 16px",
            fontSize: "0.875rem",
            fontWeight: 500,
            color: "#fff",
            cursor: "pointer",
            backdropFilter: "blur(8px)",
            transition: "background 0.2s",
          }}
        >
          Connect Wallet
        </button>
      )}
      </div>
    </header>
  );
}
