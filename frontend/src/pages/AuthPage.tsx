import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BackgroundFX from "../components/BackgroundFX";
import "./AuthPage.css";
import { useAuth } from "../state/AuthContext";

export default function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation() as { state?: { reason?: string; from?: string } };
  const { login, signup, token } = useAuth();

  // Mode + form state
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Error highlights
  const [eDisplayName, setEDisplayName] = useState(false);
  const [eEmail, setEEmail] = useState(false);
  const [ePassword, setEPassword] = useState(false);

  // Toasts (fixed)
  type Toast = { id: number; type: "error" | "info" | "success"; msg: string; ttl?: number };
  const [toasts, setToasts] = useState<Toast[]>([]);
  function pushToast(t: Omit<Toast, "id">) {
    const id = Date.now() + Math.random();
    const ttl = t.ttl ?? 3500;
    const toast: Toast = { ...t, id, ttl };
    setToasts((p) => [toast, ...p]);
    setTimeout(() => setToasts((p) => p.filter((x) => x.id !== id)), ttl);
  }

  // Forgot/reset modals
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSubmitting, setForgotSubmitting] = useState(false);

  const [showResetModal, setShowResetModal] = useState(false);
  const [resetToken, setResetToken] = useState("");
  const [newPass, setNewPass] = useState("");
  const [resetSubmitting, setResetSubmitting] = useState(false);

  // Redirect notice
  const initialNotice = useMemo(() => {
    if (location?.state?.reason === "auth_required") {
      return { type: "info" as const, msg: "Please sign in to continue." };
    }
    return null;
  }, [location?.state?.reason]);

  useEffect(() => {
    if (initialNotice) pushToast(initialNotice);
    if (token) navigate(location.state?.from || "/app/dashboard", { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // Validation
  function validateFields() {
    let ok = true;
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    const passOk = password.length >= 6;

    setEEmail(!emailOk);
    setEPassword(!passOk);

    if (mode === "signup") {
      const nameOk = displayName.trim().length >= 2;
      setEDisplayName(!nameOk);
      if (!nameOk) {
        pushToast({ type: "error", msg: "Display name must be at least 2 characters." });
        ok = false;
      }
    }
    if (!emailOk) {
      pushToast({ type: "error", msg: "Enter a valid email address." });
      ok = false;
    }
    if (!passOk) {
      pushToast({ type: "error", msg: "Password must be ≥ 6 characters." });
      ok = false;
    }
    return ok;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateFields()) return;

    setSubmitting(true);
    try {
      if (mode === "login") {
        await login(email.trim(), password);
        pushToast({ type: "success", msg: "Welcome back." });
      } else {
        await signup(displayName.trim(), email.trim(), password);
        pushToast({ type: "success", msg: "Account created. Booting dashboard…" });
      }
      navigate(location.state?.from || "/app/dashboard", { replace: true });
    } catch (err: any) {
      const msgText = (err?.message || "").toLowerCase();
      let msg = "Something went wrong.";
      if (msgText.includes("401")) msg = "Incorrect email or password.";
      else if (msgText.includes("409")) {
        msg = msgText.includes("display") ? "Display name already taken." : "Email already taken.";
      }
      pushToast({ type: "error", msg });
      setEEmail(true);
      setEPassword(true);
    } finally {
      setSubmitting(false);
    }
  }

  // Local helper to POST JSON to public endpoints (forgot/reset)
  async function postJson(path: string, body: any) {
    const res = await fetch(`/api${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(res.statusText);
    return res.json().catch(() => ({}));
  }

  async function submitForgotEmail() {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail.trim())) {
      pushToast({ type: "error", msg: "Enter a valid email." });
      return;
    }
    setForgotSubmitting(true);
    try {
      await postJson("/auth/forgot-password", { email: forgotEmail.trim() });
      pushToast({ type: "info", msg: "If that email exists, we sent reset instructions." });
      setShowForgotModal(false);
    } catch {
      pushToast({ type: "error", msg: "Unable to process request." });
    } finally {
      setForgotSubmitting(false);
    }
  }

  async function submitResetPassword() {
    if (newPass.length < 6) {
      pushToast({ type: "error", msg: "Password must be ≥ 6 characters." });
      return;
    }
    setResetSubmitting(true);
    try {
      await postJson("/auth/reset-password", { token: resetToken.trim(), newPassword: newPass });
      pushToast({ type: "success", msg: "Password reset. Try logging in." });
      setShowResetModal(false);
    } catch {
      pushToast({ type: "error", msg: "Invalid or expired token." });
    } finally {
      setResetSubmitting(false);
    }
  }

  return (
    <div className="AuthPage">
      <div className="fx-layer"><BackgroundFX /></div>

      {/* Toasts (uses existing classes) */}
      <div className="AuthToastStack">
        {toasts.map((t) => (
          <div key={t.id} className={`AuthToast ${t.type}`}>
            {/* Optional glow layer if you style it later */}
            <div className="AuthToastBody">
              <span className="AuthStatusDot">●</span>
              <span className="AuthStatusText">{t.msg}</span>
              <button
                className="AuthToastClose"
                onClick={() => setToasts((p) => p.filter((x) => x.id !== t.id))}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="AuthToastBar" />
          </div>
        ))}
      </div>

      <div className="AuthCard fx-content">
        <div className="AuthHeaderRow">
          <div className="AuthHeaderLeft">
            <div className="AuthTitle glitch" data-text="SKILLSYNTH">SKILLSYNTH</div>
            <div className="AuthSub">Sign in or create your access node.</div>
          </div>

          <div className="AuthHeaderRight">
            <button
              className={`AuthModeBtn ${mode === "signup" ? "active" : ""}`}
              onClick={() => setMode("signup")}
              type="button"
            >
              Sign Up
            </button>
            <button
              className={`AuthModeBtn ${mode === "login" ? "active" : ""}`}
              onClick={() => setMode("login")}
              type="button"
            >
              Log In
            </button>
          </div>
        </div>

        <form onSubmit={onSubmit} className="AuthForm">
          {mode === "signup" && (
            <div className="AuthField">
              <label>Display Name</label>
              <input
                className={`AuthInput ${eDisplayName ? "hasError" : ""}`}
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Display name"
                required
              />
            </div>
          )}

          <div className="AuthField">
            <label>Email</label>
            <input
              className={`AuthInput ${eEmail ? "hasError" : ""}`}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
          </div>

          <div className="AuthField">
            <label>Password</label>
            <input
              className={`AuthInput ${ePassword ? "hasError" : ""}`}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              minLength={6}
            />
          </div>

          <div className="AuthUtilityRow">
            <label style={{ fontSize: 12 }}>
              <input type="checkbox" style={{ marginRight: 6 }} /> Remember me
            </label>
            {mode === "login" && (
              <button
                type="button"
                className="AuthLink"
                onClick={() => setShowForgotModal(true)}
              >
                Forgot password?
              </button>
            )}
          </div>

          <button type="submit" className="AuthSubmitBtn" disabled={submitting}>
            {submitting ? "Processing…" : mode === "signup" ? "Create Account →" : "Sign In →"}
          </button>
        </form>

        <div className="AuthFooterMeta">
          <span className="AuthStatusDot">●</span>
          <span className="AuthStatusText">System secure</span>
        </div>
      </div>

      {/* Forgot modal (uses AuthModal* classes) */}
      {showForgotModal && (
        <div className="AuthModalOverlay" onClick={() => setShowForgotModal(false)}>
          <div className="AuthModal" onClick={(e) => e.stopPropagation()}>
            <h3>Reset your password</h3>
            <p>Enter the email associated with your account.</p>
            <input
              className="AuthInput"
              type="email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              placeholder="you@example.com"
            />
            <div className="AuthModalBtns">
              <button onClick={submitForgotEmail} disabled={forgotSubmitting}>
                {forgotSubmitting ? "Sending…" : "Send reset link"}
              </button>
              <button onClick={() => setShowForgotModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Reset modal */}
      {showResetModal && (
        <div className="AuthModalOverlay" onClick={() => setShowResetModal(false)}>
          <div className="AuthModal" onClick={(e) => e.stopPropagation()}>
            <h3>Enter reset token &amp; new password</h3>
            <input
              className="AuthInput"
              placeholder="token"
              value={resetToken}
              onChange={(e) => setResetToken(e.target.value)}
            />
            <input
              className="AuthInput"
              placeholder="new password"
              type="password"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
            />
            <div className="AuthModalBtns">
              <button onClick={submitResetPassword} disabled={resetSubmitting}>
                {resetSubmitting ? "Resetting…" : "Reset password"}
              </button>
              <button onClick={() => setShowResetModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
