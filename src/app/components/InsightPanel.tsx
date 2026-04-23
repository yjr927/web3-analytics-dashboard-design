import { AnimatePresence, motion } from "motion/react";
import {
  Sparkles, X, Activity, Zap, MessageSquare,
  TrendingUp, TrendingDown, Info, ChevronRight,
  ThumbsUp, MessageCircle,
} from "lucide-react";
import { useNavigate } from "react-router";

const P = {
  primary: "#2274a5", light: "#63bce9", deep: "#104497",
  white: "#f1f2f2",
  dim: "rgba(241,242,242,0.38)", mid: "rgba(241,242,242,0.60)",
};

export type InsightData = {
  title: string;
  systemInsight: string;
  keySignals: string[];
  explanation: string;
  expertInsight: string;
  expertName: string;
  expertRole: string;
  expertInitials: string;
  communityTop: { handle: string; text: string; likes: number; replies: number };
  discussion: { handle: string; time: string; text: string; up: boolean }[];
};

export function InsightPanel({ id, data, onClose }: { id: string | null; data: InsightData | null; onClose: () => void }) {
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {id && data && (
        <>
          {/* Semi-transparent backdrop — dashboard visible behind */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50"
            style={{ background: "rgba(15,10,10,0.45)", backdropFilter: "blur(4px)" }}
          />
          {/* Slide-in panel */}
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 220 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[440px] z-50 overflow-y-auto"
            style={{
              background: "rgba(15,10,10,0.97)",
              backdropFilter: "blur(30px)",
              WebkitBackdropFilter: "blur(30px)",
              borderLeft: "1px solid rgba(34,116,165,0.18)",
              boxShadow: "-8px 0 40px rgba(0,0,0,0.60), 0 0 60px rgba(99,188,233,0.05)",
              borderRadius: "20px 0 0 20px",
            }}
          >
            {/* Top glow */}
            <div className="absolute inset-0 pointer-events-none rounded-l-[20px]" style={{ background: "radial-gradient(ellipse 60% 28% at 85% 0%, rgba(99,188,233,0.07) 0%, transparent 55%)" }} />

            <div className="p-6 relative z-10">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg" style={{ background: "rgba(34,116,165,0.14)", border: "1px solid rgba(34,116,165,0.26)" }}>
                    <Sparkles style={{ width: 15, height: 15, color: P.light }} />
                  </div>
                  <div>
                    <h2 style={{ fontSize: "17px", fontWeight: 700, fontFamily: "'Newsreader',Georgia,serif", color: P.white }}>{data.title}</h2>
                    <p style={{ fontSize: "11px", color: P.dim }}>AI-powered analysis · Apr 2, 2026</p>
                  </div>
                </div>
                <button onClick={onClose} className="p-2 rounded-lg transition-colors" style={{ color: P.dim }}
                  onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(34,116,165,0.10)"; el.style.color = P.white; }}
                  onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = "transparent"; el.style.color = P.dim; }}>
                  <X style={{ width: 16, height: 16 }} />
                </button>
              </div>

              <div className="space-y-4">
                {/* SECTION 1 — System Insight */}
                <div className="p-4 rounded-xl" style={{ background: "rgba(34,116,165,0.08)", border: "1px solid rgba(34,116,165,0.22)" }}>
                  <div className="flex items-center gap-2 mb-2.5">
                    <Activity style={{ width: 12, height: 12, color: P.primary }} />
                    <span style={{ fontSize: "10px", fontWeight: 600, color: P.primary, textTransform: "uppercase", letterSpacing: "0.07em" }}>System Signal</span>
                  </div>
                  <p style={{ fontSize: "14px", color: "rgba(241,242,242,0.92)", lineHeight: 1.7, fontWeight: 500 }}>{data.systemInsight}</p>
                </div>

                {/* SECTION 2 — Key Signals */}
                <div className="p-4 rounded-xl" style={{ background: "rgba(34,116,165,0.05)", border: "1px solid rgba(34,116,165,0.16)" }}>
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp style={{ width: 12, height: 12, color: P.light }} />
                    <span style={{ fontSize: "10px", fontWeight: 600, color: P.light, textTransform: "uppercase", letterSpacing: "0.07em" }}>Key Signals</span>
                  </div>
                  <div className="space-y-2.5">
                    {data.keySignals.map((signal, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-[7px]" style={{ background: P.light }} />
                        <p style={{ fontSize: "13px", color: "rgba(241,242,242,0.78)", lineHeight: 1.65 }}>{signal}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SECTION 3 — Plain Explanation */}
                <div className="p-4 rounded-xl" style={{ background: "rgba(16,68,151,0.08)", border: "1px solid rgba(16,68,151,0.24)" }}>
                  <div className="flex items-center gap-2 mb-2.5">
                    <Info style={{ width: 12, height: 12, color: P.dim }} />
                    <span style={{ fontSize: "10px", fontWeight: 600, color: P.dim, textTransform: "uppercase", letterSpacing: "0.07em" }}>Plain Language</span>
                  </div>
                  <p style={{ fontSize: "13px", color: "rgba(241,242,242,0.68)", lineHeight: 1.75 }}>{data.explanation}</p>
                </div>

                {/* SECTION 4 — Expert Insight */}
                <div className="p-4 rounded-xl" style={{ background: "rgba(34,116,165,0.06)", border: "1px solid rgba(99,188,233,0.16)" }}>
                  <div className="flex items-center gap-2 mb-2.5">
                    <Zap style={{ width: 12, height: 12, color: P.light }} />
                    <span style={{ fontSize: "10px", fontWeight: 600, color: P.light, textTransform: "uppercase", letterSpacing: "0.07em" }}>Expert Insight</span>
                    <span className="ml-auto px-1.5 py-0.5 rounded-full" style={{ fontSize: "9px", fontWeight: 600, background: "rgba(34,116,165,0.18)", color: P.light, border: "1px solid rgba(34,116,165,0.28)" }}>✓ Verified</span>
                  </div>
                  <p style={{ fontSize: "14px", lineHeight: 1.7, fontStyle: "italic", color: "rgba(241,242,242,0.88)", fontFamily: "'Newsreader',Georgia,serif" }}>{data.expertInsight}</p>
                  <div className="flex items-center gap-2.5 mt-4 pt-3" style={{ borderTop: "1px solid rgba(34,116,165,0.12)" }}>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: `linear-gradient(135deg, ${P.deep}, ${P.primary})`, border: "1.5px solid rgba(99,188,233,0.28)" }}>
                      <span style={{ fontSize: "10px", fontWeight: 700, color: P.light }}>{data.expertInitials}</span>
                    </div>
                    <div>
                      <p style={{ fontSize: "12px", fontWeight: 600, color: P.white }}>{data.expertName}</p>
                      <p style={{ fontSize: "10px", color: P.dim }}>{data.expertRole}</p>
                    </div>
                  </div>
                </div>

                {/* SECTION 5 — Community Insight Preview */}
                <div className="p-4 rounded-xl" style={{ background: "rgba(16,68,151,0.06)", border: "1px solid rgba(34,116,165,0.10)" }}>
                  <div className="flex items-center gap-2 mb-3">
                    <MessageSquare style={{ width: 12, height: 12, color: P.dim }} />
                    <span style={{ fontSize: "10px", fontWeight: 600, color: P.dim, textTransform: "uppercase", letterSpacing: "0.07em" }}>Community Signals</span>
                  </div>
                  {/* Top comment */}
                  <div className="p-3 rounded-lg mb-3" style={{ background: "rgba(34,116,165,0.06)", border: "1px solid rgba(34,116,165,0.12)" }}>
                    <p style={{ fontSize: "10px", fontWeight: 500, color: P.dim, marginBottom: 4 }}>{data.communityTop.handle}</p>
                    <p style={{ fontSize: "12px", color: "rgba(241,242,242,0.80)", lineHeight: 1.65 }}>{data.communityTop.text}</p>
                    <div className="flex items-center gap-4 mt-2.5">
                      <span className="flex items-center gap-1" style={{ fontSize: "11px", color: P.dim }}>
                        <ThumbsUp style={{ width: 11, height: 11 }} />{data.communityTop.likes}
                      </span>
                      <span className="flex items-center gap-1" style={{ fontSize: "11px", color: P.dim }}>
                        <MessageCircle style={{ width: 11, height: 11 }} />{data.communityTop.replies}
                      </span>
                    </div>
                  </div>
                  {/* Other signals */}
                  <div className="space-y-3">
                    {data.discussion.map((d, i) => (
                      <div key={i} className="flex gap-2.5">
                        <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5" style={{ background: d.up ? "rgba(34,116,165,0.18)" : "rgba(16,68,151,0.25)", border: `1px solid ${d.up ? "rgba(34,116,165,0.32)" : "rgba(16,68,151,0.45)"}` }}>
                          {d.up ? <TrendingUp style={{ width: 11, height: 11, color: P.light }} /> : <TrendingDown style={{ width: 11, height: 11, color: P.mid }} />}
                        </div>
                        <div>
                          <p style={{ fontSize: "10px", fontWeight: 500, color: P.dim }}>{d.handle} · {d.time}</p>
                          <p style={{ fontSize: "12px", color: "rgba(241,242,242,0.75)", lineHeight: 1.65, marginTop: 2 }}>{d.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SECTION 6 — CTA */}
                <button
                  onClick={() => { onClose(); navigate("/notifications"); }}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl transition-all duration-200"
                  style={{
                    background: "rgba(34,116,165,0.16)",
                    border: "1px solid rgba(34,116,165,0.30)",
                    color: P.light,
                    fontSize: "13px",
                    fontWeight: 600,
                    fontFamily: "'Work Sans',sans-serif",
                    boxShadow: "0 0 20px rgba(34,116,165,0.15)",
                  }}
                  onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(34,116,165,0.26)"; el.style.boxShadow = "0 0 32px rgba(34,116,165,0.30)"; }}
                  onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(34,116,165,0.16)"; el.style.boxShadow = "0 0 20px rgba(34,116,165,0.15)"; }}
                >
                  View full insight
                  <ChevronRight style={{ width: 14, height: 14 }} />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Shared InsightBtn component
export function InsightBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all duration-200 relative flex-shrink-0 ml-2"
      style={{ background: "rgba(34,116,165,0.12)", border: "1px solid rgba(34,116,165,0.24)", color: "#63bce9", fontSize: "11px", fontWeight: 500 }}
      onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(34,116,165,0.22)"; el.style.boxShadow = "0 0 16px rgba(34,116,165,0.30)"; }}
      onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(34,116,165,0.12)"; el.style.boxShadow = "none"; }}
    >
      <Sparkles style={{ width: 12, height: 12 }} className="animate-pulse" />
      <span>Insight</span>
      <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-55" style={{ background: "#2274a5" }} />
        <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ background: "#2274a5" }} />
      </span>
    </button>
  );
}
