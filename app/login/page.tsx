"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase"; // Importante!
import { Lock, Mail, ArrowRight, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    localStorage.clear();

    // Busca o usuário na tabela de perfis do Supabase
    const { data, error } = await supabase
      .from('perfis')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !data) {
      alert("Usuário não encontrado no banco de dados!");
      setLoading(false);
      return;
    }

    // Salva os dados reais do banco no navegador
    localStorage.setItem("userRole", data.cargo);
    localStorage.setItem("userName", data.nome);
    localStorage.setItem("userSetor", data.setor);
    localStorage.setItem("userUnidade", data.unidade);

    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-10 rounded-4xl shadow-2xl w-full max-w-md border border-gray-100">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-blue-600 italic tracking-tighter">CLÍNICA</h1>
          <p className="text-gray-400 font-bold text-xs mt-2 uppercase">Acesso Restrito</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
            <input 
              type="email" 
              placeholder="E-mail cadastrado"
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button 
            disabled={loading}
            type="submit"
            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-blue-700 shadow-xl transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : "ENTRAR"} <ArrowRight size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}