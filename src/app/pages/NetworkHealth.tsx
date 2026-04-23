import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles, X, Activity, Zap, MessageSquare,
  TrendingUp, TrendingDown, Info, Shield,
  AlertTriangle, CheckCircle, ArrowUpRight, ArrowDownRight,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer,
} from "recharts";
import { useDashboard } from "../contexts/DashboardContext";
import { InsightPanel as SharedInsightPanel, type InsightData as SharedInsightData } from "../components/InsightPanel";

// ── Palette ───────────────────────────────────────────────────────────────────
const P = {
  primary: "#2274a5", light:"#63bce9", deep:"#104497",
  white:"#f1f2f2", cardBg:"rgba(16,68,151,0.07)",
  border:"rgba(34,116,165,0.16)", borderH:"rgba(99,188,233,0.28)",
  dim:"rgba(241,242,242,0.38)", mid:"rgba(241,242,242,0.60)",
};

// ── Data ──────────────────────────────────────────────────────────────────────

const riskTrend = [
  { date:"Mar 3", risk:42 }, { date:"Mar 6", risk:48 }, { date:"Mar 9", risk:44 },
  { date:"Mar 12",risk:51 }, { date:"Mar 15",risk:55 }, { date:"Mar 18",risk:61 },
  { date:"Mar 21",risk:58 }, { date:"Mar 24",risk:52 }, { date:"Mar 27",risk:57 },
  { date:"Mar 30",risk:63 }, { date:"Apr 2", risk:59 },
];

const plDistribution = [
  { range:"-50%+ ",  count:8  }, { range:"-30-50%",count:14 }, { range:"-10-30%",count:22 },
  { range:"0%",      count:31 }, { range:"0-10%",  count:28 }, { range:"10-30%", count:35 },
  { range:"30-50%",  count:19 }, { range:"50%+",   count:12 },
];

const liquidityDepth = [
  { asset:"BTC",  bid:142.1, ask:138.4 }, { asset:"ETH",  bid:82.3,  ask:79.1  },
  { asset:"SOL",  bid:24.8,  ask:22.1  }, { asset:"BNB",  bid:31.2,  ask:29.8  },
  { asset:"XRP",  bid:18.4,  ask:17.1  }, { asset:"AVAX", bid:12.8,  ask:11.4  },
];

const validatorData = [
  { date:"Mar 5",  active:542, rewards:1.24 }, { date:"Mar 9",  active:548, rewards:1.27 },
  { date:"Mar 13", active:551, rewards:1.22 }, { date:"Mar 17", active:558, rewards:1.31 },
  { date:"Mar 21", active:562, rewards:1.28 }, { date:"Mar 25", active:571, rewards:1.34 },
  { date:"Mar 29", active:575, rewards:1.30 }, { date:"Apr 2",  active:581, rewards:1.38 },
];

const profitTrend = [
  { date:"Mar 3",  btc:74,eth:38 }, { date:"Mar 7",  btc:76,eth:40 }, { date:"Mar 11",btc:78,eth:42 },
  { date:"Mar 15",btc:81,eth:45 }, { date:"Mar 19",btc:79,eth:43 }, { date:"Mar 23",btc:80,eth:44 },
  { date:"Mar 27",btc:78,eth:41 }, { date:"Apr 2",  btc:78,eth:42 },
];

