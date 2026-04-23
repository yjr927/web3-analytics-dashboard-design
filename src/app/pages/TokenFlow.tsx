import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles, X, Activity, Zap, MessageSquare,
  TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Info,
} from "lucide-react";
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer,
} from "recharts";
import { useDashboard } from "../contexts/DashboardContext";
import { InsightPanel as SharedInsightPanel, type InsightData as SharedInsightData } from "../components/InsightPanel";

// ── Palette ───────────────────────────────────────────────────────────────────
const P = {
  primary: "#2274a5",
  light:   "#63bce9",
  deep:    "#104497",
  white:   "#f1f2f2",
  cardBg:  "rgba(16,68,151,0.07)",
  border:  "rgba(34,116,165,0.16)",
  borderH: "rgba(99,188,233,0.28)",
  dim:     "rgba(241,242,242,0.38)",
  mid:     "rgba(241,242,242,0.60)",
};

// ── Data ──────────────────────────────────────────────────────────────────────

const exchangeFlows = [
  { date:"Mar 5",  inflow:1.24, outflow:-0.82 }, { date:"Mar 8",  inflow:1.41, outflow:-0.95 },
  { date:"Mar 11", inflow:1.62, outflow:-1.10 }, { date:"Mar 14", inflow:1.38, outflow:-1.31 },
  { date:"Mar 17", inflow:1.88, outflow:-1.21 }, { date:"Mar 20", inflow:2.14, outflow:-1.48 },
  { date:"Mar 23", inflow:1.95, outflow:-1.65 }, { date:"Mar 26", inflow:2.30, outflow:-1.72 },
  { date:"Mar 29", inflow:2.18, outflow:-1.58 }, { date:"Apr 1",  inflow:2.42, outflow:-1.80 },
  { date:"Apr 2",  inflow:2.38, outflow:-1.91 },
];

const netFlowTrend = [
  { date:"Mar 5",  net:0.42 }, { date:"Mar 8",  net:0.46 }, { date:"Mar 11", net:0.52 },
  { date:"Mar 14", net:0.07 }, { date:"Mar 17", net:0.67 }, { date:"Mar 20", net:0.66 },
  { date:"Mar 23", net:0.30 }, { date:"Mar 26", net:0.58 }, { date:"Mar 29", net:0.60 },
  { date:"Apr 1",  net:0.62 }, { date:"Apr 2",  net:0.47 },
];

const whaleData = [
  { date:"Mar 5",  large:8,  medium:24 }, { date:"Mar 9",  large:12, medium:31 },
  { date:"Mar 13", large:6,  medium:28 }, { date:"Mar 17", large:15, medium:38 },
  { date:"Mar 21", large:9,  medium:32 }, { date:"Mar 25", large:18, medium:42 },
  { date:"Mar 29", large:11, medium:35 }, { date:"Apr 2",  large:22, medium:47 },
];

const dexVolume = [
  { date:"Mar 5",  uni:1.24, curve:0.48, balancer:0.31 }, { date:"Mar 9",  uni:1.38, curve:0.52, balancer:0.28 },
  { date:"Mar 13", uni:1.62, curve:0.61, balancer:0.35 }, { date:"Mar 17", uni:1.41, curve:0.54, balancer:0.29 },
  { date:"Mar 21", uni:1.88, curve:0.72, balancer:0.44 }, { date:"Mar 25", uni:2.11, curve:0.81, balancer:0.52 },
  { date:"Mar 29", uni:1.95, curve:0.68, balancer:0.47 }, { date:"Apr 2",  uni:2.24, curve:0.89, balancer:0.58 },
];

const crossChainFlows = [
  { chain:"Ethereum → Arbitrum", vol:"$842M", delta:+24.1, pct:28 },
  { chain:"Ethereum → Optimism",  vol:"$612M", delta:+11.8, pct:21 },
  { chain:"Ethereum → Base",      vol:"$521M", delta:+38.4, pct:18 },
  { chain:"BNB → Ethereum",       vol:"$384M", delta:-5.2,  pct:13 },
  { chain:"Polygon → Ethereum",   vol:"$298M", delta:-12.4, pct:10 },
  { chain:"Avalanche → Ethereum", vol:"$187M", delta:+4.8,  pct:6  },
  { chain:"Solana → Ethereum",    vol:"$124M", delta:+67.2, pct:4  },
];

