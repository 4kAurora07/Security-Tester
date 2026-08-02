import { useState } from "react";
import {
  BookOpen, ChevronRight, ChevronDown, Terminal, Copy, Check, Search,
  AlertTriangle, ShieldCheck, Info, FileCode2, ExternalLink, Zap, Code2
} from "lucide-react";
import { Navbar, Screen } from "../components/Navbar";
import { Footer } from "../components/Footer";

interface DocsPageProps {
  onNav: (s: Screen) => void;
  dark: boolean;
  toggleDark: () => void;
}

interface DocArticle {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  sections: { id: string; title: string }[];
}

export function DocsPage({ onNav, dark, toggleDark }: DocsPageProps) {
  const [activeCategory, setActiveCategory] = useState("Getting Started");
  const [activeArticleId, setActiveArticleId] = useState("quickstart");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const copyCode = (code: string, key: string) => {
    navigator.clipboard?.writeText(code).catch(() => {});
    setCopiedCode(key);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const navTree = [
    {
      category: "Getting Started",
      items: [
        { id: "quickstart", title: "Quickstart Guide" },
        { id: "installation", title: "CLI & SDK Installation" },
        { id: "ownership", title: "Ownership Verification" },
      ]
    },
    {
      category: "Website Scanner",
      items: [
        { id: "web-crawling", title: "URL Crawling & DOM Rules" },
        { id: "web-headers", title: "Custom Headers & Auth Cookies" },
      ]
    },
    {
      category: "API Scanner",
      items: [
        { id: "api-openapi", title: "Importing OpenAPI / Postman" },
        { id: "api-tokens", title: "Auth Tokens & Bearer Headers" },
        { id: "api-rate-limits", title: "Rate Limit & Throttling Rules" },
      ]
    },
    {
      category: "APK Scanner",
      items: [
        { id: "apk-upload", title: "Uploading .apk & Manifest Audit" },
        { id: "apk-proguard", title: "Decompilation & Proguard Rules" },
      ]
    },
    {
      category: "API Reference",
      items: [
        { id: "ref-auth", title: "API Key Authentication" },
        { id: "ref-scans", title: "GET /v1/scans Endpoint" },
        { id: "ref-reports", title: "GET /v1/reports Endpoint" },
      ]
    },
    {
      category: "Webhooks",
      items: [
        { id: "webhooks-config", title: "Configuring Webhook Alerts" },
        { id: "webhooks-signature", title: "Payload Signature Verification" },
      ]
    }
  ];

  // Sample doc content for quickstart
  const quickstartContent = {
    title: "Quickstart Guide: Triggering Your First Security Scan",
    subtitle: "Learn how to initiate automated web, API, and APK security scans using the Solvane CLI or REST API.",
    sections: [
      { id: "prerequisites", title: "1. Prerequisites" },
      { id: "cli-setup", title: "2. CLI Setup & Authentication" },
      { id: "trigger-scan", title: "3. Triggering a Website Scan" },
      { id: "api-scan", title: "4. Triggering an API Scan" },
      { id: "github-actions", title: "5. GitHub Actions Integration" },
    ]
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <Navbar currentScreen="docs" onNav={onNav} dark={dark} toggleDark={toggleDark} />

      <main className="flex-1 pt-14 flex flex-col">
        {/* Top Header bar with search */}
        <div className="border-b border-border bg-secondary/30 px-6 py-4">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-[13px]">
              <span className="text-muted-foreground">Docs</span>
              <ChevronRight size={12} className="text-muted-foreground" />
              <span className="text-primary font-medium">{activeCategory}</span>
              <ChevronRight size={12} className="text-muted-foreground" />
              <span className="font-semibold text-foreground">Quickstart Guide</span>
            </div>

            <div className="relative w-full sm:w-72">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search documentation…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 bg-card border border-border rounded-lg text-[13px] outline-none focus:border-primary/60 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* 3-Column Docs Layout */}
        <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col lg:flex-row">
          {/* Left Sidebar Nav Tree */}
          <aside className="w-full lg:w-64 shrink-0 border-r border-border p-6 bg-card/50">
            <div className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground mb-4 font-bold">
              Documentation Nav
            </div>
            <nav className="space-y-4 text-[13px]">
              {navTree.map((cat) => (
                <div key={cat.category} className="space-y-1">
                  <div className="font-semibold text-[12px] text-foreground/80 flex items-center gap-1.5 py-1">
                    <ChevronDown size={14} className="text-primary" />
                    <span>{cat.category}</span>
                  </div>
                  <div className="pl-4 space-y-1 border-l border-border/80 ml-2">
                    {cat.items.map((item) => {
                      const isActive = activeArticleId === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setActiveArticleId(item.id);
                            setActiveCategory(cat.category);
                          }}
                          className={`block w-full text-left py-1 px-2 rounded-md transition-colors cursor-pointer text-[12.5px] ${
                            isActive
                              ? "bg-primary/10 text-primary font-semibold border-l-2 border-primary -ml-[1px]"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                          }`}
                        >
                          {item.title}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>
          </aside>

          {/* Main Article Content */}
          <article className="flex-1 p-6 md:p-10 max-w-4xl space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-mono mb-3">
                <BookOpen size={12} /> Solvane Platform Docs v2.4
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
                {quickstartContent.title}
              </h1>
              <p className="text-[15px] text-muted-foreground leading-relaxed border-b border-border pb-6">
                {quickstartContent.subtitle}
              </p>
            </div>

            {/* Callout Alert Box 1: Info */}
            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-blue-900 dark:text-blue-200 flex items-start gap-3 text-[13px]">
              <Info size={18} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold block mb-0.5">Automated Ownership Check</strong>
                Solvane requires target ownership verification before scanning. For staging environments, you can verify using a local DNS record or CLI auth token.
              </div>
            </div>

            {/* Section 1: Prerequisites */}
            <section id="prerequisites" className="space-y-3">
              <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                1. Prerequisites
              </h2>
              <p className="text-[14px] text-muted-foreground leading-relaxed">
                Before initiating scans, ensure you have an active Solvane account and your target system is accessible. You will need:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-[13.5px] text-muted-foreground">
                <li>A Solvane API key (generated under Account Settings &gt; API Keys).</li>
                <li>Node.js 18+ (if installing the CLI via npm) or standard cURL utilities.</li>
                <li>Ownership rights to the target domain, API URL, or APK file.</li>
              </ul>
            </section>

            {/* Section 2: CLI Setup & Authentication */}
            <section id="cli-setup" className="space-y-4">
              <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                2. CLI Setup & Authentication
              </h2>
              <p className="text-[14px] text-muted-foreground leading-relaxed">
                Install the official Solvane CLI globally via npm to initiate scans from your local terminal or local build scripts.
              </p>

              {/* Code Block 1: Terminal Installation */}
              <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                <div className="flex items-center justify-between px-4 py-2 bg-secondary border-b border-border text-[11px] font-mono text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Terminal size={12} className="text-primary" />
                    <span>Bash / Terminal</span>
                  </div>
                  <button
                    onClick={() => copyCode("npm install -g @solvane/cli\nsolvane login --key svn_prod_99x2", "install")}
                    className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer"
                  >
                    {copiedCode === "install" ? <Check size={12} /> : <Copy size={12} />}
                    <span>{copiedCode === "install" ? "Copied!" : "Copy"}</span>
                  </button>
                </div>
                <pre className="p-4 font-mono text-[12.5px] text-foreground overflow-x-auto bg-card" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
{`# Install Solvane CLI globally
npm install -g @solvane/cli

# Authenticate with your API key
solvane login --key svn_prod_99x2831a`}
                </pre>
              </div>
            </section>

            {/* Section 3: Triggering a Website Scan */}
            <section id="trigger-scan" className="space-y-4">
              <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                3. Triggering a Website Scan
              </h2>
              <p className="text-[14px] text-muted-foreground leading-relaxed">
                Run a full DOM crawl and injection audit against your web application URL using either the CLI or cURL REST API request:
              </p>

              {/* Code Block 2: cURL request */}
              <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                <div className="flex items-center justify-between px-4 py-2 bg-secondary border-b border-border text-[11px] font-mono text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Code2 size={12} className="text-violet-500" />
                    <span>cURL / REST API</span>
                  </div>
                  <button
                    onClick={() => copyCode(`curl -X POST https://api.solvane.io/v1/scans \\\n  -H "Authorization: Bearer svn_prod_99x2" \\\n  -H "Content-Type: application/json" \\\n  -d '{"target":"https://myapp.vercel.app","type":"web"}'`, "curl")}
                    className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer"
                  >
                    {copiedCode === "curl" ? <Check size={12} /> : <Copy size={12} />}
                    <span>{copiedCode === "curl" ? "Copied!" : "Copy"}</span>
                  </button>
                </div>
                <pre className="p-4 font-mono text-[12.5px] text-foreground overflow-x-auto bg-card" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
{`curl -X POST https://api.solvane.io/v1/scans \\
  -H "Authorization: Bearer svn_prod_99x2831a" \\
  -H "Content-Type: application/json" \\
  -d '{
    "target": "https://myapp.vercel.app",
    "type": "web",
    "depth": 4
  }'`}
                </pre>
              </div>

              {/* Callout Alert Box 2: Warning */}
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-900 dark:text-amber-200 flex items-start gap-3 text-[13px]">
                <AlertTriangle size={18} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold block mb-0.5">Rate Limiting Warning</strong>
                  Avoid running rapid parallel scans against production databases without testing throttles. Use staging endpoints where possible.
                </div>
              </div>
            </section>

            {/* Section 4: Triggering an API Scan */}
            <section id="api-scan" className="space-y-4">
              <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                4. Triggering an API Scan (OpenAPI Schema)
              </h2>
              <p className="text-[14px] text-muted-foreground leading-relaxed">
                To test REST endpoints for BOLA or authorization bypass, pass your OpenAPI 3.0 specification URL:
              </p>

              {/* Code Block 3: Python snippet */}
              <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                <div className="flex items-center justify-between px-4 py-2 bg-secondary border-b border-border text-[11px] font-mono text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <FileCode2 size={12} className="text-emerald-500" />
                    <span>Python SDK</span>
                  </div>
                  <button
                    onClick={() => copyCode(`import solvane\n\nclient = solvane.Client(api_key="svn_prod_99x2")\nscan = client.scans.create(\n    target="https://api.acme.io/openapi.json",\n    scan_type="api",\n    headers={"Authorization": "Bearer test_token"}\n)`, "python")}
                    className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer"
                  >
                    {copiedCode === "python" ? <Check size={12} /> : <Copy size={12} />}
                    <span>{copiedCode === "python" ? "Copied!" : "Copy"}</span>
                  </button>
                </div>
                <pre className="p-4 font-mono text-[12.5px] text-foreground overflow-x-auto bg-card" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
{`import solvane

client = solvane.Client(api_key="svn_prod_99x2831a")

scan = client.scans.create(
    target="https://api.acme.io/openapi.json",
    scan_type="api",
    headers={"Authorization": "Bearer test_token"}
)

print(f"Scan initiated: {scan.id}")`}
                </pre>
              </div>
            </section>

            {/* Section 5: GitHub Actions Integration */}
            <section id="github-actions" className="space-y-4">
              <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                5. GitHub Actions CI/CD Integration
              </h2>
              <p className="text-[14px] text-muted-foreground leading-relaxed">
                Add Solvane scan steps directly into your repository workflow file (`.github/workflows/security.yml`):
              </p>

              {/* Code Block 4: YAML GitHub Actions */}
              <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                <div className="flex items-center justify-between px-4 py-2 bg-secondary border-b border-border text-[11px] font-mono text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Zap size={12} className="text-primary" />
                    <span>YAML · GitHub Actions Workflow</span>
                  </div>
                  <button
                    onClick={() => copyCode(`name: Solvane Security Scan\non: [pull_request]\njobs:\n  security:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: solvane/scan-action@v2\n        with:\n          api-key: \${{ secrets.SOLVANE_API_KEY }}\n          target: 'https://staging.myapp.com'`, "yaml")}
                    className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer"
                  >
                    {copiedCode === "yaml" ? <Check size={12} /> : <Copy size={12} />}
                    <span>{copiedCode === "yaml" ? "Copied!" : "Copy"}</span>
                  </button>
                </div>
                <pre className="p-4 font-mono text-[12.5px] text-foreground overflow-x-auto bg-card" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
{`name: Solvane Security Scan
on:
  pull_request:
    branches: [ main ]

jobs:
  security-audit:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Run Solvane Security Audit
        uses: solvane/scan-action@v2
        with:
          api-key: \${{ secrets.SOLVANE_API_KEY }}
          target: 'https://staging.myapp.com'
          fail-on-critical: true`}
                </pre>
              </div>
            </section>
          </article>

          {/* Right Sidebar: "On this page" Mini TOC */}
          <aside className="w-full lg:w-56 shrink-0 p-6 border-l border-border hidden lg:block">
            <div className="sticky top-20">
              <div className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground mb-3 font-bold">
                On This Page
              </div>
              <ul className="space-y-2 text-[12.5px]">
                {quickstartContent.sections.map((sec) => (
                  <li key={sec.id}>
                    <a
                      href={`#${sec.id}`}
                      className="text-muted-foreground hover:text-primary transition-colors block leading-tight"
                    >
                      {sec.title}
                    </a>
                  </li>
                ))}
              </ul>

              <div className="mt-8 p-4 rounded-xl bg-secondary border border-border">
                <div className="text-[11px] font-bold mb-1">Need help?</div>
                <p className="text-[12px] text-muted-foreground mb-3">
                  Ask our security team on Discord or check the API reference.
                </p>
                <button
                  onClick={() => onNav("signup")}
                  className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                >
                  Join Community Discord <ExternalLink size={10} />
                </button>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer onNav={onNav} />
    </div>
  );
}