const INSIGHTS: Record<string, SharedInsightData> = {
  strip: {
    title:"Network Health Overview",
    systemInsight:"Overall network health score: 72/100 — 'Cautious'. Risk index at 59/100, elevated but not extreme. BTC supply in profit at 78% provides strong floor support.",
    keySignals: ["Network health at 72/100 — functioning normally with elevated risk zones", "Risk index declining from 63 to 59 — natural deleveraging in progress", "BTC 78% supply in profit — strong floor against panic selling"],
    explanation:"The network health score aggregates on-chain profitability, liquidity depth, and risk metrics. A score of 72 means the network is functioning normally with some areas of elevated risk.",
    expertInsight:'"72/100 is healthy by historical standards. The 2022 bear market had health scores in the 30-45 range. Current readings suggest a mid-cycle consolidation, not a structural breakdown."',
    expertName:"Kai Huang", expertRole:"Network Health Lead", expertInitials:"KH",
    communityTop: {handle:"@net_monitor",text:"72/100 health score with BTC at $65K. This level has historically been a base for the next leg up.",likes:284,replies:42},
    discussion:[
      {handle:"@net_monitor",time:"1h ago",text:"72/100 health score with BTC at $65K. This level has historically been a base for the next leg up.",up:true},
      {handle:"@risk_desk",time:"3h ago",text:"Risk index at 59 is elevated. Not red-zone, but worth monitoring for cascading liquidations.",up:false},
    ],
  },
  risk: {
    title:"Risk Index Analysis",
    systemInsight:"30-day risk index peaked at 63 on Mar 30 before declining to 59 on Apr 2. Rising risk driven by elevated futures funding rates and increasing open interest relative to spot market cap.",
    keySignals: ["Risk peaked at 63 on Mar 30 — now declining to 59 naturally", "Futures funding rates elevated — leverage is high but not extreme", "Open interest growing relative to spot cap — watch for cascade risk"],
    explanation:"The risk index (0-100) measures how dangerous the market is for leveraged positions. Below 40 = low risk. 40-60 = moderate. Above 60 = elevated. Above 80 = extreme danger.",
    expertInsight:'"Risk at 59 means we\'re in the upper half of the moderate zone. The decline from 63 to 59 is encouraging — deleveraging is happening naturally without a major liquidation cascade."',
    expertName:"Raj Patel", expertRole:"Risk Management", expertInitials:"RP",
    communityTop: {handle:"@risk_on",text:"Risk declining from 63 to 59 while price holds. That's the sweet spot for a safe long.",likes:196,replies:28},
    discussion:[
      {handle:"@risk_on",time:"2h ago",text:"Risk declining from 63 to 59 while price holds. That's the sweet spot for a safe long.",up:true},
      {handle:"@careful_now",time:"5h ago",text:"One more 5% BTC drop would push risk back above 65. The liquidation pools are still heavy above.",up:false},
    ],
  },
  profit: {
    title:"Profitability Analysis",
    systemInsight:"78% of BTC supply and 42% of ETH supply are currently in profit. BTC profitability peaked at 81% on Mar 15. Declining from that level tracks with recent price softness.",
    keySignals: ["BTC 78% in profit — Goldilocks zone between capitulation (55%) and euphoria (85%)", "ETH only 42% in profit — sharper decline from ATH creates more underwater holders", "BTC profitability declining from 81% peak — consistent with healthy correction"],
    explanation:"Supply in profit tells you what fraction of all coins were last bought at a lower price than today. At 78%, most BTC holders are sitting on unrealized gains and unlikely to panic-sell.",
    expertInsight:'"BTC at 78% in-profit is the Goldilocks zone. Below 55% = capitulation risk. Above 85% = distribution risk. 78% supports the thesis that this correction is healthy and buyable."',
    expertName:"Vera Lim", expertRole:"On-Chain Strategist", expertInitials:"VL",
    communityTop: {handle:"@on_chain_v",text:"78% profitable is not the sentiment of a market about to crash. Most holders are green and happy.",likes:172,replies:22},
    discussion:[
      {handle:"@on_chain_v",time:"1h ago",text:"78% profitable is not the sentiment of a market about to crash. Most holders are green and happy.",up:true},
      {handle:"@btc_bear",time:"4h ago",text:"The 22% underwater is a lot of potential sell pressure if we drop another 10%.",up:false},
    ],
  },
  liquidity: {
    title:"Liquidity Depth Analysis",
    systemInsight:"BTC bid-side liquidity at $142.1M (2% depth). ETH at $82.3M. Total top-6 asset liquidity: $311.6M bid / $297.9M ask — near-balanced book suggests stable price discovery.",
    keySignals: ["Bid/ask book near-balanced: $311M bid vs $298M ask across top 6", "BTC bid depth $142M — strong buying support at current levels", "No overwhelming sell walls — constructive for a recovery attempt"],
    explanation:"Liquidity depth measures how much money is queued up to buy or sell an asset within 2% of the current price. Higher bid-side means more buying support; higher ask-side means more potential overhead.",
    expertInsight:'"A balanced bid/ask book ($311M vs $298M across top assets) is bullish. It means there\'s no overwhelming seller ready to crush prices. The order book looks constructive for a recovery attempt."',
    expertName:"Alicia Torres", expertRole:"Market Microstructure", expertInitials:"AT",
    communityTop: {handle:"@liq_tracker",text:"BTC bid depth at $142M is strong for this price level. Buyers are ready to catch any drop.",likes:211,replies:38},
    discussion:[
      {handle:"@liq_tracker",time:"30m ago",text:"BTC bid depth at $142M is strong for this price level. Buyers are ready to catch any drop.",up:true},
      {handle:"@mm_trader",time:"2h ago",text:"Ask walls forming just above the current price. We need to push through those for any sustained rally.",up:false},
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

function InsightBtn({ onClick }:{ onClick:()=>void }) {
  return (
    <button onClick={onClick}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all duration-200 relative flex-shrink-0 ml-2"
      style={{ background:"rgba(34,116,165,0.12)", border:"1px solid rgba(34,116,165,0.24)", color:P.light, fontSize:"11px", fontWeight:500 }}
      onMouseEnter={(e)=>{ const el=e.currentTarget as HTMLElement; el.style.background="rgba(34,116,165,0.22)"; el.style.boxShadow="0 0 16px rgba(34,116,165,0.30)"; }}
      onMouseLeave={(e)=>{ const el=e.currentTarget as HTMLElement; el.style.background="rgba(34,116,165,0.12)"; el.style.boxShadow="none"; }}>
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
      onMouseEnter={(e)=>{ const el=e.currentTarget as HTMLElement; el.style.border=`1px solid ${P.borderH}`; el.style.boxShadow="0 12px 40px rgba(0,0,0,0.55), 0 0 28px rgba(34,116,165,0.10)"; }}
      onMouseLeave={(e)=>{ const el=e.currentTarget as HTMLElement; el.style.border=`1px solid ${P.border}`; el.style.boxShadow="0 8px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(99,188,233,0.04)"; }}
      {...rest}>{children}</div>
  );
}

function MetricCard({ label, value, sub, change, icon: Icon, highlight=false }: { label:string; value:string; sub:string; change:number; icon:any; highlight?:boolean }) {
  const pos = change >= 0;
  return (
    <Card className="p-5 hover:-translate-y-0.5">
      <div className="flex items-start justify-between mb-3">
        <div className="p-2 rounded-xl" style={{ background:"rgba(34,116,165,0.10)", border:"1px solid rgba(34,116,165,0.18)" }}>
          <Icon style={{ width:16, height:16, color:P.primary }} />
        </div>
        <span className="flex items-center gap-1 px-2 py-0.5 rounded-lg"
          style={{ fontSize:"12px", fontWeight:600, color:pos?P.light:P.mid, background:pos?"rgba(99,188,233,0.10)":"rgba(241,242,242,0.06)", border:pos?"1px solid rgba(99,188,233,0.18)":"1px solid rgba(241,242,242,0.08)" }}>
          {pos?<ArrowUpRight style={{ width:11, height:11 }}/>:<ArrowDownRight style={{ width:11, height:11 }}/>}
          {pos?"+":""}{change.toFixed(1)}%
        </span>
      </div>
      <p style={{ fontSize:"26px", fontWeight:700, color:highlight?P.light:P.white, fontFamily:"monospace" }}>{value}</p>
      <p style={{ fontSize:"13px", fontWeight:500, color:P.white, marginTop:2 }}>{label}</p>
      <p style={{ fontSize:"11px", color:P.dim, marginTop:2 }}>{sub}</p>
    </Card>
  );
}

// ── Plain-language explanation box ───────────────────────────────────────────
function ExplainBox({ icon: Icon, label, text, accent="rgba(34,116,165,0.14)" }: { icon:any; label:string; text:string; accent?:string }) {
  return (
    <div className="flex gap-3 p-4 rounded-xl"
      style={{ background:accent, border:"1px solid rgba(34,116,165,0.18)" }}>
      <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{ background:"rgba(34,116,165,0.14)", border:"1px solid rgba(34,116,165,0.24)" }}>
        <Icon style={{ width:14, height:14, color:P.primary }} />
      </div>
      <div>
        <p style={{ fontSize:"11px", fontWeight:600, color:P.primary, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:4 }}>{label}</p>
        <p style={{ fontSize:"12px", color:"rgba(241,242,242,0.72)", lineHeight:1.7 }}>{text}</p>
      </div>
    </div>
  );
}

// ── Insight Panel ─────────────────────────────────────────────────────────────
function InsightPanel({ id, onClose }:{ id:string|null; onClose:()=>void }) {
  const data = id ? INSIGHTS[id] : null;
  return <SharedInsightPanel id={id} data={data ?? null} onClose={onClose} />;
}

// ── Insight Strip ─────────────────────────────────────────────────────────────
function InsightStrip({ onInsightClick }:{ onInsightClick:()=>void }) {
  const { asset, timeRange } = useDashboard();
  return (
    <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }}
      className="relative overflow-hidden rounded-[20px]"
      style={{ background:"rgba(16,68,151,0.08)", backdropFilter:"blur(26px)", WebkitBackdropFilter:"blur(26px)", border:`1px solid ${P.border}`, boxShadow:"0 8px 32px rgba(0,0,0,0.40)" }}>
      <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-[20px]" style={{ background:`linear-gradient(180deg, ${P.deep}, ${P.light})` }} />
      <div className="pl-7 pr-5 py-4 flex flex-col sm:flex-row sm:items-center gap-4 relative z-10">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <Zap style={{ width:12, height:12, color:P.light }} />
            <span style={{ fontSize:"10px", fontWeight:600, color:P.primary, textTransform:"uppercase", letterSpacing:"0.08em" }}>AI Signal · {asset!=="ALL"?`${asset} · `:""}Network Health · {timeRange} · Apr 2, 2026</span>
          </div>
          <p style={{ fontFamily:"'Newsreader',Georgia,serif", fontSize:"20px", fontWeight:700, lineHeight:1.3, color:P.white }}>
            Network health at 72/100 — moderate risk, strong profitability base
          </p>
          <p style={{ fontSize:"13px", color:P.mid, marginTop:6, lineHeight:1.6 }}>
            Risk index declining from 63 to 59. BTC supply in profit stable at 78%.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 sm:flex-nowrap sm:flex-shrink-0 items-center">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ fontSize:"12px", fontWeight:500, background:"rgba(34,116,165,0.12)", border:"1px solid rgba(34,116,165,0.24)", color:P.mid }}>
            <Shield style={{ width:12, height:12, color:P.primary }} /> Health 72/100
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ fontSize:"12px", fontWeight:500, background:"rgba(16,68,151,0.16)", border:"1px solid rgba(16,68,151,0.32)", color:P.mid }}>
            <AlertTriangle style={{ width:12, height:12, color:"rgba(241,242,242,0.55)" }} /> Risk 59/100
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