const topInflowAssets = [
  { rank:1, sym:"ETH",  name:"Ethereum",  inflow:"$1.24B", change:+18.2, net:"net-in"  },
  { rank:2, sym:"BTC",  name:"Bitcoin",   inflow:"$892M",  change:+8.4,  net:"net-in"  },
  { rank:3, sym:"USDT", name:"Tether",    inflow:"$741M",  change:+3.1,  net:"net-in"  },
  { rank:4, sym:"SOL",  name:"Solana",    inflow:"$412M",  change:+52.1, net:"net-out" },
  { rank:5, sym:"BNB",  name:"BNB",       inflow:"$284M",  change:-14.2, net:"net-in"  },
  { rank:6, sym:"AVAX", name:"Avalanche", inflow:"$191M",  change:-8.8,  net:"net-out" },
];

const INSIGHTS: Record<string, SharedInsightData> = {
  strip: {
    title:"Token Flow Overview",
    systemInsight:"Net exchange inflow at $470M today — broadly positive for price pressure. ETH inflows lead at $1.24B while SOL showed net-outflow of $330M, suggesting accumulation off exchanges.",
    keySignals: ["ETH leading inflows at $1.24B — selling pressure concentrated in ETH", "SOL net-outflow of $330M — smart money accumulating off exchanges", "Net inflow compressing from $660M peak to $470M — sellers losing steam"],
    explanation:"When assets flow INTO exchanges, it means holders are preparing to sell. When assets flow OUT, it means buyers are moving coins to cold storage — a bullish signal.",
    expertInsight:'"SOL net-outflow while price is down 7% is a classic dip-buy pattern. Wallets are removing SOL from exchanges while price is weak. This historically precedes 2-3 week recovery moves."',
    expertName:"Nina Reyes", expertRole:"Flow Analysis Lead", expertInitials:"NR",
    communityTop: {handle:"@sol_tracker",text:"SOL outflow signal is very clean. Someone big is buying and holding off exchange.",likes:267,replies:45},
    discussion:[
      {handle:"@exchange_watch",time:"45m ago",text:"ETH inflows elevated but not extreme. Selling pressure present but not capitulation-level.",up:false},
      {handle:"@sol_tracker",time:"2h ago",text:"SOL outflow signal is very clean. Someone big is buying and holding off exchange.",up:true},
    ],
  },
  flows: {
    title:"Exchange Flow Analysis",
    systemInsight:"Total exchange inflows rose to $2.38B on Apr 2 (+63% vs 30-day avg). Outflows at $1.91B — net positive inflow of $470M indicates selling pressure, but not alarming.",
    keySignals: ["Inflows at $2.38B — up 63% vs 30-day average", "Outflows at $1.91B — buyers active but outpaced by sellers", "Net inflow differential narrowing — distribution phase may be ending"],
    explanation:"Exchange inflow means coins are moving TO exchanges (potential selling). Outflow means coins leaving exchanges (potential buying/hodling). Net inflow = more sell pressure.",
    expertInsight:'"Inflow/outflow differential closing to $470M is compressing — down from $660M peak. Sellers are running out of steam. Watch for net-outflow to signal the next leg up."',
    expertName:"Marcus Vo", expertRole:"Exchange Analytics", expertInitials:"MV",
    communityTop: {handle:"@flow_watcher",text:"Net inflow narrowing week-over-week. Distribution phase ending, accumulation phase starting.",likes:196,replies:31},
    discussion:[
      {handle:"@flow_watcher",time:"1h ago",text:"Net inflow narrowing week-over-week. Distribution phase ending, accumulation phase starting.",up:true},
      {handle:"@bear_case",time:"3h ago",text:"$2.4B inflow is still large. Until that drops below $1B, I'm skeptical of any recovery.",up:false},
    ],
  },
  whale: {
    title:"Whale Movement Analysis",
    systemInsight:"22 large whale transactions (>$10M each) detected on Apr 2 — highest in 30 days. 47 medium whale transactions ($1-10M). Whale activity is accelerating into the current dip.",
    keySignals: ["22 large whale txns (>$10M) — 30-day high during a dip", "4 new addresses this week with $500M+ holdings", "Whale activity accelerating into weakness — classic accumulation"],
    explanation:"Whale addresses control large amounts. When they transact more during price dips, it often means they are accumulating. Whale activity during dips historically precedes rallies.",
    expertInsight:'"22 large whale transactions in a single day during a 7% BTC drawdown is the kind of signal you see at major lows. Institutional buyers don\'t announce, they just buy."',
    expertName:"Elena Marsh", expertRole:"Whale Intelligence", expertInitials:"EM",
    communityTop: {handle:"@bigfish_on",text:"22 large whale moves today. Tracking 4 new addresses that appeared this week with $500M+ holdings.",likes:352,replies:67},
    discussion:[
      {handle:"@bigfish_on",time:"30m ago",text:"22 large whale moves today. Tracking 4 new addresses that appeared this week with $500M+ holdings.",up:true},
      {handle:"@whale_skeptic",time:"4h ago",text:"Could be whales rotating, not accumulating. Need to see if these are buy or sell transactions.",up:false},
    ],
  },
  dex: {
    title:"DEX Activity Overview",
    systemInsight:"Total DEX volume hit $2.71B on Apr 2 (+41% vs 7-day avg). Uniswap leads at $2.24B. Curve and Balancer growing as stable/yield strategies pick up.",
    keySignals: ["Total DEX volume $2.71B — up 41% vs 7-day average", "Curve growth +47% — stable liquidity farming seeing renewed interest", "DEX rising while CEX mixed — structural DeFi health signal"],
    explanation:"DEX (decentralized exchange) volume shows on-chain trading. Rising DEX volume during market uncertainty means DeFi users are actively repositioning, often from riskier assets to stables or ETH.",
    expertInsight:'"DEX volume rising while CEX volume is mixed is a structural DeFi health signal. Curve growth (+47%) confirms stable liquidity farming is seeing renewed interest from yield-hungry capital."',
    expertName:"Owen Park", expertRole:"DeFi Strategist", expertInitials:"OP",
    communityTop: {handle:"@defi_anon",text:"Uniswap V3 LP returns jumped this week. Makes sense volume is up — LPs are getting compensated.",likes:211,replies:38},
    discussion:[
      {handle:"@defi_anon",time:"1h ago",text:"Uniswap V3 LP returns jumped this week. Makes sense volume is up — LPs are getting compensated.",up:true},
      {handle:"@curve_watch",time:"2h ago",text:"Curve gauge votes shifting to newer pools. Watch for incentive changes affecting volume.",up:false},
    ],
  },
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const Tooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="px-3 py-2.5 rounded-xl text-xs" style={{ background:"rgba(15,10,10,0.97)", border:"1px solid rgba(34,116,165,0.22)", boxShadow:"0 8px 32px rgba(0,0,0,0.60)" }}>
      <p style={{ color:P.dim, marginBottom:5, fontSize:"10px" }}>{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} className="mb-0.5" style={{ color:p.color||P.light }}>
          <span style={{ color:P.mid, marginRight:5 }}>{p.name}:</span>{p.value}
        </p>
      ))}
    </div>
  );
};

