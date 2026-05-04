import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles, TrendingUp, MessageSquare, Heart, Newspaper,
  Users, ExternalLink, Clock, Flame, ArrowUpRight, BadgeCheck,
  Send, Bookmark, X as XIcon,
} from "lucide-react";
import { GlassCard } from "../components/GlassCard";
import { useDashboard } from "../contexts/DashboardContext";

const P = {
  primary: "#2274a5",
  light:   "#63bce9",
  deep:    "#104497",
  white:   "#f1f2f2",
  dim:     "rgba(241,242,242,0.38)",
  mid:     "rgba(241,242,242,0.62)",
  faint:   "rgba(241,242,242,0.22)",
};

// ── Mock data ─────────────────────────────────────────────────────────────
type Source = "Community" | "News" | "Expert";

const FEATURED = [
  {
    id: "f1",
    title: "AI sector rotation accelerates as compute tokens lead weekly gains",
    summary:
      "Capital is rotating from L1s into AI-adjacent tokens. On-chain flows show a 3.2× increase in stable inflows to AI projects this week, while community discussion volume has doubled across analyst circles.",
    takeaway: "Watch RNDR, FET, TAO — narrative momentum precedes price action by ~5 days historically.",
    sources: ["Community", "News", "Expert"] as Source[],
    tags: ["AI", "Rotation", "L1"],
    score: 92,
  },
  {
    id: "f2",
    title: "Whale accumulation phase: BTC supply on exchanges hits 5-year low",
    summary:
      "Exchange reserves dropped 18,400 BTC over 7 days. Three new wallets in the top-100 cohort accumulated >2k BTC each, with no historical sell-side footprint.",
    takeaway: "Supply squeeze conditions consistent with prior pre-breakout regimes (Q4 2020, Q1 2024).",
    sources: ["Community", "Expert"] as Source[],
    tags: ["BTC", "Whale", "Supply"],
    score: 88,
  },
  {
    id: "f3",
    title: "Stablecoin minting surges ahead of CPI release",
    summary:
      "USDC and USDT issuance spiked $1.6B in 48 hours. Historically, pre-CPI mints precede directional volatility. Sentiment is leaning long across derivatives desks.",
    takeaway: "Expect amplified volatility in the 24h window post-print.",
    sources: ["News", "Expert"] as Source[],
    tags: ["Stablecoins", "Macro"],
    score: 79,
  },
];

type Post = {
  id: string; user: string; handle: string; role: string;
  text: string; tags: string[]; likes: number; replies: number; time: string;
};

const POSTS: Post[] = [
  {
    id: "p1", user: "0xAria", handle: "@aria.eth", role: "On-chain analyst",
    text: "ETH/BTC ratio just printed a higher low on the weekly. Combined with rising staking yield and falling exchange supply — first real structural setup since March.",
    tags: ["ETH", "BTC"], likes: 412, replies: 58, time: "2h",
  },
  {
    id: "p2", user: "DeFi_Maxi", handle: "@defimaxi", role: "Researcher",
    text: "Three of the top-10 DeFi protocols quietly raised their TVL caps this week. Nobody's talking about it, but real yield is back above T-bills for the first time in 14 months.",
    tags: ["DeFi", "Yield"], likes: 287, replies: 41, time: "4h",
  },
  {
    id: "p3", user: "Lattice", handle: "@lattice_eng", role: "Quant",
    text: "Whale cluster forming around $63k-$64k BTC. Accumulation footprint is identical to the Feb 2024 base. If this holds the regime, expect range expansion within 9 days.",
    tags: ["BTC", "Whale"], likes: 1024, replies: 132, time: "6h",
  },
  {
    id: "p4", user: "Solana_Sage", handle: "@sol.sage", role: "Validator",
    text: "DEX volume on Solana is up 38% week-over-week, but most of it is concentrated in 4 pools. Concentration risk worth flagging before chasing the narrative.",
    tags: ["SOL", "DEX"], likes: 198, replies: 27, time: "9h",
  },
  {
    id: "p5", user: "MacroGwei", handle: "@macrogwei", role: "Macro strategist",
    text: "DXY breaking down + BTC reclaiming the 50d + AI tokens leading risk-on = textbook early-cycle behavior. We're not in chop, we're in a regime change.",
    tags: ["Macro", "AI"], likes: 631, replies: 84, time: "11h",
  },
];