// ── Tab: Risk ─────────────────────────────────────────────────────────────────
function RiskTab({ onInsight }:{ onInsight:(id:string)=>void }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Risk Index" value="59/100" sub="Elevated — moderate zone" change={-6.3} icon={AlertTriangle} />
        <MetricCard label="Liquidation Risk" value="Medium" sub="Current market exposure" change={-11.2} icon={Shield} />
        <MetricCard label="Open Interest" value="$84.2B" sub="Total futures OI" change={+4.1} icon={Activity} />
        <MetricCard label="Leverage Ratio" value="2.14×" sub="Futures/Spot volume ratio" change={+8.6} icon={TrendingUp} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.45, delay:0.22 }}>
          <Card className="p-5 hover:-translate-y-0.5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 style={{ fontSize:"15px", fontWeight:600, color:P.white }}>Risk Index Trend</h3>
                <p style={{ fontSize:"11px", color:P.dim, marginTop:2 }}>30-day risk score (0 = no risk, 100 = extreme)</p>
              </div>
              <InsightBtn onClick={()=>onInsight("risk")} />
            </div>
            {/* Risk scale legend */}
            <div className="flex items-center gap-2 mb-4 overflow-x-auto">
              {[["0-40","rgba(99,188,233,0.55)","Low"],["40-60","rgba(34,116,165,0.55)","Moderate"],["60-80","rgba(16,68,151,0.75)","Elevated"],[">80","rgba(99,188,233,0.25)","Extreme"]].map(([r,c,l]) => (
                <div key={r} className="flex items-center gap-1 flex-shrink-0">
                  <span className="w-2.5 h-2 rounded-sm" style={{ backgroundColor:c }} />
                  <span style={{ fontSize:"10px", color:P.dim }}>{l}</span>
                </div>
              ))}
            </div>
            <div style={{ height:196 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={riskTrend} margin={{ top:4, right:4, left:-22, bottom:0 }}>
                  <defs>
                    <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#104497" stopOpacity={0.55} />
                      <stop offset="100%" stopColor="#104497" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(34,116,165,0.08)" vertical={false} />
                  <XAxis dataKey="date" tick={{ fill:"rgba(241,242,242,0.28)", fontSize:10 }} tickLine={false} axisLine={false} interval={2} dy={6} />
                  <YAxis tick={{ fill:"rgba(241,242,242,0.28)", fontSize:10 }} tickLine={false} axisLine={false} domain={[30,80]} />
                  <RechartsTooltip content={<Tooltip />} />
                  <Area type="monotone" dataKey="risk" name="Risk Index" stroke={P.primary} strokeWidth={2} fill="url(#riskGrad)" style={{ filter:"drop-shadow(0 0 6px rgba(34,116,165,0.35))" }} animationDuration={1200} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.45, delay:0.30 }}>
          <Card className="p-5 hover:-translate-y-0.5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 style={{ fontSize:"15px", fontWeight:600, color:P.white }}>P&L Distribution</h3>
                <p style={{ fontSize:"11px", color:P.dim, marginTop:2 }}>% of wallets in each profit/loss band</p>
              </div>
              <InsightBtn onClick={()=>onInsight("risk")} />
            </div>
            <div style={{ height:228 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={plDistribution} margin={{ top:4, right:4, left:-22, bottom:0 }} barSize={22}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(34,116,165,0.08)" vertical={false} />
                  <XAxis dataKey="range" tick={{ fill:"rgba(241,242,242,0.28)", fontSize:9 }} tickLine={false} axisLine={false} dy={6} />
                  <YAxis tick={{ fill:"rgba(241,242,242,0.28)", fontSize:10 }} tickLine={false} axisLine={false} tickFormatter={(v)=>`${v}%`} />
                  <RechartsTooltip content={<Tooltip />} formatter={(v:number)=>`${v}%`} />
                  <Bar dataKey="count" name="% of wallets" radius={[4,4,0,0]} animationDuration={1200}
                    fill={P.primary} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Plain language explanations */}
      <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.45, delay:0.38 }}>
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 style={{ fontSize:"15px", fontWeight:600, color:P.white }}>What does this mean for you?</h3>
            <InsightBtn onClick={()=>onInsight("risk")} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <ExplainBox icon={Info} label="Risk Index 59/100" text="The market is in a moderate risk zone. This means leveraged positions face elevated liquidation danger if prices drop another 5-8%. Reduce leverage or use stop-losses." />
            <ExplainBox icon={CheckCircle} label="P&L Distribution" text="Most wallets (47%) are in positive territory. The peak at +10-30% suggests most buyers entered during the last dip and are sitting on healthy gains." />
            <ExplainBox icon={AlertTriangle} label="Leverage Ratio 2.14×" text="Futures volume is 2.14× spot — elevated but not extreme. Above 2.5× has historically preceded corrections. Monitor this ratio for warning signs." />
            <ExplainBox icon={Shield} label="What to watch" text="If the risk index rises back above 65 while price falls, that's a cascade warning. Watch for BTC open interest drops which signal forced liquidations." />
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

