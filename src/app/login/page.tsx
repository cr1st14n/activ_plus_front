"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { setToken } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await api.post("/api/auth/login", { email, password });
      setToken(data.token);
      router.replace("/");
    } catch {
      setError("Credenciales incorrectas");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "var(--color-naabol-bg)" }}
    >
      <div className="naabol-card-base w-full max-w-sm">
        <h1
          className="text-2xl font-bold text-center"
          style={{
            fontFamily: "'Syne', sans-serif",
            color: "var(--color-naabol-gold)",
          }}
        >
          Activ+
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="field">
            <label className="field-label">Email</label>
            <input
              type="email"
              className="input naabol-input w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label className="field-label">Contraseña</label>
            <input
              type="password"
              className="input naabol-input w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && (
            <p className="text-sm" style={{ color: "var(--naabol-button-error-text)" }}>
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="naabol-btn naabol-btn-primary w-full"
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
}
