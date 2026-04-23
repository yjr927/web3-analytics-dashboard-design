import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles, X, Activity, Zap, MessageSquare,
  TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Info,
  ChevronUp, ChevronDown,
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer, AreaChart, Area,
} from "recharts";
import { useDashboard } from "../contexts/DashboardContext";
import { InsightPanel as SharedInsightPanel, type InsightData as SharedInsightData } from "../components/InsightPanel";

// ─────────────────────────────────────────────────────────────────────────────
// STRICT PALETTE — NO OTHER COLORS ALLOWED
// #2274a5  #63bce9  #104497  #000000  #0f0a0a  #f1f2f2
// ─────────────────────────────────────────────────────────────────────────────
const P = {
  primary: "#2274a5",
  light:   "#63bce9",
  deep:    "#104497",
  black:   "#000000",
  bg:      "#0f0a0a",
  white:   "#f1f2f2",
  // Opacity derivatives (same base colors)
  cardBg:     "rgba(16, 68, 151, 0.07)",
  border:     "rgba(34, 116, 165, 0.16)",
  borderHov:  "rgba(99, 188, 233, 0.28)",
  textDim:    "rgba(241, 242, 242, 0.38)",
  textMid:    "rgba(241, 242, 242, 0.60)",
};

// ─── DATA ─────────────────────────────────────────────────────────────────────

const marketCapData = [
  { date:"Mar 3",  value:2150 }, { date:"Mar 5",  value:2185 },
  { date:"Mar 7",  value:2242 }, { date:"Mar 9",  value:2218 },
  { date:"Mar 11", value:2309 }, { date:"Mar 13", value:2351 },
  { date:"Mar 15", value:2392 }, { date:"Mar 17", value:2363 },
  { date:"Mar 18", value:2317 }, { date:"Mar 19", value:2289 },
  { date:"Mar 20", value:2254 }, { date:"Mar 21", value:2290 },
  { date:"Mar 22", value:2348 }, { date:"Mar 23", value:2412 },
  { date:"Mar 24", value:2388 }, { date:"Mar 25", value:2353 },
  { date:"Mar 26", value:2321 }, { date:"Mar 27", value:2365 },
  { date:"Mar 28", value:2404 }, { date:"Mar 29", value:2382 },
  { date:"Mar 30", value:2344 }, { date:"Apr 1",  value:2391 },
  { date:"Apr 2",  value:2418 },
];

const futuresSpotData = [
  { date:"Mar 27", futures:48.2, spot:24.1 },
  { date:"Mar 28", futures:52.4, spot:26.8 },
  { date:"Mar 29", futures:45.1, spot:21.3 },
  { date:"Mar 30", futures:61.3, spot:28.9 },
  { date:"Mar 31", futures:55.7, spot:25.4 },
  { date:"Apr 1",  futures:67.2, spot:31.6 },
  { date:"Apr 2",  futures:71.8, spot:33.2 },
];

const sectorData = [
  { d:1,  BTC:0,   ETH:0,   L2:0,   DeFi:0,   AI:0,   Meme:0   },
  { d:4,  BTC:1.8, ETH:2.4, L2:3.1, DeFi:-1.3,AI:5.2, Meme:8.4 },
  { d:7,  BTC:3.2, ETH:4.1, L2:5.8, DeFi:-0.7,AI:9.8, Meme:15.2},
  { d:10, BTC:2.1, ETH:3.0, L2:4.2, DeFi:-2.1,AI:7.3, Meme:11.0},
  { d:13, BTC:4.5, ETH:5.8, L2:7.4, DeFi:0.8, AI:12.1,Meme:18.6},
  { d:16, BTC:3.9, ETH:4.9, L2:6.1, DeFi:-0.3,AI:10.4,Meme:14.2},
  { d:19, BTC:2.3, ETH:2.8, L2:3.9, DeFi:-1.8,AI:8.7, Meme:9.8 },
  { d:22, BTC:5.1, ETH:6.7, L2:9.2, DeFi:1.5, AI:14.8,Meme:21.3},
  { d:25, BTC:4.2, ETH:5.5, L2:7.8, DeFi:0.2, AI:12.9,Meme:17.8},
  { d:28, BTC:3.1, ETH:3.9, L2:5.3, DeFi:-0.9,AI:10.1,Meme:13.4},
  { d:30, BTC:3.8, ETH:4.7, L2:6.4, DeFi:0.4, AI:11.5,Meme:15.9},
];

// Sector lines — all derived from the 6 palette colors only
const SECTOR_COLORS: Record<string, string> = {
  BTC:  "#63bce9",
  ETH:  "#2274a5",
  L2:   "#104497",
  DeFi: "rgba(99,188,233,0.55)",
  AI:   "#f1f2f2",
  Meme: "rgba(34,116,165,0.75)",
};

const heatmapAssets = [
  { symbol:"BTC",  name:"Bitcoin",   price:"$65,939", change:-3.8, volume:"$6.42B", col:"1",    row:"1/span 3" },
  { symbol:"ETH",  name:"Ethereum",  price:"$2,032",  change:-4.7, volume:"$4.26B", col:"2",    row:"1/span 3" },
  { symbol:"SOL",  name:"Solana",    price:"$77.00",  change:-7.0, volume:"$1.33B", col:"3",    row:"1"        },
  { symbol:"BNB",  name:"BNB",       price:"$573.95", change:-6.8, volume:"$1.54B", col:"3",    row:"2"        },
  { symbol:"XRP",  name:"XRP",       price:"$1.29",   change:-4.9, volume:"$611M",  col:"3",    row:"3"        },
  { symbol:"USDC", name:"USDC",      price:"$1.00",   change:0.0,  volume:"$1.5B",  col:"4",    row:"1"        },
  { symbol:"DOGE", name:"Dogecoin",  price:"$0.089",  change:-3.5, volume:"$231M",  col:"4",    row:"2"        },
  { symbol:"TRX",  name:"TRON",      price:"$0.316",  change:0.34, volume:"$84M",   col:"4",    row:"3"        },
  { symbol:"ADA",  name:"Cardano",   price:"$0.45",   change:-5.2, volume:"$180M",  col:"5",    row:"1"        },
  { symbol:"AVAX", name:"Avalanche", price:"$35.20",  change:-8.1, volume:"$423M",  col:"5",    row:"2"        },
  { symbol:"LINK", name:"Chainlink", price:"$14.20",  change:-4.3, volume:"$280M",  col:"5",    row:"3"        },
];

