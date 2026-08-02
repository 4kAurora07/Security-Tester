import { useState, useEffect } from "react";
import { Shield, Loader2, CheckCircle2, AlertCircle, Eye, EyeOff } from "lucide-react";
import { Screen } from "../components/Navbar";
import { authApi, validatePasswordStrength } from "../services/authApi";
import { ThemeToggle } from "../App";

interface ResetPasswordPageProps {
  onNav: (s: Screen) => void;
  dark: boolean;
  toggleDark: () => void;
}

export function ResetPasswordPage({ onNav, dark, toggleDark }: ResetPasswordPageProps) {
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenParam = params.get("token") || "mock_reset_token";
    setToken(tokenParam);
  }, []);

  const strength = validatePasswordStrength(newPassword);
  const match = newPassword && confirmPassword && newPassword === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!strength.isValid) {
      setError("Password does not satisfy minimum strength requirements.");
      return;
    }
    if (!match) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    setLoading(true);
    try {
      await authApi.resetPassword(token, newPassword);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Failed to reset password. Link may have expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground grid lg:grid-cols-2 font-sans">
      {/* Left Form Panel */}
      <div className="flex flex-col justify-between p-6 sm:p-10 md:p-12 min-h-screen border-r border-border/40">
        {/* Header Bar */}
        <div className="flex items-center justify-between">
          <button onClick={() => onNav("landing")} className="flex items-center gap-2.5 hover:opacity-85 transition-opacity cursor-pointer">
            <div className="w-8 h-8 rounded-md bg-blue-600 flex items-center justify-center text-white font-bold shadow-sm">
              <Shield size={18} />
            </div>
            <span className="font-bold text-base tracking-tight text-foreground">Solvane</span>
          </button>
          <ThemeToggle dark={dark} toggle={toggleDark} />
        </div>

        {/* Center Form */}
        <div className="w-full max-w-sm mx-auto my-auto py-8">
          <div className="mb-6 text-left">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-1.5">Create new password</h1>
            <p className="text-sm text-muted-foreground">Set a new password for your account</p>
          </div>

          {success ? (
            <div className="space-y-4 text-left">
              <div className="p-4 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs leading-relaxed flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-semibold mb-0.5">Password Reset Complete</strong>
                  <span>Your password has been successfully updated. All previous sessions have been invalidated.</span>
                </div>
              </div>
              <button
                onClick={() => onNav("login")}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm py-2.5 rounded-md transition-colors cursor-pointer shadow-none"
              >
                Log in to Solvane
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              {error && (
                <div className="p-3 rounded-md bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 text-xs flex items-center gap-2">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* New Password */}
              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">New Password</label>
                <div className="relative flex items-center rounded-md border border-border bg-background focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 transition-colors">
                  <input
                    type={showNew ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none font-sans"
                    required
                  />
                  <button type="button" onClick={() => setShowNew(!showNew)} className="pr-3 text-muted-foreground hover:text-foreground transition-colors shrink-0">
                    {showNew ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                <p className={`text-xs mt-1.5 transition-colors ${newPassword && !strength.isValid ? "text-red-500 dark:text-red-400 font-medium" : "text-muted-foreground"}`}>
                  Must be at least 8 characters with a number and a symbol.
                </p>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Confirm New Password</label>
                <div className="relative flex items-center rounded-md border border-border bg-background focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 transition-colors">
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none font-sans"
                    required
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="pr-3 text-muted-foreground hover:text-foreground transition-colors shrink-0">
                    {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                {confirmPassword && !match && (
                  <p className="mt-1 text-xs text-red-500 dark:text-red-400 flex items-center gap-1">
                    <AlertCircle size={12} className="shrink-0" /> Passwords do not match
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || !strength.isValid || !match}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm py-2.5 rounded-md transition-colors disabled:opacity-50 cursor-pointer shadow-none"
              >
                {loading ? <Loader2 size={15} className="animate-spin" /> : null}
                Reset Password
              </button>
            </form>
          )}

          <div className="mt-6 pt-4 border-t border-border/40 text-left">
            <button
              onClick={() => onNav("login")}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer flex items-center gap-1"
            >
              ← Back to log in
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-xs text-muted-foreground pt-4 border-t border-border/40 flex items-center justify-between">
          <span>© {new Date().getFullYear()} Solvane Inc.</span>
          <div className="flex items-center gap-4">
            <button onClick={() => onNav("docs")} className="hover:text-foreground transition-colors cursor-pointer">Privacy</button>
            <button onClick={() => onNav("docs")} className="hover:text-foreground transition-colors cursor-pointer">Terms</button>
          </div>
        </div>
      </div>

      {/* Right Branded Panel */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-[#090A0F] text-white relative overflow-hidden">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 opacity-[0.08] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`,
            backgroundSize: `24px 24px`
          }}
        />

        {/* Radar / Scan graphic */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] pointer-events-none opacity-40">
          <div className="w-full h-full rounded-full border border-blue-500/20 flex items-center justify-center relative">
            <div className="w-[300px] h-[300px] rounded-full border border-blue-500/25 flex items-center justify-center">
              <div className="w-[180px] h-[180px] rounded-full border border-blue-500/30 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-blue-500 animate-ping" />
              </div>
            </div>
            <div className="absolute inset-x-0 top-1/2 border-b border-blue-500/20" />
            <div className="absolute inset-y-0 left-1/2 border-r border-blue-500/20" />
            <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,transparent_0_300deg,rgba(37,99,235,0.25)_360deg)] animate-[spin_8s_linear_infinite]" />
            <div className="absolute top-16 right-24 bg-blue-950/80 border border-blue-500/30 rounded-md px-2.5 py-1 text-[10px] font-mono text-blue-300 flex items-center gap-1.5 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              Web Scanner
            </div>
            <div className="absolute bottom-20 left-16 bg-indigo-950/80 border border-indigo-500/30 rounded-md px-2.5 py-1 text-[10px] font-mono text-indigo-300 flex items-center gap-1.5 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              API Fuzzer
            </div>
            <div className="absolute top-1/2 right-8 bg-emerald-950/80 border border-emerald-500/30 rounded-md px-2.5 py-1 text-[10px] font-mono text-emerald-300 flex items-center gap-1.5 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              APK Decompiler
            </div>
          </div>
        </div>

        {/* Right Panel Header */}
        <div className="relative z-10 flex items-center justify-between">
          <span className="text-xs font-mono text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded-full tracking-wider uppercase">
            Solvane Security
          </span>
        </div>

        {/* Right Panel Bottom Content */}
        <div className="relative z-10 max-w-md">
          <div className="w-10 h-10 rounded-md bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-6">
            <Shield size={20} />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white mb-3 leading-snug">
            Find vulnerabilities before attackers do.
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            Continuous automated security analysis across web applications, APIs, and mobile binaries with plain-English remediation diffs.
          </p>
        </div>
      </div>
    </div>
  );
}
