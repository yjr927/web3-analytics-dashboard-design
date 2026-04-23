// ── Profile page — uses the strict blue-only palette ─────────────────────────
const P = {
  primary: "#2274a5", light: "#63bce9", deep: "#104497",
  white: "#f1f2f2", cardBg: "rgba(16,68,151,0.07)",
  border: "rgba(34,116,165,0.16)", dim: "rgba(241,242,242,0.38)",
};

export function Profile() {
  return (
    <div className="space-y-6 pb-16">
      <div>
        <h1 style={{ fontFamily:"'Newsreader',Georgia,serif", fontSize:"28px", fontWeight:700, color:P.white }}>
          Profile Settings
        </h1>
        <p style={{ fontSize:"14px", color:"rgba(99,188,233,0.55)", marginTop:4 }}>
          Manage your account and preferences
        </p>
      </div>

      <div
        className="rounded-[20px] p-8 flex items-center justify-center min-h-[360px]"
        style={{ background:P.cardBg, backdropFilter:"blur(26px)", WebkitBackdropFilter:"blur(26px)", border:`1px solid ${P.border}`, boxShadow:"0 8px 32px rgba(0,0,0,0.45)" }}
      >
        <div className="text-center space-y-5">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
            style={{ background:`linear-gradient(135deg, ${P.deep}, ${P.primary})`, border:"2px solid rgba(99,188,233,0.28)" }}
          >
            <span style={{ fontSize:"22px", fontWeight:700, color:P.light }}>PM</span>
          </div>
          <div>
            <h2 style={{ fontFamily:"'Newsreader',Georgia,serif", fontSize:"20px", fontWeight:600, color:P.white }}>
              Product Manager
            </h2>
            <p style={{ fontSize:"14px", color:P.dim, marginTop:4, maxWidth:360, margin:"10px auto 0", lineHeight:1.75 }}>
              Profile settings, notification preferences, and API access will appear here.
            </p>
          </div>
          <div
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl"
            style={{ background:"rgba(34,116,165,0.10)", border:`1px solid ${P.border}`, color:"rgba(99,188,233,0.65)", fontSize:"13px", fontWeight:500 }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60" style={{ background:P.primary }} />
              <span className="relative inline-flex rounded-full h-2 w-2" style={{ background:P.primary }} />
            </span>
            Coming soon
          </div>
        </div>
      </div>
    </div>
  );
}
