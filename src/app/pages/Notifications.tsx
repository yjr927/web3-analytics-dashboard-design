import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles, X, Activity, Zap, MessageSquare,
  TrendingUp, TrendingDown, Info,
  Bookmark, BookmarkCheck, Heart, Share2,
  Filter, ChevronRight,
} from "lucide-react";
import {
  LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer,
} from "recharts";
import { useDashboard } from "../contexts/DashboardContext";
import { InsightPanel as SharedInsightPanel, type InsightData as SharedInsightData } from "../components/InsightPanel";

// ── Palette ───────────────────────────────────────────────────────────────────
const P = {
  primary:"#2274a5", light:"#63bce9", deep:"#104497",
  white:"#f1f2f2", cardBg:"rgba(16,68,151,0.07)",
  border:"rgba(34,116,165,0.16)", borderH:"rgba(99,188,233,0.28)",
  dim:"rgba(241,242,242,0.38)", mid:"rgba(241,242,242,0.60)",
};

// ── Featured Insight data ─────────────────────────────────────────────────────

const featuredInsights = [
  {
    id:"feat1",
    badge:"Market Signal",
    title:"Bitcoin on-chain data contradicts bearish price action",
    summary:"Despite BTC's 12% correction, on-chain fundamentals remain constructive: 78% supply in profit, declining exchange reserves, and rising long-term holder balances all point to accumulation.",
    author:"Sarah Chen", role:"Head of Research", initials:"SC",
    time:"2h ago", topic:"Bitcoin", readTime:"5 min",
    likes:284, bookmarks:142, trend:+8.4,
    sparkData:[{v:65},{v:67},{v:64},{v:66},{v:68},{v:65},{v:63},{v:66}],
  },
  {
    id:"feat2",
    badge:"Sector Alert",
    title:"AI token sector shows structural divergence from broader market",
    summary:"AI-sector tokens are holding 30-day gains of +11.5% while the broader market corrects. Capital rotation from DeFi and Layer-1s into AI narratives is systematic, not speculative.",
    author:"Chris Wong", role:"Sector Analyst", initials:"CW",
    time:"4h ago", topic:"AI Sector", readTime:"4 min",
    likes:196, bookmarks:88, trend:+11.5,
    sparkData:[{v:100},{v:104},{v:108},{v:105},{v:110},{v:108},{v:112},{v:115}],
  },
  {
    id:"feat3",
    badge:"Risk Watch",
    title:"Futures-to-spot ratio at 2.14× — approaching yellow-flag territory",
    summary:"The futures/spot volume ratio has climbed to 2.14×, approaching the 2.5× threshold that historically precedes 8–15% corrections. Funding rates remain negative, suggesting shorts are dominant.",
    author:"Alex Rivera", role:"Derivatives Analyst", initials:"AR",
    time:"6h ago", topic:"Derivatives", readTime:"3 min",
    likes:147, bookmarks:93, trend:-2.1,
    sparkData:[{v:1.8},{v:1.9},{v:1.95},{v:2.0},{v:2.05},{v:2.1},{v:2.12},{v:2.14}],
  },
];

// ── Feed data ─────────────────────────────────────────────────────────────────

