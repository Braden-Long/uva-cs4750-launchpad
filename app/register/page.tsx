"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Rocket } from "lucide-react";
import Link from "next/link";

function validateField(name: string, value: string): string {
  switch (name) {
    case "first_name":
    case "last_name":
      if (!value.trim()) return "Required";
      if (!/^[a-zA-Z\s'\-]+$/.test(value.trim())) return "Letters only";
      return "";
    case "username":
      if (!value.trim()) return "Required";
      if (!/^[a-zA-Z0-9_]+$/.test(value)) return "Letters, numbers, and underscores only";
      if (value.length < 3) return "At least 3 characters";
      return "";
    case "password":
      if (!value) return "Required";
      if (value.length < 6) return "At least 6 characters";
      if (!/[a-zA-Z]/.test(value)) return "Must include at least one letter";
      if (!/[0-9]/.test(value)) return "Must include at least one number";
      return "";
    default:
      return "";
  }
}

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", first_name: "", last_name: "", password: "" });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fieldErrors = Object.fromEntries(
    Object.keys(form).map((k) => [k, validateField(k, form[k as keyof typeof form])])
  );
  const isValid = Object.values(fieldErrors).every((e) => e === "");

  function handleChange(name: string, value: string) {
    setForm({ ...form, [name]: value });
  }

  function handleBlur(name: string) {
    setTouched({ ...touched, [name]: true });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ first_name: true, last_name: true, username: true, password: true });
    if (!isValid) return;
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      router.push("/");
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error ?? "Registration failed");
      setLoading(false);
    }
  }

  function fieldClass(name: string) {
    const hasError = touched[name] && fieldErrors[name];
    return `w-full bg-background border rounded-lg px-3 py-2 text-sm focus:outline-none ${
      hasError ? "border-[var(--danger)] focus:border-[var(--danger)]" : "border-border focus:border-accent"
    }`;
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2.5 justify-center mb-8">
          <Rocket size={22} className="text-accent" />
          <span className="text-xl font-bold">Launchpad</span>
        </div>
        <div className="bg-card border border-border rounded-xl p-6 shadow-2xl">
          <h1 className="text-lg font-semibold mb-1">Create account</h1>
          <p className="text-sm text-muted mb-5">Start tracking your applications</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-muted mb-1.5">First Name</label>
                <input
                  value={form.first_name}
                  onChange={(e) => handleChange("first_name", e.target.value)}
                  onBlur={() => handleBlur("first_name")}
                  className={fieldClass("first_name")}
                  placeholder="First name"
                />
                {touched.first_name && fieldErrors.first_name && (
                  <p className="text-xs text-[var(--danger)] mt-1">{fieldErrors.first_name}</p>
                )}
              </div>
              <div>
                <label className="block text-xs text-muted mb-1.5">Last Name</label>
                <input
                  value={form.last_name}
                  onChange={(e) => handleChange("last_name", e.target.value)}
                  onBlur={() => handleBlur("last_name")}
                  className={fieldClass("last_name")}
                  placeholder="Last name"
                />
                {touched.last_name && fieldErrors.last_name && (
                  <p className="text-xs text-[var(--danger)] mt-1">{fieldErrors.last_name}</p>
                )}
              </div>
            </div>
            <div>
              <label className="block text-xs text-muted mb-1.5">Username</label>
              <input
                value={form.username}
                onChange={(e) => handleChange("username", e.target.value)}
                onBlur={() => handleBlur("username")}
                className={fieldClass("username")}
                placeholder="Choose a username"
              />
              {touched.username && fieldErrors.username && (
                <p className="text-xs text-[var(--danger)] mt-1">{fieldErrors.username}</p>
              )}
            </div>
            <div>
              <label className="block text-xs text-muted mb-1.5">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => handleChange("password", e.target.value)}
                onBlur={() => handleBlur("password")}
                className={fieldClass("password")}
                placeholder="••••••••"
              />
              {touched.password && fieldErrors.password ? (
                <p className="text-xs text-[var(--danger)] mt-1">{fieldErrors.password}</p>
              ) : (
                <p className="text-xs text-muted mt-1">Min. 6 characters, at least one letter and one number</p>
              )}
            </div>
            {error && <p className="text-xs text-[var(--danger)]">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>
          <p className="text-xs text-muted text-center mt-4">
            Already have an account?{" "}
            <Link href="/login" className="text-accent hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