function InsightBtn({ onClick }: { onClick:()=>void }) {
  return (
    <button onClick={onClick}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all duration-200 relative flex-shrink-0 ml-2"
      style={{ background:"rgba(34,116,165,0.12)", border:"1px solid rgba(34,116,165,0.24)", color:P.light, fontSize:"11px", fontWeight:500 }}
      onMouseEnter={(e) => { const el=e.currentTarget as HTMLElement; el.style.background="rgba(34,116,165,0.22)"; el.style.boxShadow="0 0 16px rgba(34,116,165,0.30)"; }}
      onMouseLeave={(e) => { const el=e.currentTarget as HTMLElement; el.style.background="rgba(34,116,165,0.12)"; el.style.boxShadow="none"; }}>
      <Sparkles style={{ width:12, height:12 }} className="animate-pulse" />
      <span>Insight</span>
      <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-55" style={{ background:P.primary }} />
        <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ background:P.primary }} />
      </span>
    </button>
  );
}

function Card({ children, className="", ...rest }: any) {
  return (
    <div className={`rounded-[20px] transition-all duration-300 ${className}`}
      style={{ background:P.cardBg, backdropFilter:"blur(26px)", WebkitBackdropFilter:"blur(26px)", border:`1px solid ${P.border}`, boxShadow:"0 8px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(99,188,233,0.04)", ...rest.style }}
      onMouseEnter={(e) => { const el=e.currentTarget as HTMLElement; el.style.border=`1px solid ${P.borderH}`; el.style.boxShadow="0 12px 40px rgba(0,0,0,0.55), 0 0 28px rgba(34,116,165,0.10)"; }}
      onMouseLeave={(e) => { const el=e.currentTarget as HTMLElement; el.style.border=`1px solid ${P.border}`; el.style.boxShadow="0 8px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(99,188,233,0.04)"; }}
      {...rest}>
      {children}
    </div>
  );
}