const supplyProfitAssets = [
  { asset:"BTC",  pct:78 }, { asset:"ETH",  pct:42 },
  { asset:"XRP",  pct:55 }, { asset:"BNB",  pct:63 },
  { asset:"SOL",  pct:48 }, { asset:"TRX",  pct:71 },
  { asset:"DOGE", pct:35 }, { asset:"WBT",  pct:82 },
  { asset:"LINK", pct:44 }, { asset:"SHIB", pct:28 },
  { asset:"TON",  pct:59 }, { asset:"CRO",  pct:23 },
  { asset:"LEO",  pct:88 }, { asset:"ADA",  pct:37 },
  { asset:"USYC", pct:95 },
];

const assetTableData = [
  { rank:1,  sym:"BTC",  name:"Bitcoin",   price:"$65,939", c24:-3.8, c7d:-4.9, mcap:"$1,321.5B", vol:"$6.4B",   volC:-12.2, oi:"$36.6B", fr:-0.0023, liq:"$41.3M" },
  { rank:2,  sym:"ETH",  name:"Ethereum",  price:"$2,021",  c24:-5.1, c7d:-2.5, mcap:"$256.5B",  vol:"$4.3B",   volC:-6.5,  oi:"$22.3B", fr:-0.0055, liq:"$36.5M" },
  { rank:3,  sym:"USDT", name:"Tether",    price:"$0.9997", c24:0.0,  c7d:0.0,  mcap:"$184.1B",  vol:"$267.5M", volC:-22.0, oi:"—",      fr:-0.0039, liq:"$327"   },
  { rank:4,  sym:"XRP",  name:"XRP",       price:"$1.28",   c24:-5.1, c7d:-6.4, mcap:"$79B",     vol:"$611.3M", volC:6.1,   oi:"$2B",    fr:-0.008,  liq:"$3.8M"  },
  { rank:5,  sym:"BNB",  name:"BNB",       price:"$571.86", c24:-7.0, c7d:-9.1, mcap:"$78.1B",   vol:"$325M",   volC:24.5,  oi:"$721.4M",fr:0.006,   liq:"$2.5M"  },
  { rank:6,  sym:"SOL",  name:"Solana",    price:"$77.00",  c24:-7.0, c7d:-11.7,mcap:"$44.4B",   vol:"$1.3B",   volC:47.2,  oi:"$4.1B",  fr:-0.0083, liq:"$13.2M" },
  { rank:7,  sym:"USDC", name:"USD Coin",  price:"$0.9999", c24:0.0,  c7d:0.0,  mcap:"$77.3B",   vol:"$1.5B",   volC:-26.7, oi:"$16.6M", fr:-0.0029, liq:"$211"   },
  { rank:8,  sym:"TRX",  name:"TRON",      price:"$0.316",  c24:0.3,  c7d:1.7,  mcap:"$30B",     vol:"$84.1M",  volC:-25.4, oi:"$225.6M",fr:0.0077,  liq:"—"      },
  { rank:9,  sym:"DOGE", name:"Dogecoin",  price:"$0.089",  c24:-3.8, c7d:-2.3, mcap:"$13.7B",   vol:"$231.8M", volC:-0.4,  oi:"$840.5M",fr:-0.0014, liq:"—"      },
  { rank:10, sym:"AVAX", name:"Avalanche", price:"$35.20",  c24:-8.1, c7d:-10.2,mcap:"$14.4B",   vol:"$423M",   volC:15.3,  oi:"$618M",  fr:-0.0031, liq:"$8.1M"  },
];

// ─── INSIGHT PANEL DATA ───────────────────────────────────────────────────────

