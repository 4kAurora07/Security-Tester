import { useState } from "react";
import {
  Check, ArrowRight, Zap, Shield, HelpCircle, ChevronDown, ChevronUp,
  Building2, Sparkles, Lock, CreditCard, Mail, CheckCircle2, Minus
} from "lucide-react";
import { Navbar, Screen } from "../components/Navbar";
import { Footer } from "../components/Footer";

interface PricingPageProps {
  onNav: (s: Screen) => void;
  dark: boolean;
  toggleDark: () => void;
}

interface FeatureRow {
  f: string;
  desc?: string;
  starter: boolean | React.ReactNode;
  pro: boolean | React.ReactNode;
  enterprise: boolean | React.ReactNode;
}

export function PricingPage({ onNav, dark, toggleDark }: PricingPageProps) {
  const [annual, setAnnual] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: "How does Solvane verify domain and app ownership?",
      a: "Before running security scans on any target, Solvane verifies ownership via a DNS TXT record, HTML meta tag, or temporary file upload to ensure scans are only performed on systems you own or have explicit authorization to audit."
    },
    {
      q: "What counts as a scan?",
      a: "A single scan encompasses a complete audit run across a target URL, OpenAPI schema, or uploaded APK file. You can rerun scans as often as needed within your monthly quota."
    },
    {
      q: "Can I upgrade, downgrade, or cancel anytime?",
      a: "Yes! You can change your plan or cancel subscription anytime from your dashboard billing settings. Upgrades take effect immediately, and downgrades apply at the start of your next billing cycle."
    },
    {
      q: "What happens if I reach my monthly scan limit?",
      a: "On the Free and Pro plans, once your limit is reached, scans pause until the next monthly billing cycle unless you upgrade or purchase add-on scan packages from your dashboard."
    },
    {
      q: "Do you offer discounts for open-source projects or non-profits?",
      a: "Absolutely! We offer free Pro accounts to active maintainers of open-source projects and registered non-profit organizations. Reach out to community@solvane.io for details."
    },
    {
      q: "Is there a free trial for the Pro plan?",
      a: "Yes! Every new account includes a 14-day full access trial of the Pro tier without requiring a credit card up front."
    }
  ];

  const renderCellContent = (val: boolean | React.ReactNode) => {
    if (val === true) {
      return (
        <div className="w-6 h-6 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-xs">
          <Check size={14} className="stroke-[2.5]" />
        </div>
      );
    }
    if (val === false) {
      return <span className="text-muted-foreground/30 font-bold">—</span>;
    }
    return val;
  };

  const renderRow = (row: FeatureRow, idx: number) => (
    <div
      key={row.f}
      className={`grid grid-cols-4 items-center text-xs border-b border-border/50 hover:bg-blue-500/5 transition-colors ${
        idx % 2 === 0 ? "bg-background" : "bg-secondary/30"
      }`}
    >
      <div className="p-4">
        <div className="font-semibold text-foreground">{row.f}</div>
        {row.desc && <div className="text-[11px] text-muted-foreground mt-0.5">{row.desc}</div>}
      </div>

      <div className="p-4 text-center font-medium">{renderCellContent(row.starter)}</div>

      <div className="p-4 text-center bg-blue-500/5 dark:bg-blue-500/10 border-x border-blue-500/20 font-semibold text-blue-600 dark:text-blue-400">
        {renderCellContent(row.pro)}
      </div>

      <div className="p-4 text-center font-medium">{renderCellContent(row.enterprise)}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <Navbar currentScreen="pricing" onNav={onNav} dark={dark} toggleDark={toggleDark} />

      <main className="flex-1 pt-14">
        {/* Header */}
        <section className="pt-24 pb-12 px-6 text-center relative overflow-hidden">
          {/* Dot Grid Background */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.35] dark:opacity-[0.20]"
            style={{
              backgroundImage: `radial-gradient(#cbd5e1 2px, transparent 2px)`,
              backgroundSize: `20px 20px`
            }}
          />
          {/* Radial Blue Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,0.12)_0%,rgba(37,99,235,0.03)_50%,transparent_70%)] pointer-events-none blur-3xl z-0" />

          <div className="max-w-4xl mx-auto relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-semibold mb-4">
              <Zap size={12} /> Transparent & Flexible Plans
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 text-foreground">
              Simple pricing for secure engineering
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto mb-8">
              Start scanning for free. Upgrade as your team grows and requires API/APK scanning, CI/CD integrations, and priority support.
            </p>

            {/* Monthly / Annual Toggle */}
            <div className="flex items-center justify-center gap-3">
              <span className={`text-sm ${!annual ? "font-bold text-foreground" : "text-muted-foreground"}`}>
                Monthly billing
              </span>
              <button
                onClick={() => setAnnual(!annual)}
                className={`relative w-12 h-6 rounded-full transition-colors p-1 cursor-pointer ${
                  annual ? "bg-blue-600" : "bg-border"
                }`}
              >
                <span
                  className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                    annual ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
              <span className={`text-sm flex items-center gap-1.5 ${annual ? "font-bold text-foreground" : "text-muted-foreground"}`}>
                Annual billing
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400 border border-emerald-200">
                  Save 20%
                </span>
              </span>
            </div>
          </div>
        </section>

        {/* 3-Column Pricing Cards */}
        <section className="py-8 px-6 max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-3 gap-8 items-stretch">
            {/* Tier 1: Free */}
            <div className="bg-card border border-border/80 rounded-2xl p-8 flex flex-col justify-between hover:border-blue-500/40 transition-all">
              <div>
                <div className="text-xs uppercase tracking-wider font-bold text-muted-foreground mb-2">Starter</div>
                <h3 className="text-2xl font-bold mb-2">Free</h3>
                <p className="text-xs text-muted-foreground mb-6">
                  Perfect for individual developers and side projects.
                </p>

                <div className="mb-6 pb-6 border-b border-border/80">
                  <span className="text-4xl font-extrabold tracking-tight">$0</span>
                  <span className="text-muted-foreground text-xs"> / month</span>
                </div>

                <div className="space-y-3 mb-8">
                  <div className="text-xs uppercase text-muted-foreground tracking-wider font-bold">Includes:</div>
                  {[
                    "10 Web Scans / month",
                    "Website Scanner included",
                    "Basic vulnerability report",
                    "1 Team Seat",
                    "Community support",
                    "Manual scan triggers"
                  ].map((feat) => (
                    <div key={feat} className="flex items-center gap-2.5 text-xs">
                      <Check size={16} className="text-blue-600 dark:text-blue-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => onNav("signup")}
                className="w-full py-2.5 rounded-md border border-border bg-background text-foreground font-semibold text-xs hover:bg-secondary/70 transition-colors cursor-pointer"
              >
                Get Started Free
              </button>
            </div>

            {/* Tier 2: Pro (MOST POPULAR) */}
            <div className="bg-card border-2 border-blue-600 rounded-2xl p-8 flex flex-col justify-between shadow-xl relative scale-100 lg:-translate-y-2">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-blue-600 text-white text-[11px] font-bold tracking-wider uppercase shadow-md flex items-center gap-1">
                <Sparkles size={11} /> Most Popular
              </div>

              <div>
                <div className="text-xs uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2 font-bold">Growth & Teams</div>
                <h3 className="text-2xl font-bold mb-2">Pro Tier</h3>
                <p className="text-xs text-muted-foreground mb-6">
                  For growing startups and engineering teams needing continuous scanning.
                </p>

                <div className="mb-6 pb-6 border-b border-border/80">
                  <span className="text-4xl font-extrabold tracking-tight">{annual ? "$39" : "$49"}</span>
                  <span className="text-muted-foreground text-xs"> / month {annual && "(billed annually)"}</span>
                </div>

                <div className="space-y-3 mb-8">
                  <div className="text-xs uppercase text-blue-600 dark:text-blue-400 tracking-wider font-bold">Everything in Free, plus:</div>
                  {[
                    "100 Web + API + APK Scans / month",
                    "Website, API & APK Scanners included",
                    "AI-powered code remediation diffs",
                    "5 Team Seats included",
                    "GitHub & GitLab CI/CD integration",
                    "Slack & PagerDuty instant alerts",
                    "Priority email support (< 4 hr SLA)"
                  ].map((feat) => (
                    <div key={feat} className="flex items-center gap-2.5 text-xs">
                      <CheckCircle2 size={16} className="text-blue-600 dark:text-blue-400 shrink-0" />
                      <span className="font-medium">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => onNav("signup")}
                className="w-full py-2.5 rounded-md bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 transition-colors shadow-none cursor-pointer"
              >
                Start 14-Day Free Trial
              </button>
            </div>

            {/* Tier 3: Enterprise */}
            <div className="bg-card border border-border/80 rounded-2xl p-8 flex flex-col justify-between hover:border-blue-500/40 transition-all">
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2 font-bold">Scale & Compliance</div>
                <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
                <p className="text-xs text-muted-foreground mb-6">
                  Custom security rules, SLA guarantees, and dedicated proxy infrastructure.
                </p>

                <div className="mb-6 pb-6 border-b border-border/80">
                  <span className="text-4xl font-extrabold tracking-tight">{annual ? "$199" : "$249"}</span>
                  <span className="text-muted-foreground text-xs"> / month</span>
                </div>

                <div className="space-y-3 mb-8">
                  <div className="text-xs uppercase text-muted-foreground tracking-wider font-bold">Everything in Pro, plus:</div>
                  {[
                    "Unlimited Web, API & APK Scans",
                    "Dedicated static scanning IP proxies",
                    "Custom security rules & compliance engine",
                    "Unlimited Team Seats & SSO / SAML",
                    "SOC 2 Type II compliance reports",
                    "99.9% Uptime SLA",
                    "Dedicated Security Specialist & Slack channel"
                  ].map((feat) => (
                    <div key={feat} className="flex items-center gap-2.5 text-xs">
                      <Check size={16} className="text-blue-600 dark:text-blue-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => onNav("signup")}
                className="w-full py-2.5 rounded-md border border-border bg-background text-foreground font-semibold text-xs hover:bg-secondary/70 transition-colors cursor-pointer"
              >
                Contact Enterprise Sales
              </button>
            </div>
          </div>
        </section>

        {/* Feature Comparison Matrix */}
        <section className="py-16 px-6 max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-semibold mb-3">
              <Sparkles size={12} /> Plan Matrix
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight">Detailed Plan Comparison</h2>
            <p className="text-xs text-muted-foreground mt-1.5">Compare features, quotas, and security controls across all plan tiers</p>
          </div>

          <div className="bg-card border border-border/80 rounded-2xl overflow-hidden shadow-md">
            {/* Table Header */}
            <div className="grid grid-cols-4 items-center bg-secondary/80 border-b border-border/80 text-xs font-bold">
              <div className="p-4 uppercase tracking-wider text-muted-foreground">Capabilities</div>
              <div className="p-4 text-center text-foreground font-bold">
                Starter
                <div className="text-[11px] font-normal text-muted-foreground mt-0.5">$0 / mo</div>
              </div>
              <div className="p-4 text-center bg-blue-600/10 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 font-extrabold border-x border-blue-500/20 relative">
                <span className="inline-block px-2 py-0.5 rounded bg-blue-600 text-white text-[9px] font-bold tracking-wider uppercase mb-1">
                  RECOMMENDED
                </span>
                <div>Pro Tier</div>
                <div className="text-[11px] font-normal text-blue-600/80 dark:text-blue-400/80 mt-0.5">{annual ? "$39" : "$49"} / mo</div>
              </div>
              <div className="p-4 text-center text-foreground font-bold">
                Enterprise
                <div className="text-[11px] font-normal text-muted-foreground mt-0.5">{annual ? "$199" : "$249"} / mo</div>
              </div>
            </div>

            {/* Category 1: Scanners & Security */}
            <div className="px-4 py-2.5 bg-muted/60 border-b border-border/70 text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Zap size={12} className="text-blue-600 dark:text-blue-400" /> Scanner & Audit Capabilities
            </div>

            {[
              {
                f: "Website Vulnerability Scanner",
                desc: "DOM & endpoint crawler, CSP, XSS, headers",
                starter: <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-secondary border border-border/80 text-muted-foreground">Basic</span>,
                pro: <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30">Advanced</span>,
                enterprise: <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-violet-50 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300 border border-violet-200 dark:border-violet-500/30">Custom Rules</span>,
              },
              {
                f: "API Security Fuzzer",
                desc: "OpenAPI, GraphQL, BOLA & token tests",
                starter: false,
                pro: true,
                enterprise: true,
              },
              {
                f: "Android APK Scanner",
                desc: "Bytecode decompiler & secret extraction",
                starter: false,
                pro: true,
                enterprise: true,
              },
              {
                f: "AI Code Fix Diffs",
                desc: "Line-by-line remediation code snippets",
                starter: false,
                pro: <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30">Full Diffs</span>,
                enterprise: <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-violet-50 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300 border border-violet-200 dark:border-violet-500/30">Full Diffs + Export</span>,
              },
            ].map((row, idx) => renderRow(row, idx))}

            {/* Category 2: Quotas & Team Seats */}
            <div className="px-4 py-2.5 bg-muted/60 border-y border-border/70 text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Shield size={12} className="text-emerald-600 dark:text-emerald-400" /> Quotas & Team Seats
            </div>

            {[
              {
                f: "Monthly Scan Quota",
                desc: "Web, API, and APK scan executions",
                starter: <span className="font-medium text-foreground">10 / mo</span>,
                pro: <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30">100 / mo</span>,
                enterprise: <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30">Unlimited</span>,
              },
              {
                f: "Team Member Seats",
                desc: "Dashboard access & role management",
                starter: <span className="text-muted-foreground">1 Seat</span>,
                pro: <span className="font-bold text-blue-600 dark:text-blue-400">5 Seats</span>,
                enterprise: <span className="font-bold text-emerald-600 dark:text-emerald-400">Unlimited</span>,
              },
            ].map((row, idx) => renderRow(row, idx))}

            {/* Category 3: Integrations & Compliance */}
            <div className="px-4 py-2.5 bg-muted/60 border-y border-border/70 text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Building2 size={12} className="text-violet-600 dark:text-violet-400" /> Integrations & Security SLA
            </div>

            {[
              {
                f: "CI/CD Pipeline Integrations",
                desc: "GitHub Actions, GitLab CI, CircleCI",
                starter: false,
                pro: <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30">GitHub & GitLab</span>,
                enterprise: <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-violet-50 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300 border border-violet-200 dark:border-violet-500/30">All + Custom</span>,
              },
              {
                f: "Dedicated Scan IP Proxies",
                desc: "White-listed static proxy IPs for firewalls",
                starter: false,
                pro: false,
                enterprise: true,
              },
              {
                f: "SSO / SAML Authentication",
                desc: "Okta, Azure AD, Google Workspace SSO",
                starter: false,
                pro: false,
                enterprise: true,
              },
              {
                f: "Support SLA",
                desc: "Response time guarantee from security team",
                starter: <span className="text-muted-foreground">Community</span>,
                pro: <span className="font-semibold text-blue-600 dark:text-blue-400">&lt; 4 Hours</span>,
                enterprise: <span className="font-bold text-emerald-600 dark:text-emerald-400">1 Hour + Dedicated Slack</span>,
              },
            ].map((row, idx) => renderRow(row, idx))}
          </div>
        </section>

        {/* FAQ Accordion */}
        <section className="py-16 px-6 bg-secondary/40 border-t border-border/80">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-semibold mb-3">
                <HelpCircle size={12} /> Got Questions?
              </div>
              <h2 className="text-3xl font-bold tracking-tight mb-2">Frequently Asked Questions</h2>
              <p className="text-xs text-muted-foreground">Everything you need to know about billing, scanning limits, and security protocols.</p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={faq.q}
                    className="bg-card border border-border/80 rounded-2xl overflow-hidden transition-colors"
                  >
                    <button
                      onClick={() => toggleFaq(idx)}
                      className="w-full p-5 text-left flex items-center justify-between font-semibold text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      {isOpen ? <ChevronUp size={18} className="text-blue-600 dark:text-blue-400 shrink-0" /> : <ChevronDown size={18} className="text-muted-foreground shrink-0" />}
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-5 text-xs text-muted-foreground leading-relaxed border-t border-border/60 pt-4">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Enterprise Contact-Sales Card */}
        <section className="py-20 px-6">
          <div className="max-w-5xl mx-auto bg-card border border-border/80 rounded-3xl p-8 md:p-12 shadow-md flex flex-col md:flex-row items-center justify-between gap-8 bg-gradient-to-r from-card via-secondary to-card">
            <div className="space-y-3 max-w-xl">
              <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 uppercase font-bold tracking-wider">
                <Building2 size={14} /> Tailored Enterprise Security
              </div>
              <h3 className="text-2xl md:text-3xl font-bold tracking-tight">Need custom scan contracts or penetration testing?</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Our security engineers can assist with custom security compliance audits, custom IP proxy white-listing, SOC 2 reports, and dedicated Slack channels.
              </p>
            </div>

            <button
              onClick={() => onNav("signup")}
              className="shrink-0 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-5 py-2.5 rounded-md transition-colors shadow-none cursor-pointer"
            >
              Contact Enterprise Sales <ArrowRight size={14} />
            </button>
          </div>
        </section>
      </main>

      <Footer onNav={onNav} />
    </div>
  );
}
