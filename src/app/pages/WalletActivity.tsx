import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles, X, Activity, Zap, MessageSquare,
  TrendingUp, TrendingDown, Info, Users,
  ArrowUpRight, ArrowDownRight,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar,
  LineChart, Line,
  XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";
import { useDashboard } from "../contexts/DashboardContext";
import { InsightPanel as SharedInsightPanel, type InsightData as SharedInsightData } from "../components/InsightPanel";

// ── Palette ───────────────────────────────────────────────────────────────────
const P = {
  primary: "#2274a5",
  light:   "#63bce9",
  deep:    "#104497",
  bg:      "#0f0a0a",
  white:   "#f1f2f2",
  cardBg:  "rgba(16,68,151,0.07)",
  border:  "rgba(34,116,165,0.16)",
  borderH: "rgba(99,188,233,0.28)",
  dim:     "rgba(241,242,242,0.38)",
  mid:     "rgba(241,242,242,0.60)",
};

// ── Mock Data ─────────────────────────────────────────────────────────────────

const activityTrend = [
  { date:"Mar 3",  active:1.21, new:0.18 }, { date:"Mar 5",  active:1.24, new:0.21 },
  { date:"Mar 7",  active:1.31, new:0.24 }, { date:"Mar 9",  active:1.28, new:0.19 },
  { date:"Mar 11", active:1.38, new:0.27 }, { date:"Mar 13", active:1.42, new:0.30 },
  { date:"Mar 15", active:1.35, new:0.22 }, { date:"Mar 17", active:1.29, new:0.17 },
  { date:"Mar 19", active:1.33, new:0.20 }, { date:"Mar 21", active:1.44, new:0.31 },
  { date:"Mar 23", active:1.52, new:0.35 }, { date:"Mar 25", active:1.48, new:0.28 },
  { date:"Mar 27", active:1.41, new:0.23 }, { date:"Mar 29", active:1.55, new:0.38 },
  { date:"Apr 1",  active:1.61, new:0.42 }, { date:"Apr 2",  active:1.58, new:0.39 },
];

const newVsReturning = [
  { date:"Mar 5",  newU:180, ret:1040 }, { date:"Mar 9",  newU:190, ret:1090 },
  { date:"Mar 13", newU:300, ret:1120 }, { date:"Mar 17", newU:170, ret:1120 },
  { date:"Mar 21", newU:310, ret:1130 }, { date:"Mar 25", newU:280, ret:1200 },
  { date:"Mar 29", newU:380, ret:1170 }, { date:"Apr 2",  newU:390, ret:1190 },
];

const txVolumeTrend = [
  { date:"Mar 3",  vol:4.2 }, { date:"Mar 6",  vol:4.8 }, { date:"Mar 9",  vol:5.1 },
  { date:"Mar 12", vol:4.6 }, { date:"Mar 15", vol:5.4 }, { date:"Mar 18", vol:5.9 },
  { date:"Mar 21", vol:6.2 }, { date:"Mar 24", vol:5.8 }, { date:"Mar 27", vol:6.5 },
  { date:"Mar 30", vol:7.1 }, { date:"Apr 2",  vol:6.8 },
];

const retentionCohorts = [
  { week:"W1", d1:100, d7:68, d14:52, d30:41 },
  { week:"W2", d1:100, d7:71, d14:55, d30:44 },
  { week:"W3", d1:100, d7:65, d14:49, d30:38 },
  { week:"W4", d1:100, d7:73, d14:58, d30:47 },
  { week:"W5", d1:100, d7:70, d14:54, d30:43 },
];

const topWallets = [
  { rank:1, addr:"0x3a4c…f19b", type:"Exchange",    txCount:1842, volume:"$4.21B",  change:+12.4 },
  { rank:2, addr:"0xb7d2…09ac", type:"Whale",        txCount:324,  volume:"$1.88B",  change:-3.2  },
  { rank:3, addr:"0x9f0e…c44d", type:"Institution",  txCount:2107, volume:"$1.45B",  change:+8.9  },
  { rank:4, addr:"0x5c8a…112f", type:"DeFi Protocol",txCount:8842, volume:"$890M",   change:+5.1  },
  { rank:5, addr:"0xe12b…77de", type:"Whale",        txCount:118,  volume:"$742M",   change:-11.3 },
  { rank:6, addr:"0x2d5f…aa93", type:"Exchange",    txCount:5291, volume:"$631M",   change:+2.7  },
  { rank:7, addr:"0x8810…b3c0", type:"Market Maker", txCount:19440,volume:"$512M",   change:-1.4  },
];