// ── Tab: Profitability ────────────────────────────────────────────────────────
function ProfitabilityTab({ onInsight }:{ onInsight:(id:string)=>void }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="BTC In Profit" value="78%" sub="Of BTC supply above cost" change={-2.5} icon={TrendingUp} highlight />
        <MetricCard label="ETH In Profit" value="42%" sub="Of ETH supply above cost" change={+3.1} icon={TrendingUp} />
        <MetricCard label="Miner Revenue" value="$42.8M" sub="Daily BTC miner income" change={-8.4} icon={Activity} />
        <MetricCard label="Staking Yield" value="4.2%" sub="ETH average APY" change={+0.3} icon={CheckCircle} />
      </div>
      <Card className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 style={{ fontSize:"15px", fontWeight:600, color:P.white }}>Supply in Profit Trend</h3>
            <p style={{ fontSize:"11px", color:P.dim, marginTop:2 }}>% of BTC and ETH supply currently in profit</p>
          </div>
          <InsightBtn onClick={()=>onInsight("profit")} />
        </div>
        <div style={{ height:240 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={profitTrend} margin={{ top:4, right:4, left:-22, bottom:0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(34,116,165,0.08)" vertical={false} />
              <XAxis dataKey="date" tick={{ fill:"rgba(241,242,242,0.28)", fontSize:10 }} tickLine={false} axisLine={false} dy={6} />
              <YAxis tick={{ fill:"rgba(241,242,242,0.28)", fontSize:10 }} tickLine={false} axisLine={false} tickFormatter={(v)=>`${v}%`} />
              <RechartsTooltip content={<Tooltip />} formatter={(v:number)=>`${v}%`} />
              <Line type="monotone" dataKey="btc" name="BTC" stroke={P.light} strokeWidth={2} dot={{ fill:P.light, r:3 }} animationDuration={1200} />
              <Line type="monotone" dataKey="eth" name="ETH" stroke={P.primary} strokeWidth={1.5} dot={{ fill:P.primary, r:3 }} animationDuration={1400} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
          <ExplainBox icon={Info} label="BTC 78% in profit" text="When 78% of coins last moved at a lower price than today, most holders are profitable. This reduces panic-sell pressure significantly — only the 22% underwater could be forced sellers." />
          <ExplainBox icon={Shield} label="ETH 42% in profit" text="Lower ETH profitability reflects its sharper price decline from ATH. At 42%, nearly half of ETH holders are underwater — watch this number if it drops below 35%." />
        </div>
      </Card>
    </div>
  );
}

// ── Tab: Liquidity ────────────────────────────────────────────────────────────
function LiquidityTab({ onInsight }:{ onInsight:(id:string)=>void }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="BTC Bid Depth" value="$142M" sub="Within 2% of market price" change={+4.2} icon={Activity} highlight />
        <MetricCard label="ETH Bid Depth" value="$82.3M" sub="Within 2% of market price" change={-2.1} icon={Activity} />
        <MetricCard label="Bid/Ask Spread" value="0.018%" sub="BTC average spread" change={-12.4} icon={TrendingDown} />
        <MetricCard label="Slippage (1M)" value="$0.31" sub="1M USD order slippage" change={-8.8} icon={Shield} />
      </div>
      <Card className="p-5">
        <div className="flex items-start justify-between mb-5">
          <div>
            <h3 style={{ fontSize:"15px", fontWeight:600, color:P.white }}>Order Book Depth</h3>
            <p style={{ fontSize:"11px", color:P.dim, marginTop:2 }}>Bid vs Ask liquidity within 2% for top assets ($M)</p>
          </div>
          <InsightBtn onClick={()=>onInsight("liquidity")} />
        </div>
        <div style={{ height:240 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={liquidityDepth} margin={{ top:4, right:4, left:-22, bottom:0 }} barGap={4} barSize={22}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(34,116,165,0.08)" vertical={false} />
              <XAxis dataKey="asset" tick={{ fill:"rgba(241,242,242,0.28)", fontSize:10 }} tickLine={false} axisLine={false} dy={6} />
              <YAxis tick={{ fill:"rgba(241,242,242,0.28)", fontSize:10 }} tickLine={false} axisLine={false} tickFormatter={(v)=>`$${v}M`} />
              <RechartsTooltip content={<Tooltip />} formatter={(v:number)=>`$${v}M`} />
              <Bar dataKey="bid" name="Bid Side" fill={P.light} radius={[4,4,0,0]} animationDuration={1000} />
              <Bar dataKey="ask" name="Ask Side" fill="rgba(34,116,165,0.50)" radius={[4,4,0,0]} animationDuration={1200} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
          <ExplainBox icon={Info} label="What is order book depth?" text="Order book depth is the amount of buy and sell orders queued up within 2% of the current price. More depth = more liquid market = easier to buy and sell without moving the price." />
          <ExplainBox icon={CheckCircle} label="Current reading" text="BTC's $142M bid vs $138M ask is balanced — healthy for price stability. When bid depth drops below ask depth significantly, downward pressure builds." />
        </div>
      </Card>
    </div>
  );
}

// ── Tab: Validators ───────────────────────────────────────────────────────────
function ValidatorsTab({ onInsight }:{ onInsight:(id:string)=>void }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Active Validators" value="581K" sub="ETH staking validators" change={+7.2} icon={CheckCircle} highlight />
        <MetricCard label="Staked ETH" value="34.2M" sub="~28.4% of total supply" change={+2.1} icon={Activity} />
        <MetricCard label="Avg Reward Rate" value="4.2%" sub="Annual staking yield" change={+0.3} icon={TrendingUp} />
        <MetricCard label="Slashing Events" value="3" sub="Last 30 days — very low" change={-40.0} icon={Shield} />
      </div>
      <Card className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 style={{ fontSize:"15px", fontWeight:600, color:P.white }}>Validator Growth & Rewards</h3>
            <p style={{ fontSize:"11px", color:P.dim, marginTop:2 }}>Active validator count and average reward rate</p>
          </div>
          <InsightBtn onClick={()=>onInsight("profit")} />
        </div>
        <div style={{ height:240 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={validatorData} margin={{ top:4, right:4, left:-22, bottom:0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(34,116,165,0.08)" vertical={false} />
              <XAxis dataKey="date" tick={{ fill:"rgba(241,242,242,0.28)", fontSize:10 }} tickLine={false} axisLine={false} dy={6} />
              <YAxis yAxisId="left" tick={{ fill:"rgba(241,242,242,0.28)", fontSize:10 }} tickLine={false} axisLine={false} tickFormatter={(v)=>`${v}K`} />
              <YAxis yAxisId="right" orientation="right" tick={{ fill:"rgba(241,242,242,0.28)", fontSize:10 }} tickLine={false} axisLine={false} tickFormatter={(v)=>`${v}%`} />
              <RechartsTooltip content={<Tooltip />} />
              <Line yAxisId="left" type="monotone" dataKey="active" name="Active Validators" stroke={P.light} strokeWidth={2} dot={{ fill:P.light, r:3 }} animationDuration={1200} />
              <Line yAxisId="right" type="monotone" dataKey="rewards" name="Reward Rate" stroke="rgba(34,116,165,0.70)" strokeWidth={1.5} dot={false} animationDuration={1400} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export function NetworkHealth() {
  const [activeInsight, setActiveInsight] = useState<string | null>(null);
  const { activeSubTab } = useDashboard();
  const open  = (id: string) => setActiveInsight(id);
  const close = () => setActiveInsight(null);

  const renderTab = () => {
    switch (activeSubTab) {
      case "Profitability": return <ProfitabilityTab onInsight={open} />;
      case "Liquidity":     return <LiquidityTab     onInsight={open} />;
      case "Validators":    return <ValidatorsTab     onInsight={open} />;
      default:              return <RiskTab           onInsight={open} />;
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