const INSIGHTS: Record<string, SharedInsightData> = {
  overview: {
    title: "Market Overview",
    systemInsight: "Crypto market cap sits at $2.41T after a 12% correction over 30 days. Exchange inflows are elevated while new wallet creation has decelerated — classic distribution signals.",
    keySignals: [
      "Market cap down 12% from 30-day high, but holding higher-low structure",
      "Exchange inflows at 3-month highs — potential distribution in progress",
      "New wallet creation slowed 18% — retail interest fading short-term",
    ],
    explanation: "The market is in consolidation. When exchange inflows rise while market cap drops, existing holders are moving coins to sell, not new buyers entering.",
    expertInsight: '"The current pattern mirrors Q3 2023 behavior. Capital rotation from large caps into AI/Meme sectors is driving divergence. Expect BTC dominance to rise to 56–58% before any meaningful altcoin recovery."',
    expertName:"Sarah Chen", expertRole:"Head of Research", expertInitials:"SC",
    communityTop: { handle:"@macro_mike", text:"Exchange inflows at 3-month highs. Classic distribution setup before next leg down.", likes:284, replies:42 },
    discussion:[
      { handle:"@macro_mike", time:"1h ago", text:"Exchange inflows at 3-month highs. Classic distribution setup before next leg down.", up:false },
      { handle:"@defi_whale", time:"3h ago", text:"AI sector holding strong even while BTC corrects. Rotation not panic.", up:true  },
    ],
  },
  marketcap: {
    title: "Market Cap Analysis",
    systemInsight: "Total market cap peaked at $2.41T on Apr 2. The 30-day chart shows healthy higher-high, higher-low structure — constructive market behavior.",
    keySignals: [
      "$2.4T resistance from 2021 cycle being tested — weekly close matters",
      "Higher-low pattern intact at $2.2T support level",
      "BTC dominance rising suggests capital flowing to safety, not alts",
    ],
    explanation: "Rising market cap with dips that don't break prior lows are called higher-low patterns. These indicate ongoing buyer demand despite temporary profit-taking.",
    expertInsight: '"The $2.4T level is strong resistance from 2021. A clean weekly close above confirms a new bull phase. Watch BTC dominance — if it rises here, alt-season is delayed further."',
    expertName:"Jason Wu", expertRole:"Market Strategist", expertInitials:"JW",
    communityTop: { handle:"@chart_wizard", text:"Clean higher-low structure. $2.2T is key support for any stop-loss placement.", likes:196, replies:31 },
    discussion:[
      { handle:"@chart_wizard", time:"2h ago", text:"Clean higher-low structure. $2.2T is key support for any stop-loss placement.", up:true  },
      { handle:"@btc_realist", time:"5h ago", text:"Market cap is inflated by stablecoins. Real risk capital is down.", up:false },
    ],
  },
  futvol: {
    title: "Futures vs Spot Volume",
    systemInsight: "Futures volume running 2.1× spot — elevated but not extreme. Ratio spiked to 2.3× on Apr 2, hinting at increased speculative activity near resistance zones.",
    keySignals: [
      "Futures/Spot ratio at 2.14× — approaching the 2.5× danger threshold",
      "ETH funding rates turning negative — short pressure building",
      "Spot absorption on dips remains strong across major exchanges",
    ],
    explanation: "When futures volume is much higher than spot, traders are using leverage. High leverage causes sharp moves in both directions when positions get liquidated en masse.",
    expertInsight: '"Futures/Spot ratio above 2.5× historically precedes 8–15% corrections within 7–10 days. Current level is a yellow flag, not red. Positioning tilted short but not extreme enough for a squeeze yet."',
    expertName:"Alex Rivera", expertRole:"Derivatives Analyst", expertInitials:"AR",
    communityTop: { handle:"@perp_king", text:"Funding rates turning on ETH. Short pressure building. Watch for a squeeze.", likes:147, replies:28 },
    discussion:[
      { handle:"@perp_king", time:"30m ago", text:"Funding rates turning on ETH. Short pressure building. Watch for a squeeze.", up:false },
      { handle:"@spot_only", time:"4h ago",  text:"Spot buyers holding strong. Every dip gets absorbed quickly on main exchanges.", up:true  },
    ],
  },
  heatmap: {
    title: "Market Heatmap Insights",
    systemInsight: "Broad weakness across 9/11 tracked assets. AVAX (-8.1%) and SOL (-7.0%) lead losses. TRX (+0.34%) is the lone outlier showing resilience.",
    keySignals: [
      "9 out of 11 assets in the red — high correlation sell-off event",
      "AVAX leads losses at -8.1% but TVL unchanged — paper-hand selling",
      "TRX is the sole positive asset, suggesting defensive rotation",
    ],
    explanation: "The blocks show 24-hour price change by asset. Larger blocks = bigger market caps. Near-uniform deep blue often means a macro event or Bitcoin-led sell-off.",
    expertInsight: '"Broad deep-blue heatmaps often create the best spot-buying opportunities. AVAX at -8% while its L1 fundamentals remain strong is a potential value entry."',
    expertName:"Maya Patel", expertRole:"On-Chain Analyst", expertInitials:"MP",
    communityTop: { handle:"@altcoin_scout", text:"AVAX down 8% but TVL barely moved. Paper-hand selling, not fundamentals.", likes:211, replies:38 },
    discussion:[
      { handle:"@altcoin_scout", time:"1h ago", text:"AVAX down 8% but TVL barely moved. Paper-hand selling, not fundamentals.", up:true  },
      { handle:"@crypto_bear",  time:"2h ago", text:"When correlation goes to 1, hodlers get caught. Uniform weakness = uniform panic.", up:false },
    ],
  },
  sector: {
    title: "Sector Performance",
    systemInsight: "AI sector leads 30-day performance at +11.5%, followed by Meme (+15.9% with high volatility). L2s track ETH closely at +6.4%. DeFi lags at +0.4%.",
    keySignals: [
      "AI sector +11.5% — strongest performer with structural tailwinds",
      "DeFi at +0.4% despite ATH revenues — maximum value divergence",
      "Meme sector +15.9% but with 3× the volatility of AI tokens",
    ],
    explanation: "Different crypto sectors perform differently based on narrative cycles and capital flows. AI tokens are in high momentum while DeFi hasn't benefited from the current mood.",
    expertInsight: '"Sector rotation from DeFi into AI narratives is structural, not cyclical. Retail chases AI tokens while sophisticated capital quietly accumulates protocol-level DeFi value."',
    expertName:"Chris Wong", expertRole:"Sector Analyst", expertInitials:"CW",
    communityTop: { handle:"@ai_maxi", text:"AI sector momentum shows no signs of stopping. Narrative + fundamentals = rare combo.", likes:318, replies:54 },
    discussion:[
      { handle:"@ai_maxi",  time:"45m ago", text:"AI sector momentum shows no signs of stopping. Narrative + fundamentals = rare combo.", up:true },
      { handle:"@defi_dev", time:"3h ago",  text:"DeFi protocol revenues at ATH but prices lag. Best risk/reward in crypto right now.", up:true },
    ],
  },
  supply: {
    title: "Supply in Profit",
    systemInsight: "BTC leads with 78% of supply in profit. LEO (88%) and USYC (95%) are outliers. Meme tokens SHIB (28%) and CRO (23%) have majority of holders underwater.",
    keySignals: [
      "BTC 78% in profit — Goldilocks zone between capitulation and distribution",
      "SHIB (28%) and CRO (23%) near capitulation — potential forced selling",
      "LEO and USYC above 85% — low sell pressure from these assets",
    ],
    explanation: "Supply in profit measures what % of coins last moved at a lower price than today. High values (>70%) = most holders profitable. Low values (<40%) signal capitulation risk.",
    expertInsight: '"When BTC supply in profit drops below 60%, it historically marks major bottoms. Current 78% is healthy but declining — a move below 65% would warrant defensive positioning."',
    expertName:"Dana Lee", expertRole:"Supply Dynamics Lead", expertInitials:"DL",
    communityTop: { handle:"@on_chain_guru", text:"BTC 78% is solid. Only 22% of supply could trigger loss-based selling. Very constructive.", likes:172, replies:22 },
    discussion:[
      { handle:"@on_chain_guru", time:"2h ago", text:"BTC 78% is solid. Only 22% of supply could trigger loss-based selling. Very constructive.", up:true  },
      { handle:"@shib_holder",  time:"6h ago", text:"Another day with SHIB at 28% profit. Starting to feel like this is permanent.", up:false },
    ],
  },
  table: {
    title: "Asset Table Deep Dive",
    systemInsight: "SOL shows highest positive volume change (+47.2%) despite price down 7% — classic accumulation signal. BNB funding rate is positive (+0.006) while most are negative.",
    keySignals: [
      "SOL vol +47% while price -7% — strongest accumulation signal in table",
      "BNB funding rate positive (+0.006) while most assets are negative",
      "ETH liquidations at $36.5M — cascade risk if $1,900 breaks",
    ],
    explanation: "Volume rising while price falls can mean smart money is buying the dip. Funding rates show who's paying who in the futures market — positive means longs pay shorts.",
    expertInsight: '"The SOL volume/price divergence (vol +47%, price -7%) is one of the strongest accumulation signals in this table. When volume spikes during a drop, it often marks a reversal."',
    expertName:"Tom Nakamura", expertRole:"Quant Researcher", expertInitials:"TN",
    communityTop: { handle:"@sol_bull", text:"SOL volume up 47% while price is -7%? That's the whole thesis. Buying hand over fist.", likes:352, replies:67 },
    discussion:[
      { handle:"@sol_bull",  time:"1h ago", text:"SOL volume up 47% while price is -7%? That's the whole thesis. Buying hand over fist.", up:true  },
      { handle:"@risk_mgr",  time:"3h ago", text:"Liquidations on ETH at $36.5M today. These will cascade if we break $1,900.", up:false },
    ],
  },
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────

// Blue intensity scale: bright (#63bce9) = positive, dark (#104497) = negative
function heatColor(change: number): string {
  if (change >  5) return "rgba(99,188,233,0.72)";
  if (change >  2) return "rgba(99,188,233,0.45)";
  if (change >  0) return "rgba(34,116,165,0.28)";
  if (change === 0) return "rgba(241,242,242,0.07)";
  if (change > -2) return "rgba(16,68,151,0.36)";
  if (change > -5) return "rgba(16,68,151,0.58)";
  return "rgba(16,68,151,0.84)";
}

// Blue gradient for supply bars: dark deep = low, bright light = high
function supplyColor(pct: number): string {
  if (pct >= 80) return "#63bce9";
  if (pct >= 65) return "#2274a5";
  if (pct >= 50) return "rgba(34,116,165,0.80)";
  if (pct >= 35) return "rgba(16,68,151,0.80)";
  return "rgba(16,68,151,0.55)";
}

function pctColor(val: number | null): string {
  if (val === null) return P.textDim;
  if (val > 0) return P.light;
  if (val < 0) return "rgba(241,242,242,0.45)";
  return P.textDim;
}

function pctBg(val: number | null): string {
  if (val === null) return "transparent";
  if (val > 0) return "rgba(99,188,233,0.12)";
  if (val < 0) return "rgba(241,242,242,0.06)";
  return "transparent";
}

function pctText(val: number | null): string {
  if (val === null) return "—";
  return `${val > 0 ? "+" : ""}${val.toFixed(1)}%`;
}

// ─── CUSTOM TOOLTIP ──────────────────────────────────────────────────────────

const BlueTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="px-3 py-2.5 rounded-xl text-xs shadow-2xl"
      style={{
        background: "rgba(15,10,10,0.97)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(34,116,165,0.22)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.60), 0 0 20px rgba(34,116,165,0.10)",
      }}
    >
      <p style={{ color: P.textDim, marginBottom: 5, fontSize: "10px" }}>{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} className="mb-0.5" style={{ color: p.color || P.light }}>
          <span style={{ color: P.textMid, marginRight: 5 }}>{p.name}:</span>
          {p.value}
        </p>
      ))}
    </div>
  );
};

