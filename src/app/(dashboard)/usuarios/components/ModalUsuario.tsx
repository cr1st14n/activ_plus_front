"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import api from "@/lib/api";

interface Usuario {
  id?: string;
  nombre: string;
  apellido: string;
  ci: string;
  cod_usuario: string;
  email: string;
  nivel: string;
  activo?: boolean;
}

interface Props {
  usuario: Usuario | null; // null = crear
  onClose: () => void;
  onSaved: () => void;
}

const EMPTY: Usuario = {
  nombre: "", apellido: "", ci: "", cod_usuario: "", email: "", nivel: "operador",
};

export default function ModalUsuario({ usuario, onClose, onSaved }: Props) {
  const [form, setForm] = useState<Usuario & { password?: string }>(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const isEdit = !!usuario?.id;

  useEffect(() => {
    setForm(usuario ? { ...usuario, password: "" } : { ...EMPTY, password: "" });
    setError("");
  }, [usuario]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const payload: Record<string, unknown> = { ...form };
      if (isEdit && !payload.password) delete payload.password;

      if (isEdit) {
        await api.put(`/api/usuarios/${usuario!.id}`, payload);
      } else {
        await api.post("/api/usuarios", payload);
      }
      onSaved();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
      setError(msg ?? "Error al guardar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="naabol-card-base w-full max-w-lg mx-4">
        <div className="flex items-center justify-between">
          <h2 style={{ fontFamily: "'Syne', sans-serif", color: "var(--color-naabol-gold)" }}
              className="text-lg font-bold">
            {isEdit ? "Editar usuario" : "Nuevo usuario"}
          </h2>
          <button onClick={onClose} className="naabol-btn naabol-btn-icon">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3">
          <div className="field">
            <label className="field-label">Nombre</label>
            <input name="nombre" className="input naabol-input w-full" value={form.nombre}
              onChange={handleChange} required />
          </div>
          <div className="field">
            <label className="field-label">Apellido</label>
            <input name="apellido" className="input naabol-input w-full" value={form.apellido}
              onChange={handleChange} required />
          </div>
          <div className="field">
            <label className="field-label">C.I.</label>
            <input name="ci" className="input naabol-input w-full" value={form.ci}
              onChange={handleChange} required />
          </div>
          <div className="field">
            <label className="field-label">Código de acceso</label>
            <input name="cod_usuario" className="input naabol-input w-full" value={form.cod_usuario}
              onChange={handleChange} required />
          </div>
          <div className="field col-span-2">
            <label className="field-label">Email</label>
            <input type="email" name="email" className="input naabol-input w-full" value={form.email}
              onChange={handleChange} required />
          </div>
          <div className="field">
            <label className="field-label">Contraseña {isEdit && "(dejar vacío para no cambiar)"}</label>
            <input type="password" name="password" className="input naabol-input w-full"
              value={form.password ?? ""} onChange={handleChange}
              required={!isEdit} minLength={isEdit ? 0 : 6} />
          </div>
          <div className="field">
            <label className="field-label">Nivel</label>
            <select name="nivel" className="select naabol-select w-full" value={form.nivel}
              onChange={handleChange}>
              <option value="operador">Operador</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {error && (
            <p className="col-span-2 text-sm" style={{ color: "var(--naabol-button-error-text)" }}>
              {error}
            </p>
          )}

          <div className="col-span-2 flex justify-end gap-2 pt-1">
            <button type="button" onClick={onClose} className="naabol-btn">Cancelar</button>
            <button type="submit" disabled={loading} className="naabol-btn naabol-btn-primary">
              {loading ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