const feedInsights = [
  { id:"f1",  topic:"Bitcoin",     title:"Long-term holder supply hits 6-month high",                   summary:"LTH supply grew 180K BTC in 30 days — largest accumulation streak since early 2024.",                         author:"Dana Lee",     initials:"DL", time:"1h ago",  readTime:"3 min", likes:128, trend:+5.2  },
  { id:"f2",  topic:"Ethereum",    title:"ETH fee burn rate drops 28% as activity slows",               summary:"Lower fees are bad for deflationary pressure but positive for user cost. Net issuance turned slightly positive.", author:"Owen Park",    initials:"OP", time:"2h ago",  readTime:"2 min", likes:84,  trend:-2.8  },
  { id:"f3",  topic:"DeFi",        title:"Uniswap V3 LP returns surge as volatility rises",             summary:"High volatility increases fee income for LP providers. APRs on major ETH pools rose to 18-24% this week.",       author:"Priya Nair",   initials:"PN", time:"3h ago",  readTime:"4 min", likes:211, trend:+14.2 },
  { id:"f4",  topic:"Whale",       title:"New whale address accumulates $420M BTC over 7 days",         summary:"A previously dormant address reactivated and acquired ~6,400 BTC in sub-$66K range. OTC attribution likely.",   author:"Leo Grant",    initials:"LG", time:"4h ago",  readTime:"2 min", likes:352, trend:+0.0  },
  { id:"f5",  topic:"Layer 2",     title:"Arbitrum TVL hits ATH at $18.4B despite ETH weakness",       summary:"L2s absorbing capital that would have gone to ETH mainnet. Arbitrum's dominance within L2s rose to 41%.",         author:"Sam Torres",   initials:"ST", time:"5h ago",  readTime:"3 min", likes:93,  trend:+8.8  },
  { id:"f6",  topic:"Bitcoin",     title:"Miner capitulation risk rises as hash rate softens",          summary:"Hash rate dropped 4.2% in 10 days. If BTC drops below $58K, some older miners face negative margins.",          author:"Vera Lim",     initials:"VL", time:"6h ago",  readTime:"3 min", likes:172, trend:-3.4  },
  { id:"f7",  topic:"Stablecoins", title:"USDC supply surges $4.2B in 30 days — dry powder forming",  summary:"Rising stablecoin supply on exchanges is bullish. $4.2B of buying power sitting on the sidelines.",              author:"Rachel Kim",   initials:"RK", time:"8h ago",  readTime:"2 min", likes:267, trend:+0.0  },
  { id:"f8",  topic:"AI Sector",   title:"FET and TAO outperform as AI narrative accelerates",         summary:"FET +24%, TAO +31% in a week where BTC -7%. AI sector shows genuine fundamental catalysts beyond hype.",         author:"Nina Reyes",   initials:"NR", time:"10h ago", readTime:"3 min", likes:318, trend:+27.5 },
  { id:"f9",  topic:"DeFi",        title:"Curve gauge emissions shifting to newer pools",              summary:"CRV emissions moving to newer stablecoin pools. Older pools facing liquidity drain — repositioning underway.",    author:"Alicia Torres",initials:"AT", time:"12h ago", readTime:"3 min", likes:66,  trend:-1.2  },
  { id:"f10", topic:"Layer 2",     title:"Base reaches 2M daily active users for first time",          summary:"Coinbase's Base L2 hit 2M DAUs on Apr 1 — fastest L2 to reach this milestone. Retail onboarding accelerating.", author:"Marcus Vo",    initials:"MV", time:"1d ago",  readTime:"4 min", likes:289, trend:+18.4 },
];

const TOPICS = ["All", "Bitcoin", "Ethereum", "DeFi", "Layer 2", "AI Sector", "Derivatives", "Whale", "Stablecoins"];

