import { useState } from "react";
import {
  Check, ArrowRight, Zap, Shield, HelpCircle, ChevronDown, ChevronUp,
  Building2, Sparkles, Lock, CreditCard, Mail, CheckCircle2
} from "lucide-react";
import { Navbar, Screen } from "../components/Navbar";
import { Footer } from "../components/Footer";

interface PricingPageProps {
  onNav: (s: Screen) => void;
  dark: boolean;
  toggleDark: () => void;
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

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <Navbar currentScreen="pricing" onNav={onNav} dark={dark} toggleDark={toggleDark} />

      <main className="flex-1 pt-14">
        {/* Header */}
        <section className="pt-20 pb-12 px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[12px] font-mono mb-4">
              <Zap size={12} /> Transparent & Flexible Plans
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
              Simple pricing for secure engineering
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto mb-8">
              Start scanning for free. Upgrade as your team grows and requires API/APK scanning, CI/CD integrations, and priority support.
            </p>

            {/* Monthly / Annual Toggle */}
            <div className="flex items-center justify-center gap-3">
              <span className={`text-[14px] ${!annual ? "font-bold text-foreground" : "text-muted-foreground"}`}>
                Monthly billing
              </span>
              <button
                onClick={() => setAnnual(!annual)}
                className={`relative w-12 h-6 rounded-full transition-colors p-1 cursor-pointer ${
                  annual ? "bg-primary" : "bg-border"
                }`}
              >
                <span
                  className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                    annual ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
              <span className={`text-[14px] flex items-center gap-1.5 ${annual ? "font-bold text-foreground" : "text-muted-foreground"}`}>
                Annual billing
                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400 border border-emerald-200">
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
            <div className="bg-card border border-border rounded-2xl p-8 flex flex-col justify-between hover:border-primary/40 transition-all">
              <div>
                <div className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground mb-2">Starter</div>
                <h3 className="text-2xl font-bold mb-2">Free</h3>
                <p className="text-[13px] text-muted-foreground mb-6">
                  Perfect for individual developers and side projects.
                </p>

                <div className="mb-6 pb-6 border-b border-border">
                  <span className="text-4xl font-extrabold font-mono">$0</span>
                  <span className="text-muted-foreground text-[13px]"> / month</span>
                </div>

