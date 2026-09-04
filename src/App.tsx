import { useState } from "react";

// ── Icons ──────────────────────────────────────────────────────────────────
function LeafIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  );
}

function CheckCircleIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function AlertTriangleIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}

function AlertCircleIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function CameraIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
      <circle cx="12" cy="13" r="3" />
    </svg>
  );
}

function ArrowLeftIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  );
}

function ExternalLinkIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function ShieldCheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

// ── Types ──────────────────────────────────────────────────────────────────
type VerdictType = "verified" | "vague" | "redflag";

interface ResultData {
  claim: string;
  verdict: VerdictType;
  confidence: number;
  explanation: string;
  realClaimExample: string;
  realClaimLabel: string;
  sources: { label: string; url: string }[];
}

// ── Mock analysis engine ───────────────────────────────────────────────────
function analyzeClaim(claim: string): ResultData {
  const lower = claim.toLowerCase();

  if (
    lower.includes("usda organic") ||
    lower.includes("certified b corp") ||
    lower.includes("energy star") ||
    lower.includes("fair trade certified") ||
    lower.includes("rainforest alliance")
  ) {
    return {
      claim,
      verdict: "verified",
      confidence: 91,
      explanation:
        "This claim references a recognized third-party certification body with publicly auditable standards. USDA Organic certification requires producers to meet strict USDA National Organic Program criteria and undergo annual inspections by accredited certifiers. Consumers can independently verify certification status through official registries.",
      realClaimExample:
        '"Certified USDA Organic — cert #ORG-2024-8821. Audited annually by Oregon Tilth Certified Organic. Full ingredient sourcing report available at [brand].com/transparency."',
      realClaimLabel: "What verified looks like",
      sources: [
        { label: "USDA NOP Certified Operations Database", url: "#" },
        { label: "FTC Green Guides — Certifications & Seals", url: "#" },
        { label: "Ecolabel Index — USDA Organic", url: "#" },
      ],
    };
  }

  if (
    lower.includes("carbon neutral") ||
    lower.includes("net zero") ||
    lower.includes("climate positive") ||
    lower.includes("offset")
  ) {
    return {
      claim,
      verdict: "vague",
      confidence: 62,
      explanation:
        "\"Carbon neutral\" and \"net zero\" claims are frequently used without independent verification or a disclosed methodology. Unless the brand names the specific carbon accounting standard, the certification body, and whether offsets or actual reductions drive the claim, consumers have no reliable way to verify it. Offset-based claims in particular are contested by emissions researchers.",
      realClaimExample:
        '"Scope 1 & 2 emissions reduced 47% since 2019. Remaining 12,400 tCO₂e offset via Gold Standard-verified reforestation projects in Uganda. Science-based target validated by SBTi. Full methodology: [brand].com/climate-report-2024."',
      realClaimLabel: "What a verifiable carbon claim looks like",
      sources: [
        { label: "FTC Green Guides — Environmental Claims (16 CFR §260)", url: "#" },
        { label: "Science Based Targets initiative (SBTi)", url: "#" },
        { label: "Carbon Neutral Claims — UK CMA Guidance 2024", url: "#" },
      ],
    };
  }

  if (
    lower.includes("eco-friendly") ||
    lower.includes("natural") ||
    lower.includes("green") ||
    lower.includes("sustainable") ||
    lower.includes("planet-friendly") ||
    lower.includes("environmentally friendly")
  ) {
    return {
      claim,
      verdict: "redflag",
      confidence: 88,
      explanation:
        "Terms like \"eco-friendly,\" \"natural,\" and \"sustainable\" are unregulated marketing language in most jurisdictions. No certification body, government agency, or independent standard governs their use — any brand can apply them to any product. The FTC's Green Guides explicitly flag these terms as likely to mislead consumers without specific, substantiated supporting evidence.",
      realClaimExample:
        '"Made with 94% post-consumer recycled paperboard. Certified by How2Recycle (label #HRC-4492). Printed with soy-based inks. Packaging recyclable in curbside programs reaching 78% of U.S. households."',
      realClaimLabel: "Specific, substantiated packaging claim",
      sources: [
        { label: "FTC Green Guides — Unqualified General Claims", url: "#" },
        { label: "Greenwashing Cases: EU Omnibus Directive 2024", url: "#" },
        { label: "Terrachoice \"Sins of Greenwashing\" Framework", url: "#" },
      ],
    };
  }

  return {
    claim,
    verdict: "vague",
    confidence: 55,
    explanation:
      "This claim could not be matched to a known certification standard or registry. It may be genuine but lacks the specificity needed for independent verification. Look for a named certifying body, an audit date, and a publicly accessible certificate number to substantiate environmental claims of this type.",
    realClaimExample:
      '"Packaging contains 80% post-consumer recycled content, certified by SCS Global Services (cert #SCS-COC-005678). Chain of custody documentation available on request."',
    realClaimLabel: "What a specific, checkable claim looks like",
    sources: [
      { label: "FTC Green Guides — Environmental Marketing Claims", url: "#" },
      { label: "ISO 14021: Environmental Labels & Declarations", url: "#" },
      { label: "Green Claims Code — UK Competition & Markets Authority", url: "#" },
    ],
  };
}