const PANEL_DATA: SharedInsightData = {
  title:"Featured Insight Deep Dive",
  systemInsight:"On-chain metrics remain constructive despite recent price weakness. The divergence between price action and on-chain fundamentals is a classic accumulation signal.",
  keySignals: [
    "Price down 12% but on-chain fundamentals improving — accumulation signal",
    "Long-term holder supply at 6-month high — smart money is buying",
    "Exchange reserves declining — coins moving to cold storage (bullish)",
  ],
  explanation:"When prices fall but on-chain data (supply in profit, LTH balances, exchange reserves) improves, it typically means smart money is buying while retail panics. This is how major bottoms form.",
  expertInsight:'"The gap between price sentiment and on-chain reality is where alpha lives. When prices are down 12% but fundamentals improve, historically that\'s the entry — not the exit."',
  expertName:"Sarah Chen", expertRole:"Head of Research", expertInitials:"SC",
  communityTop: {handle:"@contrarian_cap",text:"On-chain bullish while price is down. I've been adding here. The data is unambiguous.",likes:284,replies:42},
  discussion:[
    {handle:"@contrarian_cap",time:"1h ago",text:"On-chain bullish while price is down. I've been adding here. The data is unambiguous.",up:true},
    {handle:"@patient_bear",time:"3h ago",text:"Fundamentals were strong in 2022 too. Price can stay disconnected longer than most expect.",up:false},
  ],
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function Card({ children, className="", ...rest }: any) {
  return (
    <div className={`rounded-[20px] transition-all duration-300 ${className}`}
      style={{ background:P.cardBg, backdropFilter:"blur(26px)", WebkitBackdropFilter:"blur(26px)", border:`1px solid ${P.border}`, boxShadow:"0 8px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(99,188,233,0.04)", ...rest.style }}
      onMouseEnter={(e)=>{ const el=e.currentTarget as HTMLElement; el.style.border=`1px solid ${P.borderH}`; el.style.boxShadow="0 12px 40px rgba(0,0,0,0.55), 0 0 28px rgba(34,116,165,0.10)"; }}
      onMouseLeave={(e)=>{ const el=e.currentTarget as HTMLElement; el.style.border=`1px solid ${P.border}`; el.style.boxShadow="0 8px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(99,188,233,0.04)"; }}
      {...rest}>{children}</div>
  );
}

function MiniSparkline({ data, trend }: { data:{v:number}[]; trend:number }) {
  const pos = trend >= 0;
  const color = pos ? P.light : "rgba(241,242,242,0.40)";
  return (
    <div style={{ height:40, width:"100%", maxWidth:140 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top:2, right:2, left:2, bottom:2 }}>
          <Line type="monotone" dataKey="v" stroke={color} strokeWidth={1.5} dot={false} animationDuration={1200} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function InsightPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  return <SharedInsightPanel id={open ? "insights" : null} data={open ? PANEL_DATA : null} onClose={onClose} />;
}

// ── Featured Insights section ─────────────────────────────────────────────────
function FeaturedSection({ onOpen }:{ onOpen:()=>void }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles style={{ width:14, height:14, color:P.light }} />
          <span style={{ fontSize:"13px", fontWeight:600, color:P.white }}>Featured Insights</span>
        </div>
        <span style={{ fontSize:"11px", color:P.dim }}>AI-curated · Apr 2, 2026</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {featuredInsights.map((ins, i) => (
          <motion.div key={ins.id} initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.45, delay:i*0.08 }}>
            <div
              className="rounded-[20px] p-5 flex flex-col cursor-pointer group transition-all duration-300 hover:-translate-y-1"
              style={{ background:P.cardBg, backdropFilter:"blur(26px)", WebkitBackdropFilter:"blur(26px)", border:`1px solid ${P.border}`, boxShadow:"0 8px 32px rgba(0,0,0,0.45)", height:"100%" }}
              onMouseEnter={(e)=>{ const el=e.currentTarget as HTMLElement; el.style.border=`1px solid ${P.borderH}`; el.style.boxShadow="0 16px 48px rgba(0,0,0,0.55), 0 0 30px rgba(34,116,165,0.12)"; }}
              onMouseLeave={(e)=>{ const el=e.currentTarget as HTMLElement; el.style.border=`1px solid ${P.border}`; el.style.boxShadow="0 8px 32px rgba(0,0,0,0.45)"; }}
              onClick={onOpen}
            >
              {/* Badge */}
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 rounded-lg" style={{ fontSize:"10px", fontWeight:600, background:"rgba(34,116,165,0.16)", border:"1px solid rgba(34,116,165,0.28)", color:P.light }}>
                  {ins.badge}
                </span>
                <span style={{ fontSize:"10px", color:P.dim }}>{ins.readTime} read</span>
              </div>

              {/* Title */}
              <h3
                className="flex-1"
                style={{ fontFamily:"'Newsreader',Georgia,serif", fontSize:"17px", fontWeight:700, color:P.white, lineHeight:1.4, marginBottom:10 }}
              >
                {ins.title}
              </h3>

              {/* Summary */}
              <p style={{ fontSize:"12px", color:P.mid, lineHeight:1.7, marginBottom:12 }}>{ins.summary}</p>

              {/* Sparkline + trend */}
              <div className="flex items-center justify-between mb-3">
                <MiniSparkline data={ins.sparkData} trend={ins.trend} />
                <span style={{ fontSize:"14px", fontWeight:700, color: ins.trend >= 0 ? P.light : "rgba(241,242,242,0.45)" }}>
                  {ins.trend >= 0 ? "+" : ""}{ins.trend.toFixed(1)}%
                </span>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-3" style={{ borderTop:"1px solid rgba(34,116,165,0.10)" }}>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background:`linear-gradient(135deg, ${P.deep}, ${P.primary})`, border:"1px solid rgba(99,188,233,0.22)" }}>
                    <span style={{ fontSize:"8px", fontWeight:700, color:P.light }}>{ins.initials}</span>
                  </div>
                  <div>
                    <p style={{ fontSize:"11px", fontWeight:500, color:P.white }}>{ins.author}</p>
                    <p style={{ fontSize:"10px", color:P.dim }}>{ins.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="flex items-center gap-1" style={{ fontSize:"11px", color:P.dim }}>
                    <Heart style={{ width:11, height:11 }} />{ins.likes}
                  </span>
                  <span className="flex items-center gap-1" style={{ fontSize:"11px", color:P.dim }}>
                    <Bookmark style={{ width:11, height:11 }} />{ins.bookmarks}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ── Feed card ─────────────────────────────────────────────────────────────────
function FeedCard({ ins, onOpen, delay=0 }:{ ins:typeof feedInsights[0]; onOpen:()=>void; delay?:number }) {
  const [bookmarked, setBookmarked] = useState(false);
  const pos = ins.trend >= 0;

  return (
    <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.35, delay }}>
      <div
        className="rounded-[20px] p-4 flex gap-4 cursor-pointer group transition-all duration-300"
        style={{ background:P.cardBg, backdropFilter:"blur(26px)", WebkitBackdropFilter:"blur(26px)", border:`1px solid ${P.border}`, boxShadow:"0 4px 20px rgba(0,0,0,0.35)" }}
        onMouseEnter={(e)=>{ const el=e.currentTarget as HTMLElement; el.style.border=`1px solid ${P.borderH}`; el.style.boxShadow="0 8px 32px rgba(0,0,0,0.50), 0 0 22px rgba(34,116,165,0.10)"; el.style.transform="translateY(-2px)"; }}
        onMouseLeave={(e)=>{ const el=e.currentTarget as HTMLElement; el.style.border=`1px solid ${P.border}`; el.style.boxShadow="0 4px 20px rgba(0,0,0,0.35)"; el.style.transform="none"; }}
        onClick={onOpen}
      >
        {/* Avatar */}
        <div className="flex-shrink-0 mt-0.5">
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background:`linear-gradient(135deg, ${P.deep}, ${P.primary})`, border:"1.5px solid rgba(99,188,233,0.22)" }}>
            <span style={{ fontSize:"9px", fontWeight:700, color:P.light }}>{ins.initials}</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 rounded" style={{ fontSize:"10px", fontWeight:600, background:"rgba(34,116,165,0.12)", border:"1px solid rgba(34,116,165,0.20)", color:P.light }}>{ins.topic}</span>
              <span style={{ fontSize:"11px", color:P.dim }}>{ins.author} · {ins.time}</span>
            </div>
            <span style={{ fontSize:"12px", fontWeight:600, color:pos?P.light:"rgba(241,242,242,0.40)", flexShrink:0 }}>
              {ins.trend !== 0 ? (pos?"+":"")+ins.trend.toFixed(1)+"%" : "—"}
            </span>
          </div>

          <h4 style={{ fontSize:"14px", fontWeight:600, color:P.white, lineHeight:1.45, marginBottom:6, fontFamily:"'Work Sans',sans-serif" }}>
            {ins.title}
          </h4>
          <p style={{ fontSize:"12px", color:P.mid, lineHeight:1.65, marginBottom:10 }}>{ins.summary}</p>

          <div className="flex items-center justify-between">
            <span style={{ fontSize:"11px", color:P.dim }}>{ins.readTime} read</span>
            <div className="flex items-center gap-3">
              <button
                className="flex items-center gap-1 transition-colors duration-150"
                style={{ fontSize:"11px", color:P.dim }}
                onClick={(e)=>{ e.stopPropagation(); }}
                onMouseEnter={(e)=>{ (e.currentTarget as HTMLElement).style.color=P.mid; }}
                onMouseLeave={(e)=>{ (e.currentTarget as HTMLElement).style.color=P.dim; }}>
                <Heart style={{ width:12, height:12 }} />{ins.likes}
              </button>
              <button
                className="flex items-center gap-1 transition-colors duration-150"
                style={{ fontSize:"11px", color: bookmarked ? P.light : P.dim }}
                onClick={(e)=>{ e.stopPropagation(); setBookmarked(v=>!v); }}
                onMouseEnter={(e)=>{ if(!bookmarked)(e.currentTarget as HTMLElement).style.color=P.mid; }}
                onMouseLeave={(e)=>{ if(!bookmarked)(e.currentTarget as HTMLElement).style.color=P.dim; }}>
                {bookmarked ? <BookmarkCheck style={{ width:12, height:12 }} /> : <Bookmark style={{ width:12, height:12 }} />}
              </button>
              <button
                className="flex items-center gap-1 transition-colors duration-150"
                style={{ fontSize:"11px", color:P.dim }}
                onClick={(e)=>{ e.stopPropagation(); }}
                onMouseEnter={(e)=>{ (e.currentTarget as HTMLElement).style.color=P.mid; }}
                onMouseLeave={(e)=>{ (e.currentTarget as HTMLElement).style.color=P.dim; }}>
                <Share2 style={{ width:12, height:12 }} />
              </button>
              <ChevronRight style={{ width:13, height:13, color:"rgba(241,242,242,0.20)" }} />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Filter bar ────────────────────────────────────────────────────────────────
function FilterBar({ topic, setTopic, sort, setSort }:{
  topic:string; setTopic:(t:string)=>void;
  sort:string;  setSort:(s:string)=>void;
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
      {/* Topic filter */}
      <div className="flex items-center gap-1 overflow-x-auto" style={{ scrollbarWidth:"none" }}>
        <Filter style={{ width:13, height:13, color:P.dim, flexShrink:0 }} />
        {TOPICS.map((t) => (
          <button key={t} onClick={()=>setTopic(t)}
            className="px-2.5 py-1 rounded-lg transition-all duration-150 whitespace-nowrap"
            style={{ fontSize:"11px", fontWeight:500,
              background: topic===t?"rgba(34,116,165,0.18)":"rgba(34,116,165,0.06)",
              border: topic===t?"1px solid rgba(34,116,165,0.32)":"1px solid rgba(34,116,165,0.10)",
              color: topic===t?P.light:"rgba(241,242,242,0.38)" }}>
            {t}
          </button>
        ))}
      </div>

      {/* Sort */}
      <div className="ml-auto flex items-center gap-1 flex-shrink-0">
        {["Trending","Latest"].map((s) => (
          <button key={s} onClick={()=>setSort(s)}
            className="px-3 py-1.5 rounded-xl transition-all duration-150"
            style={{ fontSize:"11px", fontWeight:500,
              background: sort===s?"rgba(34,116,165,0.18)":"transparent",
              border: sort===s?"1px solid rgba(34,116,165,0.28)":"1px solid rgba(34,116,165,0.10)",
              color: sort===s?P.light:"rgba(241,242,242,0.38)" }}>
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Tab content helpers ───────────────────────────────────────────────────────
function FeedTabContent({ filter, onOpen }:{ filter:(ins:typeof feedInsights[0])=>boolean; onOpen:()=>void }) {
  const filtered = feedInsights.filter(filter);
  if (filtered.length === 0)
    return (
      <div className="py-16 text-center">
        <p style={{ color:P.dim, fontSize:"14px" }}>No insights match your current filters.</p>
      </div>
    );
  return (
    <div className="grid grid-cols-1 gap-3">
      {filtered.map((ins, i) => (
        <FeedCard key={ins.id} ins={ins} onOpen={onOpen} delay={i * 0.04} />
      ))}
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export function Notifications() {
  const [panelOpen, setPanelOpen] = useState(false);
  const [topic, setTopic]         = useState("All");
  const [sort, setSort]           = useState("Trending");
  const { activeSubTab }          = useDashboard();

  const open  = () => setPanelOpen(true);
  const close = () => setPanelOpen(false);

  const topicFilter = (ins: typeof feedInsights[0]) =>
    topic === "All" || ins.topic === topic;

  const sortedFeed = [...feedInsights].sort((a, b) =>
    sort === "Trending" ? b.likes - a.likes : 0
  );

  const renderTab = () => {
    switch (activeSubTab) {
      case "Trending":
        return (
          <FeedTabContent
            filter={(ins) => topicFilter(ins) && ins.likes > 150}
            onOpen={open}
          />
        );
      case "Latest":
        return (
          <FeedTabContent
            filter={(ins) => topicFilter(ins)}
            onOpen={open}
          />
        );
      case "Bookmarked":
        return (
          <div className="py-16 text-center">
            <Bookmark style={{ width:32, height:32, color:"rgba(34,116,165,0.30)", margin:"0 auto 12px" }} />
            <p style={{ fontSize:"15px", fontWeight:600, color:P.mid }}>No bookmarks yet</p>
            <p style={{ fontSize:"13px", color:P.dim, marginTop:4 }}>
              Click the bookmark icon on any insight to save it here.
            </p>
          </div>
        );
      default: // Featured
        return (
          <>
            <FeaturedSection onOpen={open} />
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Activity style={{ width:14, height:14, color:P.primary }} />
                  <span style={{ fontSize:"13px", fontWeight:600, color:P.white }}>Insight Feed</span>
                </div>
              </div>
              <div className="mb-4">
                <FilterBar topic={topic} setTopic={setTopic} sort={sort} setSort={setSort} />
              </div>
              <div className="grid grid-cols-1 gap-3">
                {sortedFeed
                  .filter(topicFilter)
                  .map((ins, i) => (
                    <FeedCard key={ins.id} ins={ins} onOpen={open} delay={i * 0.035} />
                  ))}
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="space-y-5 pb-16">
      {/* Insight strip */}
      <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }}
        className="relative overflow-hidden rounded-[20px]"
        style={{ background:"rgba(16,68,151,0.08)", backdropFilter:"blur(26px)", WebkitBackdropFilter:"blur(26px)", border:`1px solid ${P.border}`, boxShadow:"0 8px 32px rgba(0,0,0,0.40)" }}>
        <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-[20px]" style={{ background:`linear-gradient(180deg, ${P.deep}, ${P.light})` }} />
        <div className="pl-7 pr-5 py-4 flex flex-col sm:flex-row sm:items-center gap-4 relative z-10">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <Zap style={{ width:12, height:12, color:P.light }} />
              <span style={{ fontSize:"10px", fontWeight:600, color:P.primary, textTransform:"uppercase", letterSpacing:"0.08em" }}>AI-Curated Insights · Apr 2, 2026</span>
            </div>
            <p style={{ fontFamily:"'Newsreader',Georgia,serif", fontSize:"20px", fontWeight:700, lineHeight:1.3, color:P.white }}>
              10 new signals today — on-chain data diverges from price sentiment
            </p>
            <p style={{ fontSize:"13px", color:P.mid, marginTop:6 }}>AI analysis across 284 data streams · 12 expert contributors active</p>
          </div>
          <button onClick={open}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg transition-all duration-200 whitespace-nowrap flex-shrink-0"
            style={{ fontSize:"12px", fontWeight:600, background:"rgba(34,116,165,0.20)", border:"1px solid rgba(34,116,165,0.36)", color:P.light, boxShadow:"0 0 16px rgba(34,116,165,0.20)" }}
            onMouseEnter={(e)=>{ (e.currentTarget as HTMLElement).style.boxShadow="0 0 28px rgba(34,116,165,0.38)"; }}
            onMouseLeave={(e)=>{ (e.currentTarget as HTMLElement).style.boxShadow="0 0 16px rgba(34,116,165,0.20)"; }}>
            <Sparkles style={{ width:13, height:13 }} className="animate-pulse" /> ✨ Insight
          </button>
        </div>
      </motion.div>

      {/* Tab content */}
      <motion.div key={activeSubTab} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.3 }}>
        {renderTab()}
      </motion.div>

      <InsightPanel open={panelOpen} onClose={close} />
    </div>
  );
}
