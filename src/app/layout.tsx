import { useState, useRef, useEffect } from "react";
import { Outlet, NavLink, useLocation } from "react-router";
import { Activity, Search, ChevronDown, X, Menu, Sparkles } from "lucide-react";
import { DashboardContext } from "./contexts/DashboardContext";

// ── Palette ───────────────────────────────────────────────────────────────────
const P = {
  primary: "#2274a5",
  light:   "#63bce9",
  deep:    "#104497",
  bg:      "#0f0a0a",
  white:   "#f1f2f2",
  dim:     "rgba(241,242,242,0.38)",
  mid:     "rgba(241,242,242,0.60)",
};

const NAV_H  = 68;   // px — global nav
const SUB_H  = 48;   // px — secondary nav

// ── Secondary nav config per route ───────────────────────────────────────────
const SECONDARY_NAV: Record<string, string[]> = {
  "/"             : ["Market", "Derivatives", "On-Chain", "Sectors"],
  "/wallet"       : ["Active Addresses", "Transactions", "Retention", "Cohorts"],
  "/token-flow"   : ["Exchange Flows", "Whale Activity", "DEX Activity", "Cross-Chain"],
  "/network"      : ["Profitability", "Risk", "Liquidity", "Validators"],
  "/notifications": ["Featured", "Trending", "Latest", "Bookmarked"],
  "/insights":      ["Featured", "Trending", "Latest", "Bookmarked"],
};

// ── Main nav route config ─────────────────────────────────────────────────────
const MAIN_TABS = [
  { name: "Overview",        path: "/",             end: true  },
  { name: "Wallet Activity", path: "/wallet",        end: false },
  { name: "Token Flow",      path: "/token-flow",    end: false },
  { name: "Network Health",  path: "/network",       end: false },
  { name: "Insights",        path: "/notifications", end: false },
];