// ── Shared components ──────────────────────────────────────────────────────
function Header({ onLogoClick }: { onLogoClick?: () => void }) {
  return (
    <header className="w-full border-b border-[#E5E7EB] bg-white/80 backdrop-blur-sm sticky top-0 z-20">
      <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-3">
        <button
          onClick={onLogoClick}
          className="flex items-center gap-2 group"
        >
          <div className="w-8 h-8 rounded-lg bg-[#2D6A4F] flex items-center justify-center group-hover:bg-[#40916C] transition-colors">
            <LeafIcon className="w-4 h-4 text-white" />
          </div>
          <span style={{ fontFamily: "Manrope, sans-serif" }} className="text-[17px] font-800 tracking-tight text-[#1a1a1a]">
            EcoTruth
          </span>
        </button>
        <div className="w-px h-5 bg-[#E5E7EB] mx-1" />
        <span className="text-sm text-[#6B7280] hidden sm:block">Verify sustainability claims instantly</span>
      </div>
    </header>
  );
}

// ── Verdict Badge ──────────────────────────────────────────────────────────
const VERDICT_CONFIG = {
  verified: {
    bg: "bg-[#DCFCE7]",
    text: "text-[#16A34A]",
    border: "border-[#86EFAC]",
    glow: "shadow-[0_0_0_4px_rgba(22,163,74,0.12)]",
    icon: <CheckCircleIcon className="w-7 h-7" />,
    label: "VERIFIED",
    sublabel: "Backed by certified standards",
    accent: "#16A34A",
    barColor: "bg-[#16A34A]",
  },
  vague: {
    bg: "bg-[#FEF3C7]",
    text: "text-[#92400E]",
    border: "border-[#FCD34D]",
    glow: "shadow-[0_0_0_4px_rgba(245,158,11,0.12)]",
    icon: <AlertTriangleIcon className="w-7 h-7" />,
    label: "VAGUE",
    sublabel: "Cannot be independently verified",
    accent: "#F59E0B",
    barColor: "bg-[#F59E0B]",
  },
  redflag: {
    bg: "bg-[#FEE2E2]",
    text: "text-[#991B1B]",
    border: "border-[#FCA5A5]",
    glow: "shadow-[0_0_0_4px_rgba(220,38,38,0.12)]",
    icon: <AlertCircleIcon className="w-7 h-7" />,
    label: "RED FLAG",
    sublabel: "Unregulated marketing language",
    accent: "#DC2626",
    barColor: "bg-[#DC2626]",
  },
};

function VerdictBadge({ verdict }: { verdict: VerdictType }) {
  const cfg = VERDICT_CONFIG[verdict];
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`inline-flex items-center gap-3 px-6 py-3.5 rounded-2xl border-2 ${cfg.bg} ${cfg.text} ${cfg.border} ${cfg.glow}`}
      >
        {cfg.icon}
        <span
          style={{ fontFamily: "Manrope, sans-serif" }}
          className="text-[17px] font-800 tracking-[0.12em] uppercase"
        >
          {cfg.label}
        </span>
      </div>
      <span className="text-xs text-[#9CA3AF] font-500">{cfg.sublabel}</span>
    </div>
  );
}

function ConfidenceBar({ score, verdict }: { score: number; verdict: VerdictType }) {
  const cfg = VERDICT_CONFIG[verdict];
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2.5">
        <span className="text-xs font-600 uppercase tracking-widest text-[#9CA3AF]">
          Confidence score
        </span>
        <span
          style={{ fontFamily: "Manrope, sans-serif", color: cfg.accent }}
          className="text-sm font-800"
        >
          {score}%
        </span>
      </div>
      <div className="w-full h-2 bg-[#E5E7EB] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${cfg.barColor}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <div className="flex justify-between mt-1.5">
        <span className="text-[10px] text-[#C4C9D4]">0%</span>
        <span className="text-[10px] text-[#C4C9D4]">100%</span>
      </div>
    </div>
  );
}