// ─── CHART CARD WRAPPER ───────────────────────────────────────────────────────

function ChartCard({
  title, subtitle, badge, onInsightClick, children, className = "",
}: {
  title: string; subtitle?: string; badge?: string;
  onInsightClick: () => void; children: React.ReactNode; className?: string;
}) {
  return (
    <div
      className={`rounded-[20px] p-5 group relative overflow-hidden transition-all duration-300 hover:-translate-y-0.5 ${className}`}
      style={{
        background: P.cardBg,
        backdropFilter: "blur(26px)",
        WebkitBackdropFilter: "blur(26px)",
        border: `1px solid ${P.border}`,
        boxShadow: "0 8px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(99,188,233,0.04)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.border = `1px solid ${P.borderHov}`;
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 12px 40px rgba(0,0,0,0.55), 0 0 30px rgba(34,116,165,0.12), inset 0 1px 0 rgba(99,188,233,0.06)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.border = `1px solid ${P.border}`;
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(99,188,233,0.04)";
      }}
    >
      {/* Top-right ambient hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[20px]"
        style={{ background: "radial-gradient(ellipse 70% 50% at 90% 0%, rgba(34,116,165,0.08) 0%, transparent 60%)" }}
      />

      {/* Header */}
      <div className="flex items-start justify-between mb-4 relative z-10">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h3 style={{ fontSize: "15px", fontWeight: 600, color: P.white, fontFamily: "'Work Sans', sans-serif" }}>
              {title}
            </h3>
            {badge && (
              <span
                className="px-1.5 py-0.5 rounded"
                style={{
                  fontSize: "10px", fontWeight: 600,
                  background: "rgba(34,116,165,0.16)",
                  color: P.light,
                  border: "1px solid rgba(34,116,165,0.28)",
                }}
              >
                {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <p style={{ fontSize: "11px", color: P.textDim, marginTop: 2 }}>{subtitle}</p>
          )}
        </div>

        {/* ✨ Insight button */}
        <InsightBtn onClick={onInsightClick} />
      </div>

      <div className="relative z-10">{children}</div>
    </div>
  );
}

function InsightBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all duration-200 relative flex-shrink-0 ml-2"
      style={{
        background: "rgba(34,116,165,0.12)",
        border: "1px solid rgba(34,116,165,0.24)",
        color: P.light,
        fontSize: "11px", fontWeight: 500,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = "rgba(34,116,165,0.22)";
        (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 16px rgba(34,116,165,0.30)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = "rgba(34,116,165,0.12)";
        (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
      }}
    >
      <Sparkles style={{ width: 12, height: 12 }} className="animate-pulse" />
      <span>Insight</span>
      {/* Ping dot */}
      <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-55" style={{ background: P.primary }} />
        <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ background: P.primary }} />
      </span>
    </button>
  );
}

// ─── SECTION 1 — INSIGHT STRIP ────────────────────────────────────────────────