// ── Search overlay ────────────────────────────────────────────────────────────
function SearchOverlay({ onClose }: { onClose: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const QUICK = [
    "BTC Market Cap Trend",
    "ETH Futures Open Interest",
    "SOL Network Activity Spike",
    "DeFi Total Value Locked",
    "AI Sector 30-Day Performance",
  ];

  return (
    <div
      className="fixed inset-0 z-[200] flex items-start justify-center"
      style={{
        background: "rgba(8,6,6,0.72)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        paddingTop: `${NAV_H + 28}px`,
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-[580px] mx-4 rounded-2xl overflow-hidden"
        style={{
          background: "rgba(12,9,9,0.99)",
          border: "1px solid rgba(34,116,165,0.28)",
          boxShadow: "0 28px 72px rgba(0,0,0,0.75), 0 0 0 1px rgba(99,188,233,0.04)",
        }}
      >
        <div
          className="flex items-center gap-3 px-5 py-4"
          style={{ borderBottom: "1px solid rgba(34,116,165,0.11)" }}
        >
          <Search style={{ width: 16, height: 16, color: P.primary, flexShrink: 0 }} />
          <input
            ref={inputRef}
            placeholder="Search assets, metrics, signals…"
            className="flex-1 bg-transparent outline-none"
            style={{
              fontSize: "15px",
              color: P.white,
              caretColor: P.light,
              fontFamily: "'Work Sans', sans-serif",
            }}
          />
          <button
            onClick={onClose}
            className="flex items-center justify-center w-7 h-7 rounded-lg transition-all duration-150"
            style={{ color: P.dim, background: "transparent" }}
            onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.color = P.white; el.style.background = "rgba(34,116,165,0.14)"; }}
            onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.color = P.dim; el.style.background = "transparent"; }}
          >
            <X style={{ width: 14, height: 14 }} />
          </button>
        </div>
        <div className="px-4 py-3">
          <p style={{ fontSize: "10px", fontWeight: 600, color: "rgba(241,242,242,0.22)", textTransform: "uppercase", letterSpacing: "0.09em", marginBottom: 8, fontFamily: "'Work Sans',sans-serif" }}>
            Quick links
          </p>
          {QUICK.map((item) => (
            <button
              key={item}
              onClick={onClose}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 text-left"
              style={{ color: P.dim, fontSize: "13px", fontFamily: "'Work Sans',sans-serif" }}
              onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(34,116,165,0.09)"; el.style.color = P.light; }}
              onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = "transparent"; el.style.color = P.dim; }}
            >
              <Search style={{ width: 12, height: 12, opacity: 0.30, flexShrink: 0 }} />
              {item}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Mobile menu ───────────────────────────────────────────────────────────────
function MobileMenu({ onClose }: { onClose: () => void }) {
  const location = useLocation();
  useEffect(() => { document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = ""; }; }, []);

  return (
    <div
      className="fixed inset-0 z-[150]"
      style={{ background: "rgba(8,6,6,0.72)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="absolute left-0 top-0 bottom-0 w-[280px] flex flex-col"
        style={{
          background: "rgba(12,9,9,0.98)",
          borderRight: "1px solid rgba(34,116,165,0.17)",
          boxShadow: "8px 0 48px rgba(0,0,0,0.70)",
        }}
      >
        <div className="flex items-center justify-between px-5 flex-shrink-0" style={{ height: NAV_H, borderBottom: "1px solid rgba(34,116,165,0.11)" }}>
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${P.deep}, ${P.primary})`, border: "1px solid rgba(99,188,233,0.22)" }}>
              <Activity style={{ width: 14, height: 14, color: P.light }} />
            </div>
            <span style={{ fontFamily: "'Newsreader', Georgia, serif", fontSize: "17px", fontWeight: 700, color: P.white }}>
              Nexus<span style={{ color: P.light }}>Chain</span>
            </span>
          </div>
          <button onClick={onClose} style={{ color: P.dim }}><X style={{ width: 18, height: 18 }} /></button>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {MAIN_TABS.map((tab) => {
            const isActive = tab.end ? location.pathname === tab.path : location.pathname.startsWith(tab.path);
            return (
              <NavLink
                key={tab.name}
                to={tab.path}
                end={tab.end}
                onClick={onClose}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "11px 14px", borderRadius: 12,
                  fontSize: "14px", fontWeight: isActive ? 600 : 450,
                  textDecoration: "none",
                  color: isActive ? P.light : "rgba(241,242,242,0.50)",
                  background: isActive ? "rgba(34,116,165,0.14)" : "transparent",
                  border: isActive ? "1px solid rgba(34,116,165,0.22)" : "1px solid transparent",
                  fontFamily: "'Work Sans',sans-serif",
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: isActive ? P.light : "rgba(241,242,242,0.18)" }} />
                {tab.name}
              </NavLink>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

// ── Layout ────────────────────────────────────────────────────────────────────
export function Layout() {
  const [asset,       setAsset]       = useState("ALL");
  const [timeRange,   setTimeRange]   = useState("30D");
  const [activeSubTab, setActiveSubTab] = useState("");
  const [searchOpen,  setSearchOpen]  = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [assetOpen,   setAssetOpen]   = useState(false);

  const location   = useLocation();
  const assetRef   = useRef<HTMLDivElement>(null);

  // ── Reset secondary tab on route change ──
  useEffect(() => {
    const tabs = SECONDARY_NAV[location.pathname];
    setActiveSubTab(tabs ? tabs[0] : "");
  }, [location.pathname]);

  // ── Close asset dropdown on outside click ──
  useEffect(() => {
    function onOut(e: MouseEvent) {
      if (assetRef.current && !assetRef.current.contains(e.target as Node)) setAssetOpen(false);
    }
    if (assetOpen) document.addEventListener("mousedown", onOut);
    return () => document.removeEventListener("mousedown", onOut);
  }, [assetOpen]);

  const subTabs = SECONDARY_NAV[location.pathname] ?? [];

  return (
    <DashboardContext.Provider value={{ asset, setAsset, timeRange, setTimeRange, activeSubTab, setActiveSubTab }}>
      <div
        style={{
          paddingTop: NAV_H,
          background: P.bg,
          minHeight: "100vh",
          fontFamily: "'Work Sans', -apple-system, BlinkMacSystemFont, sans-serif",
          color: P.white,
        }}
      >
        {/* ── Ambient depth ──────────────────────────────────────────────── */}
        <div
          className="fixed inset-0 pointer-events-none z-0"
          style={{
            background: [
              "radial-gradient(ellipse 62% 40% at 5% 7%, rgba(16,68,151,0.16) 0%, transparent 58%)",
              "radial-gradient(ellipse 46% 32% at 93% 90%, rgba(34,116,165,0.09) 0%, transparent 54%)",
            ].join(", "),
          }}
        />

        {/* ══ GLOBAL NAVIGATION BAR ════════════════════════════════════════ */}
        <header
          className="fixed top-0 left-0 right-0 z-50"
          style={{
            height: NAV_H,
            background: "rgba(15,10,10,0.88)",
            backdropFilter: "blur(28px)",
            WebkitBackdropFilter: "blur(28px)",
            borderBottom: "1px solid rgba(34,116,165,0.13)",
            boxShadow: "inset 0 1px 0 rgba(99,188,233,0.05), 0 4px 28px rgba(0,0,0,0.30)",
          }}
        >
          <div
            className="h-full flex items-stretch mx-auto"
            style={{ maxWidth: 1400, padding: "0 24px" }}
          >
            {/* Logo */}
            <NavLink
              to="/"
              className="flex items-center gap-2.5 flex-shrink-0 mr-5"
              style={{ textDecoration: "none" }}
            >
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300"
                style={{ background: `linear-gradient(145deg, ${P.deep}, ${P.primary})`, border: "1px solid rgba(99,188,233,0.22)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 0 22px rgba(34,116,165,0.52)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
              >
                <Activity style={{ width: 15, height: 15, color: P.light }} />
              </div>
              <span
                className="hidden sm:block select-none"
                style={{ fontFamily: "'Newsreader', Georgia, serif", fontSize: "18px", fontWeight: 700, color: P.white, letterSpacing: "-0.01em" }}
              >
                Nexus<span style={{ color: P.light }}>Chain</span>
              </span>
            </NavLink>

            {/* Divider */}
            <div className="hidden lg:block w-px my-[19px] mr-5 flex-shrink-0" style={{ background: "rgba(34,116,165,0.20)" }} />

            {/* ── Main nav tabs (underline indicator) ────────────────────── */}
            <nav className="hidden lg:flex items-stretch flex-1 min-w-0" style={{ marginBottom: "-1px" }}>
              {MAIN_TABS.map((tab) => (
                <NavLink
                  key={tab.name}
                  to={tab.path}
                  end={tab.end}
                  className="relative flex items-center px-[14px] flex-shrink-0 group"
                  style={({ isActive }) => ({
                    fontSize: "13.5px",
                    fontWeight: isActive ? 600 : 450,
                    textDecoration: "none",
                    whiteSpace: "nowrap",
                    color: isActive ? P.light : "rgba(241,242,242,0.50)",
                    borderBottom: isActive ? `2px solid ${P.light}` : "2px solid transparent",
                    textShadow: isActive ? "0 0 18px rgba(99,188,233,0.55)" : "none",
                    transition: "color 0.18s, text-shadow 0.18s",
                    fontFamily: "'Work Sans',sans-serif",
                  })}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    if (!el.style.color.includes("99,188")) { el.style.color = P.light; el.style.textShadow = "0 0 14px rgba(99,188,233,0.35)"; }
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    if (!el.style.color.includes("99,188")) { el.style.color = "rgba(241,242,242,0.50)"; el.style.textShadow = "none"; }
                  }}
                >
                  {tab.name}
                </NavLink>
              ))}
            </nav>

            <div className="flex-1 lg:hidden" />

            {/* ── Right controls ─────────────────────────────────────────── */}
            <div className="flex items-center gap-2 flex-shrink-0">

              {/* Time range */}
              <div
                className="hidden md:flex items-center gap-0.5 p-1 rounded-xl"
                style={{ background: "rgba(16,68,151,0.10)", border: "1px solid rgba(34,116,165,0.14)" }}
              >
                {(["1D", "7D", "30D", "1Y"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTimeRange(t)}
                    className="px-2.5 py-1.5 rounded-lg transition-all duration-200"
                    style={{
                      fontSize: "12px", fontWeight: 500,
                      fontFamily: "'Work Sans',sans-serif",
                      background: timeRange === t ? "rgba(34,116,165,0.26)" : "transparent",
                      color:      timeRange === t ? P.light : "rgba(241,242,242,0.36)",
                      border:     timeRange === t ? "1px solid rgba(34,116,165,0.34)" : "1px solid transparent",
                      boxShadow:  timeRange === t ? "0 0 8px rgba(34,116,165,0.18)" : "none",
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* Asset dropdown */}
              <div ref={assetRef} className="relative flex-shrink-0" style={{ zIndex: 60 }}>
                <button
                  onClick={() => setAssetOpen((v) => !v)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all duration-200"
                  style={{
                    fontSize: "12px", fontWeight: 500,
                    fontFamily: "'Work Sans',sans-serif",
                    background: "rgba(16,68,151,0.12)",
                    border: `1px solid ${assetOpen ? "rgba(34,116,165,0.36)" : "rgba(34,116,165,0.18)"}`,
                    color: P.light,
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: P.light }} />
                  {asset}
                  <ChevronDown style={{ width: 13, height: 13, transition: "transform 0.2s", transform: assetOpen ? "rotate(180deg)" : "none" }} />
                </button>
                {assetOpen && (
                  <div
                    className="absolute right-0 top-full mt-2 w-[116px] rounded-[14px] overflow-hidden"
                    style={{
                      background: "rgba(10,8,8,0.99)",
                      backdropFilter: "blur(28px)",
                      WebkitBackdropFilter: "blur(28px)",
                      border: "1px solid rgba(34,116,165,0.22)",
                      boxShadow: "0 20px 48px rgba(0,0,0,0.72)",
                    }}
                  >
                    <div className="py-1.5">
                      {["ALL", "BTC", "ETH"].map((opt) => (
                        <button
                          key={opt}
                          onClick={() => { setAsset(opt); setAssetOpen(false); }}
                          className="w-full flex items-center gap-2.5 px-3.5 py-2.5 transition-all duration-150"
                          style={{
                            fontSize: "13px", fontWeight: 500, fontFamily: "'Work Sans',sans-serif",
                            color: asset === opt ? P.light : "rgba(241,242,242,0.45)",
                            background: asset === opt ? "rgba(34,116,165,0.16)" : "transparent",
                          }}
                          onMouseEnter={(e) => { if (asset !== opt) (e.currentTarget as HTMLElement).style.background = "rgba(34,116,165,0.08)"; }}
                          onMouseLeave={(e) => { if (asset !== opt) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                        >
                          <span className="w-1.5 h-1.5 rounded-full" style={{ background: asset === opt ? P.light : "rgba(241,242,242,0.20)" }} />
                          {opt}
                          {asset === opt && <span className="ml-auto" style={{ fontSize: "10px", color: "rgba(99,188,233,0.55)" }}>✓</span>}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Search */}
              <button
                onClick={() => setSearchOpen(true)}
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200"
                style={{ background: "rgba(16,68,151,0.10)", border: "1px solid rgba(34,116,165,0.15)", color: "rgba(241,242,242,0.38)" }}
                onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(34,116,165,0.18)"; el.style.color = P.light; el.style.borderColor = "rgba(34,116,165,0.30)"; }}
                onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(16,68,151,0.10)"; el.style.color = "rgba(241,242,242,0.38)"; el.style.borderColor = "rgba(34,116,165,0.15)"; }}
              >
                <Search style={{ width: 15, height: 15 }} />
              </button>

              {/* Profile */}
              <NavLink to="/profile" style={{ flexShrink: 0, textDecoration: "none" }}>
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300"
                  style={{ background: `linear-gradient(145deg, ${P.deep}, ${P.primary})`, border: "1.5px solid rgba(99,188,233,0.26)" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 0 18px rgba(34,116,165,0.50)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
                >
                  <span style={{ fontSize: "10px", fontWeight: 700, color: P.light }}>PM</span>
                </div>
              </NavLink>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200"
                style={{ background: "rgba(16,68,151,0.10)", border: "1px solid rgba(34,116,165,0.15)", color: "rgba(241,242,242,0.48)" }}
                onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(34,116,165,0.18)"; el.style.color = P.light; }}
                onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(16,68,151,0.10)"; el.style.color = "rgba(241,242,242,0.48)"; }}
              >
                <Menu style={{ width: 17, height: 17 }} />
              </button>
            </div>
          </div>
        </header>

        {/* ══ SECONDARY NAV ═════════════════════════════════════════════════
            Only rendered when the current route has sub-tabs.
            Sticky: sticks right below the fixed global nav.
        ══════════════════════════════════════════════════════════════════ */}
        {subTabs.length > 0 && (
          <div
            className="sticky z-40"
            style={{
              top: NAV_H,
              height: SUB_H,
              background: "rgba(13,9,9,0.92)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              borderBottom: "1px solid rgba(34,116,165,0.10)",
              boxShadow: "0 2px 16px rgba(0,0,0,0.25)",
            }}
          >
            <div
              className="h-full flex items-stretch mx-auto overflow-x-auto"
              style={{ maxWidth: 1400, padding: "0 24px", scrollbarWidth: "none" }}
            >
              {subTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveSubTab(tab)}
                  className="relative flex items-center flex-shrink-0 px-4 transition-all duration-200"
                  style={{
                    fontSize: "13px",
                    fontWeight: activeSubTab === tab ? 600 : 450,
                    fontFamily: "'Work Sans',sans-serif",
                    whiteSpace: "nowrap",
                    color: activeSubTab === tab ? P.light : "rgba(241,242,242,0.42)",
                    borderBottom: activeSubTab === tab ? `2px solid ${P.primary}` : "2px solid transparent",
                    textShadow: activeSubTab === tab ? "0 0 14px rgba(99,188,233,0.40)" : "none",
                    marginBottom: "-1px",
                    background: "transparent",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    if (activeSubTab !== tab) { el.style.color = "rgba(241,242,242,0.72)"; }
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    if (activeSubTab !== tab) { el.style.color = "rgba(241,242,242,0.42)"; }
                  }}
                >
                  {tab}
                </button>
              ))}

              {/* Right side — live indicator */}
              <div className="ml-auto flex items-center gap-2 flex-shrink-0 pl-4">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60" style={{ background: P.primary }} />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ background: P.primary }} />
                </span>
                <span style={{ fontSize: "11px", color: "rgba(241,242,242,0.25)", fontFamily: "'Work Sans',sans-serif", fontWeight: 500 }}>
                  Live
                </span>

                {/* AI insight pill */}
                <div
                  className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg ml-2"
                  style={{
                    background: "rgba(34,116,165,0.10)",
                    border: "1px solid rgba(34,116,165,0.20)",
                    fontSize: "11px", fontWeight: 500,
                    color: "rgba(99,188,233,0.65)",
                    fontFamily: "'Work Sans',sans-serif",
                  }}
                >
                  <Sparkles style={{ width: 10, height: 10 }} />
                  AI-powered
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══ PAGE CONTENT ══════════════════════════════════════════════════ */}
        <main
          className="relative z-10 mx-auto"
          style={{
            maxWidth: 1400,
            padding: "28px 24px 64px",
          }}
        >
          <Outlet />
        </main>

        {/* Overlays */}
        {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
        {mobileOpen  && <MobileMenu  onClose={() => setMobileOpen(false)}  />}
      </div>
    </DashboardContext.Provider>
  );
}
