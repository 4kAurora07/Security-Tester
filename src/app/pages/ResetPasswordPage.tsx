import { useState, useEffect } from "react";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Screen } from "../components/Navbar";
import { authApi, validatePasswordStrength } from "../services/authApi";
import { AuthCard, Field } from "../App";

interface ResetPasswordPageProps {
  onNav: (s: Screen) => void;
  dark: boolean;
  toggleDark: () => void;
}

export function ResetPasswordPage({ onNav, dark, toggleDark }: ResetPasswordPageProps) {
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
    <AuthCard onNav={onNav} dark={dark} toggleDark={toggleDark} title="Create new password" subtitle="Set a new password for your account">
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
        <form onSubmit={handleSubmit} className="space-y-3 text-left">
          {error && (
            <div className="p-3 rounded-md bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 text-xs flex items-center gap-2">
              <AlertCircle size={14} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* New Password */}
          <Field
            label="New Password"
            type="password"
            placeholder="••••••••"
            value={newPassword}
            onChange={setNewPassword}
            hint="Must be at least 8 characters with a number and a symbol."
            error={newPassword && !strength.isValid ? "Must be at least 8 characters with a number and a symbol." : undefined}
          />

          {/* Confirm Password */}
          <Field
            label="Confirm New Password"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={setConfirmPassword}
            error={confirmPassword && !match ? "Passwords do not match" : undefined}
          />

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

      <div className="mt-4.5 pt-3 border-t border-border/40 text-left">
        <button
          onClick={() => onNav("login")}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer flex items-center gap-1"
        >
          ← Back to log in
        </button>
      </div>
    </AuthCard>
  );
}
