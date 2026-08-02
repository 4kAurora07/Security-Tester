import { useState, useRef, useEffect } from "react";
import {
  Shield, Globe, Code2, Smartphone, GitBranch, ArrowRight,
  CheckCircle2, AlertTriangle, XCircle, Bell, Search, User,
  LayoutDashboard, History, FileText, Settings, Download, Share2,
  ChevronDown, ChevronUp, RotateCcw, Eye, EyeOff, Loader2,
  Terminal, Lock, Zap, Activity, Upload, ChevronRight, Cpu,
  ScanLine, AlertOctagon, Package, Moon, Sun, Github, Mail,
  Camera, Key, Users, CreditCard, Trash2, Plus, Copy,
  ToggleLeft, ToggleRight, Clock, TrendingUp, ExternalLink, AlertCircle,
} from "lucide-react";
import { Navbar, Screen } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { ProductPage } from "./pages/ProductPage";
import { PricingPage } from "./pages/PricingPage";
import { DocsPage } from "./pages/DocsPage";
import { BlogPage } from "./pages/BlogPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";
import { authApi, validatePasswordStrength, User as AuthUser } from "./services/authApi";

// ─── Static data ──────────────────────────────────────────────────────────────
const SCAN_HISTORY = [
  { id:"s1", name:"api.stripe.com/v1",        type:"api",  status:"complete", risk:23,   time:"2 min ago",  checks:18 },
  { id:"s2", name:"myapp.vercel.app",          type:"web",  status:"complete", risk:67,   time:"1 hr ago",   checks:24 },
  { id:"s3", name:"com.shopify.mobile",        type:"apk",  status:"running",  risk:null, time:"Just now",   checks:null },
  { id:"s4", name:"github.com/acme/backend",   type:"repo", status:"failed",   risk:null, time:"3 hr ago",   checks:null },
  { id:"s5", name:"staging.acme.io",           type:"web",  status:"complete", risk:91,   time:"Yesterday",  checks:31 },
];

const FINDINGS = {
  good: [
    "HTTPS enforced across all endpoints",
    "Content Security Policy header present",
    "HSTS configured with max-age > 1 year",
    "X-Frame-Options set to DENY",
    "Secure, HttpOnly cookies on session tokens",
    "Rate limiting active on auth endpoints",
  ],
  warning: [
    { id:"w1", title:"JWT tokens lack explicit expiry", severity:"medium",
      what:"Your API issues JWT access tokens without an `exp` claim — tokens remain valid indefinitely once issued.",
      why:"A stolen token can be replayed forever with no mechanism to expire compromised sessions.",
      exploit:"Attacker intercepts token via CDN log → replays /api/user/profile six months later with no rejection.",
      before:"jwt.sign({ userId: user.id }, SECRET)",
      after:"jwt.sign({ userId: user.id }, SECRET, { expiresIn: '15m' })",
      secret: null },
    { id:"w2", title:"lodash@4.17.19 — prototype pollution (CVE-2020-8203)", severity:"medium",
      what:"Your package.json pins lodash 4.17.19 which contains a known prototype pollution vulnerability.",
      why:"Prototype pollution lets attackers inject properties into Object.prototype, enabling privilege escalation.",
      exploit:`Send { "__proto__": { "isAdmin": true } } to any endpoint using _.merge() to gain admin context.`,
      before:'"lodash": "4.17.19"',
      after:'"lodash": "4.17.21"',
      secret: null },
  ],
  critical: [
    { id:"c1", title:"SQL Injection in /api/search", severity:"critical",
      what:"The ?q= parameter in /api/search is interpolated directly into a raw SQL string without sanitization.",
      why:"An attacker can read, modify, or delete any database row — including credentials, PII, and payment data.",
      exploit:"GET /api/search?q=' OR 1=1; DROP TABLE users; -- dumps all rows and destroys the table.",
      before:"const q = `SELECT * FROM items WHERE name = '${req.query.q}'`",
      after:"const q = db.prepare('SELECT * FROM items WHERE name = ?').get(req.query.q)",
      secret: null },
    { id:"c2", title:"Secret API key exposed in client bundle", severity:"critical",
      what:"A live Stripe secret key was found in your compiled JS bundle at /static/js/main.chunk.js.",
      why:"Any visitor can extract the key via DevTools and make unauthorized charges or read customer data.",
      exploit:"DevTools → Sources → main.chunk.js → search sk_live → copy → curl stripe.com/v1/charges",
      before:`const stripe = Stripe("sk_live_4xKp9mN2vL8qR3wT")`,
      after:"// Move to server-side only. Never prefix secret keys with NEXT_PUBLIC_.",
      secret:"sk_live_4xKp9mN2vL8qR3wT" },
  ],
};

const PROGRESS_STEPS = [
  "Resolving DNS records and TLS chain…",
  "Auditing SSL/TLS configuration…",
  "Crawling application endpoints…",
  "Fuzzing for injection vulnerabilities…",
  "Testing authentication flows…",
  "Running AI analysis on findings…",
  "Generating remediation diffs…",
];

const SEVERITY_VARIANTS = [
  { level:"critical", label:"Critical", cls:"bg-red-50    text-red-600    border-red-200    dark:bg-red-500/15    dark:text-red-400    dark:border-red-500/30" },
  { level:"high",     label:"High",     cls:"bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-500/15 dark:text-orange-400 dark:border-orange-500/30" },
  { level:"medium",   label:"Medium",   cls:"bg-amber-50  text-amber-600  border-amber-200  dark:bg-amber-500/15  dark:text-amber-400  dark:border-amber-500/30" },
  { level:"low",      label:"Low",      cls:"bg-blue-50   text-blue-600   border-blue-200   dark:bg-blue-500/15   dark:text-blue-400   dark:border-blue-500/30" },
  { level:"info",     label:"Info",     cls:"bg-gray-50   text-gray-600   border-gray-200   dark:bg-slate-500/15  dark:text-slate-400  dark:border-slate-500/30" },
];

const TEAM_MEMBERS = [
  { name:"Alex Chen",     email:"alex@acme.io",     role:"Admin",  avatar:"AC", joined:"Jan 2025" },
  { name:"Sara Kim",      email:"sara@acme.io",      role:"Member", avatar:"SK", joined:"Feb 2025" },
  { name:"James Ruiz",    email:"james@acme.io",     role:"Member", avatar:"JR", joined:"Mar 2025" },
  { name:"Priya Nair",    email:"priya@acme.io",     role:"Admin",  avatar:"PN", joined:"Mar 2025" },
];

const API_KEYS = [
  { id:"k1", name:"Production CI",   prefix:"svn_prod_",  created:"Jan 12, 2025", last:"2 hr ago" },
  { id:"k2", name:"Staging Tests",   prefix:"svn_stg_",   created:"Feb 3, 2025",  last:"1 day ago" },
  { id:"k3", name:"Local Dev",       prefix:"svn_dev_",   created:"Mar 1, 2025",  last:"Never" },
];

// ─── Atoms ────────────────────────────────────────────────────────────────────
function SeverityBadge({ level }: { level: string }) {
  const s = SEVERITY_VARIANTS.find(v => v.level === level) ?? SEVERITY_VARIANTS[4];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-semibold border tracking-wide ${s.cls}`}>
      {s.label}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label:string; cls:string; dot:string }> = {
    complete: { label:"Complete", cls:"bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/25", dot:"bg-emerald-500" },
    running:  { label:"Running",  cls:"bg-blue-50   text-blue-700   border-blue-200   dark:bg-blue-500/10   dark:text-blue-400   dark:border-blue-500/25",   dot:"bg-blue-500 animate-pulse" },
    failed:   { label:"Failed",   cls:"bg-red-50    text-red-700    border-red-200    dark:bg-red-500/10    dark:text-red-400    dark:border-red-500/25",    dot:"bg-red-500" },
  };
  const s = map[status] ?? map.complete;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono border ${s.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${s.dot}`} />
      {s.label}
    </span>
  );
}

function ScanTypeIcon({ type, size=14 }: { type:string; size?:number }) {
  const map: Record<string,{Icon:typeof Globe;color:string}> = {
    web:  { Icon:Globe,       color:"text-blue-500" },
    api:  { Icon:Code2,       color:"text-violet-500" },
    apk:  { Icon:Smartphone,  color:"text-emerald-500" },
    repo: { Icon:GitBranch,   color:"text-amber-500" },
  };
  const { Icon, color } = map[type] ?? map.web;
  return <Icon size={size} className={color} />;
}

function RiskGauge({ score, size="md" }: { score:number; size?:"sm"|"md"|"lg" }) {
  const color = score < 30 ? "#22C55E" : score < 60 ? "#F59E0B" : "#EF4444";
  const label = score < 30 ? "Low" : score < 60 ? "Medium" : "High";
  const dim  = size==="lg" ? 120 : size==="sm" ? 52 : 88;
  const r    = dim/2 - 7;
  const c    = dim/2;
  const circ = 2*Math.PI*r;
  const dash = (score/100)*circ;
  const sw   = size==="lg" ? 9 : 6;
  return (
    <div className="relative flex items-center justify-center" style={{width:dim,height:dim}}>
      <svg width={dim} height={dim} className="-rotate-90" style={{position:"absolute"}}>
        <circle cx={c} cy={c} r={r} fill="none" stroke="currentColor" strokeWidth={sw} className="text-border opacity-50" />
        <circle cx={c} cy={c} r={r} fill="none" stroke={color} strokeWidth={sw}
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{transition:"stroke-dasharray 1.2s cubic-bezier(.4,0,.2,1)"}} />
      </svg>
      <div className="flex flex-col items-center z-10">
        <span className={`font-bold font-mono leading-none ${size==="lg"?"text-3xl":size==="sm"?"text-sm":"text-xl"}`} style={{color}}>{score}</span>
        {size!=="sm" && <span className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground mt-0.5">{label}</span>}
      </div>
    </div>
  );
}

export function ThemeToggle({ dark, toggle }: { dark:boolean; toggle:()=>void }) {
  return (
    <button onClick={toggle}
      className="p-2 rounded-lg border border-border hover:bg-muted transition-colors"
      title="Toggle theme"
    >
      {dark ? <Sun size={14} className="text-amber-400" /> : <Moon size={14} className="text-muted-foreground" />}
    </button>
  );
}

function GoogleIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
    </svg>
  );
}

function GithubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

