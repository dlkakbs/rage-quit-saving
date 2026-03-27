"use client";

export function VaultAnimation() {
  return (
    <div style={{ position: "relative", width: 280, height: 320, margin: "0 auto" }}>
      {/* Coins */}
      {[80, 108, 136].map((left, i) => (
        <div key={i} className={`coin-${i + 1}`} style={{
          position: "absolute", left, top: 10,
          width: 22, height: 22, borderRadius: "50%",
          background: "linear-gradient(135deg, #818CF8, #6366F1)",
          boxShadow: "0 0 12px rgba(99,102,241,0.8)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "var(--font-orbitron), monospace",
          fontSize: 8, fontWeight: 900, color: "#E0E7FF",
        }}>
          $
        </div>
      ))}

      {/* Vault */}
      <div className="vault-float vault-glow" style={{ position: "absolute", top: 30, left: "50%", transform: "translateX(-50%)" }}>
        <svg width="200" height="230" viewBox="0 0 200 230" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Body */}
          <path d="M8 8L192 8L192 200L8 200Z" fill="#0A0A1E" stroke="#6366F1" strokeWidth="2"/>
          {/* HUD corners */}
          <path d="M8 8L32 8M8 8L8 32" stroke="#818CF8" strokeWidth="2.5"/>
          <path d="M192 8L168 8M192 8L192 32" stroke="#818CF8" strokeWidth="2.5"/>
          <path d="M8 200L32 200M8 200L8 176" stroke="#818CF8" strokeWidth="2.5"/>
          <path d="M192 200L168 200M192 200L192 176" stroke="#818CF8" strokeWidth="2.5"/>
          {/* Door */}
          <rect x="24" y="26" width="152" height="148" fill="#06060F" stroke="#4338CA" strokeWidth="1.5"/>
          {/* Dial */}
          <circle cx="100" cy="100" r="44" fill="#0C0C1E" stroke="#6366F1" strokeWidth="2"/>
          <circle cx="100" cy="100" r="36" fill="#06060F" stroke="#4338CA" strokeWidth="1.5"/>
          {Array.from({ length: 12 }, (_, i) => {
            const a = (i * 30 * Math.PI) / 180;
            const isMain = i % 3 === 0;
            return <line key={i}
              x1={100 + 28 * Math.cos(a)} y1={100 + 28 * Math.sin(a)}
              x2={100 + 36 * Math.cos(a)} y2={100 + 36 * Math.sin(a)}
              stroke={isMain ? "#818CF8" : "#4338CA"} strokeWidth={isMain ? 2 : 1}
            />;
          })}
          <circle cx="100" cy="100" r="10" fill="#6366F1" opacity="0.7"/>
          <circle cx="100" cy="100" r="4" fill="#C4B5FD"/>
          <line x1="100" y1="100" x2="100" y2="68" stroke="#818CF8" strokeWidth="2.5" strokeLinecap="square"/>
          {/* Handle */}
          <rect x="158" y="88" width="14" height="24" fill="#1C1C3A" stroke="#6366F1" strokeWidth="1.5"/>
          <rect x="160" y="94" width="10" height="12" fill="#6366F1" opacity="0.4"/>
          {/* Coin slot */}
          <rect x="76" y="14" width="48" height="6" rx="1" fill="#06060F" stroke="#818CF8" strokeWidth="1.5"/>
          <rect x="88" y="15" width="24" height="4" fill="#6366F1" opacity="0.4"/>
          {/* Bolts */}
          {[[20,22],[180,22],[20,178],[180,178]].map(([cx, cy], i) => (
            <g key={i}>
              <rect x={cx-5} y={cy-5} width={10} height={10} fill="#06060F" stroke="#4338CA" strokeWidth="1.5"/>
              <line x1={cx-3} y1={cy} x2={cx+3} y2={cy} stroke="#4338CA" strokeWidth={1}/>
              <line x1={cx} y1={cy-3} x2={cx} y2={cy+3} stroke="#4338CA" strokeWidth={1}/>
            </g>
          ))}
          {/* Status LED */}
          <circle cx="158" cy="58" r="5" fill="#22C55E" opacity="0.9"/>
          <circle cx="158" cy="58" r="8" fill="none" stroke="#22C55E" strokeWidth="1" opacity="0.3"/>
          {/* Legs */}
          <rect x="30" y="198" width="28" height="22" fill="#0A0A1E" stroke="#4338CA" strokeWidth="1.5"/>
          <rect x="142" y="198" width="28" height="22" fill="#0A0A1E" stroke="#4338CA" strokeWidth="1.5"/>
        </svg>
      </div>

      {/* Ground glow */}
      <div style={{
        position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: 180, height: 24,
        background: "radial-gradient(ellipse, rgba(99,102,241,0.5) 0%, transparent 70%)",
        filter: "blur(10px)",
      }} />
    </div>
  );
}