const NEWS = [
  {
    id: "n1", headline: "BlackRock files updated S-1 for spot ETH ETF with staking provisions",
    source: "CoinDesk", summary: "The amendment includes language permitting staking rewards to flow to shareholders, a first-of-its-kind structure under SEC review.",
    tags: ["ETH", "ETF"], time: "1h",
  },
  {
    id: "n2", headline: "Fed minutes signal slower QT path; risk assets rally into close",
    source: "Bloomberg", summary: "Officials discussed slowing the pace of balance-sheet runoff. BTC and ETH both closed above key technical levels.",
    tags: ["Macro", "Fed"], time: "3h",
  },
  {
    id: "n3", headline: "Solana monthly active addresses hit all-time high",
    source: "The Block", summary: "On-chain data shows 23.4M monthly actives in April, driven primarily by memecoin and DePIN activity.",
    tags: ["SOL"], time: "5h",
  },
  {
    id: "n4", headline: "EU finalizes MiCA stablecoin reporting standards",
    source: "Reuters", summary: "Issuers operating in EU jurisdictions must publish reserve attestations on a 30-day cadence beginning Q3.",
    tags: ["Regulation", "Stablecoins"], time: "8h",
  },
  {
    id: "n5", headline: "Ethereum L2 sequencer revenue overtakes mainnet for first time",
    source: "Dune Analytics", summary: "Aggregate weekly L2 revenue reached $14.2M, surpassing Ethereum L1 base-fee revenue of $11.8M.",
    tags: ["ETH", "L2"], time: "12h",
  },
];

const FILTER_TAGS = ["BTC", "ETH", "SOL", "AI", "DeFi", "Whale", "Macro", "Stablecoins"];

// ── Helpers ───────────────────────────────────────────────────────────────
function SourceBadge({ kind }: { kind: Source }) {
  const styles: Record<Source, { bg: string; bd: string; fg: string; icon: any }> = {
    Community: { bg: "rgba(34,116,165,0.14)", bd: "rgba(34,116,165,0.32)", fg: P.light, icon: Users },
    News:      { bg: "rgba(16,68,151,0.18)",  bd: "rgba(16,68,151,0.40)",  fg: P.light, icon: Newspaper },
    Expert:    { bg: "rgba(99,188,233,0.10)", bd: "rgba(99,188,233,0.30)", fg: P.light, icon: BadgeCheck },
  };
  const s = styles[kind]; const Icon = s.icon;
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md"
      style={{ background: s.bg, border: `1px solid ${s.bd}`, color: s.fg, fontSize: "10.5px", fontWeight: 500, fontFamily: "'Work Sans',sans-serif" }}
    >
      <Icon style={{ width: 10, height: 10 }} />
      {kind}
    </span>
  );
}

function Tag({ label, active, onClick }: { label: string; active?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="px-2.5 py-1 rounded-lg transition-all duration-150"
      style={{
        fontSize: "11.5px", fontWeight: 500, fontFamily: "'Work Sans',sans-serif",
        background: active ? "rgba(34,116,165,0.22)" : "rgba(16,68,151,0.08)",
        border: `1px solid ${active ? "rgba(99,188,233,0.40)" : "rgba(34,116,165,0.16)"}`,
        color: active ? P.light : P.mid,
      }}
    >
      {label}
    </button>
  );
}

