import { useState } from "react";
import {
  Globe, Code2, Smartphone, ArrowRight, CheckCircle2, Zap, Lock,
  Terminal, ExternalLink, Cpu, GitBranch, AlertTriangle, Copy, Check,
  Layers, ShieldAlert, FileCode2, RefreshCw, Send, CheckCircle, Database
} from "lucide-react";
import { Navbar, Screen } from "../components/Navbar";
import { Footer } from "../components/Footer";

interface ProductPageProps {
  onNav: (s: Screen) => void;
  dark: boolean;
  toggleDark: () => void;
}

export function ProductPage({ onNav, dark, toggleDark }: ProductPageProps) {
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeScannerTab, setActiveScannerTab] = useState<"web" | "api" | "apk">("web");

  const copyDiff = () => {
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const integrations = [
    { name: "GitHub Actions", category: "CI/CD", desc: "Automate security scans on every pull request." },
    { name: "GitLab CI", category: "CI/CD", desc: "Block merging vulnerable code with native pipelines." },
    { name: "Bitbucket", category: "VCS", desc: "Scan repositories and inline pull request comments." },
    { name: "Vercel", category: "Hosting", desc: "Automatic deployment preview security testing." },
    { name: "CircleCI", category: "CI/CD", desc: "Fail builds on critical security vulnerabilities." },
    { name: "Jenkins", category: "Automation", desc: "Custom build steps & automated report generation." },
    { name: "Slack", category: "Alerts", desc: "Instant notifications for critical vulnerability alerts." },
    { name: "PagerDuty", category: "Incident", desc: "Trigger on-call escalations for zero-day findings." },
    { name: "Webhooks", category: "API", desc: "Custom JSON webhook payloads for any SIEM or tool." },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <Navbar currentScreen="product" onNav={onNav} dark={dark} toggleDark={toggleDark} />

      <main className="flex-1 pt-14">
        {/* Hero Section */}
        <section className="pt-24 pb-16 px-6 relative overflow-hidden">
          {/* Dot Grid Background */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.35] dark:opacity-[0.20]"
            style={{
              backgroundImage: `radial-gradient(#cbd5e1 2px, transparent 2px)`,
              backgroundSize: `20px 20px`
            }}
          />
          {/* Radial Blue Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,0.12)_0%,rgba(37,99,235,0.03)_50%,transparent_70%)] pointer-events-none blur-3xl z-0" />

          <div className="max-w-7xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-semibold mb-6">
              <Zap size={12} /> Complete Attack Surface Protection
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight max-w-4xl mx-auto text-foreground">
              Automated security testing for <span className="text-blue-600 dark:text-blue-400">websites, APIs & APKs</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-8">
              Solvane continuously tests your applications using 200+ AI-driven exploit vectors, turning complex security findings into copy-pasteable code fixes.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
              <button
                onClick={() => onNav("signup")}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-5 py-2.5 rounded-md transition-colors cursor-pointer shadow-none"
              >
                Start free scan <ArrowRight size={16} />
              </button>
              <button
                onClick={() => onNav("docs")}
                className="flex items-center gap-2 border border-border bg-background text-foreground font-medium text-sm px-5 py-2.5 rounded-md hover:bg-secondary/70 transition-colors cursor-pointer"
              >
                Explore Documentation
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-6 border-t border-border/60">
              <div className="p-4 bg-card border border-border/80 rounded-2xl">
                <div className="text-2xl font-extrabold tracking-tight text-blue-600 dark:text-blue-400">&lt; 3 mins</div>
                <div className="text-xs text-muted-foreground mt-1 font-medium">Average scan duration</div>
              </div>
              <div className="p-4 bg-card border border-border/80 rounded-2xl">
                <div className="text-2xl font-extrabold tracking-tight text-emerald-600 dark:text-emerald-400">200+</div>
                <div className="text-xs text-muted-foreground mt-1 font-medium">AI attack vectors</div>
              </div>
              <div className="p-4 bg-card border border-border/80 rounded-2xl">
                <div className="text-2xl font-extrabold tracking-tight text-amber-500">0%</div>
                <div className="text-xs text-muted-foreground mt-1 font-medium">PDF bloat — code diffs only</div>
              </div>
              <div className="p-4 bg-card border border-border/80 rounded-2xl">
                <div className="text-2xl font-extrabold tracking-tight text-blue-600 dark:text-blue-400">100%</div>
                <div className="text-xs text-muted-foreground mt-1 font-medium">Ownership verified safety</div>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Scanner Navigation Tabs */}
        <section className="py-8 px-6 bg-secondary/50 border-y border-border/80">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 overflow-x-auto py-2">
            <button
              onClick={() => setActiveScannerTab("web")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-md font-semibold text-xs transition-all cursor-pointer ${
                activeScannerTab === "web"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-background border border-border text-muted-foreground hover:text-foreground hover:border-blue-600/40"
              }`}
            >
              <Globe size={15} /> Website Scanner
            </button>
            <button
              onClick={() => setActiveScannerTab("api")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-md font-semibold text-xs transition-all cursor-pointer ${
                activeScannerTab === "api"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-background border border-border text-muted-foreground hover:text-foreground hover:border-blue-600/40"
              }`}
            >
              <Code2 size={15} /> API Scanner
            </button>
            <button
              onClick={() => setActiveScannerTab("apk")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-md font-semibold text-xs transition-all cursor-pointer ${
                activeScannerTab === "apk"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-background border border-border text-muted-foreground hover:text-foreground hover:border-blue-600/40"
              }`}
            >
              <Smartphone size={15} /> APK Scanner
            </button>
          </div>
        </section>

        {/* Scanner 1: Website Scanner */}
        <section id="scanner-website" className={`py-16 px-6 border-b border-border/80 ${activeScannerTab !== "web" ? "hidden" : "block"}`}>
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 text-xs font-semibold mb-4">
                <Globe size={12} /> Scanner 01 · Web Surfaces
              </div>
              <h2 className="text-3xl font-bold tracking-tight mb-4">
                Website & Web App Vulnerability Scanner
              </h2>
              <p className="text-[15px] text-muted-foreground leading-relaxed mb-6">
                Deep-crawls single-page applications (SPAs), SSR apps, and legacy websites to discover exposed attack vectors, missing security headers, CSRF, and injection flaws.
              </p>

              <div className="space-y-3 mb-8">
                {[
                  { title: "Full DOM & Endpoint Crawler", desc: "Discovers hidden routes, dynamic query parameters, and unlinked endpoints." },
                  { title: "Header & Security Policy Validation", desc: "Audits CSP, HSTS, X-Frame-Options, CORS origin wildcard leaks, and cookie security flags." },
                  { title: "XSS & Open Redirect Fuzzing", desc: "Simulates payload injection across inputs, headers, and URL query strings." },
                  { title: "Subdomain & Port Exposure", desc: "Identifies dangling DNS, exposed dev services, and open management ports." }
                ].map((feat) => (
                  <div key={feat.title} className="flex items-start gap-3 p-3 rounded-xl bg-card border border-border/80">
                    <CheckCircle2 size={16} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-[13px] font-semibold">{feat.title}</h4>
                      <p className="text-[12px] text-muted-foreground">{feat.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => onNav("signup")}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-5 py-2.5 rounded-md transition-colors cursor-pointer"
              >
                Scan your website free <ArrowRight size={14} />
              </button>
            </div>

            {/* Mock UI Screenshot / Preview */}
            <div className="bg-card border border-border/80 rounded-2xl shadow-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 bg-secondary border-b border-border/80">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-400 opacity-80" />
                  <span className="w-3 h-3 rounded-full bg-amber-400 opacity-80" />
                  <span className="w-3 h-3 rounded-full bg-emerald-400 opacity-80" />
                  <span className="text-xs text-muted-foreground ml-2 font-medium">web-scanner://app.company.com</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200">
                  SCAN COMPLETE
                </span>
              </div>
              <div className="p-6 space-y-4 text-xs">
                <div className="p-3 bg-secondary/80 rounded-xl border border-border/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe size={14} className="text-blue-600 dark:text-blue-400" />
                    <span>Target: <strong className="text-foreground font-semibold">https://app.company.com</strong></span>
                  </div>
                  <span className="text-muted-foreground">Crawl depth: 4</span>
                </div>

                <div className="space-y-2">
                  <div className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">Crawl Findings Summary</div>

                  <div className="p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-300 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldAlert size={14} />
                      <span className="font-medium">Content-Security-Policy header is missing</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 bg-red-600 text-white font-bold rounded">HIGH</span>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-300 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle size={14} />
                      <span className="font-medium">CORS Access-Control-Allow-Origin set to wildcard (*)</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 bg-amber-500 text-white font-bold rounded">MEDIUM</span>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-300 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle size={14} />
                      <span className="font-medium">TLS 1.3 enforced · HSTS preload active</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 bg-emerald-600 text-white font-bold rounded">PASSED</span>
                  </div>
                </div>

                <div className="p-3 bg-card border border-border/80 rounded-xl">
                  <div className="text-[11px] text-muted-foreground mb-1 font-semibold">AUTOMATED REMEDIATION SUGGESTION</div>
                  <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">Add strict Header directive in nginx.conf or Next.js config</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Scanner 2: API Scanner */}
        <section id="scanner-api" className={`py-16 px-6 bg-secondary/30 border-b border-border/80 ${activeScannerTab !== "api" ? "hidden" : "block"}`}>
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
            {/* Mock UI Screenshot / Preview */}
            <div className="order-2 lg:order-1 bg-card border border-border/80 rounded-2xl shadow-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 bg-secondary border-b border-border/80">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-400 opacity-80" />
                  <span className="w-3 h-3 rounded-full bg-amber-400 opacity-80" />
                  <span className="w-3 h-3 rounded-full bg-emerald-400 opacity-80" />
                  <span className="text-xs text-muted-foreground ml-2 font-medium">api-scanner://api.company.com/v1/swagger.json</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400 border border-violet-200">
                  OPENAPI PARSED
                </span>
              </div>
              <div className="p-6 space-y-4 text-xs">
                <div className="p-3 bg-secondary/80 rounded-xl border border-border/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Code2 size={14} className="text-violet-500" />
                    <span>Schema: <strong className="text-foreground font-semibold">OpenAPI 3.0 (42 routes)</strong></span>
                  </div>
                  <span className="text-violet-600 dark:text-violet-400 font-bold">BOLA Test Active</span>
                </div>

                <div className="space-y-2">
                  <div className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">Detected API Vulnerabilities</div>

                  <div className="p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-300">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold">CRITICAL · Broken Object Level Auth (BOLA)</span>
                      <span className="text-[10px] px-2 py-0.5 bg-red-600 text-white rounded font-bold">CVE-2024-BOLA</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      GET /api/v1/users/102 allows User A to view User B&#39;s private profile data without authorization.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-300">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold">MEDIUM · Missing Rate Limiting</span>
                      <span className="text-[10px] px-2 py-0.5 bg-amber-500 text-white rounded font-bold">LIMIT</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      POST /api/v1/auth/login accepts &gt; 500 requests/sec with no throttling.
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-secondary rounded-xl border border-border/80">
                  <div className="text-[11px] text-muted-foreground font-semibold">FUZZER PAYLOAD USED</div>
                  <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                    GET /api/v1/users/999 HTTP/1.1 Header: Authorization Bearer (User_A_Token)
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400 border border-violet-200 dark:border-violet-500/20 text-xs font-semibold mb-4">
                <Code2 size={12} /> Scanner 02 · REST & GraphQL APIs
              </div>
              <h2 className="text-3xl font-bold tracking-tight mb-4">
                Schema-Aware API Security Fuzzer
              </h2>
              <p className="text-[15px] text-muted-foreground leading-relaxed mb-6">
                Parse OpenAPI, Swagger, or GraphQL schemas to automatically construct stateful API tests that uncover authorization flaws, data leaks, and broken business logic.
              </p>

              <div className="space-y-3 mb-8">
                {[
                  { title: "BOLA / IDOR Testing", desc: "Tests horizontal and vertical authorization across user contexts." },
                  { title: "JWT & Token Audit", desc: "Checks algorithm downgrade attacks, missing expiry claims, and weak signatures." },
                  { title: "Mass Assignment & Payload Injection", desc: "Fuzzes request bodies for unintended property overwrites." },
                  { title: "Rate Limit & Throttling Verification", desc: "Ensures auth & payment endpoints enforce strict request budgets." }
                ].map((feat) => (
                  <div key={feat.title} className="flex items-start gap-3 p-3 rounded-xl bg-card border border-border/80">
                    <CheckCircle2 size={16} className="text-violet-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-[13px] font-semibold">{feat.title}</h4>
                      <p className="text-[12px] text-muted-foreground">{feat.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => onNav("signup")}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-5 py-2.5 rounded-md transition-colors cursor-pointer"
              >
                Scan your API endpoints <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </section>

        {/* Scanner 3: APK Scanner */}
        <section id="scanner-apk" className={`py-16 px-6 border-b border-border/80 ${activeScannerTab !== "apk" ? "hidden" : "block"}`}>
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 text-xs font-semibold mb-4">
                <Smartphone size={12} /> Scanner 03 · Android APK Mobile
              </div>
              <h2 className="text-3xl font-bold tracking-tight mb-4">
                Android APK Static & Dynamic Decompiler
              </h2>
              <p className="text-[15px] text-muted-foreground leading-relaxed mb-6">
                Upload your Android `.apk` package to decompile DEX bytecode, scan for hardcoded secrets, analyze AndroidManifest permissions, and audit local SQLite storage.
              </p>

              <div className="space-y-3 mb-8">
                {[
                  { title: "Bytecode Decompilation & Secret Scanner", desc: "Detects exposed AWS credentials, Stripe secret keys, and Firebase tokens." },
                  { title: "AndroidManifest Audit", desc: "Flags exported activities, dangerous permissions, and debuggable flags." },
                  { title: "Insecure Storage & Crypto Analysis", desc: "Verifies SharedPreferences encryption and weak AES/DES implementations." },
                  { title: "Dependency Vulnerability Scan", desc: "Maps compiled third-party JARs/AARs against known CVE databases." }
                ].map((feat) => (
                  <div key={feat.title} className="flex items-start gap-3 p-3 rounded-xl bg-card border border-border/80">
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-[13px] font-semibold">{feat.title}</h4>
                      <p className="text-[12px] text-muted-foreground">{feat.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => onNav("signup")}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-5 py-2.5 rounded-md transition-colors cursor-pointer"
              >
                Scan an APK package <ArrowRight size={14} />
              </button>
            </div>

            {/* Mock UI Screenshot / Preview */}
            <div className="bg-card border border-border/80 rounded-2xl shadow-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 bg-secondary border-b border-border/80">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-400 opacity-80" />
                  <span className="w-3 h-3 rounded-full bg-amber-400 opacity-80" />
                  <span className="w-3 h-3 rounded-full bg-emerald-400 opacity-80" />
                  <span className="text-xs text-muted-foreground ml-2 font-medium">apk-scanner://com.acme.mobileapp.apk</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200">
                  DECOMPILED
                </span>
              </div>
              <div className="p-6 space-y-4 text-xs">
                <div className="p-3 bg-secondary/80 rounded-xl border border-border/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone size={14} className="text-emerald-500" />
                    <span>Package: <strong className="text-foreground font-semibold">com.acme.mobileapp (v2.4.1)</strong></span>
                  </div>
                  <span className="text-muted-foreground">Size: 18.4 MB</span>
                </div>

                <div className="space-y-2">
                  <div className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">Discovered Hardcoded Secrets</div>

                  <div className="p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-300">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold">CRITICAL · Hardcoded AWS Access Key</span>
                      <span className="text-[10px] px-2 py-0.5 bg-red-600 text-white rounded font-bold">BuildConfig.java</span>
                    </div>
                    <code className="text-[11px] font-mono bg-red-100 dark:bg-red-950/60 px-2 py-1 rounded block mt-1 overflow-x-auto text-red-800 dark:text-red-200">
                      public static final String AWS_KEY = &quot;AKIAIOSFODNN7EXAMPLE&quot;;
                    </code>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-300">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold">MEDIUM · Exported Activity Without Permission</span>
                      <span className="text-[10px] px-2 py-0.5 bg-amber-500 text-white rounded font-bold">AndroidManifest.xml</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground font-sans">
                      &lt;activity android:name=&quot;.DeepLinkActivity&quot; android:exported=&quot;true&quot; /&gt;
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-secondary rounded-xl border border-border/80">
                  <div className="text-[11px] text-muted-foreground font-semibold">RECOMMENDED ACTION</div>
                  <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">Move AWS keys to AWS Secrets Manager / Android KeyStore.</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section: How the AI Report Works */}
        <section className="py-24 px-6 bg-secondary/50 border-b border-border/80">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-semibold mb-3">
                <Cpu size={12} /> AI Remediation Engine
              </div>
              <h2 className="text-3xl font-bold tracking-tight mb-4">
                How the AI Security Report Works
              </h2>
              <p className="text-[15px] text-muted-foreground leading-relaxed">
                Traditional security scanners dump 80-page PDFs with cryptic errors. Solvane provides clear context and line-by-line code diffs ready for your codebase.
              </p>
            </div>

            {/* Sample Finding Card */}
            <div className="bg-card border border-border/80 rounded-2xl shadow-xl overflow-hidden max-w-4xl mx-auto">
              <div className="p-6 border-b border-border/80 flex flex-wrap items-center justify-between gap-4 bg-muted/30">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wider bg-red-50 text-red-600 border border-red-200 dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/30">
                    CRITICAL SEVERITY
                  </span>
                  <h3 className="text-lg font-bold">SQL Injection in <code className="font-mono text-blue-600 dark:text-blue-400 text-sm">/api/search</code></h3>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground font-semibold">
                  <span>Category: Injection</span>
                  <span>·</span>
                  <span>CWE-89</span>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* 3-Column Breakdown: What, Why, Exploit */}
                <div className="grid md:grid-cols-3 gap-4 text-[13px]">
                  <div className="p-4 bg-secondary rounded-xl border border-border/80">
                    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5 font-bold">What Happened</div>
                    <p className="text-foreground/90 leading-snug">
                      The <code className="font-mono text-xs bg-muted px-1 py-0.5 rounded">?q=</code> parameter is interpolated directly into raw SQL without sanitization.
                    </p>
                  </div>
                  <div className="p-4 bg-secondary rounded-xl border border-border/80">
                    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5 font-bold">Why It Matters</div>
                    <p className="text-foreground/90 leading-snug">
                      An attacker can read, modify, or drop any database row, including passwords and payment data.
                    </p>
                  </div>
                  <div className="p-4 bg-secondary rounded-xl border border-border/80">
                    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5 font-bold">Exploit Scenario</div>
                    <p className="text-foreground/90 leading-snug font-mono text-[11px] text-red-600 dark:text-red-400">
                      GET /api/search?q=&#39; OR 1=1; DROP TABLE users; --
                    </p>
                  </div>
                </div>

                {/* Side-by-side Code Diff */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Side-by-Side Remediation Diff
                    </span>
                    <button
                      onClick={copyDiff}
                      className="flex items-center gap-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                    >
                      {copiedCode ? <Check size={12} /> : <Copy size={12} />}
                      {copiedCode ? "Copied diff!" : "Copy fix"}
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Before */}
                    <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-500/30 rounded-xl p-4 text-xs">
                      <div className="text-red-700 dark:text-red-400 text-[11px] font-bold mb-2 pb-1 border-b border-red-200 dark:border-red-500/20">
                        ❌ VULNERABLE CODE (BEFORE)
                      </div>
                      <pre className="text-red-900 dark:text-red-200 leading-relaxed overflow-x-auto font-mono font-medium">
{`// Interpolating unsanitized input
const q = \`SELECT * FROM items 
           WHERE name = '\${req.query.q}'\`;
const results = await db.query(q);`}
                      </pre>
                    </div>

                    {/* After */}
                    <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/30 rounded-xl p-4 text-xs">
                      <div className="text-emerald-700 dark:text-emerald-400 text-[11px] font-bold mb-2 pb-1 border-b border-emerald-200 dark:border-emerald-500/20">
                        ✅ SECURED CODE (AFTER - SOLVANE AI FIX)
                      </div>
                      <pre className="text-emerald-900 dark:text-emerald-200 leading-relaxed overflow-x-auto font-mono font-medium">
{`// Using parameterized queries
const q = 'SELECT * FROM items WHERE name = ?';
const results = await db.query(q, [
  req.query.q
]);`}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section: Integrations */}
        <section className="py-20 px-6 border-b border-border/80">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <div className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">Ecosystem</div>
              <h2 className="text-3xl font-bold tracking-tight mb-3">Integrates with your existing workflow</h2>
              <p className="text-[14px] text-muted-foreground">
                Plug Solvane directly into your CI/CD pipelines, code repositories, and incident response tools.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {integrations.map((item) => (
                <div key={item.name} className="p-5 bg-card border border-border/80 rounded-2xl hover:border-blue-500/40 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-[15px]">{item.name}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-[13px] text-muted-foreground leading-snug">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Closing CTA Banner */}
        <section className="py-20 px-6 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
              Secure your application stack today
            </h2>
            <p className="text-blue-100 text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
              Start your first automated security scan in less than 60 seconds. Free forever for developers and small teams.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => onNav("signup")}
                className="bg-white text-blue-600 font-bold text-sm px-6 py-3 rounded-md hover:bg-blue-50 transition-colors shadow-md cursor-pointer"
              >
                Get Started Free
              </button>
              <button
                onClick={() => onNav("pricing")}
                className="bg-white/10 border border-white/30 text-white font-semibold text-sm px-6 py-3 rounded-md hover:bg-white/20 transition-colors cursor-pointer"
              >
                View Pricing Plans
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer onNav={onNav} />
    </div>
  );
}
