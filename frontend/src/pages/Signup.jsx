import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import api from "../services/api"
import { useAuth } from "../context/AuthContext"
import { useToast } from "../components/useToast"

export default function Signup() {
  const { saveSession } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const [form, setForm] = useState({ full_name: "", email: "", password: "", confirm: "" })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.full_name.trim()) e.full_name = "Full name is required"
    else if (form.full_name.trim().length < 2) e.full_name = "Name must be at least 2 characters"
    if (!form.email) e.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email"
    if (!form.password) e.password = "Password is required"
    else if (form.password.length < 6) e.password = "Password must be at least 6 characters"
    if (!form.confirm) e.confirm = "Please confirm your password"
    else if (form.password !== form.confirm) e.confirm = "Passwords do not match"
    return e
  }

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
    setErrors((er) => ({ ...er, [e.target.name]: "" }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    try {
      const { data } = await api.post("/api/auth/signup", {
        full_name: form.full_name.trim(),
        email: form.email,
        password: form.password,
      })
      saveSession(data.access_token, data.user)
      showToast(`Welcome to EventNest, ${data.user.full_name}!`, "success")
      navigate("/")
    } catch (err) {
      const msg = err.response?.data?.detail || "Signup failed. Please try again."
      showToast(msg, "error")
    } finally {
      setLoading(false)
    }
  }

  const strength = (() => {
    const p = form.password
    if (!p) return 0
    let s = 0
    if (p.length >= 6) s++
    if (p.length >= 10) s++
    if (/[A-Z]/.test(p)) s++
    if (/[0-9]/.test(p)) s++
    if (/[^A-Za-z0-9]/.test(p)) s++
    return s
  })()

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong", "Very Strong"][strength]
  const strengthClass = ["", "auth-strength-weak", "auth-strength-fair", "auth-strength-good", "auth-strength-strong", "auth-strength-strong"][strength]

  return (
    <div className="auth-page">
      <div className="auth-card auth-card-lg">
        <div className="auth-brand">
          <div className="auth-brand-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/>
            </svg>
          </div>
          <span className="auth-brand-name">Event<span className="auth-brand-accent">Nest</span></span>
        </div>

        <h1 className="auth-title">Create your account</h1>
        <p className="auth-subtitle">Join thousands of event lovers. It&apos;s free.</p>

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div className={`auth-field ${errors.full_name ? "has-error" : ""}`}>
            <label htmlFor="signup-name" className="auth-label">Full Name</label>
            <div className="auth-input-wrap">
              <span className="auth-input-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
              </span>
              <input
                id="signup-name"
                type="text"
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                placeholder="Your full name"
                className="auth-input"
                autoComplete="name"
              />
            </div>
            {errors.full_name && <span className="auth-error">{errors.full_name}</span>}
          </div>

          <div className={`auth-field ${errors.email ? "has-error" : ""}`}>
            <label htmlFor="signup-email" className="auth-label">Email address</label>
            <div className="auth-input-wrap">
              <span className="auth-input-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
              </span>
              <input
                id="signup-email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                className="auth-input"
                autoComplete="email"
              />
            </div>
            {errors.email && <span className="auth-error">{errors.email}</span>}
          </div>

          <div className={`auth-field ${errors.password ? "has-error" : ""}`}>
            <label htmlFor="signup-password" className="auth-label">Password</label>
            <div className="auth-input-wrap">
              <span className="auth-input-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </span>
              <input
                id="signup-password"
                type={showPass ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Min. 6 characters"
                className="auth-input"
                autoComplete="new-password"
              />
              <button
                type="button"
                className="auth-toggle-pass"
                onClick={() => setShowPass((s) => !s)}
                aria-label={showPass ? "Hide password" : "Show password"}
              >
                {showPass ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
            {errors.password && <span className="auth-error">{errors.password}</span>}
            {form.password && (
              <div className="auth-strength-bar-wrap">
                <div className="auth-strength-bar">
                  {[1,2,3,4,5].map((i) => (
                    <div key={i} className={`auth-strength-segment ${i <= strength ? strengthClass : ""}`} />
                  ))}
                </div>
                <span className={`auth-strength-label ${strengthClass}`}>{strengthLabel}</span>
              </div>
            )}
          </div>

          <div className={`auth-field ${errors.confirm ? "has-error" : ""}`}>
            <label htmlFor="signup-confirm" className="auth-label">Confirm Password</label>
            <div className="auth-input-wrap">
              <span className="auth-input-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </span>
              <input
                id="signup-confirm"
                type={showPass ? "text" : "password"}
                name="confirm"
                value={form.confirm}
                onChange={handleChange}
                placeholder="Re-enter password"
                className="auth-input"
                autoComplete="new-password"
              />
            </div>
            {errors.confirm && <span className="auth-error">{errors.confirm}</span>}
          </div>

          <button type="submit" className="btn btn-primary btn-block auth-submit" disabled={loading}>
            {loading ? <span className="auth-spinner" /> : "Create Account"}
          </button>
        </form>

        <p className="auth-footer-text">
          Already have an account?{" "}
          <Link to="/login" className="auth-link">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