const INSIGHTS: Record<string, SharedInsightData> = {
  strip: {
    title: "Wallet Activity Overview",
    systemInsight: "Active wallets hit 1.58M on Apr 2 — up 30.6% from 30-day baseline. New wallet creation remains elevated at 390K/day. Transaction volume has risen 62% over the period.",
    keySignals: [
      "Active wallets at 1.58M — 30-day high and up 30.6% from baseline",
      "New wallet creation at 390K/day — retail onboarding accelerating",
      "Transaction volume up 62% despite sideways price action",
    ],
    explanation: "Active wallet count measures how many unique addresses participated in transactions on a given day. When this rises while prices consolidate, it suggests growing organic adoption rather than speculation.",
    expertInsight: '"Rising active addresses with stable gas fees is a textbook accumulation signal. 1.58M daily actives is consistent with Q4 2023 before the November breakout."',
    expertName: "Rachel Kim", expertRole: "On-Chain Lead", expertInitials: "RK",
    communityTop: { handle: "@addr_watcher", text: "1.58M active wallets in a sideways market. Retail is learning to buy dips, not panic sell.", likes: 284, replies: 42 },
    discussion: [
      { handle: "@addr_watcher", time: "1h ago", text: "1.58M active wallets in a sideways market. Retail is learning to buy dips, not panic sell.", up: true },
      { handle: "@skeptic_on", time: "4h ago", text: "Some of that is just bot activity. Strip out known bots and it's probably 20% lower.", up: false },
    ],
  },
  trend: {
    title: "Activity Trend Deep Dive",
    systemInsight: "The 16-day trend shows a consistent upward channel. Active addresses have grown from 1.21M to 1.61M (+33%). New user creation peaks correlate with positive price days.",
    keySignals: [
      "Active addresses up 33% from 1.21M to 1.61M in 16 days",
      "New/returning user ratio converging to 1:4 — healthy organic growth",
      "New wallets above 300K/day — historically precedes price rallies",
    ],
    explanation: "The area chart shows two metrics: total active addresses (all wallets active that day) and new addresses (first-time wallets). New wallets above 300K/day historically precede price rallies.",
    expertInsight: '"The divergence between new and returning users closing in on a 1:4 ratio is healthy. It means 80% of activity is from established users — not just FOMO-driven newcomers."',
    expertName: "Sam Torres", expertRole: "Network Analyst", expertInitials: "ST",
    communityTop: { handle: "@growth_mon", text: "New wallets trending up 3 weeks in a row. Next leg starts when this hits 500K/day.", likes: 196, replies: 31 },
    discussion: [
      { handle: "@growth_mon", time: "2h ago", text: "New wallets trending up 3 weeks in a row. Next leg starts when this hits 500K/day.", up: true },
      { handle: "@ux_researcher", time: "6h ago", text: "Wallet creation is correlated with app store downloads of major wallets. Both rising.", up: true },
    ],
  },
  retention: {
    title: "User Retention Cohorts",
    systemInsight: "Week 4 cohort shows strongest retention with 73% at D7 and 47% at D30. D30 retention improved from 38% (W3) to 47% (W4) — a 9-point jump.",
    keySignals: [
      "D30 retention jumped 9 points from W3 (38%) to W4 (47%)",
      "D7 retention averaging 70.4% across all cohorts — very strong",
      "W4 cohort at 47% D30 rivals traditional fintech retention rates",
    ],
    explanation: "Cohort retention shows what percentage of new wallets from a given week are still active after 7, 14, and 30 days. Higher numbers mean users are staying engaged — a sign of product-market fit.",
    expertInsight: '"D30 retention above 40% is rare in crypto. The W4 cohort at 47% rivals traditional fintech apps. This suggests UX improvements or a stickier use case driving the trend."',
    expertName: "Priya Nair", expertRole: "Product Analytics", expertInitials: "PN",
    communityTop: { handle: "@pm_onchain", text: "47% D30 retention is exceptional. Most DeFi protocols see this drop to 15-20%.", likes: 211, replies: 38 },
    discussion: [
      { handle: "@pm_onchain", time: "3h ago", text: "47% D30 retention is exceptional. Most DeFi protocols see this drop to 15-20%.", up: true },
      { handle: "@contrarian_", time: "5h ago", text: "Check if these are actual human wallets or protocol-owned accounts boosting the numbers.", up: false },
    ],
  },
  topWallets: {
    title: "Top Wallet Analysis",
    systemInsight: "Top 7 wallets account for $9.3B in 24h volume — 38% of total tracked volume. Exchange addresses dominate, but whale addresses show elevated activity (+2 new entrances in 7 days).",
    keySignals: [
      "Top 7 wallets = $9.3B volume (38% of total tracked activity)",
      "2 new whale addresses entered top 10 in the past 7 days",
      "0xb7d2 whale moved $340M off exchange — OTC accumulation pattern",
    ],
    explanation: "The top wallet table shows the most active addresses by volume. Exchange addresses handle large flows, while whale addresses (1 to few thousand holders) can signal major positioning shifts.",
    expertInsight: '"Two new whale addresses appearing in the top 10 within 7 days is a notable signal. Cross-referencing their entry transactions with exchange flows suggests accumulation, not distribution."',
    expertName: "Leo Grant", expertRole: "Whale Tracker", expertInitials: "LG",
    communityTop: { handle: "@whale_alert2", text: "The 0xb7d2 whale moved $340M off exchange yesterday. That's OTC buying, not retail.", likes: 352, replies: 67 },
    discussion: [
      { handle: "@whale_alert2", time: "30m ago", text: "The 0xb7d2 whale moved $340M off exchange yesterday. That's OTC buying, not retail.", up: true },
      { handle: "@on_chain_m", time: "2h ago", text: "Exchange wallets at the top means custodial activity is rising. Bull flag or trap?", up: false },
    ],
  },
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const Tooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="px-3 py-2.5 rounded-xl text-xs" style={{ background:"rgba(15,10,10,0.97)", border:"1px solid rgba(34,116,165,0.22)", boxShadow:"0 8px 32px rgba(0,0,0,0.60)" }}>
      <p style={{ color: P.dim, marginBottom: 5, fontSize: "10px" }}>{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} className="mb-0.5" style={{ color: p.color || P.light }}>
          <span style={{ color: P.mid, marginRight: 5 }}>{p.name}:</span>{p.value}
        </p>
      ))}
    </div>
  );
};

function InsightBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all duration-200 relative flex-shrink-0 ml-2"
      style={{ background:"rgba(34,116,165,0.12)", border:"1px solid rgba(34,116,165,0.24)", color: P.light, fontSize:"11px", fontWeight:500 }}
      onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(34,116,165,0.22)"; el.style.boxShadow = "0 0 16px rgba(34,116,165,0.30)"; }}
      onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(34,116,165,0.12)"; el.style.boxShadow = "none"; }}
    >
      <Sparkles style={{ width: 12, height: 12 }} className="animate-pulse" />
      <span>Insight</span>
      <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-55" style={{ background: P.primary }} />
        <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ background: P.primary }} />
      </span>
    </button>
  );
}

function Card({ children, className="", hoverBorder=true, ...rest }: any) {
  return (
    <div
      className={`rounded-[20px] transition-all duration-300 ${className}`}
      style={{ background: P.cardBg, backdropFilter:"blur(26px)", WebkitBackdropFilter:"blur(26px)", border:`1px solid ${P.border}`, boxShadow:"0 8px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(99,188,233,0.04)", ...rest.style }}
      onMouseEnter={hoverBorder ? (e) => { (e.currentTarget as HTMLElement).style.border = `1px solid ${P.borderH}`; (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 40px rgba(0,0,0,0.55), 0 0 28px rgba(34,116,165,0.10)"; } : undefined}
      onMouseLeave={hoverBorder ? (e) => { (e.currentTarget as HTMLElement).style.border = `1px solid ${P.border}`; (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(99,188,233,0.04)"; } : undefined}
      {...rest}
    >
      {children}
    </div>
  );
}

// ── Insight Panel (uses shared component) ────────────────────────────────────
function InsightPanel({ id, onClose }: { id: string | null; onClose: () => void }) {
  const data = id ? INSIGHTS[id] : null;
  return <SharedInsightPanel id={id} data={data ?? null} onClose={onClose} />;
}

// ── Metric Card ───────────────────────────────────────────────────────────────
function MetricCard({ label, value, sub, change, icon: Icon }: { label:string; value:string; sub:string; change:number; icon:any }) {
  const positive = change >= 0;
  return (
    <Card className="p-5 hover:-translate-y-0.5">
      <div className="flex items-start justify-between mb-3">
        <div className="p-2 rounded-xl" style={{ background:"rgba(34,116,165,0.10)", border:"1px solid rgba(34,116,165,0.18)" }}>
          <Icon style={{ width:16, height:16, color: P.primary }} />
        </div>
        <span
          className="flex items-center gap-1 px-2 py-0.5 rounded-lg"
          style={{ fontSize:"12px", fontWeight:600, color: positive ? P.light : P.mid, background: positive ? "rgba(99,188,233,0.10)" : "rgba(241,242,242,0.06)", border: positive ? "1px solid rgba(99,188,233,0.18)" : "1px solid rgba(241,242,242,0.08)" }}
        >
          {positive ? <ArrowUpRight style={{ width:11, height:11 }} /> : <ArrowDownRight style={{ width:11, height:11 }} />}
          {positive ? "+" : ""}{change.toFixed(1)}%
        </span>
      </div>
      <p style={{ fontSize:"26px", fontWeight:700, color: P.light, fontFamily:"monospace" }}>{value}</p>
      <p style={{ fontSize:"13px", fontWeight:500, color: P.white, marginTop:2 }}>{label}</p>
      <p style={{ fontSize:"11px", color: P.dim, marginTop:2 }}>{sub}</p>
    </Card>
  );
}

// ── Page sections ─────────────────────────────────────────────────────────────

function InsightStrip({ onInsightClick }: { onInsightClick: () => void }) {
  const { asset, timeRange } = useDashboard();
  return (
    <motion.div
      initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }}
      className="relative overflow-hidden rounded-[20px]"
      style={{ background:"rgba(16,68,151,0.08)", backdropFilter:"blur(26px)", WebkitBackdropFilter:"blur(26px)", border:`1px solid ${P.border}`, boxShadow:"0 8px 32px rgba(0,0,0,0.40), inset 0 1px 0 rgba(99,188,233,0.04)" }}
    >
      <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-[20px]" style={{ background:`linear-gradient(180deg, ${P.deep}, ${P.light})` }} />
      <div className="absolute inset-0 pointer-events-none" style={{ background:"radial-gradient(ellipse 35% 100% at 0% 50%, rgba(34,116,165,0.07) 0%, transparent 55%)" }} />
      <div className="pl-7 pr-5 py-4 flex flex-col sm:flex-row sm:items-center gap-4 relative z-10">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <Zap style={{ width:12, height:12, color:P.light }} />
            <span style={{ fontSize:"10px", fontWeight:600, color:P.primary, textTransform:"uppercase", letterSpacing:"0.08em", fontFamily:"'Work Sans',sans-serif" }}>
              AI Signal · {asset !== "ALL" ? `${asset} · ` : ""}Wallet Activity · {timeRange} · Apr 2, 2026
            </span>
          </div>
          <p style={{ fontFamily:"'Newsreader',Georgia,serif", fontSize:"20px", fontWeight:700, lineHeight:1.3, color:P.white }}>
            Active wallets at 30-day high — 1.58M daily users on-chain
          </p>
          <p style={{ fontSize:"13px", color:P.mid, marginTop:6, lineHeight:1.6 }}>
            New wallet creation surged to 390K/day. D30 retention at 47% — highest in 6 months.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 sm:flex-nowrap sm:flex-shrink-0 items-center">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ fontSize:"12px", fontWeight:500, background:"rgba(34,116,165,0.12)", border:"1px solid rgba(34,116,165,0.24)", color:P.mid }}>
            <TrendingUp style={{ width:12, height:12, color:P.primary }} /> New users +116%
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ fontSize:"12px", fontWeight:500, background:"rgba(16,68,151,0.16)", border:"1px solid rgba(16,68,151,0.32)", color:P.mid }}>
            <Users style={{ width:12, height:12, color:"rgba(241,242,242,0.55)" }} /> 47% D30 retention
          </span>
          <button onClick={onInsightClick}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg transition-all duration-200 whitespace-nowrap"
            style={{ fontSize:"12px", fontWeight:600, background:"rgba(34,116,165,0.20)", border:"1px solid rgba(34,116,165,0.36)", color:P.light, boxShadow:"0 0 16px rgba(34,116,165,0.20)" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 0 28px rgba(34,116,165,0.38)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 0 16px rgba(34,116,165,0.20)"; }}>
            <Sparkles style={{ width:13, height:13 }} className="animate-pulse" /> ✨ Insight
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function ActiveAddressesTab({ onInsight }: { onInsight:(id:string)=>void }) {
  return (
    <div className="space-y-4">
      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.4, delay:0.05 }}>
          <MetricCard label="Active Wallets" value="1.58M" sub="Unique addresses today" change={+30.6} icon={Users} />
        </motion.div>
        <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.4, delay:0.10 }}>
          <MetricCard label="New Addresses" value="390K" sub="First-time wallets today" change={+116.7} icon={ArrowUpRight} />
        </motion.div>
        <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.4, delay:0.15 }}>
          <MetricCard label="Transaction Count" value="4.2M" sub="On-chain transactions" change={+18.4} icon={Activity} />
        </motion.div>
        <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.4, delay:0.20 }}>
          <MetricCard label="Avg Tx Value" value="$1,619" sub="Per transaction today" change={-4.2} icon={TrendingUp} />
        </motion.div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Activity trend */}
        <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.45, delay:0.25 }}>
          <Card className="p-5 hover:-translate-y-0.5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 style={{ fontSize:"15px", fontWeight:600, color:P.white, fontFamily:"'Work Sans',sans-serif" }}>Activity Trend</h3>
                <p style={{ fontSize:"11px", color:P.dim, marginTop:2 }}>Active & new addresses · 30-day</p>
              </div>
              <InsightBtn onClick={() => onInsight("trend")} />
            </div>
            <div className="flex gap-4 mb-4">
              {[["#63bce9","Active","M"],["rgba(34,116,165,0.55)","New","K"]].map(([c,n,u]) => (
                <div key={n} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2 rounded-sm" style={{ background: c }} />
                  <span style={{ fontSize:"11px", color:P.mid }}>{n}</span>
                </div>
              ))}
            </div>
            <div style={{ height:210 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activityTrend} margin={{ top:4, right:4, left:-22, bottom:0 }}>
                  <defs>
                    <linearGradient id="actGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#63bce9" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#63bce9" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="newGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2274a5" stopOpacity={0.30} />
                      <stop offset="100%" stopColor="#2274a5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(34,116,165,0.08)" vertical={false} />
                  <XAxis dataKey="date" tick={{ fill:"rgba(241,242,242,0.28)", fontSize:10, fontFamily:"'Work Sans',sans-serif" }} tickLine={false} axisLine={false} interval={4} dy={6} />
                  <YAxis tick={{ fill:"rgba(241,242,242,0.28)", fontSize:10, fontFamily:"'Work Sans',sans-serif" }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}M`} />
                  <RechartsTooltip content={<Tooltip />} />
                  <Area type="monotone" dataKey="active" name="Active" stroke={P.light} strokeWidth={2} fill="url(#actGrad)" style={{ filter:"drop-shadow(0 0 6px rgba(99,188,233,0.40))" }} animationDuration={1200} />
                  <Area type="monotone" dataKey="new" name="New" stroke={P.primary} strokeWidth={1.5} fill="url(#newGrad)" animationDuration={1400} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        {/* New vs Returning */}
        <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.45, delay:0.32 }}>
          <Card className="p-5 hover:-translate-y-0.5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 style={{ fontSize:"15px", fontWeight:600, color:P.white, fontFamily:"'Work Sans',sans-serif" }}>New vs Returning Users</h3>
                <p style={{ fontSize:"11px", color:P.dim, marginTop:2 }}>Thousands of wallets per period</p>
              </div>
              <InsightBtn onClick={() => onInsight("trend")} />
            </div>
            <div className="flex gap-4 mb-4">
              {[["#63bce9","Returning"],["rgba(99,188,233,0.40)","New"]].map(([c,n]) => (
                <div key={n} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2 rounded-sm" style={{ background: c }} />
                  <span style={{ fontSize:"11px", color:P.mid }}>{n}</span>
                </div>
              ))}
            </div>
            <div style={{ height:210 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={newVsReturning} margin={{ top:4, right:4, left:-22, bottom:0 }} barGap={2} barSize={20}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(34,116,165,0.08)" vertical={false} />
                  <XAxis dataKey="date" tick={{ fill:"rgba(241,242,242,0.28)", fontSize:10, fontFamily:"'Work Sans',sans-serif" }} tickLine={false} axisLine={false} dy={6} />
                  <YAxis tick={{ fill:"rgba(241,242,242,0.28)", fontSize:10, fontFamily:"'Work Sans',sans-serif" }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}K`} />
                  <RechartsTooltip content={<Tooltip />} />
                  <Bar dataKey="ret" name="Returning" fill={P.light} radius={[3,3,0,0]} animationDuration={1000} />
                  <Bar dataKey="newU" name="New" fill="rgba(99,188,233,0.40)" radius={[3,3,0,0]} animationDuration={1200} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Top Wallets Table */}
      <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.45, delay:0.40 }}>
        <div className="rounded-[20px] overflow-hidden" style={{ background:P.cardBg, backdropFilter:"blur(26px)", WebkitBackdropFilter:"blur(26px)", border:`1px solid ${P.border}`, boxShadow:"0 8px 32px rgba(0,0,0,0.45)" }}>
          <div className="px-5 pt-5 pb-3 flex items-center justify-between">
            <div>
              <h3 style={{ fontSize:"15px", fontWeight:600, color:P.white, fontFamily:"'Work Sans',sans-serif" }}>Top Wallets by Volume</h3>
              <p style={{ fontSize:"11px", color:P.dim, marginTop:2 }}>24h activity · ranked by transaction volume</p>
            </div>
            <InsightBtn onClick={() => onInsight("topWallets")} />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px]">
              <thead>
                <tr style={{ borderBottom:"1px solid rgba(34,116,165,0.08)" }}>
                  {["#","Address","Type","Tx Count","Volume","24h Chg"].map((h) => (
                    <th key={h} style={{ fontSize:"11px", fontWeight:500, color:"rgba(241,242,242,0.32)", padding:"10px 16px", textAlign:"left", fontFamily:"'Work Sans',sans-serif" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {topWallets.map((row, i) => (
                  <motion.tr key={row.rank} initial={{ opacity:0, y:4 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.22, delay:i*0.05 }}
                    style={{ borderBottom:"1px solid rgba(34,116,165,0.06)", cursor:"pointer" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(34,116,165,0.06)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                    <td className="px-4 py-3" style={{ fontSize:"12px", color:"rgba(241,242,242,0.22)" }}>{row.rank}</td>
                    <td className="px-4 py-3" style={{ fontSize:"12px", color:P.light, fontFamily:"monospace" }}>{row.addr}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-md" style={{ fontSize:"11px", background:"rgba(34,116,165,0.10)", border:"1px solid rgba(34,116,165,0.18)", color:"rgba(241,242,242,0.55)" }}>{row.type}</span>
                    </td>
                    <td className="px-4 py-3" style={{ fontSize:"12px", color:P.mid }}>{row.txCount.toLocaleString()}</td>
                    <td className="px-4 py-3" style={{ fontSize:"12px", color:P.white, fontWeight:500 }}>{row.volume}</td>
                    <td className="px-4 py-3">
                      <span style={{ fontSize:"12px", fontWeight:600, color: row.change >= 0 ? P.light : "rgba(241,242,242,0.45)" }}>
                        {row.change >= 0 ? "+" : ""}{row.change.toFixed(1)}%
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function TransactionsTab({ onInsight }: { onInsight:(id:string)=>void }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Total Transactions" value="4.2M" sub="On-chain txns today" change={+18.4} icon={Activity} />
        <MetricCard label="Avg Gas Fee" value="$2.84" sub="Per transaction" change={-12.1} icon={TrendingDown} />
        <MetricCard label="Median Tx Size" value="$840" sub="Median value" change={+5.3} icon={ArrowUpRight} />
        <MetricCard label="Failed Txns" value="1.2%" sub="Failure rate" change={-0.4} icon={TrendingDown} />
      </div>
      <Card className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 style={{ fontSize:"15px", fontWeight:600, color:P.white }}>Transaction Volume Trend</h3>
            <p style={{ fontSize:"11px", color:P.dim, marginTop:2 }}>Daily volume in $B · 30-day</p>
          </div>
          <InsightBtn onClick={() => onInsight("trend")} />
        </div>
        <div style={{ height:240 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={txVolumeTrend} margin={{ top:4, right:4, left:-22, bottom:0 }}>
              <defs>
                <linearGradient id="txGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2274a5" stopOpacity={0.40} />
                  <stop offset="100%" stopColor="#2274a5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(34,116,165,0.08)" vertical={false} />
              <XAxis dataKey="date" tick={{ fill:"rgba(241,242,242,0.28)", fontSize:10 }} tickLine={false} axisLine={false} dy={6} />
              <YAxis tick={{ fill:"rgba(241,242,242,0.28)", fontSize:10 }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}B`} />
              <RechartsTooltip content={<Tooltip />} />
              <Area type="monotone" dataKey="vol" name="Volume" stroke={P.primary} strokeWidth={2} fill="url(#txGrad)" style={{ filter:"drop-shadow(0 0 6px rgba(34,116,165,0.35))" }} animationDuration={1200} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}

function RetentionTab({ onInsight }: { onInsight:(id:string)=>void }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="D1 Retention" value="100%" sub="Baseline: Day 1" change={0} icon={Users} />
        <MetricCard label="D7 Retention" value="70.4%" sub="Avg across cohorts" change={+3.2} icon={TrendingUp} />
        <MetricCard label="D14 Retention" value="53.6%" sub="Avg across cohorts" change={+1.8} icon={TrendingUp} />
        <MetricCard label="D30 Retention" value="42.6%" sub="Avg across cohorts" change={+4.1} icon={TrendingUp} />
      </div>
      <Card className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 style={{ fontSize:"15px", fontWeight:600, color:P.white }}>Retention by Cohort</h3>
            <p style={{ fontSize:"11px", color:P.dim, marginTop:2 }}>% of wallets remaining active per cohort week</p>
          </div>
          <InsightBtn onClick={() => onInsight("retention")} />
        </div>
        <div style={{ height:260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={retentionCohorts} margin={{ top:4, right:4, left:-22, bottom:0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(34,116,165,0.08)" vertical={false} />
              <XAxis dataKey="week" tick={{ fill:"rgba(241,242,242,0.28)", fontSize:10 }} tickLine={false} axisLine={false} dy={6} />
              <YAxis tick={{ fill:"rgba(241,242,242,0.28)", fontSize:10 }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
              <RechartsTooltip content={<Tooltip />} formatter={(v:number) => `${v}%`} />
              {[["d1","#63bce9"],["d7","#2274a5"],["d14","rgba(99,188,233,0.60)"],["d30","rgba(34,116,165,0.70)"]].map(([k,c]) => (
                <Line key={k} type="monotone" dataKey={k} name={`D${k.slice(1)}`} stroke={c} strokeWidth={2} dot={{ fill:c, r:3 }} animationDuration={1200} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}

function CohortsTab({ onInsight }: { onInsight:(id:string)=>void }) {
  const weeks = ["W1","W2","W3","W4","W5"];
  const days  = ["D1","D7","D14","D30"];
  const vals: Record<string, Record<string, number>> = {
    W1:{ D1:100, D7:68, D14:52, D30:41 }, W2:{ D1:100, D7:71, D14:55, D30:44 },
    W3:{ D1:100, D7:65, D14:49, D30:38 }, W4:{ D1:100, D7:73, D14:58, D30:47 },
    W5:{ D1:100, D7:70, D14:54, D30:43 },
  };
  function cellColor(v: number) {
    if (v >= 80) return "rgba(99,188,233,0.75)";
    if (v >= 65) return "rgba(99,188,233,0.50)";
    if (v >= 50) return "rgba(34,116,165,0.60)";
    if (v >= 40) return "rgba(16,68,151,0.65)";
    return "rgba(16,68,151,0.40)";
  }
  return (
    <div className="space-y-4">
      <Card className="p-5">
        <div className="flex items-start justify-between mb-5">
          <div>
            <h3 style={{ fontSize:"15px", fontWeight:600, color:P.white }}>Cohort Retention Matrix</h3>
            <p style={{ fontSize:"11px", color:P.dim, marginTop:2 }}>% active at each time point · by acquisition week</p>
          </div>
          <InsightBtn onClick={() => onInsight("retention")} />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full" style={{ borderCollapse:"separate", borderSpacing:4 }}>
            <thead>
              <tr>
                <th style={{ fontSize:"11px", color:P.dim, padding:"8px 12px", textAlign:"left" }}>Cohort</th>
                {days.map((d) => <th key={d} style={{ fontSize:"11px", color:P.dim, padding:"8px 12px", textAlign:"center", minWidth:80 }}>{d}</th>)}
              </tr>
            </thead>
            <tbody>
              {weeks.map((w) => (
                <tr key={w}>
                  <td style={{ fontSize:"12px", color:P.mid, padding:"4px 12px", fontWeight:500 }}>{w}</td>
                  {days.map((d) => {
                    const v = vals[w][d];
                    return (
                      <td key={d} style={{ padding:4 }}>
                        <div className="rounded-xl flex items-center justify-center py-3 transition-all duration-200 cursor-default"
                          style={{ background:cellColor(v), border:"1px solid rgba(241,242,242,0.06)" }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1.04)"; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "none"; }}>
                          <span style={{ fontSize:"13px", fontWeight:700, color:P.white }}>{v}%</span>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center gap-3 mt-4 pt-3 flex-wrap" style={{ borderTop:"1px solid rgba(34,116,165,0.10)" }}>
          <span style={{ fontSize:"10px", color:P.dim }}>Retention:</span>
          {[["< 40%","rgba(16,68,151,0.40)"],["40–50%","rgba(16,68,151,0.65)"],["50–65%","rgba(34,116,165,0.60)"],["65–80%","rgba(99,188,233,0.50)"],["> 80%","rgba(99,188,233,0.75)"]].map(([l,c]) => (
            <div key={l} className="flex items-center gap-1">
              <span className="w-2.5 h-2 rounded-sm" style={{ backgroundColor:c }} />
              <span style={{ fontSize:"10px", color:P.dim }}>{l}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export function WalletActivity() {
  const [activeInsight, setActiveInsight] = useState<string | null>(null);
  const { activeSubTab } = useDashboard();
  const open  = (id: string) => setActiveInsight(id);
  const close = () => setActiveInsight(null);

  const renderTab = () => {
    switch (activeSubTab) {
      case "Transactions": return <TransactionsTab onInsight={open} />;
      case "Retention":    return <RetentionTab    onInsight={open} />;
      case "Cohorts":      return <CohortsTab      onInsight={open} />;
      default:             return <ActiveAddressesTab onInsight={open} />;
    }
  };

  return (
    <div className="space-y-4 pb-16">
      <InsightStrip onInsightClick={() => open("strip")} />
      {renderTab()}
      <InsightPanel id={activeInsight} onClose={close} />
    </div>
  );
}
