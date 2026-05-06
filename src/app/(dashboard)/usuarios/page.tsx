"use client";

import { useEffect, useState, useCallback } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import api from "@/lib/api";
import ModalUsuario from "./components/ModalUsuario";

interface Usuario {
  id: string;
  nombre: string;
  apellido: string;
  ci: string;
  cod_usuario: string;
  email: string;
  nivel: string;
  activo: boolean;
  created_at: string;
}

export default function UsuariosPage() {
  const [data, setData] = useState<Usuario[]>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [modal, setModal] = useState<{ open: boolean; usuario: Usuario | null }>({
    open: false,
    usuario: null,
  });
  const [loading, setLoading] = useState(true);

  const fetchUsuarios = useCallback(async () => {
    setLoading(true);
    try {
      const { data: res } = await api.get<Usuario[]>("/api/usuarios");
      setData(res);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsuarios(); }, [fetchUsuarios]);

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este usuario?")) return;
    await api.delete(`/api/usuarios/${id}`);
    fetchUsuarios();
  }

  const columns: ColumnDef<Usuario>[] = [
    {
      accessorFn: (r) => `${r.apellido} ${r.nombre}`,
      header: "Nombre",
      id: "nombre",
    },
    { accessorKey: "ci",          header: "C.I." },
    { accessorKey: "cod_usuario", header: "Código" },
    { accessorKey: "email",       header: "Email" },
    {
      accessorKey: "nivel",
      header: "Nivel",
      cell: ({ getValue }) => {
        const v = getValue() as string;
        return (
          <span className={`text-xs px-2 py-0.5 rounded-full ${
            v === "admin"
              ? "bg-naabol-gold/20 text-naabol-gold"
              : "bg-naabol-white/8 text-naabol-white/70"
          }`}>
            {v}
          </span>
        );
      },
    },
    {
      accessorKey: "activo",
      header: "Estado",
      cell: ({ getValue }) =>
        getValue() ? (
          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "var(--naabol-button-success)", color: "var(--naabol-button-success-text)" }}>Activo</span>
        ) : (
          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "var(--naabol-button-error)", color: "var(--naabol-button-error-text)" }}>Inactivo</span>
        ),
    },
    {
      id: "acciones",
      header: "",
      cell: ({ row }) => (
        <div className="flex gap-1 justify-end">
          <button
            className="naabol-btn naabol-btn-icon naabol-btn-sm"
            onClick={() => setModal({ open: true, usuario: row.original })}
          >
            <Pencil size={13} />
          </button>
          <button
            className="naabol-btn naabol-btn-error naabol-btn-icon naabol-btn-sm"
            onClick={() => handleDelete(row.original.id)}
          >
            <Trash2 size={13} />
          </button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 style={{ fontFamily: "'Syne', sans-serif", color: "var(--color-naabol-gold)" }}
            className="text-2xl font-bold">
          Usuarios
        </h1>
        <button className="naabol-btn naabol-btn-primary"
          onClick={() => setModal({ open: true, usuario: null })}>
          <Plus size={15} /> Nuevo usuario
        </button>
      </div>

      <div className="naabol-card-base !p-4 space-y-3">
        <div className="relative max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-naabol-white/40" />
          <input
            className="input naabol-input w-full pl-8"
            placeholder="Buscar..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
        </div>

        {loading ? (
          <p className="text-naabol-white/50 text-sm py-4 text-center">Cargando...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                {table.getHeaderGroups().map((hg) => (
                  <tr key={hg.id} className="border-b border-naabol-gold/10">
                    {hg.headers.map((h) => (
                      <th key={h.id}
                          className="text-left py-2 px-3 text-naabol-white/50 font-medium whitespace-nowrap">
                        {flexRender(h.column.columnDef.header, h.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length}
                        className="text-center py-8 text-naabol-white/40">
                      Sin usuarios registrados
                    </td>
                  </tr>
                ) : (
                  table.getRowModel().rows.map((row) => (
                    <tr key={row.id}
                        className="border-b border-naabol-gold/5 hover:bg-naabol-navy/30 transition-colors">
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="py-2.5 px-3 text-naabol-white/80">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal.open && (
        <ModalUsuario
          usuario={modal.usuario}
          onClose={() => setModal({ open: false, usuario: null })}
          onSaved={() => { setModal({ open: false, usuario: null }); fetchUsuarios(); }}
        />
      )}
    </div>
  );
}