function MetricCard({ label, value, sub, change, highlight=false }: { label:string; value:string; sub:string; change:number; highlight?:boolean }) {
  const pos = change >= 0;
  return (
    <Card className="p-5 hover:-translate-y-0.5">
      <div className="flex items-start justify-between mb-3">
        <span style={{ fontSize:"11px", fontWeight:500, color:P.dim, textTransform:"uppercase", letterSpacing:"0.06em" }}>{label}</span>
        <span className="flex items-center gap-1 px-2 py-0.5 rounded-lg"
          style={{ fontSize:"12px", fontWeight:600, color:pos?P.light:P.mid, background:pos?"rgba(99,188,233,0.10)":"rgba(241,242,242,0.06)", border:pos?"1px solid rgba(99,188,233,0.18)":"1px solid rgba(241,242,242,0.08)" }}>
          {pos ? <ArrowUpRight style={{ width:11, height:11 }} /> : <ArrowDownRight style={{ width:11, height:11 }} />}
          {pos?"+":""}{change.toFixed(1)}%
        </span>
      </div>
      <p style={{ fontSize:"26px", fontWeight:700, color:highlight?P.light:P.white, fontFamily:"monospace" }}>{value}</p>
      <p style={{ fontSize:"11px", color:P.dim, marginTop:4 }}>{sub}</p>
    </Card>
  );
}

// ── Insight Panel ─────────────────────────────────────────────────────────────
function InsightPanel({ id, onClose }: { id:string|null; onClose:()=>void }) {
  const data = id ? INSIGHTS[id] : null;
  return <SharedInsightPanel id={id} data={data ?? null} onClose={onClose} />;
}

