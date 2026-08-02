import { Shield, Moon, Sun } from "lucide-react";

export type Screen =
  | "landing"
  | "product"
  | "pricing"
  | "docs"
  | "blog"
  | "login"
  | "signup"
  | "forgot"
  | "verify"
  | "reset-password"
  | "dashboard"
  | "results"
  | "empty"
  | "profile"
  | "settings";

interface NavbarProps {
  currentScreen: Screen;
  onNav: (s: Screen) => void;
  dark: boolean;
  toggleDark: () => void;
}

export function ThemeToggle({ dark, toggle }: { dark: boolean; toggle: () => void }) {
  return (
    <button
      onClick={toggle}
      className="p-2 rounded-lg border border-border hover:bg-muted transition-colors cursor-pointer"
      title="Toggle theme"
    >
      {dark ? <Sun size={14} className="text-amber-400" /> : <Moon size={14} className="text-muted-foreground" />}
    </button>
  );
}

export function Navbar({ currentScreen, onNav, dark, toggleDark }: NavbarProps) {
  const navItems = [
    { label: "Product", screen: "product" as Screen },
    { label: "Docs", screen: "docs" as Screen },
    { label: "Pricing", screen: "pricing" as Screen },
    { label: "Blog", screen: "blog" as Screen },
  ];

  return (
    <nav className="fixed top-0 inset-x-0 z-50 border-b border-border/80 bg-background/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 flex items-center h-14 gap-6">
        <button
          onClick={() => onNav("landing")}
          className="flex items-center gap-2.5 cursor-pointer hover:opacity-85 transition-opacity group"
        >
          <div className="w-7 h-7 rounded-md bg-blue-600 flex items-center justify-center text-white font-bold shadow-xs transition-transform group-hover:scale-105">
            <Shield size={15} />
          </div>
          <span className="font-bold text-sm tracking-tight text-foreground">Solvane</span>
        </button>

        <div className="hidden md:flex items-center gap-6 text-[13px] text-muted-foreground flex-1">
          {navItems.map((item) => {
            const isActive = currentScreen === item.screen;
            return (
              <button
                key={item.label}
                onClick={() => onNav(item.screen)}
                className={`transition-colors cursor-pointer ${
                  isActive
                    ? "text-primary font-semibold"
                    : "hover:text-foreground"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2.5 ml-auto">
          <ThemeToggle dark={dark} toggle={toggleDark} />
          <button
            onClick={() => onNav("login")}
            className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer px-2.5 py-1.5 rounded-md"
          >
            Log in
          </button>
          <button
            onClick={() => onNav("signup")}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3.5 py-1.5 rounded-md transition-colors cursor-pointer shadow-none"
          >
            Get started free
          </button>
        </div>
      </div>
    </nav>
  );
}