export function Field({ label, type="text", placeholder, value, onChange, error, hint }:
  { label:string; type?:string; placeholder?:string; value?:string; onChange?:(v:string)=>void; error?:string; hint?:string }) {
  const [show, setShow] = useState(false);
  const isPass = type==="password";
  return (
    <div className="space-y-1 text-left">
      <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{label}</label>
      <div className={`relative flex items-center rounded-md border bg-background transition-colors ${
        error ? "border-red-500 focus-within:border-red-500 focus-within:ring-1 focus-within:ring-red-500" : "border-border focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
      }`}>
        <input
          type={isPass && !show ? "password" : "text"}
          placeholder={placeholder}
          value={value}
          onChange={e => onChange?.(e.target.value)}
          className={`w-full bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none font-sans ${
            isPass && !show ? "tracking-widest" : "tracking-normal"
          }`}
        />
        {isPass && (
          <button type="button" onClick={()=>setShow(s=>!s)} className="pr-3 text-muted-foreground hover:text-foreground transition-colors shrink-0">
            {show ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        )}
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-500 dark:text-red-400 flex items-center gap-1">
          <AlertCircle size={12} className="shrink-0" /> {error}
        </p>
      )}
      {hint && !error && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function OrDivider() {
  return (
    <div className="relative flex items-center justify-center my-3.5">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-border/60" />
      </div>
      <div className="relative flex justify-center text-xs">
        <span className="bg-background border border-border/80 text-muted-foreground font-medium uppercase tracking-widest text-[10px] px-2.5 py-0.5 rounded-full shadow-xs">
          OR
        </span>
      </div>
    </div>
  );
}

function Toggle({ on, onToggle }: { on:boolean; onToggle:()=>void }) {
  return (
    <button onClick={onToggle}
      className={`relative w-10 h-5.5 rounded-full transition-colors shrink-0 ${on?"bg-primary":"bg-border"}`}
      style={{height:"22px",width:"40px"}}
    >
      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${on?"left-5":"left-0.5"}`} />
    </button>
  );
}

function Avatar({ initials, size="sm" }: { initials:string; size?:"sm"|"md"|"lg" }) {
  const dim = size==="lg"?"w-16 h-16 text-lg":size==="md"?"w-10 h-10 text-sm":"w-8 h-8 text-[11px]";
  return (
    <div className={`rounded-full bg-primary/15 border border-primary/25 flex items-center justify-center font-semibold text-primary shrink-0 ${dim}`}>
      {initials}
    </div>
  );
}

// ─── Auth Layout ──────────────────────────────────────────────────────────────
export function AuthCard({ children, onNav, dark, toggleDark, title, subtitle }:
  { children:React.ReactNode; onNav:(s:Screen)=>void; dark:boolean; toggleDark:()=>void; title:string; subtitle:string }) {
  const [legalModal, setLegalModal] = useState<"privacy" | "terms" | null>(null);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans relative flex flex-col items-center justify-between px-4 py-5 sm:px-6 sm:py-7 overflow-hidden selection:bg-blue-500/20">
      {/* 1. Top Brand Accent Line */}
      <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-transparent via-blue-600 to-transparent opacity-90 z-20" />

      {/* 2. Clearly Visible Dot Grid Background Pattern (2px dots, 20px spacing, 45% opacity) */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.45] dark:opacity-[0.25]"
        style={{
          backgroundImage: `radial-gradient(#cbd5e1 2px, transparent 2px)`,
          backgroundSize: `20px 20px`
        }}
      />

      {/* 3. High-Contrast Blue Radial Glow Centered Behind the Form (14% Center Opacity, 750px Radius) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,0.14)_0%,rgba(37,99,235,0.05)_40%,transparent_70%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.22)_0%,rgba(59,130,246,0.06)_45%,transparent_70%)] pointer-events-none blur-3xl z-0" />

      {/* Top Bar (Theme Toggle Pinned to Top Right) */}
      <div className="w-full max-w-5xl flex items-center justify-end relative z-20">
        <ThemeToggle dark={dark} toggle={toggleDark} />
      </div>

      {/* Center Auth Card (Centered Logo -> Frosted Backdrop Panel) */}
      <div className="w-full max-w-[420px] my-auto py-4 relative z-10 flex flex-col text-left">
        {/* Centered Logo */}
        <div className="flex justify-center mb-5">
          <button
            onClick={() => onNav("landing")}
            className="flex items-center gap-2.5 hover:opacity-85 transition-opacity cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-md transition-transform group-hover:scale-105">
              <Shield size={20} />
            </div>
            <span className="font-bold text-xl tracking-tight text-foreground">Solvane</span>
          </button>
        </div>

        {/* Form Container Panel with Reduced Internal Padding (p-5 sm:p-6) */}
        <div className="bg-background/90 dark:bg-background/90 backdrop-blur-md border border-border/80 rounded-2xl p-5 sm:p-6 shadow-xl shadow-slate-950/5">
          {/* Left-Aligned Form Header */}
          <div className="mb-4.5 text-left">
            <h1 className="text-2xl sm:text-[26px] font-bold sm:font-extrabold tracking-tight text-foreground mb-1 leading-tight">{title}</h1>
            <p className="text-sm text-muted-foreground leading-normal">{subtitle}</p>
          </div>

          {/* Form Body */}
          {children}
        </div>
      </div>

      {/* Footer Below Form */}
      <div className="relative z-10 pt-6 text-xs text-muted-foreground flex items-center justify-center gap-3">
        <span>© {new Date().getFullYear()} Solvane Inc.</span>
        <span className="text-border/80">•</span>
        <button onClick={() => setLegalModal("privacy")} className="hover:text-foreground transition-colors cursor-pointer">
          Privacy
        </button>
        <span className="text-border/80">•</span>
        <button onClick={() => setLegalModal("terms")} className="hover:text-foreground transition-colors cursor-pointer">
          Terms
        </button>
      </div>

      {/* Legal Modal (Privacy / Terms) */}
      {legalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-background text-foreground border border-border rounded-xl shadow-2xl max-w-lg w-full p-6 relative max-h-[85vh] flex flex-col text-left">
            <div className="flex items-center justify-between pb-4 border-b border-border mb-4">
              <h3 className="text-lg font-bold text-foreground">
                {legalModal === "privacy" ? "Privacy Policy" : "Terms of Service"}
              </h3>
              <button
                onClick={() => setLegalModal(null)}
                className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-secondary cursor-pointer"
              >
                <XCircle size={18} />
              </button>
            </div>

            <div className="overflow-y-auto pr-2 space-y-3 text-xs text-muted-foreground leading-relaxed flex-1">
              {legalModal === "privacy" ? (
                <>
                  <p className="font-medium text-foreground">Last updated: August 2026</p>
                  <p>
                    At Solvane, we take data privacy and security scan confidentiality extremely seriously. All security scan telemetry, codebase references, and API endpoint details submitted to our platform are encrypted at rest using AES-256 and in transit using TLS 1.3.
                  </p>
                  <h4 className="font-semibold text-foreground text-sm pt-2">1. Information Collection</h4>
                  <p>
                    We collect minimal account information required for service operation (name, work email, and OAuth identifier). Scan artifacts and source repository ASTs are processed in isolated ephemeral containers.
                  </p>
                  <h4 className="font-semibold text-foreground text-sm pt-2">2. Data Retention & Usage</h4>
                  <p>
                    We never sell your data or use customer scan targets for public benchmark training. Detailed findings and diffs are retained only for the active lifecycle of your workspace.
                  </p>
                </>
              ) : (
                <>
                  <p className="font-medium text-foreground">Last updated: August 2026</p>
                  <p>
                    By accessing or using Solvane's automated security analysis tools, you agree to comply with and be bound by these Terms of Service.
                  </p>
                  <h4 className="font-semibold text-foreground text-sm pt-2">1. Permitted Security Testing</h4>
                  <p>
                    You agree to initiate automated scans, fuzzing, or APK decompilation ONLY on assets, applications, and networks that you own or have explicit authorization to audit.
                  </p>
                  <h4 className="font-semibold text-foreground text-sm pt-2">2. Responsible Disclosure</h4>
                  <p>
                    Vulnerability findings generated by Solvane are for authorized internal remediation. Misuse of findings for unauthorized exploitation is strictly prohibited.
                  </p>
                </>
              )}
            </div>

            <div className="pt-4 border-t border-border mt-4 flex justify-end">
              <button
                onClick={() => setLegalModal(null)}
                className="px-4 py-2 bg-primary text-white text-xs font-semibold rounded-md hover:bg-primary/90 transition-colors cursor-pointer"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Login ────────────────────────────────────────────────────────────────────
function LoginScreen({ onNav, dark, toggleDark, onLoginSuccess }: { onNav:(s:Screen)=>void; dark:boolean; toggleDark:()=>void; onLoginSuccess:(u:AuthUser)=>void }) {
  const [email, setEmail]   = useState("");
  const [pass,  setPass]    = useState("");
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const oauthError = params.get("error");
    if (oauthError) {
      const messages: Record<string, string> = {
        oauth_cancelled: "Sign-in was cancelled. Please try again.",
        oauth_token_failed: "Could not complete OAuth sign-in. Please try again.",
        oauth_token_missing: "OAuth provider did not return a token. Please try again.",
        oauth_profile_failed: "Could not fetch your profile from the provider. Please try again.",
        oauth_no_email: "Your account doesn't have a public email. Please add an email to your GitHub/Google account.",
        oauth_email_unverified: "Your Google email is not verified. Please verify it first.",
      };
      setError(messages[oauthError] || "OAuth sign-in failed. Please try again.");
      window.history.replaceState({}, "", "/login");
    }
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { setError("Email is required"); return; }
    if (!pass) { setError("Password is required"); return; }

    setError("");
    setLoading(true);
    try {
      const res = await authApi.login(email, pass);
      onLoginSuccess(res.user);
      onNav("dashboard");
    } catch (err: any) {
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard onNav={onNav} dark={dark} toggleDark={toggleDark} title="Welcome back" subtitle="Sign in to your account">
      {error && (
        <div className="mb-3.5 p-3 rounded-md bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 text-xs flex items-center gap-2">
          <AlertCircle size={14} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={submit} className="space-y-3">
        <Field label="Email" type="text" placeholder="name@company.com" value={email} onChange={setEmail} />
        <div>
          <Field label="Password" type="password" placeholder="••••••••" value={pass} onChange={setPass} />
          <div className="flex justify-end mt-1">
            <button type="button" onClick={()=>onNav("forgot")} className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
              Forgot password?
            </button>
          </div>
        </div>

        <button type="submit" disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm py-2.5 rounded-md transition-colors disabled:opacity-50 cursor-pointer shadow-none"
        >
          {loading ? <Loader2 size={15} className="animate-spin" /> : null} Log in
        </button>
      </form>

      <OrDivider />

      <div className="space-y-2">
        <button
          type="button"
          onClick={() => authApi.triggerOAuth("github")}
          className="w-full flex items-center justify-center gap-2.5 border border-border rounded-md px-3.5 py-2 text-sm font-medium text-foreground hover:bg-secondary/70 transition-colors cursor-pointer"
        >
          <GithubIcon className="w-4 h-4 text-foreground shrink-0" />
          <span>Continue with GitHub</span>
        </button>
        <button
          type="button"
          onClick={() => authApi.triggerOAuth("google")}
          className="w-full flex items-center justify-center gap-2.5 border border-border rounded-md px-3.5 py-2 text-sm font-medium text-foreground hover:bg-secondary/70 transition-colors cursor-pointer"
        >
          <GoogleIcon className="w-4 h-4 shrink-0" />
          <span>Continue with Google</span>
        </button>
      </div>

      <p className="text-xs text-muted-foreground mt-4.5 text-left">
        {"Don't have an account? "}
        <button onClick={()=>onNav("signup")} className="text-blue-600 dark:text-blue-400 font-medium hover:underline cursor-pointer">Sign up</button>
      </p>
    </AuthCard>
  );
}

// ─── Sign Up ─────────────────────────────────────────────────────────────────
function SignupScreen({ onNav, dark, toggleDark, onLoginSuccess }: { onNav:(s:Screen)=>void; dark:boolean; toggleDark:()=>void; onLoginSuccess:(u:AuthUser)=>void }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName]   = useState("");
  const [email, setEmail]         = useState("");
  const [pass, setPass]           = useState("");
  const [company, setCompany]     = useState("");
  const [agreed, setAgreed]       = useState(false);
  const [error, setError]         = useState("");
  const [loading, setLoading]     = useState(false);

  const strength = validatePasswordStrength(pass);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !email) { setError("Please enter your name and email."); return; }
    if (!strength.isValid) { setError("Password does not satisfy minimum strength requirements."); return; }

    setError("");
    setLoading(true);
    try {
      const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
      const res = await authApi.signup({ name: fullName, email, password: pass, company });
      onLoginSuccess(res.user);
      onNav("verify");
    } catch (err: any) {
      setError(err.message || "Failed to create account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard onNav={onNav} dark={dark} toggleDark={toggleDark} title="Create your account" subtitle="Get started with Solvane">
      {error && (
        <div className="mb-3.5 p-3 rounded-md bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 text-xs flex items-center gap-2">
          <AlertCircle size={14} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={submit} className="space-y-3">
        <div className="grid grid-cols-2 gap-2.5">
          <Field label="First name" placeholder="Alex" value={firstName} onChange={setFirstName} />
          <Field label="Last name" placeholder="Chen" value={lastName} onChange={setLastName} />
        </div>
        <Field label="Work email" type="text" placeholder="name@company.com" value={email} onChange={setEmail} />
        
        <div>
          <Field label="Password" type="password" placeholder="••••••••" value={pass} onChange={setPass} />
          <p className={`text-xs mt-1 text-left transition-colors ${pass && !strength.isValid ? "text-red-500 dark:text-red-400 font-medium" : "text-muted-foreground"}`}>
            Must be at least 8 characters with a number and a symbol.
          </p>
        </div>

        <Field label="Company (optional)" placeholder="Acme Inc." value={company} onChange={setCompany} />
        
        <label className="flex items-start gap-2 cursor-pointer pt-0.5 text-left">
          <input type="checkbox" checked={agreed} onChange={()=>setAgreed(v=>!v)} className="mt-0.5 rounded accent-blue-600 cursor-pointer" />
          <span className="text-xs text-muted-foreground leading-snug">
            I agree to the{" "}
            <span className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">Terms of Service</span>
            {" and "}
            <span className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">Privacy Policy</span>
          </span>
        </label>
        
        <button type="submit" disabled={!agreed || loading || Boolean(pass && !strength.isValid)}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm py-2.5 rounded-md transition-colors disabled:opacity-50 cursor-pointer shadow-none"
        >
          {loading ? <Loader2 size={15} className="animate-spin" /> : null} Create account
        </button>
      </form>

      <OrDivider />

      <div className="space-y-2">
        <button
          type="button"
          onClick={() => authApi.triggerOAuth("github")}
          className="w-full flex items-center justify-center gap-2.5 border border-border rounded-md px-3.5 py-2 text-sm font-medium text-foreground hover:bg-secondary/70 transition-colors cursor-pointer"
        >
          <GithubIcon className="w-4 h-4 text-foreground shrink-0" />
          <span>Continue with GitHub</span>
        </button>
        <button
          type="button"
          onClick={() => authApi.triggerOAuth("google")}
          className="w-full flex items-center justify-center gap-2.5 border border-border rounded-md px-3.5 py-2 text-sm font-medium text-foreground hover:bg-secondary/70 transition-colors cursor-pointer"
        >
          <GoogleIcon className="w-4 h-4 shrink-0" />
          <span>Continue with Google</span>
        </button>
      </div>

      <p className="text-xs text-muted-foreground mt-4 text-left">
        Already have an account?{" "}
        <button onClick={()=>onNav("login")} className="text-blue-600 dark:text-blue-400 font-medium hover:underline cursor-pointer">Log in</button>
      </p>
    </AuthCard>
  );
}

// ─── Forgot Password ──────────────────────────────────────────────────────────
function ForgotScreen({ onNav, dark, toggleDark }: { onNav:(s:Screen)=>void; dark:boolean; toggleDark:()=>void }) {
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e:React.FormEvent) => {
    e.preventDefault();
    if (!email) { setError("Email is required"); return; }
    setError("");
    setLoading(true);
    try {
      await authApi.forgotPassword(email);
      setSent(true);
    } catch (err: any) {
      setError(err.message || "Failed to request password reset.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard onNav={onNav} dark={dark} toggleDark={toggleDark} title="Reset password" subtitle="Enter your email to receive a password reset link">
      {!sent ? (
        <>
          {error && (
            <div className="mb-4 p-3 rounded-md bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 text-xs flex items-center gap-2">
              <AlertCircle size={14} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            <Field label="Email" type="text" placeholder="name@company.com" value={email} onChange={setEmail} />
            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm py-2.5 rounded-md transition-colors disabled:opacity-50 cursor-pointer shadow-none"
            >
              {loading ? <Loader2 size={15} className="animate-spin" /> : null} Send reset link
            </button>
          </form>
        </>
      ) : (
        <div className="space-y-4 text-left">
          <div className="p-4 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs leading-relaxed flex items-start gap-2.5">
            <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-semibold mb-0.5">Check your inbox</strong>
              <span>We sent a password reset link to <span className="font-mono text-foreground font-medium">{email || "your email"}</span>.</span>
            </div>
          </div>
        </div>
      )}
      <div className="mt-6 pt-4 border-t border-border/40 text-left">
        <button onClick={()=>onNav("login")} className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer flex items-center gap-1">
          ← Back to log in
        </button>
      </div>
    </AuthCard>
  );
}

// ─── Email Verify ─────────────────────────────────────────────────────────────
function VerifyScreen({ onNav, dark, toggleDark, user }: { onNav:(s:Screen)=>void; dark:boolean; toggleDark:()=>void; user?:AuthUser|null }) {
  const [resending, setResending] = useState(false);
  const [msg, setMsg] = useState("");

  const handleResend = async () => {
    setResending(true);
    setMsg("");
    try {
      const result = await authApi.resendVerification();
      setMsg(result);
    } catch (err: any) {
      setMsg(err.message || "Failed to resend email.");
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthCard onNav={onNav} dark={dark} toggleDark={toggleDark} title="Verify your email" subtitle="Confirm your email address to activate your account">
      <div className="space-y-4 text-left">
        <p className="text-xs text-muted-foreground leading-relaxed">
          We sent a verification link to <span className="font-mono font-medium text-foreground">{user?.email || "your email"}</span>. Please open it to complete setup.
        </p>

        {msg && (
          <div className="p-3 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-xs">
            {msg}
          </div>
        )}

        <div className="flex flex-col gap-2 pt-2">
          <button onClick={()=>onNav("dashboard")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm py-2.5 rounded-md transition-colors cursor-pointer shadow-none"
          >
            Continue to dashboard
          </button>
          <button onClick={handleResend} disabled={resending} className="w-full text-xs text-muted-foreground hover:text-foreground py-2 transition-colors cursor-pointer">
            {resending ? "Resending..." : "Resend verification email"}
          </button>
        </div>
      </div>
    </AuthCard>
  );
}

// ─── Landing ─────────────────────────────────────────────────────────────────
function Landing({ onNav, dark, toggleDark }: { onNav:(s:Screen)=>void; dark:boolean; toggleDark:()=>void }) {
  const [scanVal, setScanVal] = useState("");
  const features = [
    { icon:Globe,      title:"Website Scanner", col:"text-blue-600 dark:text-blue-400",   ring:"border-blue-200   bg-blue-50   dark:border-blue-500/25 dark:bg-blue-500/8",
      desc:"Full-surface crawl: headers, TLS, CORS, CSP, open redirects, and injection vectors. Zero config.",
      sev:"high", finding:"Open redirect on /oauth/callback" },
    { icon:Code2,      title:"API Scanner",     col:"text-violet-600 dark:text-violet-400", ring:"border-violet-200 bg-violet-50 dark:border-violet-500/25 dark:bg-violet-500/8",
      desc:"Schema-aware REST and GraphQL fuzzing. Finds BOLA, auth bypass, mass assignment, and data leaks.",
      sev:"critical", finding:"BOLA: /api/v1/users/{id} leaks any record" },
    { icon:Smartphone, title:"APK Scanner",     col:"text-emerald-600 dark:text-emerald-400", ring:"border-emerald-200 bg-emerald-50 dark:border-emerald-500/25 dark:bg-emerald-500/8",
      desc:"Static + dynamic analysis for Android APKs: hardcoded secrets, insecure storage, weak crypto.",
      sev:"critical", finding:"Hardcoded AWS key in BuildConfig.java" },
  ];
  const steps = [
    { n:"01", Icon:Terminal,    title:"Enter target",         desc:"Paste a URL, API endpoint, APK, or GitHub repo." },
    { n:"02", Icon:ScanLine,    title:"Automated scan",       desc:"200+ AI-driven test vectors run in minutes." },
    { n:"03", Icon:Cpu,         title:"AI explains findings", desc:"Plain-English severity, impact, and exploit scenarios." },
    { n:"04", Icon:CheckCircle2,title:"Fix with confidence",  desc:"Side-by-side code diffs — copy straight to your editor." },
  ];
  return (
    <div className="min-h-screen bg-background text-foreground" style={{fontFamily:"'Inter',sans-serif"}}>
      {/* Nav */}
      <Navbar currentScreen="landing" onNav={onNav} dark={dark} toggleDark={toggleDark} />

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Dot Grid Background */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.35] dark:opacity-[0.20]"
          style={{
            backgroundImage: `radial-gradient(#cbd5e1 2px, transparent 2px)`,
            backgroundSize: `20px 20px`
          }}
        />
        {/* Radial Blue Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,0.12)_0%,rgba(37,99,235,0.04)_45%,transparent_70%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.18)_0%,rgba(59,130,246,0.05)_50%,transparent_70%)] pointer-events-none blur-3xl z-0" />

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-[12px] font-mono mb-6">
              <Zap size={12} /> Public beta — APK scanning live
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-5 text-foreground">
              Find vulnerabilities<br />
              <span className="text-blue-600 dark:text-blue-400">before attackers do.</span>
            </h1>
            <p className="text-[17px] text-muted-foreground leading-relaxed mb-8 max-w-lg">
              AI-powered security testing for websites, APIs, and Android apps. Get code-level fixes in minutes — not a 90-page PDF.
            </p>
            {/* Scan bar */}
            <div className="flex items-center gap-2 bg-background border border-border/80 rounded-xl p-1.5 mb-4 max-w-lg shadow-sm">
              <div className="flex items-center gap-2 px-3 flex-1">
                <Terminal size={14} className="text-blue-600 dark:text-blue-400 shrink-0" />
                <input value={scanVal} onChange={e=>setScanVal(e.target.value)}
                  placeholder="https://yourapp.com or paste APK…"
                  className="bg-transparent text-[13px] font-mono text-foreground placeholder:text-muted-foreground outline-none flex-1"
                />
              </div>
              <button onClick={()=>onNav("dashboard")}
                className="shrink-0 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-semibold px-4 py-2.5 rounded-md transition-colors cursor-pointer shadow-none">
                Start free scan <ArrowRight size={14} />
              </button>
            </div>
            <p className="text-[12px] text-muted-foreground font-mono">
              No credit card · Results in ~3 min · Only scans systems you own
            </p>
            {/* Severity strip */}
            <div className="flex items-center gap-2 mt-8 flex-wrap">
              <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider mr-1">Severity:</span>
              {SEVERITY_VARIANTS.map(v=><SeverityBadge key={v.level} level={v.level} />)}
            </div>
          </div>

          {/* Hero mockup */}
          <div className="relative hidden lg:block">
            <div className="absolute -inset-4 rounded-3xl pointer-events-none"
              style={{background:"radial-gradient(ellipse 70% 50% at 50% 50%, rgba(37,99,235,0.07) 0%, transparent 70%)"}} />
            <div
              className="rounded-2xl border border-border bg-card shadow-lg overflow-hidden cursor-pointer hover:border-primary/40 transition-colors"
              onClick={()=>onNav("results")}
            >
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-secondary/60">
                {["bg-red-400","bg-amber-400","bg-emerald-400"].map(c=><span key={c} className={`w-2.5 h-2.5 rounded-full ${c} opacity-60`} />)}
                <span className="ml-2 text-[11px] font-mono text-muted-foreground">solvane.io/scan/myapp.vercel.app</span>
                <ExternalLink size={10} className="text-muted-foreground ml-auto" />
              </div>
              <div className="p-5 flex gap-4">
                <div className="w-28 shrink-0 space-y-0.5">
                  {["Dashboard","New Scan","History","Reports"].map((item,i)=>(
                    <div key={item} className={`flex items-center gap-1.5 px-2 py-1.5 rounded text-[10px] font-mono ${i===0?"bg-primary/10 text-primary":"text-muted-foreground"}`}>
                      <div className="w-1.5 h-1.5 rounded-sm bg-current opacity-60" />{item}
                    </div>
                  ))}
                </div>
                <div className="flex-1 space-y-3 min-w-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[12px] font-semibold font-mono">myapp.vercel.app</div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">Website · 2 min ago</div>
                    </div>
                    <RiskGauge score={67} size="sm" />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[{c:"2",l:"Critical",col:"text-red-500"},{c:"2",l:"Warnings",col:"text-amber-500"},{c:"6",l:"Passed",col:"text-emerald-500"}].map(s=>(
                      <div key={s.l} className="bg-secondary rounded-lg p-2 border border-border">
                        <div className={`text-base font-bold font-mono ${s.col}`}>{s.c}</div>
                        <div className="text-[9px] text-muted-foreground">{s.l}</div>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-1.5">
                    {[{t:"SQL Injection in /api/search",s:"critical"},{t:"API key in client bundle",s:"critical"},{t:"JWT tokens lack expiry",s:"medium"}].map(f=>(
                      <div key={f.t} className="flex items-center justify-between py-1.5 px-2.5 rounded-lg bg-secondary border border-border">
                        <span className="text-[10px] font-mono truncate mr-2">{f.t}</span>
                        <SeverityBadge level={f.s} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 bg-secondary border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <div className="text-[11px] font-mono text-primary uppercase tracking-widest mb-2">Scan surfaces</div>
            <h2 className="text-3xl font-bold tracking-tight">Three scanners. One platform.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map(f=>(
              <div key={f.title} className="bg-card border border-border rounded-2xl p-6 hover:border-primary/40 transition-colors flex flex-col">
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-4 ${f.ring}`}>
                  <f.icon size={18} className={f.col} />
                </div>
                <h3 className="font-semibold text-[15px] mb-2">{f.title}</h3>
                <p className="text-[13px] text-muted-foreground leading-relaxed flex-1">{f.desc}</p>
                <div className="mt-4 bg-secondary border border-border rounded-xl p-3">
                  <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-1.5">Sample finding</div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <SeverityBadge level={f.sev} />
                    <span className="text-[11px] font-mono text-foreground/80">{f.finding}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <div className="text-[11px] font-mono text-primary uppercase tracking-widest mb-2">Process</div>
            <h2 className="text-3xl font-bold tracking-tight">From target to fix in minutes.</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-px bg-border rounded-2xl overflow-hidden">
            {steps.map((step,i)=>(
              <div key={step.n} className="bg-background p-7 flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <div className="w-9 h-9 rounded-lg bg-primary/8 border border-primary/20 flex items-center justify-center">
                    <step.Icon size={15} className="text-primary" />
                  </div>
                  <span className="text-2xl font-bold font-mono text-foreground/8">{step.n}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-[14px] mb-1">{step.title}</h3>
                  <p className="text-[13px] text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="py-16 px-6 bg-secondary border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="bg-card border border-border rounded-2xl p-8 flex flex-col md:flex-row items-start md:items-center gap-8 justify-between">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 bg-primary/8 border border-primary/20 rounded-xl flex items-center justify-center shrink-0">
                <Lock size={18} className="text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-[15px] mb-1.5">Only scans systems you own</h3>
                <p className="text-[13px] text-muted-foreground leading-relaxed max-w-md">
                  Solvane verifies ownership via DNS TXT record, HTML meta tag, or file upload before any scan begins.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2 shrink-0 pl-0 md:pl-6 md:border-l border-border">
              {["Ownership verified before scan","SOC 2 Type II","Data encrypted at rest + transit","No third-party data sharing"].map(t=>(
                <div key={t} className="flex items-center gap-2 text-[12px] text-emerald-600 dark:text-emerald-400 font-mono">
                  <CheckCircle2 size={11} /> {t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer onNav={onNav} />
    </div>
  );
}

// ─── App Shell ────────────────────────────────────────────────────────────────
const NAV = [
  { id:"dashboard", icon:LayoutDashboard, label:"Dashboard" },
  { id:"empty",     icon:ScanLine,         label:"New Scan" },
  { id:"empty",     icon:History,          label:"Scan History" },
  { id:"results",   icon:FileText,         label:"Reports" },
] as const;

function AppSidebar({ screen, onNav, onScreen }: { screen:Screen; onNav:(s:Screen)=>void; onScreen:(s:Screen)=>void }) {
  return (
    <aside className="w-[220px] shrink-0 bg-sidebar border-r border-sidebar-border flex flex-col h-screen sticky top-0">
      <button onClick={()=>onNav("landing")} className="flex items-center gap-2.5 px-5 py-4 border-b border-sidebar-border hover:opacity-75 transition-opacity text-left">
        <Shield size={16} className="text-primary shrink-0" />
        <span className="font-bold text-[13px] tracking-tight text-sidebar-foreground">Solvane</span>
      </button>
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {NAV.map((item,i)=>{
          const active = item.id===screen;
          return (
            <button key={item.label} onClick={()=>onScreen(item.id as Screen)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] transition-colors text-left ${
                active ? "bg-sidebar-accent text-sidebar-primary" : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              }`}
            >
              <item.icon size={14} className={active?"text-primary":"text-muted-foreground"} />
              {item.label}
            </button>
          );
        })}
        <div className="pt-3 mt-2 border-t border-sidebar-border space-y-0.5">
          {[
            { id:"profile"  as Screen, icon:User,     label:"Profile" },
            { id:"settings" as Screen, icon:Settings, label:"Settings" },
          ].map(item=>{
            const active = item.id===screen;
            return (
              <button key={item.label} onClick={()=>onScreen(item.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] transition-colors text-left ${
                  active ? "bg-sidebar-accent text-sidebar-primary" : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                }`}
              >
                <item.icon size={14} className={active?"text-primary":"text-muted-foreground"} />
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>
      <div className="p-3 border-t border-sidebar-border">
        <button onClick={()=>onScreen("profile")} className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-sidebar-accent/50 transition-colors">
          <Avatar initials="AC" />
          <div className="min-w-0 text-left">
            <div className="text-[12px] font-semibold text-sidebar-foreground truncate">Alex Chen</div>
            <div className="text-[11px] text-muted-foreground truncate">alex@acme.io</div>
          </div>
        </button>
      </div>
    </aside>
  );
}

function AppTopBar({ onLanding, dark, toggleDark, breadcrumb }: { onLanding:()=>void; dark:boolean; toggleDark:()=>void; breadcrumb:string }) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur-xl px-6 h-14 flex items-center gap-4">
      <div className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
        <button onClick={onLanding} className="hover:text-foreground transition-colors">Solvane</button>
        <ChevronRight size={12} />
        <span className="text-foreground font-medium">{breadcrumb}</span>
      </div>
      <div className="flex items-center gap-2 bg-secondary border border-border rounded-lg px-3 py-1.5 w-56 ml-4">
        <Search size={12} className="text-muted-foreground" />
        <input placeholder="Search scans…" className="bg-transparent text-[13px] font-mono text-foreground placeholder:text-muted-foreground outline-none flex-1" />
        <kbd className="text-[10px] font-mono text-muted-foreground bg-muted border border-border px-1.5 py-0.5 rounded">⌘K</kbd>
      </div>
      <div className="flex-1" />
      <ThemeToggle dark={dark} toggle={toggleDark} />
      <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
        <Bell size={15} className="text-muted-foreground" />
        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-primary rounded-full" />
      </button>
      <Avatar initials="AC" />
    </header>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
function DashOverview({ onResults }: { onResults:()=>void }) {
  const [tab, setTab]       = useState("web");
  const [scanning, setSc]   = useState(false);
  const [progress, setProg] = useState(0);
  const [stepLbl, setStepLbl] = useState("");
  const ivRef = useRef<ReturnType<typeof setInterval>|null>(null);

  const tabs = [
    { id:"web",  label:"Website URL",  icon:Globe },
    { id:"api",  label:"API Endpoint", icon:Code2 },
    { id:"apk",  label:"APK Upload",   icon:Smartphone },
    { id:"repo", label:"GitHub Repo",  icon:GitBranch },
  ];

  const startScan = () => {
    setSc(true); setProg(0); let i=0; setStepLbl(PROGRESS_STEPS[0]);
    ivRef.current = setInterval(()=>{
      i++;
      setProg(Math.min((i/PROGRESS_STEPS.length)*100,97));
      setStepLbl(PROGRESS_STEPS[Math.min(i,PROGRESS_STEPS.length-1)]);
      if(i>=PROGRESS_STEPS.length){ clearInterval(ivRef.current!); setTimeout(()=>{setSc(false);onResults();},600); }
    },800);
  };

  const stats = [
    { label:"Scans this month", val:"24", icon:Activity,    col:"text-blue-600 dark:text-blue-400",    bg:"bg-blue-50   border-blue-200   dark:bg-blue-500/8  dark:border-blue-500/20" },
    { label:"Critical findings", val:"3",  icon:AlertOctagon,col:"text-red-600 dark:text-red-400",      bg:"bg-red-50    border-red-200    dark:bg-red-500/8   dark:border-red-500/20" },
    { label:"Issues resolved",   val:"41", icon:CheckCircle2,col:"text-emerald-600 dark:text-emerald-400",bg:"bg-emerald-50 border-emerald-200 dark:bg-emerald-500/8 dark:border-emerald-500/20" },
    { label:"Avg risk score",    val:"38", icon:TrendingUp,  col:"text-amber-600 dark:text-amber-400",  bg:"bg-amber-50  border-amber-200  dark:bg-amber-500/8 dark:border-amber-500/20" },
  ];

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-4xl mx-auto p-8 space-y-7">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map(s=>(
            <div key={s.label} className={`bg-card border rounded-xl p-4 ${s.bg}`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] text-muted-foreground">{s.label}</span>
                <s.icon size={13} className={s.col} />
              </div>
              <div className={`text-3xl font-bold font-mono ${s.col}`}>{s.val}</div>
            </div>
          ))}
        </div>

        {/* New Scan card */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <div>
              <h2 className="font-semibold">New Scan</h2>
              <p className="text-[12px] text-muted-foreground mt-0.5">Ownership verification required before scanning begins</p>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 px-3 py-1.5 rounded-lg">
              <Lock size={10} /> Verified mode
            </div>
          </div>
          <div className="p-6">
            <div className="flex gap-1 bg-secondary p-1 rounded-xl border border-border mb-6">
              {tabs.map(t=>(
                <button key={t.id} onClick={()=>setTab(t.id)}
                  className={`flex items-center justify-center gap-1.5 py-2 px-4 rounded-lg text-[12px] font-medium transition-all flex-1 ${
                    tab===t.id ? "bg-card border border-border text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <t.icon size={13} />
                  <span className="hidden sm:inline">{t.label}</span>
                </button>
              ))}
            </div>

            {tab==="web" && (
              <div className="space-y-3">
                <div className="flex items-center gap-3 bg-input-background border border-border rounded-xl px-4 py-3 focus-within:border-primary/60 transition-colors">
                  <Globe size={13} className="text-muted-foreground shrink-0" />
                  <input placeholder="https://yourapp.com" className="bg-transparent text-[13px] font-mono text-foreground placeholder:text-muted-foreground outline-none flex-1" />
                </div>
                <div className="flex gap-5 text-[12px] text-muted-foreground px-1">
                  {["Deep crawl","Header analysis","Auth bypass testing"].map(o=>(
                    <label key={o} className="flex items-center gap-1.5 cursor-pointer">
                      <input type="checkbox" className="accent-primary" defaultChecked={o!=="Auth bypass testing"} /> {o}
                    </label>
                  ))}
                </div>
              </div>
            )}
            {tab==="api" && (
              <div className="space-y-3">
                <div className="flex items-center gap-3 bg-input-background border border-border rounded-xl px-4 py-3 focus-within:border-primary/60 transition-colors">
                  <Code2 size={13} className="text-muted-foreground shrink-0" />
                  <input placeholder="https://api.yourapp.com/v1" className="bg-transparent text-[13px] font-mono text-foreground placeholder:text-muted-foreground outline-none flex-1" />
                </div>
                <div className="flex items-center gap-3 bg-input-background border border-border rounded-xl px-4 py-3 focus-within:border-primary/60 transition-colors">
                  <Lock size={13} className="text-muted-foreground shrink-0" />
                  <input type="password" placeholder="Authorization token (optional)" className="bg-transparent text-[13px] font-mono text-foreground placeholder:text-muted-foreground outline-none flex-1" />
                </div>
              </div>
            )}
            {tab==="apk" && (
              <label className="block border-2 border-dashed border-border rounded-2xl p-12 flex flex-col items-center gap-3 cursor-pointer hover:border-primary/50 hover:bg-primary/3 transition-all text-center">
                <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/25 rounded-xl flex items-center justify-center">
                  <Upload size={20} className="text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-[14px] font-medium">Drop your APK here</p>
                  <p className="text-[12px] text-muted-foreground mt-1">or click to browse · .apk · max 200 MB</p>
                </div>
                <input type="file" accept=".apk" className="hidden" />
              </label>
            )}
            {tab==="repo" && (
              <div className="flex items-center gap-3 bg-input-background border border-border rounded-xl px-4 py-3 focus-within:border-primary/60 transition-colors">
                <GitBranch size={13} className="text-muted-foreground shrink-0" />
                <input placeholder="github.com/your-org/your-repo" className="bg-transparent text-[13px] font-mono text-foreground placeholder:text-muted-foreground outline-none flex-1" />
              </div>
            )}

            {scanning && (
              <div className="mt-6 space-y-2.5 p-4 bg-primary/4 rounded-xl border border-primary/20">
                <div className="flex items-center gap-2">
                  <Loader2 size={13} className="text-primary animate-spin shrink-0" />
                  <span className="text-[12px] font-mono text-primary flex-1 truncate">{stepLbl}</span>
                  <span className="text-[11px] font-mono text-muted-foreground">{Math.round(progress)}%</span>
                </div>
                <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all duration-700" style={{width:`${progress}%`}} />
                </div>
              </div>
            )}

            <div className="mt-6 flex items-center justify-between">
              <p className="text-[12px] text-muted-foreground flex items-center gap-1.5">
                <Lock size={10} className="text-emerald-500" /> Ownership verified before scan
              </p>
              <button onClick={startScan} disabled={scanning}
                className="flex items-center gap-2 bg-primary text-white text-[13px] font-semibold px-6 py-2.5 rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {scanning ? <Loader2 size={13} className="animate-spin" /> : <Zap size={13} />}
                {scanning ? "Scanning…" : "Start Scan"}
              </button>
            </div>
          </div>
        </div>

        {/* Recent scans */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <h2 className="font-semibold">Recent Scans</h2>
            <button className="text-[12px] text-muted-foreground hover:text-foreground transition-colors font-mono">View all →</button>
          </div>
          <div className="divide-y divide-border">
            {SCAN_HISTORY.map(scan=>(
              <div key={scan.id} onClick={scan.status==="complete"?()=>onResults():undefined}
                className="flex items-center gap-4 px-6 py-4 hover:bg-secondary/60 transition-colors cursor-pointer"
              >
                <div className="w-8 h-8 bg-secondary border border-border rounded-lg flex items-center justify-center shrink-0">
                  <ScanTypeIcon type={scan.type} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-mono text-foreground truncate">{scan.name}</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Clock size={10} className="text-muted-foreground" />
                    <span className="text-[11px] text-muted-foreground">{scan.time}</span>
                    {scan.checks && <span className="text-[11px] text-muted-foreground">· {scan.checks} checks</span>}
                  </div>
                </div>
                <StatusBadge status={scan.status} />
                <div className="w-16 flex justify-end">
                  {scan.risk!==null && <RiskGauge score={scan.risk} size="sm" />}
                </div>
                <ChevronRight size={13} className="text-muted-foreground shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyState({ onNew }: { onNew:()=>void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
      <div className="w-20 h-20 rounded-2xl bg-primary/8 border border-primary/20 flex items-center justify-center mb-6">
        <ScanLine size={32} className="text-primary/50" />
      </div>
      <h2 className="text-xl font-bold mb-2">No scans yet</h2>
      <p className="text-[14px] text-muted-foreground max-w-sm leading-relaxed mb-8">
        Run your first security scan to see findings, risk scores, and AI-generated fix recommendations here.
      </p>
      <button onClick={onNew}
        className="flex items-center gap-2 bg-primary text-white text-[13px] font-semibold px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors"
      >
        <Zap size={14} /> Start your first scan
      </button>
      <div className="mt-12 grid grid-cols-3 gap-4 max-w-lg text-left">
        {[
          { icon:Globe,     label:"Paste a URL",  desc:"Website or API endpoint" },
          { icon:Upload,    label:"Upload APK",   desc:"Android app binary" },
          { icon:GitBranch, label:"Link a repo",  desc:"GitHub repository" },
        ].map(t=>(
          <div key={t.label} className="bg-card border border-border rounded-xl p-4">
            <t.icon size={16} className="text-primary mb-2" />
            <div className="text-[12px] font-medium mb-0.5">{t.label}</div>
            <div className="text-[11px] text-muted-foreground">{t.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Finding Card ─────────────────────────────────────────────────────────────
function FindingCard({ f, variant }: { f:typeof FINDINGS.critical[0]; variant:"critical"|"warning" }) {
  const [open, setOpen]   = useState(variant==="critical");
  const [fixed, setFixed] = useState(false);
  const [show, setShow]   = useState(false);
  const isCrit = variant==="critical";
  const Icon   = isCrit ? XCircle : AlertTriangle;
  const icnCls = isCrit ? "text-red-500 dark:text-red-400" : "text-amber-500 dark:text-amber-400";
  const bdr    = isCrit
    ? "border-red-200 dark:border-red-500/20 hover:border-red-400 dark:hover:border-red-500/45"
    : "border-amber-200 dark:border-amber-500/18 hover:border-amber-400 dark:hover:border-amber-500/40";
  const hbg    = isCrit ? "bg-red-50 dark:bg-red-500/5" : "bg-amber-50 dark:bg-amber-500/5";
  return (
    <div className={`bg-card border rounded-xl overflow-hidden transition-colors ${bdr} ${fixed?"opacity-55":""}`}>
      <button onClick={()=>setOpen(o=>!o)} className={`w-full flex items-center gap-3 px-5 py-4 text-left ${hbg}`}>
        <Icon size={14} className={`${icnCls} shrink-0`} />
        <span className="text-[13px] font-medium flex-1 truncate">{f.title}</span>
        <SeverityBadge level={f.severity} />
        {fixed && <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono ml-1">✓ fixed</span>}
        {open ? <ChevronUp size={13} className="text-muted-foreground shrink-0" /> : <ChevronDown size={13} className="text-muted-foreground shrink-0" />}
      </button>
      {open && (
        <div className="px-5 pb-5 pt-4 border-t border-border space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-2">What this means</div>
              <p className="text-[13px] text-foreground/85 leading-relaxed">{f.what}</p>
            </div>
            <div>
              <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-2">Why it matters</div>
              <p className="text-[13px] text-foreground/85 leading-relaxed">{f.why}</p>
            </div>
          </div>
          <div className="bg-red-50 dark:bg-red-500/6 border border-red-200 dark:border-red-500/18 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertOctagon size={11} className="text-red-600 dark:text-red-400" />
              <span className="text-[10px] font-mono text-red-600 dark:text-red-400 uppercase tracking-widest">Exploit scenario</span>
            </div>
            <p className="text-[12px] font-mono text-foreground/75 leading-relaxed">{f.exploit}</p>
          </div>
          {f.secret && (
            <div className="flex items-center gap-3 bg-amber-50 dark:bg-amber-500/6 border border-amber-200 dark:border-amber-500/18 rounded-xl p-3.5">
              <AlertTriangle size={12} className="text-amber-600 dark:text-amber-400 shrink-0" />
              <span className="text-[11px] font-mono text-muted-foreground">Detected secret:</span>
              <code className="text-[12px] font-mono text-amber-700 dark:text-amber-300">{show?f.secret:"sk_live_****"}</code>
              <button onClick={()=>setShow(s=>!s)} className="ml-auto p-1 rounded hover:bg-black/5 dark:hover:bg-white/5">
                {show ? <EyeOff size={12} className="text-muted-foreground" /> : <Eye size={12} className="text-muted-foreground" />}
              </button>
            </div>
          )}
          <div>
            <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-2">Suggested fix</div>
            <div className="rounded-xl overflow-hidden border border-border text-[12px] font-mono">
              <div className="bg-red-50 dark:bg-red-950/40 px-4 py-3 flex items-start gap-3 border-b border-border">
                <span className="text-red-500 select-none shrink-0">−</span>
                <code className="text-red-700 dark:text-red-300/85 break-all">{f.before}</code>
              </div>
              <div className="bg-emerald-50 dark:bg-emerald-950/40 px-4 py-3 flex items-start gap-3">
                <span className="text-emerald-600 select-none shrink-0">+</span>
                <code className="text-emerald-700 dark:text-emerald-300/85 break-all">{f.after}</code>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <button onClick={()=>setFixed(v=>!v)}
              className={`flex items-center gap-2 text-[12px] font-medium px-4 py-2 rounded-lg border transition-colors ${
                fixed
                  ? "border-emerald-300 dark:border-emerald-500/35 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10"
                  : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}
            >
              <CheckCircle2 size={13} /> {fixed?"Marked as fixed":"Mark as fixed"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Results ──────────────────────────────────────────────────────────────────
function ResultsView({ onBack }: { onBack:()=>void }) {
  const [tab, setTab] = useState<"all"|"critical"|"warning"|"good">("all");
  return (
    <div className="flex-1 overflow-hidden flex">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto p-8 space-y-6">
          <div>
            <button onClick={onBack} className="text-[12px] font-mono text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 mb-4">
              ← Back to dashboard
            </button>
            <div className="flex items-center justify-between gap-6">
              <div>
                <h1 className="text-xl font-bold font-mono">myapp.vercel.app</h1>
                <p className="text-[12px] font-mono text-muted-foreground mt-1">Website · 2 min ago · 24 checks</p>
              </div>
              <RiskGauge score={67} size="lg" />
            </div>
          </div>
          <div className="flex items-center gap-2.5 flex-wrap">
            {[{icon:RotateCcw,l:"Re-scan"},{icon:Download,l:"Export PDF"},{icon:Share2,l:"Share"}].map(a=>(
              <button key={a.l} className="flex items-center gap-1.5 text-[12px] text-muted-foreground border border-border rounded-lg px-3.5 py-2 hover:border-primary/40 hover:text-foreground transition-colors">
                <a.icon size={12} /> {a.l}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon:XCircle,     count:FINDINGS.critical.length, label:"Must Fix",          col:"text-red-600 dark:text-red-400",     bg:"bg-red-50   border-red-200  dark:bg-red-500/6  dark:border-red-500/20" },
              { icon:AlertTriangle,count:FINDINGS.warning.length, label:"Needs Improvement", col:"text-amber-600 dark:text-amber-400",  bg:"bg-amber-50  border-amber-200 dark:bg-amber-500/6 dark:border-amber-500/20" },
              { icon:CheckCircle2, count:FINDINGS.good.length,    label:"Looks Good",        col:"text-emerald-600 dark:text-emerald-400",bg:"bg-emerald-50 border-emerald-200 dark:bg-emerald-500/6 dark:border-emerald-500/20" },
            ].map(s=>(
              <div key={s.label} className={`border rounded-xl p-4 flex items-center gap-4 ${s.bg}`}>
                <s.icon size={18} className={s.col} />
                <div>
                  <div className={`text-2xl font-bold font-mono ${s.col}`}>{s.count}</div>
                  <div className="text-[11px] text-muted-foreground leading-tight mt-0.5">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-1 bg-secondary border border-border p-1 rounded-xl w-fit">
            {(["all","critical","warning","good"] as const).map(t=>(
              <button key={t} onClick={()=>setTab(t)}
                className={`px-4 py-1.5 rounded-lg text-[12px] font-mono transition-colors ${
                  tab===t ? "bg-card border border-border text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t==="all"?"All":t==="critical"?"🔴 Must Fix":t==="warning"?"⚠️ Warnings":"✅ Passed"}
              </button>
            ))}
          </div>
          {(tab==="all"||tab==="critical") && (
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <XCircle size={13} className="text-red-500" />
                <span className="text-[11px] font-semibold text-red-600 dark:text-red-400 uppercase tracking-wider font-mono">Must Fix</span>
                <div className="flex-1 h-px bg-red-200 dark:bg-red-500/15" />
              </div>
              {FINDINGS.critical.map(f=><FindingCard key={f.id} f={f} variant="critical" />)}
            </div>
          )}
          {(tab==="all"||tab==="warning") && (
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <AlertTriangle size={13} className="text-amber-500" />
                <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider font-mono">Needs Improvement</span>
                <div className="flex-1 h-px bg-amber-200 dark:bg-amber-500/15" />
              </div>
              {FINDINGS.warning.map(f=><FindingCard key={f.id} f={f} variant="warning" />)}
            </div>
          )}
          {(tab==="all"||tab==="good") && (
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 size={13} className="text-emerald-500" />
                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider font-mono">Looks Good</span>
                <div className="flex-1 h-px bg-emerald-200 dark:bg-emerald-500/15" />
              </div>
              <div className="bg-card border border-emerald-200 dark:border-emerald-500/15 rounded-xl overflow-hidden">
                {FINDINGS.good.map((item,i)=>(
                  <div key={i} className={`flex items-center gap-3 px-5 py-3.5 ${i<FINDINGS.good.length-1?"border-b border-border":""}`}>
                    <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                    <span className="text-[13px] text-foreground/80">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Right sidebar */}
      <aside className="w-60 shrink-0 border-l border-border bg-secondary overflow-y-auto p-5 flex flex-col gap-6">
        <div>
          <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-3">Scan Metadata</div>
          <div className="space-y-3">
            {[["Target","myapp.vercel.app"],["Type","Website"],["Scan ID","scn_7k2p9x"],["Checks","24 run"],["Duration","2m 41s"],["Engine","v2.4.1"],["Timestamp","2025-01-15 14:32 UTC"]].map(([k,v])=>(
              <div key={k}>
                <div className="text-[10px] font-mono text-muted-foreground">{k}</div>
                <div className="text-[12px] font-mono text-foreground mt-0.5">{v}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="border-t border-border pt-5 space-y-2">
          <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-3">Actions</div>
          {[{icon:Download,l:"Export PDF report"},{icon:Share2,l:"Share with team"},{icon:Package,l:"Export JSON"}].map(a=>(
            <button key={a.l} className="w-full flex items-center gap-2.5 text-[12px] text-muted-foreground border border-border rounded-lg px-3 py-2.5 hover:border-primary/40 hover:text-foreground bg-card transition-colors text-left">
              <a.icon size={13} className="shrink-0" /> {a.l}
            </button>
          ))}
        </div>
        <div className="border-t border-border pt-5">
          <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-3">Severity breakdown</div>
          {[{lv:"critical",l:"Critical",n:2,w:"45%",col:"bg-red-500"},{lv:"medium",l:"Medium",n:2,w:"45%",col:"bg-amber-500"},{lv:"low",l:"Low",n:0,w:"0%",col:"bg-blue-500"}].map(s=>(
            <div key={s.lv} className="flex items-center gap-2 mb-2">
              <SeverityBadge level={s.lv} />
              <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${s.col}`} style={{width:s.w}} />
              </div>
              <span className="text-[11px] font-mono text-muted-foreground">{s.n}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-border pt-5">
          <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-3">All severity variants</div>
          <div className="flex flex-wrap gap-1.5">
            {SEVERITY_VARIANTS.map(v=><SeverityBadge key={v.level} level={v.level} />)}
          </div>
        </div>
      </aside>
    </div>
  );
}

// ─── Profile Page ─────────────────────────────────────────────────────────────
function ProfilePage() {
  const [ghConnected, setGhConnected] = useState(true);
  const [saved, setSaved] = useState(false);
  const save = () => { setSaved(true); setTimeout(()=>setSaved(false),2000); };
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-2xl mx-auto p-8 space-y-8">
        <div>
          <h1 className="text-xl font-bold mb-1">Edit Profile</h1>
          <p className="text-[13px] text-muted-foreground">Update your personal information and connected accounts.</p>
        </div>

        {/* Avatar */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="font-semibold text-[14px] mb-4">Profile photo</h2>
          <div className="flex items-center gap-5">
            <Avatar initials="AC" size="lg" />
            <div>
              <button className="flex items-center gap-2 text-[13px] font-medium bg-secondary border border-border rounded-lg px-4 py-2 hover:border-primary/40 transition-colors mb-2">
                <Camera size={13} /> Upload photo
              </button>
              <p className="text-[11px] text-muted-foreground">JPG, PNG, or WebP · max 2 MB</p>
            </div>
          </div>
        </div>

        {/* Personal info */}
        <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <h2 className="font-semibold text-[14px] mb-2">Personal information</h2>
          <div className="grid grid-cols-2 gap-4">
            <Field label="First name" placeholder="Alex"    value="Alex" />
            <Field label="Last name"  placeholder="Chen"    value="Chen" />
          </div>
          <Field label="Email"     type="text" placeholder="you@company.com" value="alex@acme.io"
            hint="Changing your email requires re-verification." />
          <Field label="Job title" placeholder="Security Engineer" value="Senior Engineer" />
          <Field label="Company"   placeholder="Acme Inc."         value="Acme Inc." />
        </div>

        {/* Change password */}
        <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <h2 className="font-semibold text-[14px]">Change password</h2>
          <Field label="Current password" type="password" placeholder="••••••••" />
          <Field label="New password"     type="password" placeholder="Min. 8 characters"
            hint="Must be at least 8 characters with a number and symbol." />
          <Field label="Confirm new password" type="password" placeholder="••••••••" />
          <button className="bg-primary text-white text-[13px] font-semibold px-5 py-2.5 rounded-xl hover:bg-primary/90 transition-colors">
            Update password
          </button>
        </div>

        {/* Connected accounts */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="font-semibold text-[14px] mb-4">Connected accounts</h2>
          <div className="space-y-3">
            {[
              { icon:Github, name:"GitHub",  handle:"@alexchen", connected:ghConnected, toggle:()=>setGhConnected(v=>!v) },
              { icon:Mail,   name:"Google",  handle:"alex@gmail.com", connected:false,  toggle:()=>{} },
            ].map(a=>(
              <div key={a.name} className="flex items-center gap-3 py-3 border-b border-border last:border-0">
                <div className="w-9 h-9 bg-secondary border border-border rounded-lg flex items-center justify-center shrink-0">
                  <a.icon size={16} className="text-foreground" />
                </div>
                <div className="flex-1">
                  <div className="text-[13px] font-medium">{a.name}</div>
                  <div className="text-[11px] text-muted-foreground font-mono">{a.connected?a.handle:"Not connected"}</div>
                </div>
                <button onClick={a.toggle}
                  className={`text-[12px] font-medium px-3.5 py-1.5 rounded-lg border transition-colors ${
                    a.connected
                      ? "border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10"
                      : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  }`}
                >
                  {a.connected?"Disconnect":"Connect"}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button className="text-[13px] text-muted-foreground border border-border px-5 py-2.5 rounded-xl hover:border-primary/30 transition-colors">
            Cancel
          </button>
          <button onClick={save}
            className={`flex items-center gap-2 text-[13px] font-semibold px-6 py-2.5 rounded-xl transition-colors ${
              saved ? "bg-emerald-600 dark:bg-emerald-500 text-white" : "bg-primary text-white hover:bg-primary/90"
            }`}
          >
            {saved ? <><CheckCircle2 size={13} /> Saved!</> : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Settings Page ────────────────────────────────────────────────────────────
type SettingSection = "general"|"notifications"|"team"|"apikeys"|"billing";

function SettingsPage() {
  const [section, setSection] = useState<SettingSection>("general");
  const [notifs, setNotifs]   = useState({ scanComplete:true, criticalFound:true, weeklyDigest:false, emailAlerts:true });
  const [keys, setKeys]       = useState(API_KEYS);
  const [showKey, setShowKey] = useState<string|null>(null);
  const [roles, setRoles]     = useState<Record<string,string>>(Object.fromEntries(TEAM_MEMBERS.map(m=>[m.email,m.role])));

  const settingNav: { id:SettingSection; icon:typeof Settings; label:string }[] = [
    { id:"general",       icon:Settings,    label:"General" },
    { id:"notifications", icon:Bell,        label:"Notifications" },
    { id:"team",          icon:Users,       label:"Team" },
    { id:"apikeys",       icon:Key,         label:"API Keys" },
    { id:"billing",       icon:CreditCard,  label:"Billing" },
  ];

  return (
    <div className="flex-1 overflow-hidden flex">
      {/* Settings sub-nav */}
      <div className="w-48 shrink-0 border-r border-border bg-secondary p-4 space-y-0.5">
        <div className="text-[11px] font-mono text-muted-foreground uppercase tracking-widest mb-3 px-2">Settings</div>
        {settingNav.map(n=>(
          <button key={n.id} onClick={()=>setSection(n.id)}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] transition-colors text-left ${
              section===n.id ? "bg-card border border-border text-foreground shadow-sm" : "text-muted-foreground hover:bg-card/60 hover:text-foreground"
            }`}
          >
            <n.icon size={13} /> {n.label}
          </button>
        ))}
      </div>

      {/* Settings content */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-2xl space-y-6">

          {section==="general" && (
            <>
              <div>
                <h2 className="text-lg font-bold mb-1">General</h2>
                <p className="text-[13px] text-muted-foreground">Workspace preferences and defaults.</p>
              </div>
              <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
                <Field label="Workspace name" value="Acme Security" />
                <div className="space-y-1.5">
                  <label className="block text-[13px] font-medium">Timezone</label>
                  <select className="w-full bg-input-background border border-border rounded-xl px-3.5 py-2.5 text-[13px] text-foreground outline-none focus:border-primary/60">
                    <option>UTC−08:00 Pacific Time</option>
                    <option>UTC−05:00 Eastern Time</option>
                    <option>UTC+00:00 London</option>
                    <option>UTC+01:00 Berlin</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[13px] font-medium">Default scan type</label>
                  <div className="flex gap-3">
                    {["Website URL","API Endpoint","APK Upload"].map(t=>(
                      <label key={t} className="flex items-center gap-2 cursor-pointer text-[13px]">
                        <input type="radio" name="scan" className="accent-primary" defaultChecked={t==="Website URL"} /> {t}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <button className="bg-primary text-white text-[13px] font-semibold px-6 py-2.5 rounded-xl hover:bg-primary/90 transition-colors">Save changes</button>
              </div>
            </>
          )}

          {section==="notifications" && (
            <>
              <div>
                <h2 className="text-lg font-bold mb-1">Notifications</h2>
                <p className="text-[13px] text-muted-foreground">Control how and when Solvane contacts you.</p>
              </div>
              <div className="bg-card border border-border rounded-2xl divide-y divide-border overflow-hidden">
                {[
                  { key:"scanComplete" as const,  label:"Scan complete",         desc:"Email when a scan finishes" },
                  { key:"criticalFound" as const,  label:"Critical finding found", desc:"Immediate alert for critical severity" },
                  { key:"weeklyDigest" as const,  label:"Weekly digest",          desc:"Summary of all scans every Monday" },
                  { key:"emailAlerts" as const,   label:"Email alerts",           desc:"Receive all alerts via email" },
                ].map(n=>(
                  <div key={n.key} className="flex items-center justify-between px-6 py-4">
                    <div>
                      <div className="text-[13px] font-medium">{n.label}</div>
                      <div className="text-[12px] text-muted-foreground mt-0.5">{n.desc}</div>
                    </div>
                    <Toggle on={notifs[n.key]} onToggle={()=>setNotifs(prev=>({...prev,[n.key]:!prev[n.key]}))} />
                  </div>
                ))}
              </div>
            </>
          )}

          {section==="team" && (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold mb-1">Team</h2>
                  <p className="text-[13px] text-muted-foreground">Manage members and roles.</p>
                </div>
                <button className="flex items-center gap-2 bg-primary text-white text-[13px] font-semibold px-4 py-2 rounded-xl hover:bg-primary/90 transition-colors">
                  <Plus size={13} /> Invite member
                </button>
              </div>
              <div className="bg-card border border-border rounded-2xl overflow-hidden">
                <div className="grid grid-cols-[1fr_auto_auto] gap-4 px-5 py-3 border-b border-border text-[11px] font-mono text-muted-foreground uppercase tracking-wider">
                  <span>Member</span><span>Role</span><span />
                </div>
                {TEAM_MEMBERS.map(m=>(
                  <div key={m.email} className="grid grid-cols-[1fr_auto_auto] items-center gap-4 px-5 py-4 border-b border-border last:border-0">
                    <div className="flex items-center gap-3">
                      <Avatar initials={m.avatar} />
                      <div>
                        <div className="text-[13px] font-medium">{m.name}</div>
                        <div className="text-[11px] text-muted-foreground font-mono">{m.email}</div>
                      </div>
                    </div>
                    <select value={roles[m.email]} onChange={e=>setRoles(r=>({...r,[m.email]:e.target.value}))}
                      className="bg-secondary border border-border rounded-lg px-2.5 py-1.5 text-[12px] text-foreground outline-none">
                      <option>Admin</option><option>Member</option>
                    </select>
                    <button className="text-[12px] text-red-500 hover:text-red-600 transition-colors p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-500/10">
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          {section==="apikeys" && (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold mb-1">API Keys</h2>
                  <p className="text-[13px] text-muted-foreground">Manage keys for CI/CD and integrations.</p>
                </div>
                <button className="flex items-center gap-2 bg-primary text-white text-[13px] font-semibold px-4 py-2 rounded-xl hover:bg-primary/90 transition-colors">
                  <Plus size={13} /> Create key
                </button>
              </div>
              <div className="bg-card border border-border rounded-2xl overflow-hidden">
                <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-5 py-3 border-b border-border text-[11px] font-mono text-muted-foreground uppercase tracking-wider">
                  <span>Name</span><span>Created</span><span>Last used</span><span />
                </div>
                {keys.map(k=>(
                  <div key={k.id} className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-4 px-5 py-4 border-b border-border last:border-0">
                    <div>
                      <div className="text-[13px] font-medium">{k.name}</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <code className="text-[11px] font-mono text-muted-foreground">
                          {showKey===k.id ? `${k.prefix}••••••••••••` : `${k.prefix}••••••••••••`}
                        </code>
                        <button onClick={()=>{navigator.clipboard?.writeText(k.prefix+"••••").catch(()=>{})}} className="p-0.5 hover:text-primary transition-colors">
                          <Copy size={10} className="text-muted-foreground" />
                        </button>
                      </div>
                    </div>
                    <span className="text-[12px] text-muted-foreground font-mono">{k.created}</span>
                    <span className="text-[12px] text-muted-foreground font-mono">{k.last}</span>
                    <button onClick={()=>setKeys(prev=>prev.filter(x=>x.id!==k.id))}
                      className="text-[12px] text-red-500 hover:text-red-600 p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
              <p className="text-[12px] text-muted-foreground">Keys are shown in full only at creation time. Store them securely.</p>
            </>
          )}

          {section==="billing" && (
            <>
              <div>
                <h2 className="text-lg font-bold mb-1">Billing</h2>
                <p className="text-[13px] text-muted-foreground">Manage your plan and usage.</p>
              </div>
              {/* Current plan */}
              <div className="bg-card border border-primary/30 rounded-2xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="text-[11px] font-mono text-primary uppercase tracking-widest mb-1">Current plan</div>
                    <h3 className="text-xl font-bold">Pro</h3>
                    <p className="text-[13px] text-muted-foreground mt-1">$49 / month · Billed monthly</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-primary bg-primary/8 border border-primary/20 px-3 py-1.5 rounded-lg">
                    <Zap size={10} /> Active
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                  {[{l:"Scans used",v:"24 / 100"},{l:"Team seats",v:"4 / 10"},{l:"APK scans",v:"3 / 20"}].map(u=>(
                    <div key={u.l}>
                      <div className="text-[11px] text-muted-foreground mb-1">{u.l}</div>
                      <div className="text-[13px] font-mono font-semibold">{u.v}</div>
                      <div className="w-full h-1 bg-border rounded-full mt-1.5 overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{width:u.v.includes("24")||u.v.includes("3 /")?"24%":"40%"}} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Upgrade */}
              <div className="bg-secondary border border-border rounded-2xl p-6 flex items-center justify-between gap-6">
                <div>
                  <h3 className="font-semibold mb-1">Upgrade to Enterprise</h3>
                  <p className="text-[13px] text-muted-foreground">Unlimited scans, SSO, SLA, and dedicated support.</p>
                </div>
                <button className="shrink-0 flex items-center gap-2 bg-primary text-white text-[13px] font-semibold px-5 py-2.5 rounded-xl hover:bg-primary/90 transition-colors">
                  Upgrade plan <ArrowRight size={13} />
                </button>
              </div>
              {/* Billing info */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="font-semibold text-[14px] mb-4">Payment method</h3>
                <div className="flex items-center gap-3 py-3 border border-border rounded-xl px-4">
                  <CreditCard size={16} className="text-muted-foreground" />
                  <div className="flex-1">
                    <div className="text-[13px] font-medium">Visa ending in 4242</div>
                    <div className="text-[11px] text-muted-foreground">Expires 08/27</div>
                  </div>
                  <button className="text-[12px] text-primary hover:underline">Update</button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── URL Routing Mappings ──────────────────────────────────────────────────────
const PATH_TO_SCREEN: Record<string, Screen> = {
  "/": "landing",
  "/product": "product",
  "/pricing": "pricing",
  "/docs": "docs",
  "/blog": "blog",
  "/login": "login",
  "/signup": "signup",
  "/forgot": "forgot",
  "/forgot-password": "forgot",
  "/verify": "verify",
  "/verify-email": "verify",
  "/reset-password": "reset-password",
  "/dashboard": "dashboard",
  "/results": "results",
  "/new-scan": "empty",
  "/profile": "profile",
  "/settings": "settings",
};

const SCREEN_TO_PATH: Record<Screen, string> = {
  landing: "/",
  product: "/product",
  pricing: "/pricing",
  docs: "/docs",
  blog: "/blog",
  login: "/login",
  signup: "/signup",
  forgot: "/forgot-password",
  verify: "/verify-email",
  "reset-password": "/reset-password",
  dashboard: "/dashboard",
  results: "/results",
  empty: "/new-scan",
  profile: "/profile",
  settings: "/settings",
};

function getScreenFromPath(): Screen {
  if (typeof window === "undefined") return "landing";
  const path = window.location.pathname;
  return PATH_TO_SCREEN[path] || "landing";
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState<Screen>(getScreenFromPath);
  const [dark, setDark]     = useState(false);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);

  const toggleDark = () => setDark(d=>!d);

  // On mount: handle OAuth ?token= callback, then try to restore any existing session
  useEffect(() => {
    const init = async () => {
      // 1. Check if we're returning from an OAuth provider with a ?token= param
      const oauthUser = await authApi.handleOAuthCallback();
      if (oauthUser) {
        setCurrentUser(oauthUser);
        setSessionLoading(false);
        // Navigate to dashboard after OAuth success
        setScreen("dashboard");
        window.history.replaceState({}, "", "/dashboard");
        return;
      }

      // 2. Try to restore an existing session from localStorage / refresh cookie
      const restoredUser = await authApi.restoreSession();
      if (restoredUser) {
        setCurrentUser(restoredUser);
      }
      setSessionLoading(false);
    };
    init();
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      setScreen(getScreenFromPath());
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const onNav = (s: Screen) => {
    setScreen(s);
    const targetPath = SCREEN_TO_PATH[s] || "/";
    if (window.location.pathname !== targetPath) {
      window.history.pushState({}, "", targetPath);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const breadcrumbs: Partial<Record<Screen,string>> = {
    dashboard:"Dashboard", results:"Scan Results", empty:"New Scan",
    profile:"Profile", settings:"Settings",
  };

  const isDashboard = ["dashboard","results","empty","profile","settings"].includes(screen);

  if (sessionLoading) {
    return (
      <div className={dark?"dark":""}>
        <div className="min-h-screen bg-background flex items-center justify-center" style={{fontFamily:"'Inter',sans-serif"}}>
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center">
              <Shield size={18} className="text-primary" />
            </div>
            <Loader2 size={20} className="text-primary animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={dark?"dark":""}>
      <div className="min-h-screen bg-background text-foreground" style={{fontFamily:"'Inter',sans-serif"}}>
        {screen==="landing"        && <Landing           onNav={onNav} dark={dark} toggleDark={toggleDark} />}
        {screen==="product"        && <ProductPage       onNav={onNav} dark={dark} toggleDark={toggleDark} />}
        {screen==="pricing"        && <PricingPage       onNav={onNav} dark={dark} toggleDark={toggleDark} />}
        {screen==="docs"           && <DocsPage          onNav={onNav} dark={dark} toggleDark={toggleDark} />}
        {screen==="blog"           && <BlogPage          onNav={onNav} dark={dark} toggleDark={toggleDark} />}
        {screen==="login"          && <LoginScreen       onNav={onNav} dark={dark} toggleDark={toggleDark} onLoginSuccess={setCurrentUser} />}
        {screen==="signup"         && <SignupScreen      onNav={onNav} dark={dark} toggleDark={toggleDark} onLoginSuccess={setCurrentUser} />}
        {screen==="forgot"         && <ForgotScreen      onNav={onNav} dark={dark} toggleDark={toggleDark} />}
        {screen==="verify"         && <VerifyScreen      onNav={onNav} dark={dark} toggleDark={toggleDark} user={currentUser} />}
        {screen==="reset-password" && <ResetPasswordPage onNav={onNav} dark={dark} toggleDark={toggleDark} />}

        {isDashboard && (
          <div className="flex h-screen overflow-hidden">
            <AppSidebar screen={screen} onNav={onNav} onScreen={setScreen} />
            <div className="flex flex-col flex-1 overflow-hidden">
              <AppTopBar
                onLanding={()=>onNav("landing")}
                dark={dark} toggleDark={toggleDark}
                breadcrumb={breadcrumbs[screen]??""}
              />

              {/* Persistent Unverified Email Banner */}
              {currentUser && !currentUser.email_verified && (
                <div className="bg-amber-50 dark:bg-amber-500/15 border-b border-amber-200 dark:border-amber-500/30 px-6 py-2.5 flex items-center justify-between text-[12.5px] text-amber-900 dark:text-amber-200 shrink-0">
                  <div className="flex items-center gap-2">
                    <AlertTriangle size={15} className="text-amber-600 dark:text-amber-400 shrink-0" />
                    <span>
                      <strong>Email Verification Required:</strong> Please verify your email address ({currentUser.email}). Scan creation is restricted until verified.
                    </span>
                  </div>
                  <button
                    onClick={() => onNav("verify")}
                    className="text-[11.5px] font-bold text-amber-900 dark:text-amber-100 bg-amber-200/60 dark:bg-amber-500/30 px-3 py-1 rounded-md hover:bg-amber-300/60 transition-colors cursor-pointer"
                  >
                    Resend Email
                  </button>
                </div>
              )}

              {screen==="dashboard" && <DashOverview onResults={()=>setScreen("results")} />}
              {screen==="results"   && <ResultsView  onBack={()=>setScreen("dashboard")} />}
              {screen==="empty"     && <EmptyState   onNew={()=>setScreen("dashboard")} />}
              {screen==="profile"   && <ProfilePage />}
              {screen==="settings"  && <SettingsPage />}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