// ── Insight Strip ─────────────────────────────────────────────────────────────
function InsightStrip({ onInsightClick }:{ onInsightClick:()=>void }) {
  const { asset, timeRange } = useDashboard();
  return (
    <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }}
      className="relative overflow-hidden rounded-[20px]"
      style={{ background:"rgba(16,68,151,0.08)", backdropFilter:"blur(26px)", WebkitBackdropFilter:"blur(26px)", border:`1px solid ${P.border}`, boxShadow:"0 8px 32px rgba(0,0,0,0.40), inset 0 1px 0 rgba(99,188,233,0.04)" }}>
      <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-[20px]" style={{ background:`linear-gradient(180deg, ${P.deep}, ${P.light})` }} />
      <div className="pl-7 pr-5 py-4 flex flex-col sm:flex-row sm:items-center gap-4 relative z-10">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <Zap style={{ width:12, height:12, color:P.light }} />
            <span style={{ fontSize:"10px", fontWeight:600, color:P.primary, textTransform:"uppercase", letterSpacing:"0.08em" }}>AI Signal · {asset !== "ALL" ? `${asset} · ` : ""}Token Flow · {timeRange} · Apr 2, 2026</span>
          </div>
          <p style={{ fontFamily:"'Newsreader',Georgia,serif", fontSize:"20px", fontWeight:700, lineHeight:1.3, color:P.white }}>
            Net positive inflow: $470M — selling pressure but not capitulation
          </p>
          <p style={{ fontSize:"13px", color:P.mid, marginTop:6, lineHeight:1.6 }}>SOL net-outflow of $330M signals smart money accumulation off exchanges.</p>
        </div>
        <div className="flex flex-wrap gap-2 sm:flex-nowrap sm:flex-shrink-0 items-center">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ fontSize:"12px", fontWeight:500, background:"rgba(34,116,165,0.12)", border:"1px solid rgba(34,116,165,0.24)", color:P.mid }}>
            <ArrowUpRight style={{ width:12, height:12, color:P.primary }} /> Inflow $2.38B
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ fontSize:"12px", fontWeight:500, background:"rgba(16,68,151,0.16)", border:"1px solid rgba(16,68,151,0.32)", color:P.mid }}>
            <ArrowDownRight style={{ width:12, height:12, color:"rgba(241,242,242,0.55)" }} /> Outflow $1.91B
          </span>
          <button onClick={onInsightClick}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg transition-all duration-200 whitespace-nowrap"
            style={{ fontSize:"12px", fontWeight:600, background:"rgba(34,116,165,0.20)", border:"1px solid rgba(34,116,165,0.36)", color:P.light, boxShadow:"0 0 16px rgba(34,116,165,0.20)" }}
            onMouseEnter={(e)=>{ (e.currentTarget as HTMLElement).style.boxShadow="0 0 28px rgba(34,116,165,0.38)"; }}
            onMouseLeave={(e)=>{ (e.currentTarget as HTMLElement).style.boxShadow="0 0 16px rgba(34,116,165,0.20)"; }}>
            <Sparkles style={{ width:13, height:13 }} className="animate-pulse" /> ✨ Insight
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ── Tab: Exchange Flows ───────────────────────────────────────────────────────
function ExchangeFlowsTab({ onInsight }:{ onInsight:(id:string)=>void }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Total Inflow" value="$2.38B" sub="Coins entering exchanges" change={+63.1} />
        <MetricCard label="Total Outflow" value="$1.91B" sub="Coins leaving exchanges" change={+42.5} />
        <MetricCard label="Net Flow" value="+$470M" sub="Inflow minus outflow" change={-12.4} highlight />
        <MetricCard label="Whale Txns" value="22" sub="Transactions >$10M today" change={+83.3} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.45, delay:0.20 }}>
          <Card className="p-5 hover:-translate-y-0.5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 style={{ fontSize:"15px", fontWeight:600, color:P.white }}>Inflow vs Outflow</h3>
                <p style={{ fontSize:"11px", color:P.dim, marginTop:2 }}>Daily exchange flows in $B</p>
              </div>
              <InsightBtn onClick={() => onInsight("flows")} />
            </div>
            <div className="flex gap-4 mb-4">
              {[["#2274a5","Inflow"],["rgba(99,188,233,0.45)","Outflow"]].map(([c,n]) => (
                <div key={n} className="flex items-center gap-1.5"><span className="w-2.5 h-2 rounded-sm" style={{ background:c }} /><span style={{ fontSize:"11px", color:P.mid }}>{n}</span></div>
              ))}
            </div>
            <div style={{ height:210 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={exchangeFlows} margin={{ top:4, right:4, left:-22, bottom:0 }} barGap={2} barSize={14}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(34,116,165,0.08)" vertical={false} />
                  <XAxis dataKey="date" tick={{ fill:"rgba(241,242,242,0.28)", fontSize:10 }} tickLine={false} axisLine={false} interval={2} dy={6} />
                  <YAxis tick={{ fill:"rgba(241,242,242,0.28)", fontSize:10 }} tickLine={false} axisLine={false} tickFormatter={(v)=>`$${Math.abs(v)}B`} />
                  <RechartsTooltip content={<Tooltip />} />
                  <Bar dataKey="inflow" name="Inflow" fill={P.primary} radius={[3,3,0,0]} animationDuration={1000} />
                  <Bar dataKey="outflow" name="Outflow" fill="rgba(99,188,233,0.40)" radius={[3,3,0,0]} animationDuration={1200} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.45, delay:0.28 }}>
          <Card className="p-5 hover:-translate-y-0.5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 style={{ fontSize:"15px", fontWeight:600, color:P.white }}>Net Flow Trend</h3>
                <p style={{ fontSize:"11px", color:P.dim, marginTop:2 }}>Daily net inflow ($B) · + means sell pressure</p>
              </div>
              <InsightBtn onClick={() => onInsight("flows")} />
            </div>
            <div style={{ height:234 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={netFlowTrend} margin={{ top:4, right:4, left:-22, bottom:0 }}>
                  <defs>
                    <linearGradient id="netGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#63bce9" stopOpacity={0.30} />
                      <stop offset="100%" stopColor="#63bce9" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(34,116,165,0.08)" vertical={false} />
                  <XAxis dataKey="date" tick={{ fill:"rgba(241,242,242,0.28)", fontSize:10 }} tickLine={false} axisLine={false} interval={2} dy={6} />
                  <YAxis tick={{ fill:"rgba(241,242,242,0.28)", fontSize:10 }} tickLine={false} axisLine={false} tickFormatter={(v)=>`$${v}B`} />
                  <RechartsTooltip content={<Tooltip />} />
                  <Area type="monotone" dataKey="net" name="Net Flow" stroke={P.light} strokeWidth={2} fill="url(#netGrad)" style={{ filter:"drop-shadow(0 0 6px rgba(99,188,233,0.40))" }} animationDuration={1200} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Top inflow/outflow assets */}
      <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.45, delay:0.36 }}>
        <div className="rounded-[20px] overflow-hidden" style={{ background:P.cardBg, backdropFilter:"blur(26px)", WebkitBackdropFilter:"blur(26px)", border:`1px solid ${P.border}`, boxShadow:"0 8px 32px rgba(0,0,0,0.45)" }}>
          <div className="px-5 pt-5 pb-3 flex items-center justify-between">
            <div>
              <h3 style={{ fontSize:"15px", fontWeight:600, color:P.white }}>Top Assets by Exchange Flow</h3>
              <p style={{ fontSize:"11px", color:P.dim, marginTop:2 }}>24h inflow ranking · net direction indicator</p>
            </div>
            <InsightBtn onClick={() => onInsight("flows")} />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr style={{ borderBottom:"1px solid rgba(34,116,165,0.08)" }}>
                  {["#","Asset","24h Inflow","Change","Net Direction"].map(h => (
                    <th key={h} style={{ fontSize:"11px", fontWeight:500, color:"rgba(241,242,242,0.32)", padding:"10px 16px", textAlign:"left", fontFamily:"'Work Sans',sans-serif" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {topInflowAssets.map((row, i) => (
                  <motion.tr key={row.sym} initial={{ opacity:0, y:4 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.22, delay:i*0.05 }}
                    style={{ borderBottom:"1px solid rgba(34,116,165,0.06)", cursor:"pointer" }}
                    onMouseEnter={(e)=>{ (e.currentTarget as HTMLElement).style.background="rgba(34,116,165,0.06)"; }}
                    onMouseLeave={(e)=>{ (e.currentTarget as HTMLElement).style.background="transparent"; }}>
                    <td className="px-4 py-3" style={{ fontSize:"12px", color:"rgba(241,242,242,0.22)" }}>{row.rank}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background:`linear-gradient(135deg, ${P.deep}66, ${P.primary}aa)`, border:`1px solid ${P.primary}66` }}>
                          <span style={{ fontSize:"8px", fontWeight:700, color:P.white }}>{row.sym.slice(0,4)}</span>
                        </div>
                        <div>
                          <p style={{ fontSize:"13px", fontWeight:500, color:P.white }}>{row.name}</p>
                          <p style={{ fontSize:"10px", color:P.dim }}>{row.sym}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3" style={{ fontSize:"12px", color:P.white, fontWeight:500 }}>{row.inflow}</td>
                    <td className="px-4 py-3">
                      <span style={{ fontSize:"12px", fontWeight:600, color:row.change>=0?P.light:"rgba(241,242,242,0.45)" }}>
                        {row.change>=0?"+":""}{row.change.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg w-fit"
                        style={{ fontSize:"11px", fontWeight:500,
                          background: row.net==="net-in"?"rgba(16,68,151,0.25)":"rgba(34,116,165,0.16)",
                          border: row.net==="net-in"?"1px solid rgba(16,68,151,0.40)":"1px solid rgba(34,116,165,0.28)",
                          color: row.net==="net-in"?"rgba(241,242,242,0.55)":P.light }}>
                        {row.net==="net-in" ? <ArrowUpRight style={{ width:10, height:10 }} /> : <ArrowDownRight style={{ width:10, height:10 }} />}
                        {row.net==="net-in"?"Net Inflow":"Net Outflow"}
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

// ── Tab: Whale Activity ───────────────────────────────────────────────────────
function WhaleActivityTab({ onInsight }:{ onInsight:(id:string)=>void }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Large Txns >$10M" value="22" sub="Today — 30-day high" change={+83.3} highlight />
        <MetricCard label="Medium Txns $1-10M" value="47" sub="Today — active" change={+34.3} />
        <MetricCard label="Whale Volume" value="$1.84B" sub="Total whale activity" change={+62.1} />
        <MetricCard label="New Whale Wallets" value="4" sub="Wallets >$100M new this week" change={+100.0} />
      </div>
      <Card className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 style={{ fontSize:"15px", fontWeight:600, color:P.white }}>Whale Transaction Activity</h3>
            <p style={{ fontSize:"11px", color:P.dim, marginTop:2 }}>Daily count of large and medium whale transactions</p>
          </div>
          <InsightBtn onClick={() => onInsight("whale")} />
        </div>
        <div className="flex gap-4 mb-4">
          {[["#63bce9","Large >$10M"],["rgba(34,116,165,0.55)","Medium $1-10M"]].map(([c,n]) => (
            <div key={n} className="flex items-center gap-1.5"><span className="w-2.5 h-2 rounded-sm" style={{ background:c }} /><span style={{ fontSize:"11px", color:P.mid }}>{n}</span></div>
          ))}
        </div>
        <div style={{ height:240 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={whaleData} margin={{ top:4, right:4, left:-22, bottom:0 }} barGap={2} barSize={18}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(34,116,165,0.08)" vertical={false} />
              <XAxis dataKey="date" tick={{ fill:"rgba(241,242,242,0.28)", fontSize:10 }} tickLine={false} axisLine={false} dy={6} />
              <YAxis tick={{ fill:"rgba(241,242,242,0.28)", fontSize:10 }} tickLine={false} axisLine={false} />
              <RechartsTooltip content={<Tooltip />} />
              <Bar dataKey="large" name="Large >$10M" fill={P.light} radius={[3,3,0,0]} animationDuration={1000} />
              <Bar dataKey="medium" name="Medium $1-10M" fill="rgba(34,116,165,0.55)" radius={[3,3,0,0]} animationDuration={1200} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}

// ── Tab: DEX Activity ─────────────────────────────────────────────────────────
function DEXActivityTab({ onInsight }:{ onInsight:(id:string)=>void }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Total DEX Volume" value="$2.71B" sub="24h across all DEXes" change={+41.2} highlight />
        <MetricCard label="Uniswap V3" value="$2.24B" sub="Market leader" change={+38.7} />
        <MetricCard label="Curve Finance" value="$890M" sub="Stable swaps up" change={+47.1} />
        <MetricCard label="Balancer" value="$580M" sub="Weighted pools" change={+24.8} />
      </div>
      <Card className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 style={{ fontSize:"15px", fontWeight:600, color:P.white }}>DEX Volume by Protocol</h3>
            <p style={{ fontSize:"11px", color:P.dim, marginTop:2 }}>Daily volume in $B · 30-day trend</p>
          </div>
          <InsightBtn onClick={() => onInsight("dex")} />
        </div>
        <div style={{ height:260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dexVolume} margin={{ top:4, right:4, left:-22, bottom:0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(34,116,165,0.08)" vertical={false} />
              <XAxis dataKey="date" tick={{ fill:"rgba(241,242,242,0.28)", fontSize:10 }} tickLine={false} axisLine={false} dy={6} />
              <YAxis tick={{ fill:"rgba(241,242,242,0.28)", fontSize:10 }} tickLine={false} axisLine={false} tickFormatter={(v)=>`$${v}B`} />
              <RechartsTooltip content={<Tooltip />} />
              <Line type="monotone" dataKey="uni" name="Uniswap" stroke={P.light} strokeWidth={2} dot={false} animationDuration={1200} />
              <Line type="monotone" dataKey="curve" name="Curve" stroke={P.primary} strokeWidth={1.5} dot={false} animationDuration={1400} />
              <Line type="monotone" dataKey="balancer" name="Balancer" stroke="rgba(99,188,233,0.55)" strokeWidth={1.5} dot={false} animationDuration={1600} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}

// ── Tab: Cross-Chain ──────────────────────────────────────────────────────────
function CrossChainTab({ onInsight }:{ onInsight:(id:string)=>void }) {
  const total = crossChainFlows.reduce((s, r) => s + r.pct, 0);
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Total Bridge Volume" value="$2.97B" sub="24h cross-chain" change={+28.4} highlight />
        <MetricCard label="Active Bridges" value="14" sub="Protocols with >$1M flow" change={+7.7} />
        <MetricCard label="ETH Dominance" value="62%" sub="Share of bridge volume" change={-4.2} />
        <MetricCard label="L2 Inflows" value="$1.97B" sub="Ethereum L2 net" change={+41.8} />
      </div>
      <Card className="p-5">
        <div className="flex items-start justify-between mb-5">
          <div>
            <h3 style={{ fontSize:"15px", fontWeight:600, color:P.white }}>Cross-Chain Bridge Flows</h3>
            <p style={{ fontSize:"11px", color:P.dim, marginTop:2 }}>24h bridge volume by corridor · top routes</p>
          </div>
          <InsightBtn onClick={() => onInsight("flows")} />
        </div>
        <div className="space-y-3">
          {crossChainFlows.map((row) => (
            <div key={row.chain}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150"
              onMouseEnter={(e)=>{ (e.currentTarget as HTMLElement).style.background="rgba(34,116,165,0.06)"; }}
              onMouseLeave={(e)=>{ (e.currentTarget as HTMLElement).style.background="transparent"; }}>
              <span className="flex-shrink-0" style={{ fontSize:"12px", color:P.mid, minWidth:200 }}>{row.chain}</span>
              <div className="flex-1 h-3 rounded-full overflow-hidden" style={{ background:"rgba(34,116,165,0.08)" }}>
                <motion.div
                  initial={{ width:0 }} animate={{ width:`${row.pct}%` }} transition={{ duration:0.9, ease:"easeOut" }}
                  className="h-full rounded-full"
                  style={{ background:`linear-gradient(90deg, ${P.deep}, ${P.primary})`, boxShadow:`0 0 8px ${P.primary}50` }} />
              </div>
              <span style={{ fontSize:"12px", fontWeight:600, color:P.white, minWidth:60, textAlign:"right" }}>{row.vol}</span>
              <span style={{ fontSize:"12px", fontWeight:600, color:row.delta>=0?P.light:"rgba(241,242,242,0.45)", minWidth:60, textAlign:"right" }}>
                {row.delta>=0?"+":""}{row.delta.toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export function TokenFlow() {
  const [activeInsight, setActiveInsight] = useState<string | null>(null);
  const { activeSubTab } = useDashboard();
  const open  = (id: string) => setActiveInsight(id);
  const close = () => setActiveInsight(null);

  const renderTab = () => {
    switch (activeSubTab) {
      case "Whale Activity": return <WhaleActivityTab  onInsight={open} />;
      case "DEX Activity":   return <DEXActivityTab    onInsight={open} />;
      case "Cross-Chain":    return <CrossChainTab     onInsight={open} />;
      default:               return <ExchangeFlowsTab  onInsight={open} />;
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