                <div className="space-y-3 mb-8">
                  <div className="text-[11px] font-mono uppercase text-muted-foreground tracking-wider font-bold">Includes:</div>
                  {[
                    "10 Web Scans / month",
                    "Website Scanner included",
                    "Basic vulnerability report",
                    "1 Team Seat",
                    "Community support",
                    "Manual scan triggers"
                  ].map((feat) => (
                    <div key={feat} className="flex items-center gap-2.5 text-[13px]">
                      <Check size={16} className="text-primary shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => onNav("signup")}
                className="w-full py-3 rounded-xl border border-border bg-secondary text-foreground font-semibold text-[14px] hover:bg-muted transition-colors cursor-pointer"
              >
                Get Started Free
              </button>
            </div>

            {/* Tier 2: Pro (MOST POPULAR) */}
            <div className="bg-card border-2 border-primary rounded-2xl p-8 flex flex-col justify-between shadow-xl relative scale-100 lg:-translate-y-2">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-white text-[11px] font-mono font-bold tracking-wider uppercase shadow-md flex items-center gap-1">
                <Sparkles size={11} /> Most Popular
              </div>

              <div>
                <div className="text-[11px] font-mono uppercase tracking-widest text-primary mb-2 font-bold">Growth & Teams</div>
                <h3 className="text-2xl font-bold mb-2">Pro Tier</h3>
                <p className="text-[13px] text-muted-foreground mb-6">
                  For growing startups and engineering teams needing continuous scanning.
                </p>

                <div className="mb-6 pb-6 border-b border-border">
                  <span className="text-4xl font-extrabold font-mono">{annual ? "$39" : "$49"}</span>
                  <span className="text-muted-foreground text-[13px]"> / month {annual && "(billed annually)"}</span>
                </div>

                <div className="space-y-3 mb-8">
                  <div className="text-[11px] font-mono uppercase text-primary tracking-wider font-bold">Everything in Free, plus:</div>
                  {[
                    "100 Web + API + APK Scans / month",
                    "Website, API & APK Scanners included",
                    "AI-powered code remediation diffs",
                    "5 Team Seats included",
                    "GitHub & GitLab CI/CD integration",
                    "Slack & PagerDuty instant alerts",
                    "Priority email support (< 4 hr SLA)"
                  ].map((feat) => (
                    <div key={feat} className="flex items-center gap-2.5 text-[13px]">
                      <CheckCircle2 size={16} className="text-primary shrink-0" />
                      <span className="font-medium">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => onNav("signup")}
                className="w-full py-3 rounded-xl bg-primary text-white font-bold text-[14px] hover:bg-primary/90 transition-colors shadow-md hover:shadow-primary/25 cursor-pointer"
              >
                Start 14-Day Free Trial
              </button>
            </div>

            {/* Tier 3: Enterprise */}
            <div className="bg-card border border-border rounded-2xl p-8 flex flex-col justify-between hover:border-primary/40 transition-all">
              <div>
                <div className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground mb-2">Scale & Compliance</div>
                <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
                <p className="text-[13px] text-muted-foreground mb-6">
                  Custom security rules, SLA guarantees, and dedicated proxy infrastructure.
                </p>

                <div className="mb-6 pb-6 border-b border-border">
                  <span className="text-4xl font-extrabold font-mono">{annual ? "$199" : "$249"}</span>
                  <span className="text-muted-foreground text-[13px]"> / month</span>
                </div>

                <div className="space-y-3 mb-8">
                  <div className="text-[11px] font-mono uppercase text-muted-foreground tracking-wider font-bold">Everything in Pro, plus:</div>
                  {[
                    "Unlimited Web, API & APK Scans",
                    "Dedicated static scanning IP proxies",
                    "Custom security rules & compliance engine",
                    "Unlimited Team Seats & SSO / SAML",
                    "SOC 2 Type II compliance reports",
                    "99.9% Uptime SLA",
                    "Dedicated Security Specialist & Slack channel"
                  ].map((feat) => (
                    <div key={feat} className="flex items-center gap-2.5 text-[13px]">
                      <Check size={16} className="text-primary shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => onNav("signup")}
                className="w-full py-3 rounded-xl border border-border bg-secondary text-foreground font-semibold text-[14px] hover:bg-muted transition-colors cursor-pointer"
              >
                Contact Enterprise Sales
              </button>
            </div>
          </div>
        </section>

        {/* Feature Comparison Matrix */}
        <section className="py-16 px-6 max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold">Detailed Plan Comparison</h2>
          </div>

          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
            <div className="grid grid-cols-4 p-4 bg-secondary font-mono text-[12px] font-bold border-b border-border">
              <div>FEATURE</div>
              <div className="text-center">STARTER</div>
              <div className="text-center text-primary">PRO</div>
              <div className="text-center">ENTERPRISE</div>
            </div>

            {[
              { f: "Web Scanner", starter: "Basic", pro: "Advanced", enterprise: "Custom Rules" },
              { f: "API Fuzzer (OpenAPI/GraphQL)", starter: "—", pro: "Included", enterprise: "Included" },
              { f: "Android APK Scanner", starter: "—", pro: "Included", enterprise: "Included" },
              { f: "AI Code Fix Diffs", starter: "—", pro: "Full Diffs", enterprise: "Full Diffs" },
              { f: "Monthly Scan Quota", starter: "10", pro: "100", enterprise: "Unlimited" },
              { f: "Team Members", starter: "1 Seat", pro: "5 Seats", enterprise: "Unlimited" },
              { f: "CI/CD Integrations", starter: "—", pro: "GitHub/GitLab", enterprise: "All + Custom" },
              { f: "SSO / SAML", starter: "—", pro: "—", enterprise: "Included" }
            ].map((row, idx) => (
              <div
                key={row.f}
                className={`grid grid-cols-4 p-4 text-[13px] items-center ${
                  idx % 2 === 0 ? "bg-background" : "bg-secondary/40"
                } border-b border-border last:border-0`}
              >
                <div className="font-medium text-foreground">{row.f}</div>
                <div className="text-center font-mono text-[12px] text-muted-foreground">{row.starter}</div>
                <div className="text-center font-mono text-[12px] text-primary font-bold">{row.pro}</div>
                <div className="text-center font-mono text-[12px] text-foreground">{row.enterprise}</div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Accordion */}
        <section className="py-16 px-6 bg-secondary/40 border-t border-border">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[12px] font-mono mb-3">
                <HelpCircle size={12} /> Got Questions?
              </div>
              <h2 className="text-3xl font-bold tracking-tight mb-2">Frequently Asked Questions</h2>
              <p className="text-[14px] text-muted-foreground">Everything you need to know about billing, scanning limits, and security protocols.</p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={faq.q}
                    className="bg-card border border-border rounded-2xl overflow-hidden transition-colors"
                  >
                    <button
                      onClick={() => toggleFaq(idx)}
                      className="w-full p-5 text-left flex items-center justify-between font-semibold text-[15px] hover:text-primary transition-colors cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      {isOpen ? <ChevronUp size={18} className="text-primary shrink-0" /> : <ChevronDown size={18} className="text-muted-foreground shrink-0" />}
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-5 text-[14px] text-muted-foreground leading-relaxed border-t border-border/60 pt-4">
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
          <div className="max-w-5xl mx-auto bg-card border border-border rounded-3xl p-8 md:p-12 shadow-lg flex flex-col md:flex-row items-center justify-between gap-8 bg-gradient-to-r from-card via-secondary to-card">
            <div className="space-y-3 max-w-xl">
              <div className="flex items-center gap-2 text-[12px] font-mono text-primary uppercase font-bold">
                <Building2 size={14} /> Tailored Enterprise Security
              </div>
              <h3 className="text-2xl md:text-3xl font-bold">Need custom scan contracts or penetration testing?</h3>
              <p className="text-[14px] text-muted-foreground leading-relaxed">
                Our security engineers can assist with custom security compliance audits, custom IP proxy white-listing, SOC 2 reports, and dedicated Slack channels.
              </p>
            </div>

            <button
              onClick={() => onNav("signup")}
              className="shrink-0 flex items-center gap-2 bg-primary text-white font-bold text-[14px] px-6 py-3.5 rounded-xl hover:bg-primary/90 transition-colors shadow-md cursor-pointer"
            >
              Contact Enterprise Sales <ArrowRight size={16} />
            </button>
          </div>
        </section>
      </main>

      <Footer onNav={onNav} />
    </div>
  );
}