// ── Results Screen ─────────────────────────────────────────────────────────
function ResultsScreen({
  result,
  onReset,
}: {
  result: ResultData;
  onReset: () => void;
}) {
  const cfg = VERDICT_CONFIG[result.verdict];
  const verdictBorderColor =
    result.verdict === "verified"
      ? "border-l-[#16A34A]"
      : result.verdict === "vague"
      ? "border-l-[#F59E0B]"
      : "border-l-[#DC2626]";

  return (
    <main className="min-h-[calc(100vh-64px)] px-4 py-10">
      <div className="max-w-2xl mx-auto">

        {/* Back button */}
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 text-sm text-[#9CA3AF] hover:text-[#1a1a1a] mb-10 transition-colors group"
        >
          <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          New claim
        </button>

        {/* ── Verdict + confidence ─────────────────────────── */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-[0_2px_20px_rgba(0,0,0,0.06)] overflow-hidden mb-4">
          {/* Colored top stripe keyed to verdict */}
          <div
            className="h-1 w-full"
            style={{ background: cfg.accent }}
          />
          <div className="px-7 py-8">
            <div className="flex flex-col items-center gap-6">
              <VerdictBadge verdict={result.verdict} />
              <div className="w-full max-w-sm">
                <ConfidenceBar score={result.confidence} verdict={result.verdict} />
              </div>
            </div>
          </div>
        </div>

        {/* ── Claim text ───────────────────────────────────── */}
        <div
          className={`bg-white rounded-2xl border border-[#E5E7EB] border-l-4 ${verdictBorderColor} shadow-[0_2px_16px_rgba(0,0,0,0.05)] px-6 py-5 mb-4`}
        >
          <span className="text-[10px] font-700 uppercase tracking-widest text-[#9CA3AF] block mb-2">
            Claim reviewed
          </span>
          <p className="text-[15px] text-[#1a1a1a] font-500 leading-relaxed italic">
            "{result.claim}"
          </p>
        </div>

        {/* ── Explanation card ─────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-[0_2px_16px_rgba(0,0,0,0.05)] px-6 py-6 mb-4">
          <div className="flex items-center gap-2 mb-4">
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
              style={{ background: cfg.accent + "22" }}
            >
              {result.verdict === "verified" ? (
                <CheckCircleIcon className="w-3 h-3" style={{ color: cfg.accent } as React.CSSProperties} />
              ) : result.verdict === "vague" ? (
                <AlertTriangleIcon className="w-3 h-3" style={{ color: cfg.accent } as React.CSSProperties} />
              ) : (
                <AlertCircleIcon className="w-3 h-3" style={{ color: cfg.accent } as React.CSSProperties} />
              )}
            </div>
            <span className="text-[10px] font-700 uppercase tracking-widest text-[#9CA3AF]">
              Analysis
            </span>
          </div>
          <p className="text-[15px] text-[#374151] leading-[1.8]">{result.explanation}</p>
        </div>

        {/* ── Real claim comparison ─────────────────────────── */}
        <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-2xl px-6 py-6 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheckIcon className="w-4 h-4 text-[#16A34A]" />
            <span className="text-[10px] font-700 uppercase tracking-widest text-[#16A34A]">
              {result.realClaimLabel}
            </span>
          </div>
          <p className="text-[14px] text-[#166534] leading-[1.8] italic">
            {result.realClaimExample}
          </p>
        </div>

        {/* ── Sources ──────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-[0_2px_16px_rgba(0,0,0,0.05)] px-6 py-6 mb-8">
          <span className="text-[10px] font-700 uppercase tracking-widest text-[#9CA3AF] block mb-4">
            Sources & references
          </span>
          <ul className="space-y-3">
            {result.sources.map((s, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <ExternalLinkIcon className="w-3.5 h-3.5 text-[#C4C9D4] mt-0.5 shrink-0" />
                <a
                  href={s.url}
                  className="text-[13px] text-[#2D6A4F] hover:text-[#1B4332] hover:underline leading-snug transition-colors"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* ── CTA ─────────────────────────────────────────── */}
        <div className="flex justify-center pb-4">
          <button
            onClick={onReset}
            className="inline-flex items-center gap-2 border-2 border-[#2D6A4F] text-[#2D6A4F] hover:bg-[#2D6A4F] hover:text-white text-[15px] font-600 py-3.5 px-10 rounded-xl transition-all duration-150 active:scale-[0.98]"
            style={{ fontFamily: "Manrope, sans-serif" }}
          >
            Check Another Claim
          </button>
        </div>

      </div>
    </main>
  );
}

// ── Home Screen ────────────────────────────────────────────────────────────
const EXAMPLE_CHIPS = [
  "eco-friendly packaging",
  "USDA Organic",
  "carbon neutral by 2025",
];

function HomeScreen({ onSubmit }: { onSubmit: (claim: string) => void }) {
  const [claim, setClaim] = useState("");

  function handleSubmit() {
    const trimmed = claim.trim();
    if (trimmed.length > 2) onSubmit(trimmed);
  }

  return (
    <main className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-[#2D6A4F]/10 text-[#2D6A4F] text-xs font-600 uppercase tracking-widest px-3 py-1.5 rounded-full mb-6">
            <LeafIcon className="w-3.5 h-3.5" />
            Greenwashing Detector
          </div>
          <h1
            style={{ fontFamily: "Manrope, sans-serif" }}
            className="text-4xl sm:text-5xl font-800 text-[#1a1a1a] tracking-tight leading-[1.1] mb-4"
          >
            Is that claim<br />
            <span className="text-[#2D6A4F]">actually true?</span>
          </h1>
          <p className="text-[#6B7280] text-lg leading-relaxed max-w-md mx-auto">
            Paste any sustainability or environmental claim. We'll tell you if it's certified, vague, or a red flag.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] border border-[#E5E7EB] p-6 mb-4">
          <label className="block text-xs font-600 uppercase tracking-widest text-[#9CA3AF] mb-3">
            Product claim or label text
          </label>
          <textarea
            value={claim}
            onChange={(e) => setClaim(e.target.value)}
            placeholder='e.g. "100% eco-friendly packaging made from sustainable materials"'
            rows={4}
            className="w-full resize-none text-[15px] text-[#1a1a1a] placeholder:text-[#C4C9D4] bg-[#F8F7F2] rounded-xl border border-[#E5E7EB] px-4 py-3 outline-none focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/10 transition-all duration-150"
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSubmit();
            }}
          />
          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleSubmit}
              disabled={claim.trim().length < 3}
              className="flex-1 bg-[#2D6A4F] hover:bg-[#40916C] disabled:opacity-40 disabled:cursor-not-allowed text-white text-[15px] font-600 py-3.5 px-6 rounded-xl transition-all duration-150 active:scale-[0.98]"
              style={{ fontFamily: "Manrope, sans-serif" }}
            >
              Check This Claim
            </button>
            <button className="flex items-center justify-center gap-2 text-[#6B7280] hover:text-[#1a1a1a] hover:bg-[#F8F7F2] border border-[#E5E7EB] text-[14px] font-500 py-3.5 px-5 rounded-xl transition-all duration-150">
              <CameraIcon className="w-4 h-4" />
              <span>Upload Label Photo</span>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs text-[#C4C9D4] mr-1">Try an example:</span>
          {EXAMPLE_CHIPS.map((chip) => (
            <button
              key={chip}
              onClick={() => setClaim(chip)}
              className="text-xs text-[#2D6A4F] bg-[#2D6A4F]/8 hover:bg-[#2D6A4F]/15 border border-[#2D6A4F]/20 px-3 py-1.5 rounded-full font-500 transition-all duration-150"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

    </main>
  );
}

// ── Loading Screen ─────────────────────────────────────────────────────────
function LoadingScreen() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center gap-5">
      <div className="w-14 h-14 rounded-2xl bg-[#2D6A4F]/10 flex items-center justify-center">
        <LeafIcon className="w-7 h-7 text-[#2D6A4F] animate-pulse" />
      </div>
      <div className="text-center">
        <p style={{ fontFamily: "Manrope, sans-serif" }} className="text-[17px] font-700 text-[#1a1a1a] mb-1">
          Analyzing claim…
        </p>
        <p className="text-sm text-[#9CA3AF]">Cross-referencing certifications and greenwashing databases</p>
      </div>
      <div className="w-52 h-1.5 bg-[#E5E7EB] rounded-full overflow-hidden">
        <div className="h-full bg-[#2D6A4F] rounded-full animate-[loading_1.4s_ease-in-out_forwards]" />
      </div>
    </div>
  );
}

// ── App ────────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState<"home" | "loading" | "results">("home");
  const [result, setResult] = useState<ResultData | null>(null);

  function handleSubmit(claim: string) {
    setScreen("loading");
    setTimeout(() => {
      setResult(analyzeClaim(claim));
      setScreen("results");
    }, 1400);
  }

  function handleReset() {
    setResult(null);
    setScreen("home");
  }

  return (
    <div className="min-h-full bg-[#F8F7F2]">
      <Header onLogoClick={handleReset} />
      {screen === "home" && <HomeScreen onSubmit={handleSubmit} />}
      {screen === "loading" && <LoadingScreen />}
      {screen === "results" && result && (
        <ResultsScreen result={result} onReset={handleReset} />
      )}
      <style>{`
        @keyframes loading {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .font-800 { font-weight: 800; }
        .font-700 { font-weight: 700; }
        .font-600 { font-weight: 600; }
        .font-500 { font-weight: 500; }
      `}</style>
    </div>
  );
}
