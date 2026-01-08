"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { UserPlus, Save, ArrowLeft, Shield } from "lucide-react";
import Link from "next/link";

export default function CadastroFuncionario() {
  const [form, setForm] = useState({ nome: "", email: "", cargo: "USER", setor: "", unidade: "Matriz" });
  const [loading, setLoading] = useState(false);

  const salvarFuncionario = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from('perfis').insert([form]);

    if (error) {
      alert("Erro ao cadastrar: " + error.message);
    } else {
      alert("Funcionário cadastrado com sucesso!");
      setForm({ nome: "", email: "", cargo: "USER", setor: "", unidade: "Matriz" });
    }
    setLoading(false);
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <header className="mb-8">
        <Link href="/dashboard" className="text-blue-600 font-bold flex items-center gap-2 mb-4">
          <ArrowLeft size={18} /> Voltar
        </Link>
        <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
          <UserPlus className="text-blue-600" /> Nova Conta de Acesso
        </h1>
      </header>

      <form onSubmit={salvarFuncionario} className="bg-white p-8 rounded-4xl shadow-sm border border-gray-100 space-y-5">
        <div>
          <label className="text-sm font-bold text-gray-700">Nome Completo</label>
          <input required className="w-full mt-2 p-3 bg-gray-50 border rounded-xl" 
            onChange={e => setForm({...form, nome: e.target.value})} value={form.nome} />
        </div>

        <div>
          <label className="text-sm font-bold text-gray-700">E-mail de Acesso</label>
          <input required type="email" className="w-full mt-2 p-3 bg-gray-50 border rounded-xl" 
            onChange={e => setForm({...form, email: e.target.value})} value={form.email} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-bold text-gray-700">Setor</label>
            <input required className="w-full mt-2 p-3 bg-gray-50 border rounded-xl" 
              onChange={e => setForm({...form, setor: e.target.value})} value={form.setor} />
          </div>
          <div>
            <label className="text-sm font-bold text-gray-700">Nível de Acesso</label>
            <select className="w-full mt-2 p-3 bg-gray-50 border rounded-xl font-bold"
              onChange={e => setForm({...form, cargo: e.target.value})} value={form.cargo}>
              <option value="USER">Funcionário (USER)</option>
              <option value="ADMIN">Administrador (ADMIN)</option>
            </select>
          </div>
        </div>

        <button 
          disabled={loading}
          className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
        >
          {loading ? "SALVANDO..." : "CRIAR ACESSO"} <Save size={20} />
        </button>
      </form>
    </div>
  );
}