function InsightStrip({ onInsightClick }: { onInsightClick: () => void }) {
  const { asset, timeRange } = useDashboard();
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-[20px]"
      style={{
        background: "rgba(16,68,151,0.08)",
        backdropFilter: "blur(26px)",
        WebkitBackdropFilter: "blur(26px)",
        border: `1px solid ${P.border}`,
        boxShadow: "0 8px 32px rgba(0,0,0,0.40), inset 0 1px 0 rgba(99,188,233,0.04)",
      }}
    >
      {/* Left accent stripe */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-[20px]"
        style={{ background: `linear-gradient(180deg, ${P.deep}, ${P.light})` }}
      />
      {/* Ambient left glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 35% 100% at 0% 50%, rgba(34,116,165,0.07) 0%, transparent 55%)" }}
      />

      <div className="pl-7 pr-5 py-4 flex flex-col sm:flex-row sm:items-center gap-4 relative z-10">
        {/* Headline block */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <Zap style={{ width: 12, height: 12, color: P.light }} />
            <span
              style={{
                fontSize: "10px", fontWeight: 600, color: P.primary,
                textTransform: "uppercase", letterSpacing: "0.08em",
                fontFamily: "'Work Sans', sans-serif",
              }}
            >
              AI Signal · {asset !== "ALL" ? `${asset} · ` : ""}{timeRange} · Apr 2, 2026
            </span>
          </div>
          <p
            style={{
              fontFamily: "'Newsreader', Georgia, serif",
              fontSize: "20px", fontWeight: 700, lineHeight: 1.3,
              color: P.white,
            }}
          >
            Market is in a neutral phase with declining capital inflow
          </p>
        </div>

        {/* Signal pills + CTA */}
        <div className="flex flex-wrap gap-2 sm:flex-nowrap sm:flex-shrink-0 items-center">
          {/* Signal 1 */}
          <span
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap"
            style={{
              fontSize: "12px", fontWeight: 500,
              background: "rgba(34,116,165,0.12)",
              border: "1px solid rgba(34,116,165,0.24)",
              color: P.textMid,
            }}
          >
            <TrendingDown style={{ width: 12, height: 12, color: P.primary }} />
            User growth slowing
          </span>
          {/* Signal 2 */}
          <span
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap"
            style={{
              fontSize: "12px", fontWeight: 500,
              background: "rgba(16,68,151,0.16)",
              border: "1px solid rgba(16,68,151,0.32)",
              color: P.textMid,
            }}
          >
            <ArrowUpRight style={{ width: 12, height: 12, color: "rgba(241,242,242,0.55)" }} />
            Exchange inflow rising
          </span>

          {/* CTA */}
          <button
            onClick={onInsightClick}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg transition-all duration-200 whitespace-nowrap"
            style={{
              fontSize: "12px", fontWeight: 600,
              background: "rgba(34,116,165,0.20)",
              border: "1px solid rgba(34,116,165,0.36)",
              color: P.light,
              boxShadow: "0 0 16px rgba(34,116,165,0.20)",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 28px rgba(34,116,165,0.38)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 16px rgba(34,116,165,0.20)"; }}
          >
            <Sparkles style={{ width: 13, height: 13 }} className="animate-pulse" />
            ✨ Insight
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── MARKET CAP CHART ────────────────────────────────────────────────────────

function MarketCapChart({ onInsightClick }: { onInsightClick: () => void }) {
  return (
    <ChartCard title="Total Market Cap" subtitle="30-day trend · All assets" badge="$2.41T" onInsightClick={onInsightClick}>
      <div className="flex items-center gap-3 mb-4">
        <span style={{ fontSize: "26px", fontWeight: 700, color: P.white }}>$2.41T</span>
        <span className="flex items-center gap-1" style={{ fontSize: "13px", fontWeight: 600, color: P.light }}>
          <ChevronUp style={{ width: 14, height: 14 }} />+12.1%
        </span>
        <span style={{ fontSize: "11px", color: P.textDim }}>vs 30D ago</span>
      </div>
      <div style={{ height: 195 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={marketCapData} margin={{ top: 4, right: 4, left: -22, bottom: 0 }}>
            <defs>
              <linearGradient id="mcGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#2274a5" stopOpacity={0.42} />
                <stop offset="100%" stopColor="#2274a5" stopOpacity={0}    />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(34,116,165,0.08)" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fill: "rgba(241,242,242,0.28)", fontSize: 10, fontFamily: "'Work Sans',sans-serif" }}
              tickLine={false} axisLine={false} interval={4} dy={6}
            />
            <YAxis
              tick={{ fill: "rgba(241,242,242,0.28)", fontSize: 10, fontFamily: "'Work Sans',sans-serif" }}
              tickLine={false} axisLine={false}
              tickFormatter={(v) => `$${(v/1000).toFixed(1)}T`}
            />
            <RechartsTooltip content={<BlueTooltip />} formatter={(v: number) => [`$${v}B`, "Market Cap"]} />
            <Area
              type="monotone" dataKey="value" name="Market Cap"
              stroke={P.light} strokeWidth={2}
              fill="url(#mcGrad)"
              style={{ filter: `drop-shadow(0 0 8px rgba(99,188,233,0.45))` }}
              animationDuration={1200}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}

// ─── FUTURES VS SPOT ──────────────────────────────────────────────────────────

function FuturesSpotChart({ onInsightClick }: { onInsightClick: () => void }) {
  return (
    <ChartCard title="Futures vs Spot Volume" subtitle="7-day comparison · $B" onInsightClick={onInsightClick}>
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm" style={{ background: P.primary }} />
          <span style={{ fontSize: "12px", color: P.textMid }}>Futures</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm" style={{ background: "rgba(99,188,233,0.50)" }} />
          <span style={{ fontSize: "12px", color: P.textMid }}>Spot</span>
        </div>
        <span className="ml-auto" style={{ fontSize: "11px", color: P.textDim }}>Ratio: 2.16×</span>
      </div>
      <div style={{ height: 195 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={futuresSpotData} margin={{ top: 4, right: 4, left: -22, bottom: 0 }} barGap={2} barSize={16}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(34,116,165,0.08)" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fill: "rgba(241,242,242,0.28)", fontSize: 10, fontFamily: "'Work Sans',sans-serif" }}
              tickLine={false} axisLine={false} dy={6}
            />
            <YAxis
              tick={{ fill: "rgba(241,242,242,0.28)", fontSize: 10, fontFamily: "'Work Sans',sans-serif" }}
              tickLine={false} axisLine={false}
              tickFormatter={(v) => `${v}B`}
            />
            <RechartsTooltip content={<BlueTooltip />} />
            <Bar dataKey="futures" name="Futures" fill={P.primary}               radius={[3,3,0,0]} animationDuration={1000} />
            <Bar dataKey="spot"    name="Spot"    fill="rgba(99,188,233,0.48)"   radius={[3,3,0,0]} animationDuration={1200} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}

// ─── MARKET HEATMAP ───────────────────────────────────────────────────────────

function MarketHeatmap({ onInsightClick }: { onInsightClick: () => void }) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <ChartCard title="Market Heatmap" subtitle="24h price performance weighted by market cap" onInsightClick={onInsightClick}>
      <div
        className="w-full rounded-xl overflow-hidden"
        style={{
          display: "grid",
          gridTemplateColumns: "3.5fr 2fr 1fr 1fr 1fr",
          gridTemplateRows: "repeat(3, 90px)",
          gap: "3px",
        }}
      >
        {heatmapAssets.map((asset) => (
          <div
            key={asset.symbol}
            onMouseEnter={() => setHovered(asset.symbol)}
            onMouseLeave={() => setHovered(null)}
            className="relative flex flex-col items-center justify-center cursor-pointer transition-all duration-200 rounded-lg overflow-hidden"
            style={{
              gridColumn: asset.col,
              gridRow: asset.row,
              backgroundColor: heatColor(asset.change),
              border: hovered === asset.symbol
                ? "1px solid rgba(241,242,242,0.28)"
                : "1px solid rgba(241,242,242,0.06)",
            }}
          >
            <span
              style={{
                fontWeight: 700, color: P.white,
                fontSize: parseInt(asset.col) <= 2 ? "17px" : "12px",
                fontFamily: "'Work Sans', sans-serif",
              }}
            >
              {asset.symbol}
            </span>
            <span
              style={{
                fontSize: parseInt(asset.col) <= 2 ? "14px" : "10px",
                fontWeight: 600,
                color: asset.change >= 0 ? P.light : "rgba(241,242,242,0.55)",
              }}
            >
              {asset.change >= 0 ? "+" : ""}{asset.change.toFixed(2)}%
            </span>
            {parseInt(asset.col) <= 2 && (
              <span style={{ fontSize: "11px", color: "rgba(241,242,242,0.45)", marginTop: 2 }}>
                {asset.price}
              </span>
            )}

            {/* Hover overlay */}
            <AnimatePresence>
              {hovered === asset.symbol && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="absolute inset-0 flex flex-col items-center justify-center p-2"
                  style={{
                    background: "rgba(15,10,10,0.82)",
                    backdropFilter: "blur(6px)",
                    border: "1px solid rgba(34,116,165,0.24)",
                    borderRadius: "8px",
                  }}
                >
                  <span style={{ fontWeight: 700, color: P.white, fontSize: "12px", fontFamily: "'Work Sans',sans-serif" }}>
                    {asset.name}
                  </span>
                  <span style={{ fontSize: "11px", color: P.textMid, marginTop: 2 }}>{asset.price}</span>
                  <span style={{ fontSize: "10px", color: P.textDim, marginTop: 1 }}>Vol: {asset.volume}</span>
                  <span
                    style={{
                      fontSize: "12px", fontWeight: 700, marginTop: 3,
                      color: asset.change >= 0 ? P.light : "rgba(241,242,242,0.45)",
                    }}
                  >
                    {asset.change >= 0 ? "+" : ""}{asset.change.toFixed(2)}%
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-3 mt-3 flex-wrap">
        <span style={{ fontSize: "10px", color: P.textDim }}>24h change:</span>
        {[
          { label:"< −5%",      color:"rgba(16,68,151,0.84)"  },
          { label:"−2% to −5%", color:"rgba(16,68,151,0.58)"  },
          { label:"Flat",        color:"rgba(241,242,242,0.07)" },
          { label:"> +2%",       color:"rgba(99,188,233,0.45)" },
          { label:"> +5%",       color:"rgba(99,188,233,0.72)" },
        ].map(({ label, color }) => (
          <div key={label} className="flex items-center gap-1">
            <span className="w-2.5 h-2 rounded-sm" style={{ backgroundColor: color, border: "1px solid rgba(241,242,242,0.08)" }} />
            <span style={{ fontSize: "10px", color: P.textDim }}>{label}</span>
          </div>
        ))}
      </div>
    </ChartCard>
  );
}

// ─── SECTOR PERFORMANCE ──────────────────────────────────────────────────────

function SectorPerformance({ onInsightClick }: { onInsightClick: () => void }) {
  const [hidden, setHidden] = useState<Set<string>>(new Set());
  const sectors = ["BTC", "ETH", "L2", "DeFi", "AI", "Meme"];

  return (
    <ChartCard title="Sector Performance" subtitle="30-day % return from baseline" onInsightClick={onInsightClick}>
      <div className="flex flex-wrap gap-1.5 mb-3">
        {sectors.map((s) => (
          <button
            key={s}
            onClick={() => setHidden((prev) => {
              const next = new Set(prev);
              next.has(s) ? next.delete(s) : next.add(s);
              return next;
            })}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all duration-200"
            style={{
              fontSize: "11px", fontWeight: 500,
              background: hidden.has(s) ? "rgba(241,242,242,0.03)" : "rgba(34,116,165,0.10)",
              color:      hidden.has(s) ? P.textDim : SECTOR_COLORS[s],
              border:     `1px solid ${hidden.has(s) ? "rgba(241,242,242,0.07)" : "rgba(34,116,165,0.22)"}`,
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: hidden.has(s) ? "rgba(241,242,242,0.18)" : SECTOR_COLORS[s] }}
            />
            {s}
          </button>
        ))}
      </div>

      <div style={{ height: 195 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sectorData} margin={{ top: 4, right: 4, left: -22, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(34,116,165,0.08)" vertical={false} />
            <XAxis
              dataKey="d"
              tick={{ fill: "rgba(241,242,242,0.28)", fontSize: 10, fontFamily: "'Work Sans',sans-serif" }}
              tickLine={false} axisLine={false}
              tickFormatter={(v) => `D${v}`} dy={6}
            />
            <YAxis
              tick={{ fill: "rgba(241,242,242,0.28)", fontSize: 10, fontFamily: "'Work Sans',sans-serif" }}
              tickLine={false} axisLine={false}
              tickFormatter={(v) => `${v}%`}
            />
            <RechartsTooltip content={<BlueTooltip />} formatter={(v: number) => `${v.toFixed(1)}%`} />
            {sectors.map((s) =>
              hidden.has(s) ? null : (
                <Line
                  key={s} type="monotone" dataKey={s}
                  stroke={SECTOR_COLORS[s]}
                  strokeWidth={s === "AI" || s === "BTC" ? 2 : 1.5}
                  dot={false} animationDuration={1200}
                  style={{ filter: `drop-shadow(0 0 4px ${SECTOR_COLORS[s]}60)` }}
                />
              )
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}

// ─── SUPPLY IN PROFIT ─────────────────────────────────────────────────────────

function SupplyInProfit({ onInsightClick }: { onInsightClick: () => void }) {
  return (
    <ChartCard title="Supply in Profit" subtitle="% of circulating supply above cost basis" onInsightClick={onInsightClick}>
      <div className="space-y-1.5 mt-1" style={{ maxHeight: 260, overflowY: "auto" }}>
        {supplyProfitAssets.map(({ asset, pct }) => (
          <div
            key={asset}
            className="flex items-center gap-2.5 px-2 py-1 rounded-lg transition-colors duration-150"
            style={{ cursor: "default" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = "rgba(34,116,165,0.06)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = "transparent"; }}
          >
            <span className="w-8 flex-shrink-0" style={{ fontSize: "11px", fontWeight: 500, color: P.textDim }}>
              {asset}
            </span>
            <div
              className="flex-1 h-3.5 rounded-full overflow-hidden"
              style={{ background: "rgba(34,116,165,0.08)" }}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.9, delay: 0.1, ease: "easeOut" }}
                className="h-full rounded-full"
                style={{
                  background: `linear-gradient(90deg, ${supplyColor(pct)}99, ${supplyColor(pct)})`,
                  boxShadow: `0 0 8px ${supplyColor(pct)}60`,
                }}
              />
            </div>
            <span
              className="flex-shrink-0"
              style={{ fontSize: "11px", fontWeight: 700, color: supplyColor(pct), minWidth: 32, textAlign: "right" }}
            >
              {pct}%
            </span>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div
        className="flex items-center gap-3 mt-3 pt-3 flex-wrap"
        style={{ borderTop: "1px solid rgba(34,116,165,0.10)" }}
      >
        <span style={{ fontSize: "10px", color: P.textDim }}>Profit %:</span>
        {[
          { label:"< 35%",   color:"rgba(16,68,151,0.55)"  },
          { label:"35–50%",  color:"rgba(16,68,151,0.80)"  },
          { label:"50–65%",  color:"rgba(34,116,165,0.80)" },
          { label:"65–80%",  color:"#2274a5"               },
          { label:"> 80%",   color:"#63bce9"               },
        ].map(({ label, color }) => (
          <div key={label} className="flex items-center gap-1">
            <span className="w-2.5 h-2 rounded-sm" style={{ backgroundColor: color }} />
            <span style={{ fontSize: "10px", color: P.textDim }}>{label}</span>
          </div>
        ))}
      </div>
    </ChartCard>
  );
}

// ─── ASSET TABLE ─────────────────────────────────────────────────────────────

const TABLE_TABS = ["Overview", "Fundamentals", "Profit & Loss", "Supply Dynamics", "Futures"];
const CATEGORIES = ["Stablecoins","Layer 1","Layer 2","Web3","Meme","Tokenized","AI","Staking","DeFi","DePIN","Exchange","Gaming","NFT","RWA","Governance"];

// Coin circle shades — all from blue palette
const COIN_SHADE: Record<string, string> = {
  BTC:"#2274a5", ETH:"#63bce9", USDT:"#104497", XRP:"#2274a5",
  BNB:"rgba(99,188,233,0.70)", SOL:"#104497", USDC:"#2274a5",
  TRX:"rgba(16,68,151,0.60)", DOGE:"rgba(34,116,165,0.75)", AVAX:"#104497",
};

function AssetTable({ onInsightClick }: { onInsightClick: () => void }) {
  const [sortKey, setSortKey]   = useState("rank");
  const [sortDir, setSortDir]   = useState<"asc"|"desc">("asc");
  const [activeTab, setActiveTab] = useState("Overview");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  function handleSort(key: string) {
    if (sortKey === key) setSortDir((d) => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("desc"); }
  }

  const sorted = [...assetTableData].sort((a, b) => {
    const av = (a as any)[sortKey];
    const bv = (b as any)[sortKey];
    if (av === null || av === "—") return 1;
    if (bv === null || bv === "—") return -1;
    return sortDir === "asc" ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
  });

  const thBase: React.CSSProperties = {
    fontSize: "11px", fontWeight: 500, color: "rgba(241,242,242,0.35)",
    padding: "10px 12px", textAlign: "left", whiteSpace: "nowrap",
    cursor: "pointer", userSelect: "none",
    fontFamily: "'Work Sans', sans-serif",
  };

  function SortIcon({ col }: { col: string }) {
    const active = sortKey === col;
    return (
      <span className="ml-1" style={{ fontSize: "9px", color: active ? P.light : "rgba(34,116,165,0.35)" }}>
        {active ? (sortDir === "asc" ? "▲" : "▼") : "⇅"}
      </span>
    );
  }

  return (
    <div
      className="rounded-[20px] overflow-hidden"
      style={{
        background: P.cardBg,
        backdropFilter: "blur(26px)",
        WebkitBackdropFilter: "blur(26px)",
        border: `1px solid ${P.border}`,
        boxShadow: "0 8px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(99,188,233,0.04)",
      }}
    >
      {/* Header */}
      <div className="px-5 pt-5">
        <div className="flex items-center justify-between mb-4">
          <h3 style={{ fontSize: "15px", fontWeight: 600, color: P.white, fontFamily: "'Work Sans',sans-serif" }}>
            Asset Overview
          </h3>
          <InsightBtn onClick={onInsightClick} />
        </div>

        {/* Tab bar */}
        <div className="flex gap-0.5 overflow-x-auto" style={{ borderBottom: "1px solid rgba(34,116,165,0.10)" }}>
          {TABLE_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-3 py-2 whitespace-nowrap transition-all duration-200"
              style={{
                fontSize: "12px", fontWeight: 500,
                color: activeTab === tab ? P.light : "rgba(241,242,242,0.32)",
                borderBottom: activeTab === tab ? `2px solid ${P.primary}` : "2px solid transparent",
                marginBottom: "-1px",
                fontFamily: "'Work Sans',sans-serif",
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Category pills */}
      <div
        className="px-5 py-2.5 overflow-x-auto flex gap-1.5"
        style={{ borderBottom: "1px solid rgba(34,116,165,0.08)" }}
      >
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
            className="px-2.5 py-1 rounded-md transition-all duration-150 whitespace-nowrap"
            style={{
              fontSize: "10px", fontWeight: 500,
              background: activeCategory === cat ? "rgba(34,116,165,0.18)" : "rgba(34,116,165,0.06)",
              border: activeCategory === cat ? "1px solid rgba(34,116,165,0.32)" : "1px solid rgba(34,116,165,0.10)",
              color: activeCategory === cat ? P.light : "rgba(241,242,242,0.35)",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[960px]">
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(34,116,165,0.08)" }}>
              <th style={thBase} onClick={() => handleSort("rank")}>#</th>
              <th style={thBase} onClick={() => handleSort("name")}>Asset <SortIcon col="name" /></th>
              <th style={thBase} onClick={() => handleSort("price")}>Price <SortIcon col="price" /></th>
              <th style={{ ...thBase, minWidth: 76 }} onClick={() => handleSort("c24")}>24h% <SortIcon col="c24" /></th>
              <th style={thBase} onClick={() => handleSort("c7d")}>7d% <SortIcon col="c7d" /></th>
              <th style={thBase} onClick={() => handleSort("mcap")}>Market Cap <SortIcon col="mcap" /></th>
              <th style={thBase} onClick={() => handleSort("vol")}>Vol 24h <SortIcon col="vol" /></th>
              <th style={{ ...thBase, minWidth: 76 }} onClick={() => handleSort("volC")}>Vol% <SortIcon col="volC" /></th>
              <th style={thBase} onClick={() => handleSort("oi")}>Open Interest <SortIcon col="oi" /></th>
              <th style={thBase} onClick={() => handleSort("fr")}>Funding Rate <SortIcon col="fr" /></th>
              <th style={thBase}>Liq. 24h</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((row, i) => (
              <motion.tr
                key={row.sym}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: i * 0.04 }}
                style={{ borderBottom: "1px solid rgba(34,116,165,0.06)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = "rgba(34,116,165,0.05)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = "transparent"; }}
              >
                {/* # */}
                <td className="px-3 py-3" style={{ fontSize: "12px", color: "rgba(241,242,242,0.22)" }}>
                  {row.rank}
                </td>
                {/* Asset */}
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{
                        background: `linear-gradient(135deg, ${COIN_SHADE[row.sym] || P.deep}44, ${COIN_SHADE[row.sym] || P.primary}77)`,
                        border: `1px solid ${COIN_SHADE[row.sym] || P.primary}60`,
                      }}
                    >
                      <span style={{ fontSize: "8px", fontWeight: 700, color: P.white }}>{row.sym.slice(0,4)}</span>
                    </div>
                    <div>
                      <p style={{ fontSize: "13px", fontWeight: 500, color: P.white }}>{row.name}</p>
                      <p style={{ fontSize: "10px", color: P.textDim }}>{row.sym}</p>
                    </div>
                  </div>
                </td>
                {/* Price */}
                <td className="px-3 py-3" style={{ fontSize: "12px", color: P.white, fontFamily: "monospace" }}>
                  {row.price}
                </td>
                {/* 24h% */}
                <td className="px-3 py-3">
                  <span
                    className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded"
                    style={{
                      fontSize: "12px", fontWeight: 500,
                      background: pctBg(row.c24),
                      color: pctColor(row.c24),
                    }}
                  >
                    {row.c24 > 0 ? <ChevronUp style={{ width: 11, height: 11 }} /> : row.c24 < 0 ? <ChevronDown style={{ width: 11, height: 11 }} /> : null}
                    {pctText(row.c24)}
                  </span>
                </td>
                {/* 7d% */}
                <td className="px-3 py-3">
                  <span
                    className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded"
                    style={{
                      fontSize: "12px", fontWeight: 500,
                      background: pctBg(row.c7d),
                      color: pctColor(row.c7d),
                    }}
                  >
                    {row.c7d > 0 ? <ChevronUp style={{ width: 11, height: 11 }} /> : row.c7d < 0 ? <ChevronDown style={{ width: 11, height: 11 }} /> : null}
                    {pctText(row.c7d)}
                  </span>
                </td>
                {/* Mcap */}
                <td className="px-3 py-3" style={{ fontSize: "12px", color: P.textMid }}>{row.mcap}</td>
                {/* Vol */}
                <td className="px-3 py-3" style={{ fontSize: "12px", color: P.textMid }}>{row.vol}</td>
                {/* Vol% */}
                <td className="px-3 py-3">
                  <span
                    className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded"
                    style={{
                      fontSize: "11px",
                      background: pctBg(row.volC),
                      color: pctColor(row.volC),
                    }}
                  >
                    {row.volC > 0 ? <ChevronUp style={{ width: 10, height: 10 }} /> : <ChevronDown style={{ width: 10, height: 10 }} />}
                    {pctText(row.volC)}
                  </span>
                </td>
                {/* OI */}
                <td className="px-3 py-3" style={{ fontSize: "12px", color: P.textMid }}>{row.oi}</td>
                {/* Funding Rate */}
                <td className="px-3 py-3">
                  <span
                    style={{
                      fontSize: "11px", fontFamily: "monospace",
                      color: row.fr > 0 ? P.light : row.fr < 0 ? "rgba(241,242,242,0.42)" : P.textDim,
                    }}
                  >
                    {row.fr > 0 ? "+" : ""}{row.fr.toFixed(4)}%
                  </span>
                </td>
                {/* Liquidations */}
                <td className="px-3 py-3" style={{ fontSize: "12px", color: P.textMid }}>{row.liq}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── INSIGHT PANEL BRIDGE ─────────────────────────────────────────────────

function DashboardInsightPanel({ chartId, onClose }: { chartId: string | null; onClose: () => void }) {
  const data = chartId ? INSIGHTS[chartId] : null;
  return <SharedInsightPanel id={chartId} data={data ?? null} onClose={onClose} />;
}





// ─── MAIN DASHBOARD ───────────────────────────────────────────────────────────

export function Dashboard() {
  const [activeInsight, setActiveInsight] = useState<string | null>(null);
  const { activeSubTab } = useDashboard();
  const open  = (id: string) => setActiveInsight(id);
  const close = () => setActiveInsight(null);

  const renderContent = () => {
    switch (activeSubTab) {
      case "Derivatives":
        return (
          <>
            <InsightStrip onInsightClick={() => open("overview")} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.45, delay:0.07 }}><FuturesSpotChart onInsightClick={() => open("futvol")} /></motion.div>
              <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.45, delay:0.14 }}><MarketCapChart onInsightClick={() => open("marketcap")} /></motion.div>
            </div>
            <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.45, delay:0.21 }}><AssetTable onInsightClick={() => open("table")} /></motion.div>
          </>
        );
      case "On-Chain":
        return (
          <>
            <InsightStrip onInsightClick={() => open("overview")} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.45, delay:0.07 }}><SupplyInProfit onInsightClick={() => open("supply")} /></motion.div>
              <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.45, delay:0.14 }}><MarketCapChart onInsightClick={() => open("marketcap")} /></motion.div>
            </div>
            <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.45, delay:0.21 }}><MarketHeatmap onInsightClick={() => open("heatmap")} /></motion.div>
          </>
        );
      case "Sectors":
        return (
          <>
            <InsightStrip onInsightClick={() => open("sector")} />
            <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.45, delay:0.07 }}><SectorPerformance onInsightClick={() => open("sector")} /></motion.div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.45, delay:0.14 }}><SupplyInProfit onInsightClick={() => open("supply")} /></motion.div>
              <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.45, delay:0.21 }}><MarketCapChart onInsightClick={() => open("marketcap")} /></motion.div>
            </div>
          </>
        );
      default: // "Market"
        return (
          <>
            <InsightStrip onInsightClick={() => open("overview")} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.07 }}><MarketCapChart onInsightClick={() => open("marketcap")} /></motion.div>
              <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.14 }}><FuturesSpotChart onInsightClick={() => open("futvol")} /></motion.div>
            </div>
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.21 }}><MarketHeatmap onInsightClick={() => open("heatmap")} /></motion.div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.28 }}><SectorPerformance onInsightClick={() => open("sector")} /></motion.div>
              <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.35 }}><SupplyInProfit onInsightClick={() => open("supply")} /></motion.div>
            </div>
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.42 }}><AssetTable onInsightClick={() => open("table")} /></motion.div>
          </>
        );
    }
  };

  return (
    <div className="space-y-4 pb-16">
      <motion.div key={activeSubTab} initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.28 }}>
        <div className="space-y-4">{renderContent()}</div>
      </motion.div>
      <DashboardInsightPanel chartId={activeInsight} onClose={close} />
    </div>
  );
}