// ── Sections ──────────────────────────────────────────────────────────────
function FeaturedSignals({ activeTags, onOpenAI }: { activeTags: string[]; onOpenAI: () => void }) {
  const items = useMemo(() => {
    if (!activeTags.length) return FEATURED;
    return FEATURED.filter((f) => f.tags.some((t) => activeTags.includes(t)));
  }, [activeTags]);

  return (
    <section>
      <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <Flame style={{ width: 14, height: 14, color: P.light }} />
          <h2 style={{ fontFamily: "'Newsreader', Georgia, serif", color: P.white, letterSpacing: "-0.01em" }}>
            Featured Signals
          </h2>
          <span style={{ fontSize: "11px", color: P.faint, fontFamily: "'Work Sans',sans-serif" }}>
            Hybrid · AI synthesized
          </span>
        </div>
        <button
          onClick={onOpenAI}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all duration-200"
          style={{
            fontSize: "12px", fontWeight: 600, fontFamily: "'Work Sans',sans-serif",
            background: "rgba(34,116,165,0.20)",
            border: "1px solid rgba(34,116,165,0.36)",
            color: P.light,
            boxShadow: "0 0 16px rgba(34,116,165,0.20)",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 28px rgba(34,116,165,0.40)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 16px rgba(34,116,165,0.20)"; }}
        >
          <Sparkles style={{ width: 12, height: 12 }} className="animate-pulse" />
          AI Narrative Summary
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {items.map((f, i) => (
          <motion.div
            key={f.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.32 }}
          >
            <GlassCard
              hoverGlow
              className="p-5 h-full flex flex-col"
              style={{
                background: "linear-gradient(160deg, rgba(16,68,151,0.10), rgba(16,68,151,0.04))",
              }}
            >
              <div className="flex items-center gap-1.5 flex-wrap mb-3">
                {f.sources.map((s) => <SourceBadge key={s} kind={s} />)}
                <span className="ml-auto inline-flex items-center gap-1 px-2 py-0.5 rounded-md"
                  style={{ background: "rgba(99,188,233,0.08)", border: "1px solid rgba(99,188,233,0.22)", fontSize: "10.5px", color: P.light }}>
                  <TrendingUp style={{ width: 10, height: 10 }} />
                  {f.score}
                </span>
              </div>
              <h3 style={{ fontFamily: "'Newsreader', Georgia, serif", color: P.white, letterSpacing: "-0.01em", lineHeight: 1.25 }} className="mb-3">
                {f.title}
              </h3>
              <p style={{ fontSize: "13px", color: P.mid, lineHeight: 1.6, fontFamily: "'Work Sans',sans-serif" }}>
                {f.summary}
              </p>
              <div
                className="mt-4 p-3 rounded-xl"
                style={{ background: "rgba(34,116,165,0.10)", border: "1px solid rgba(34,116,165,0.22)" }}
              >
                <div style={{ fontSize: "10px", color: P.light, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600, marginBottom: 4 }}>
                  Key Takeaway
                </div>
                <div style={{ fontSize: "12.5px", color: P.white, lineHeight: 1.5 }}>
                  {f.takeaway}
                </div>
              </div>
              <div className="mt-auto pt-4 flex items-center gap-1.5 flex-wrap">
                {f.tags.map((t) => (
                  <span key={t} style={{
                    fontSize: "10.5px", color: P.mid,
                    padding: "2px 8px", borderRadius: 6,
                    background: "rgba(16,68,151,0.10)", border: "1px solid rgba(34,116,165,0.14)",
                  }}>{t}</span>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function CommunityPosts({
  posts, activeTags, liked, onToggleLike, bookmarked, onToggleBookmark, onOpen, composer,
}: {
  posts: Post[]; activeTags: string[];
  liked: Record<string, boolean>;
  onToggleLike: (id: string) => void;
  bookmarked: Record<string, boolean>;
  onToggleBookmark: (id: string) => void;
  onOpen: (p: Post) => void;
  composer?: React.ReactNode;
}) {
  const items = useMemo(() => {
    if (!activeTags.length) return posts;
    return posts.filter((p) => p.tags.some((t) => activeTags.includes(t)));
  }, [activeTags, posts]);

  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <Users style={{ width: 14, height: 14, color: P.light }} />
        <h2 style={{ fontFamily: "'Newsreader', Georgia, serif", color: P.white, letterSpacing: "-0.01em" }}>
          Community Posts
        </h2>
        <span style={{ fontSize: "11px", color: P.faint, fontFamily: "'Work Sans',sans-serif" }}>
          {items.length} insights
        </span>
      </div>

      {composer}

      <div className="grid grid-cols-1 gap-3">
        {items.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04, duration: 0.28 }}
          >
            <GlassCard
              className="p-4 h-full flex flex-col cursor-pointer"
              hoverGlow
              onClick={() => onOpen(p)}
            >
              <div className="flex items-center gap-2.5 mb-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${P.deep}, ${P.primary})`, border: "1px solid rgba(99,188,233,0.22)" }}
                >
                  <span style={{ fontSize: "11px", color: P.light, fontWeight: 600 }}>
                    {p.user.slice(0, 2).toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <div style={{ fontSize: "13px", color: P.white, fontWeight: 600, fontFamily: "'Work Sans',sans-serif" }}>
                    {p.user}
                  </div>
                  <div style={{ fontSize: "11px", color: P.dim, fontFamily: "'Work Sans',sans-serif" }}>
                    {p.handle} · {p.role}
                  </div>
                </div>
                <span style={{ fontSize: "10.5px", color: P.faint, fontFamily: "'Work Sans',sans-serif" }}>
                  {p.time}
                </span>
              </div>

              <p style={{ fontSize: "13px", color: P.mid, lineHeight: 1.55, fontFamily: "'Work Sans',sans-serif" }}>
                {p.text}
              </p>

              <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                {p.tags.map((t) => (
                  <span key={t} style={{
                    fontSize: "10.5px", color: P.light,
                    padding: "2px 8px", borderRadius: 6,
                    background: "rgba(34,116,165,0.10)", border: "1px solid rgba(34,116,165,0.22)",
                  }}>{t}</span>
                ))}
              </div>

              <div className="mt-3 pt-3 flex items-center justify-between" style={{ borderTop: "1px solid rgba(34,116,165,0.12)" }}>
                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => { e.stopPropagation(); onToggleLike(p.id); }}
                    className="inline-flex items-center gap-1 transition-all duration-150"
                    style={{
                      fontSize: "11.5px",
                      color: liked[p.id] ? P.light : P.dim,
                      fontFamily: "'Work Sans',sans-serif",
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = P.light; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = liked[p.id] ? P.light : P.dim; }}
                  >
                    <Heart
                      style={{
                        width: 12, height: 12,
                        fill: liked[p.id] ? P.light : "transparent",
                        transition: "fill 0.15s",
                      }}
                    />
                    {p.likes + (liked[p.id] ? 1 : 0)}
                  </button>
                  <span className="inline-flex items-center gap-1" style={{ fontSize: "11.5px", color: P.dim }}>
                    <MessageSquare style={{ width: 12, height: 12 }} /> {p.replies}
                  </span>
                  <button
                    onClick={(e) => { e.stopPropagation(); onToggleBookmark(p.id); }}
                    className="inline-flex items-center gap-1 transition-all duration-150"
                    style={{
                      fontSize: "11.5px",
                      color: bookmarked[p.id] ? P.light : P.dim,
                      fontFamily: "'Work Sans',sans-serif",
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = P.light; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = bookmarked[p.id] ? P.light : P.dim; }}
                    title={bookmarked[p.id] ? "Remove bookmark" : "Bookmark"}
                  >
                    <Bookmark
                      style={{
                        width: 12, height: 12,
                        fill: bookmarked[p.id] ? P.light : "transparent",
                        transition: "fill 0.15s",
                      }}
                    />
                  </button>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); onOpen(p); }}
                  className="inline-flex items-center gap-1 transition-colors duration-150"
                  style={{ fontSize: "11.5px", color: P.light, fontFamily: "'Work Sans',sans-serif", fontWeight: 500 }}
                >
                  View full discussion
                  <ArrowUpRight style={{ width: 11, height: 11 }} />
                </button>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function PostComposer({ onPost }: { onPost: (text: string, tags: string[]) => void }) {
  const [text, setText] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const TAG_OPTIONS = ["BTC", "ETH", "SOL", "AI", "DeFi", "Whale", "Macro", "Stablecoins"];

  const canPost = text.trim().length > 0;

  const toggle = (t: string) =>
    setTags((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));

  const submit = () => {
    if (!canPost) return;
    onPost(text.trim(), tags);
    setText("");
    setTags([]);
  };

  return (
    <GlassCard className="p-4 mb-4">
      <div className="flex gap-3">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: `linear-gradient(135deg, ${P.deep}, ${P.primary})`, border: "1px solid rgba(99,188,233,0.22)" }}
        >
          <span style={{ fontSize: "11px", color: P.light, fontWeight: 600 }}>PM</span>
        </div>
        <div className="flex-1 min-w-0">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Share an on-chain observation, narrative, or signal…"
            rows={2}
            className="w-full bg-transparent outline-none resize-none"
            style={{
              fontSize: "13px", color: P.white,
              caretColor: P.light,
              fontFamily: "'Work Sans',sans-serif",
              lineHeight: 1.55,
            }}
          />
          <div className="mt-2 flex items-center gap-1.5 flex-wrap">
            {TAG_OPTIONS.map((t) => (
              <button
                key={t}
                onClick={() => toggle(t)}
                className="px-2 py-0.5 rounded-md transition-all duration-150"
                style={{
                  fontSize: "10.5px", fontWeight: 500, fontFamily: "'Work Sans',sans-serif",
                  background: tags.includes(t) ? "rgba(34,116,165,0.22)" : "rgba(16,68,151,0.08)",
                  border: `1px solid ${tags.includes(t) ? "rgba(99,188,233,0.40)" : "rgba(34,116,165,0.16)"}`,
                  color: tags.includes(t) ? P.light : P.mid,
                }}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="mt-3 pt-3 flex items-center justify-between" style={{ borderTop: "1px solid rgba(34,116,165,0.12)" }}>
            <span style={{ fontSize: "10.5px", color: P.faint, fontFamily: "'Work Sans',sans-serif" }}>
              {text.length}/280
            </span>
            <button
              onClick={submit}
              disabled={!canPost}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all duration-150"
              style={{
                fontSize: "12px", fontWeight: 600, fontFamily: "'Work Sans',sans-serif",
                background: canPost ? "rgba(34,116,165,0.26)" : "rgba(34,116,165,0.08)",
                border: `1px solid ${canPost ? "rgba(99,188,233,0.40)" : "rgba(34,116,165,0.16)"}`,
                color: canPost ? P.light : P.dim,
                cursor: canPost ? "pointer" : "not-allowed",
                boxShadow: canPost ? "0 0 14px rgba(34,116,165,0.22)" : "none",
              }}
            >
              <Send style={{ width: 11, height: 11 }} />
              Post
            </button>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

function ExternalNews({
  activeTags, bookmarked, onToggleBookmark,
}: {
  activeTags: string[];
  bookmarked: Record<string, boolean>;
  onToggleBookmark: (id: string) => void;
}) {
  const items = useMemo(() => {
    if (!activeTags.length) return NEWS;
    return NEWS.filter((n) => n.tags.some((t) => activeTags.includes(t)));
  }, [activeTags]);

  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <Newspaper style={{ width: 14, height: 14, color: P.light }} />
        <h2 style={{ fontFamily: "'Newsreader', Georgia, serif", color: P.white, letterSpacing: "-0.01em" }}>
          External News
        </h2>
        <span style={{ fontSize: "11px", color: P.faint, fontFamily: "'Work Sans',sans-serif" }}>
          Verified sources
        </span>
      </div>

      <div className="space-y-3">
        {items.map((n, i) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04, duration: 0.28 }}
          >
            <GlassCard className="p-4 flex gap-4 items-start" hoverGlow>
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(16,68,151,0.18)", border: "1px solid rgba(34,116,165,0.26)" }}
              >
                <Newspaper style={{ width: 14, height: 14, color: P.light }} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1.5">
                  <span style={{
                    fontSize: "10.5px", color: P.light, fontWeight: 600,
                    padding: "1.5px 7px", borderRadius: 5,
                    background: "rgba(99,188,233,0.08)", border: "1px solid rgba(99,188,233,0.22)",
                    fontFamily: "'Work Sans',sans-serif",
                  }}>
                    {n.source}
                  </span>
                  <span className="inline-flex items-center gap-1" style={{ fontSize: "10.5px", color: P.faint }}>
                    <Clock style={{ width: 10, height: 10 }} /> {n.time}
                  </span>
                </div>
                <h3 style={{ fontFamily: "'Newsreader', Georgia, serif", color: P.white, letterSpacing: "-0.01em", lineHeight: 1.3 }}>
                  {n.headline}
                </h3>
                <p className="mt-1.5" style={{ fontSize: "12.5px", color: P.mid, lineHeight: 1.55, fontFamily: "'Work Sans',sans-serif" }}>
                  {n.summary}
                </p>
                <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
                  {n.tags.map((t) => (
                    <span key={t} style={{
                      fontSize: "10.5px", color: P.mid,
                      padding: "2px 7px", borderRadius: 6,
                      background: "rgba(16,68,151,0.10)", border: "1px solid rgba(34,116,165,0.14)",
                    }}>{t}</span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                <button
                  onClick={(e) => { e.stopPropagation(); onToggleBookmark(n.id); }}
                  className="transition-colors duration-150"
                  style={{ color: bookmarked[n.id] ? P.light : P.dim }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = P.light; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = bookmarked[n.id] ? P.light : P.dim; }}
                  title={bookmarked[n.id] ? "Remove bookmark" : "Bookmark"}
                >
                  <Bookmark style={{ width: 14, height: 14, fill: bookmarked[n.id] ? P.light : "transparent", transition: "fill 0.15s" }} />
                </button>
                <ExternalLink style={{ width: 14, height: 14, color: P.dim }} />
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function AISummaryModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[180] flex items-center justify-center p-4"
      style={{ background: "rgba(8,6,6,0.72)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8, scale: 0.98 }}
        transition={{ duration: 0.22 }}
        className="w-full max-w-[460px] rounded-[20px] overflow-hidden"
        style={{
          background: "linear-gradient(165deg, rgba(34,116,165,0.20), rgba(16,68,151,0.10))",
          border: "1px solid rgba(99,188,233,0.30)",
          boxShadow: "0 28px 72px rgba(0,0,0,0.75)",
        }}
      >
        <div className="flex items-center justify-end px-3 pt-3">
          <button onClick={onClose} style={{ color: P.dim }}>
            <XIcon style={{ width: 16, height: 16 }} />
          </button>
        </div>
      <div className="px-5 pb-5">
        <div className="flex items-center gap-2 mb-3">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: "rgba(99,188,233,0.14)", border: "1px solid rgba(99,188,233,0.30)" }}
          >
            <Sparkles style={{ width: 12, height: 12, color: P.light }} />
          </div>
          <div>
            <div style={{ fontSize: "13px", color: P.white, fontWeight: 600, fontFamily: "'Work Sans',sans-serif" }}>
              AI Narrative Summary
            </div>
            <div style={{ fontSize: "10.5px", color: P.dim, fontFamily: "'Work Sans',sans-serif" }}>
              Updated 4 min ago
            </div>
          </div>
        </div>

        <p style={{ fontSize: "12.5px", color: P.mid, lineHeight: 1.6, fontFamily: "'Work Sans',sans-serif" }}>
          Markets are processing two parallel narratives: a structural rotation
          into AI-adjacent infrastructure tokens, and continued whale accumulation
          in BTC against a backdrop of falling exchange supply. Macro tone has shifted
          marginally dovish following Fed minutes.
        </p>

        <div className="mt-4 space-y-2.5">
          {[
            { rank: 1, label: "AI Sector Rotation", weight: "Strong", color: P.light },
            { rank: 2, label: "BTC Whale Accumulation", weight: "Building", color: P.primary },
            { rank: 3, label: "Macro Liquidity Shift", weight: "Watch", color: P.deep },
          ].map((n) => (
            <div
              key={n.rank}
              className="flex items-center gap-3 p-2.5 rounded-xl"
              style={{ background: "rgba(16,68,151,0.10)", border: "1px solid rgba(34,116,165,0.16)" }}
            >
              <div
                className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(99,188,233,0.10)", border: `1px solid ${n.color}55` }}
              >
                <span style={{ fontSize: "11px", color: P.light, fontWeight: 600 }}>{n.rank}</span>
              </div>
              <div className="min-w-0 flex-1">
                <div style={{ fontSize: "12.5px", color: P.white, fontWeight: 500, fontFamily: "'Work Sans',sans-serif" }}>
                  {n.label}
                </div>
                <div style={{ fontSize: "10.5px", color: P.dim, fontFamily: "'Work Sans',sans-serif" }}>
                  Signal: {n.weight}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4" style={{ borderTop: "1px solid rgba(34,116,165,0.16)" }}>
          <div style={{ fontSize: "10px", color: P.faint, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>
            Synthesis sources
          </div>
          <div className="flex items-center gap-3" style={{ fontSize: "11px", color: P.mid }}>
            <span>· 184 community posts</span>
            <span>· 41 news items</span>
          </div>
        </div>
      </div>
      </motion.div>
    </div>
  );
}

function PostDetailModal({
  post, liked, bookmarked, onToggleLike, onToggleBookmark, onClose,
}: {
  post: Post;
  liked: Record<string, boolean>;
  bookmarked: Record<string, boolean>;
  onToggleLike: (id: string) => void;
  onToggleBookmark: (id: string) => void;
  onClose: () => void;
}) {
  const [reply, setReply] = useState("");
  const [replies, setReplies] = useState<{ id: string; user: string; text: string; time: string }[]>([
    { id: "r1", user: "Vega", text: "Solid framing — the staking yield divergence is the cleanest signal here.", time: "1h" },
    { id: "r2", user: "0xFrame", text: "Agreed, but watch derivatives funding before sizing in.", time: "32m" },
  ]);

  const submitReply = () => {
    if (!reply.trim()) return;
    setReplies((prev) => [...prev, { id: `r-${Date.now()}`, user: "You", text: reply.trim(), time: "now" }]);
    setReply("");
  };

  return (
    <div
      className="fixed inset-0 z-[180] flex items-center justify-center p-4"
      style={{ background: "rgba(8,6,6,0.72)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.22 }}
        className="w-full max-w-[640px] max-h-[88vh] rounded-[20px] overflow-hidden flex flex-col"
        style={{
          background: "rgba(12,9,9,0.99)",
          border: "1px solid rgba(34,116,165,0.30)",
          boxShadow: "0 28px 72px rgba(0,0,0,0.75)",
        }}
      >
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid rgba(34,116,165,0.14)" }}>
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: `linear-gradient(135deg, ${P.deep}, ${P.primary})`, border: "1px solid rgba(99,188,233,0.22)" }}
            >
              <span style={{ fontSize: "11px", color: P.light, fontWeight: 600 }}>
                {post.user.slice(0, 2).toUpperCase()}
              </span>
            </div>
            <div>
              <div style={{ fontSize: "13.5px", color: P.white, fontWeight: 600, fontFamily: "'Work Sans',sans-serif" }}>
                {post.user}
              </div>
              <div style={{ fontSize: "11px", color: P.dim, fontFamily: "'Work Sans',sans-serif" }}>
                {post.handle} · {post.role} · {post.time}
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{ color: P.dim }}>
            <XIcon style={{ width: 16, height: 16 }} />
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-4 flex-1">
          <p style={{ fontSize: "14px", color: P.white, lineHeight: 1.65, fontFamily: "'Work Sans',sans-serif" }}>
            {post.text}
          </p>
          <div className="mt-3 flex items-center gap-1.5 flex-wrap">
            {post.tags.map((t) => (
              <span key={t} style={{
                fontSize: "10.5px", color: P.light,
                padding: "2px 8px", borderRadius: 6,
                background: "rgba(34,116,165,0.10)", border: "1px solid rgba(34,116,165,0.22)",
              }}>{t}</span>
            ))}
          </div>

          <div className="mt-5 flex items-center gap-4 pt-3" style={{ borderTop: "1px solid rgba(34,116,165,0.12)" }}>
            <button
              onClick={() => onToggleLike(post.id)}
              className="inline-flex items-center gap-1.5"
              style={{ fontSize: "12px", color: liked[post.id] ? P.light : P.mid, fontFamily: "'Work Sans',sans-serif" }}
            >
              <Heart style={{ width: 13, height: 13, fill: liked[post.id] ? P.light : "transparent" }} />
              {post.likes + (liked[post.id] ? 1 : 0)} likes
            </button>
            <span className="inline-flex items-center gap-1.5" style={{ fontSize: "12px", color: P.mid }}>
              <MessageSquare style={{ width: 13, height: 13 }} /> {replies.length} replies
            </span>
            <button
              onClick={() => onToggleBookmark(post.id)}
              className="inline-flex items-center gap-1.5 ml-auto"
              style={{ fontSize: "12px", color: bookmarked[post.id] ? P.light : P.mid, fontFamily: "'Work Sans',sans-serif" }}
            >
              <Bookmark style={{ width: 13, height: 13, fill: bookmarked[post.id] ? P.light : "transparent" }} />
              {bookmarked[post.id] ? "Saved" : "Save"}
            </button>
          </div>

          <div className="mt-5">
            <div style={{ fontSize: "10.5px", color: P.faint, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600, marginBottom: 10, fontFamily: "'Work Sans',sans-serif" }}>
              Discussion
            </div>
            <div className="space-y-3">
              {replies.map((r) => (
                <div key={r.id} className="flex gap-2.5">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(16,68,151,0.20)", border: "1px solid rgba(34,116,165,0.22)" }}
                  >
                    <span style={{ fontSize: "10px", color: P.light, fontWeight: 600 }}>
                      {r.user.slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span style={{ fontSize: "12px", color: P.white, fontWeight: 600, fontFamily: "'Work Sans',sans-serif" }}>{r.user}</span>
                      <span style={{ fontSize: "10.5px", color: P.faint }}>{r.time}</span>
                    </div>
                    <p style={{ fontSize: "12.5px", color: P.mid, lineHeight: 1.55, marginTop: 2, fontFamily: "'Work Sans',sans-serif" }}>
                      {r.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="px-5 py-3 flex items-center gap-2" style={{ borderTop: "1px solid rgba(34,116,165,0.14)" }}>
          <input
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") submitReply(); }}
            placeholder="Reply to this thread…"
            className="flex-1 bg-transparent outline-none px-3 py-2 rounded-lg"
            style={{
              fontSize: "13px", color: P.white,
              caretColor: P.light, fontFamily: "'Work Sans',sans-serif",
              background: "rgba(16,68,151,0.10)", border: "1px solid rgba(34,116,165,0.18)",
            }}
          />
          <button
            onClick={submitReply}
            disabled={!reply.trim()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg"
            style={{
              fontSize: "12px", fontWeight: 600, fontFamily: "'Work Sans',sans-serif",
              background: reply.trim() ? "rgba(34,116,165,0.26)" : "rgba(34,116,165,0.08)",
              border: `1px solid ${reply.trim() ? "rgba(99,188,233,0.40)" : "rgba(34,116,165,0.16)"}`,
              color: reply.trim() ? P.light : P.dim,
            }}
          >
            <Send style={{ width: 11, height: 11 }} />
            Send
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────
export function Community() {
  const { activeSubTab } = useDashboard();
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [sort, setSort] = useState<"trending" | "latest">("trending");
  const [posts, setPosts] = useState<Post[]>(POSTS);
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [bookmarked, setBookmarked] = useState<Record<string, boolean>>({});
  const [savedOnly, setSavedOnly] = useState(false);
  const [openPost, setOpenPost] = useState<Post | null>(null);
  const [aiOpen, setAiOpen] = useState(false);

  const view = activeSubTab || "All";

  const handlePost = (text: string, tags: string[]) => {
    const id = `u-${Date.now()}`;
    setPosts((prev) => [
      {
        id, user: "You", handle: "@you", role: "Member",
        text, tags: tags.length ? tags : ["General"],
        likes: 0, replies: 0, time: "now",
      },
      ...prev,
    ]);
  };

  const toggleLike = (id: string) =>
    setLiked((prev) => ({ ...prev, [id]: !prev[id] }));

  const toggleBookmark = (id: string) =>
    setBookmarked((prev) => {
      const next = { ...prev };
      if (next[id]) delete next[id]; else next[id] = true;
      return next;
    });

  const visiblePosts = useMemo(
    () => savedOnly ? posts.filter((p) => bookmarked[p.id]) : posts,
    [posts, bookmarked, savedOnly]
  );
  const visibleNewsTags = activeTags;
  const savedCount = Object.keys(bookmarked).length;

  const composer = <PostComposer onPost={handlePost} />;

  const toggleTag = (t: string) =>
    setActiveTags((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));

  return (
    <div className="space-y-8">
      {/* ── Top header ───────────────────────────────────────────────── */}
      <div>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 style={{ fontFamily: "'Newsreader', Georgia, serif", color: P.white, letterSpacing: "-0.02em", lineHeight: 1.1 }}>
              Community Insights
            </h1>
            <p className="mt-1.5" style={{ fontSize: "13.5px", color: P.mid, fontFamily: "'Work Sans',sans-serif" }}>
              Real-time narratives from community and external sources
            </p>
          </div>

          <div
            className="flex items-center gap-0.5 p-1 rounded-xl"
            style={{ background: "rgba(16,68,151,0.10)", border: "1px solid rgba(34,116,165,0.16)" }}
          >
            {(["trending", "latest"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSort(s)}
                className="px-3 py-1.5 rounded-lg transition-all duration-150"
                style={{
                  fontSize: "11.5px", fontWeight: 500,
                  fontFamily: "'Work Sans',sans-serif",
                  background: sort === s ? "rgba(34,116,165,0.26)" : "transparent",
                  color: sort === s ? P.light : P.dim,
                  border: sort === s ? "1px solid rgba(34,116,165,0.34)" : "1px solid transparent",
                  textTransform: "capitalize",
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Filter chips */}
        <div className="mt-5 flex items-center gap-1.5 flex-wrap">
          <span style={{ fontSize: "10.5px", color: P.faint, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600, marginRight: 4 }}>
            Filter
          </span>
          {FILTER_TAGS.map((t) => (
            <Tag key={t} label={t} active={activeTags.includes(t)} onClick={() => toggleTag(t)} />
          ))}
          {activeTags.length > 0 && (
            <button
              onClick={() => setActiveTags([])}
              style={{ fontSize: "11px", color: P.light, fontFamily: "'Work Sans',sans-serif", marginLeft: 4 }}
            >
              Clear
            </button>
          )}

          <button
            onClick={() => setSavedOnly((v) => !v)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all duration-150 ml-auto"
            style={{
              fontSize: "11.5px", fontWeight: 500, fontFamily: "'Work Sans',sans-serif",
              background: savedOnly ? "rgba(34,116,165,0.22)" : "rgba(16,68,151,0.08)",
              border: `1px solid ${savedOnly ? "rgba(99,188,233,0.40)" : "rgba(34,116,165,0.16)"}`,
              color: savedOnly ? P.light : P.mid,
            }}
          >
            <Bookmark style={{ width: 11, height: 11, fill: savedOnly ? P.light : "transparent" }} />
            Saved {savedCount > 0 && `· ${savedCount}`}
          </button>
        </div>
      </div>

      {/* ── Body: Featured full-width, Posts + News side-by-side ─────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.25 }}
          className="space-y-10"
        >
          <FeaturedSignals activeTags={activeTags} onOpenAI={() => setAiOpen(true)} />

          {view === "All" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CommunityPosts posts={visiblePosts} activeTags={activeTags} liked={liked} onToggleLike={toggleLike} bookmarked={bookmarked} onToggleBookmark={toggleBookmark} onOpen={setOpenPost} composer={composer} />
              <ExternalNews activeTags={visibleNewsTags} bookmarked={bookmarked} onToggleBookmark={toggleBookmark} />
            </div>
          )}
          {view === "Community Posts" && (
            <CommunityPosts posts={visiblePosts} activeTags={activeTags} liked={liked} onToggleLike={toggleLike} bookmarked={bookmarked} onToggleBookmark={toggleBookmark} onOpen={setOpenPost} composer={composer} />
          )}
          {view === "External News" && (
            <ExternalNews activeTags={visibleNewsTags} bookmarked={bookmarked} onToggleBookmark={toggleBookmark} />
          )}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {aiOpen && <AISummaryModal onClose={() => setAiOpen(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {openPost && (
          <PostDetailModal
            post={openPost}
            liked={liked}
            bookmarked={bookmarked}
            onToggleLike={toggleLike}
            onToggleBookmark={toggleBookmark}
            onClose={() => setOpenPost(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
