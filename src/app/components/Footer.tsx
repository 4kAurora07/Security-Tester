import { Shield } from "lucide-react";
import { Screen } from "./Navbar";

interface FooterProps {
  onNav: (s: Screen) => void;
}

export function Footer({ onNav }: FooterProps) {
  return (
    <footer className="border-t border-border py-14 px-6 bg-background text-foreground">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between gap-10 mb-10">
          <div>
            <button
              onClick={() => onNav("landing")}
              className="flex items-center gap-2.5 mb-3 cursor-pointer text-left group"
            >
              <div className="w-7 h-7 rounded-md bg-blue-600 flex items-center justify-center text-white font-bold shadow-xs transition-transform group-hover:scale-105">
                <Shield size={15} />
              </div>
              <span className="font-bold text-sm tracking-tight text-foreground">Solvane</span>
            </button>
            <p className="text-[12px] text-muted-foreground max-w-xs">
              AI-powered security testing for modern engineering teams.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-10 text-[12px]">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-3 font-semibold">
                Product
              </div>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => onNav("product")} className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                    Features
                  </button>
                </li>
                <li>
                  <button onClick={() => onNav("pricing")} className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                    Pricing
                  </button>
                </li>
                <li>
                  <button onClick={() => onNav("blog")} className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                    Changelog
                  </button>
                </li>
                <li>
                  <button onClick={() => onNav("product")} className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                    Roadmap
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-3 font-semibold">
                Developers
              </div>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => onNav("docs")} className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                    Docs
                  </button>
                </li>
                <li>
                  <button onClick={() => onNav("docs")} className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                    API Reference
                  </button>
                </li>
                <li>
                  <button onClick={() => onNav("docs")} className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                    SDKs
                  </button>
                </li>
                <li>
                  <button onClick={() => onNav("landing")} className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                    Status
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-3 font-semibold">
                Company
              </div>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => onNav("landing")} className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                    About
                  </button>
                </li>
                <li>
                  <button onClick={() => onNav("blog")} className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                    Blog
                  </button>
                </li>
                <li>
                  <button onClick={() => onNav("landing")} className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                    Careers
                  </button>
                </li>
                <li>
                  <button onClick={() => onNav("landing")} className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                    Security
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t border-border pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[11px] text-muted-foreground">© 2026 Solvane Inc. All rights reserved.</p>
          <div className="flex gap-4">
            {["Privacy", "Terms", "Cookies"].map((l) => (
              <button key={l} onClick={() => onNav("docs")} className="text-[11px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
