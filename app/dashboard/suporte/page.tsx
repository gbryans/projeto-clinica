"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { 
  LifeBuoy, Send, ArrowLeft, User, Monitor, 
  AlertCircle, CheckCircle2, HardDrive, MousePointer2, Loader2 
} from "lucide-react";
import Link from "next/link";

export default function SuporteTIPage() {
  const router = useRouter();
  const [usuario, setUsuario] = useState({ nome: "", setor: "", unidade: "" });
  const [enviado, setEnviado] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Busca dados do localStorage salvos no login
    setUsuario({
      nome: localStorage.getItem("userName") || "Funcionário",
      setor: localStorage.getItem("userSetor") || "Geral",
      unidade: localStorage.getItem("userUnidade") || "Matriz",
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    
    const dadosParaEnviar = {
      solicitante: usuario.nome,
      setor: usuario.setor,
      categoria: formData.get("categoria"),
      urgencia: formData.get("urgencia"),
      descricao: formData.get("descricao"),
      status: "pendente"
    };

    const { error } = await supabase
      .from("chamados")
      .insert([dadosParaEnviar]);

    if (error) {
      console.error("Erro Supabase:", error);
      alert("Erro ao enviar: " + error.message);
      setLoading(false);
    } else {
      setEnviado(true);
      setLoading(false);
      // Redireciona após 3 segundos
      setTimeout(() => router.push("/dashboard"), 3000);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto bg-gray-50 min-h-screen font-sans text-gray-900">
      
      {/* Cabeçalho sem conflitos de CSS */}
      <header className="mb-8">
        <Link href="/dashboard" className="flex items-center gap-2 text-indigo-600 font-semibold mb-4 hover:underline">
          <ArrowLeft size={18} /> Voltar ao Painel
        </Link>
        <div className="flex items-center gap-4">
          <div className="bg-indigo-600 p-3 rounded-2xl text-white shadow-lg shadow-indigo-100">
            <LifeBuoy size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tighter italic">SUPORTE T.I.</h1>
            <p className="text-gray-500 font-medium text-sm">Relate o problema abaixo para nossa equipe técnica.</p>
          </div>
        </div>
      </header>

      {enviado ? (
        <div className="bg-white p-12 rounded-4xl text-center shadow-xl border border-green-100 animate-in fade-in zoom-in">
          <CheckCircle2 className="text-green-500 mx-auto mb-4" size={64} />
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Chamado Enviado com Sucesso!</h2>
          <p className="text-gray-500 mt-2 text-sm font-medium italic">A equipe técnica foi notificada. Voltando ao início...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Dados do Solicitante */}
          <div className="bg-white p-6 rounded-4xl shadow-sm border border-gray-100 opacity-80">
            <h2 className="text-[10px] font-black mb-4 text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <User size={14}/> Identificação do Usuário
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase">Nome</label>
                <input disabled value={usuario.nome} className="w-full mt-1 p-3 bg-gray-50 border border-gray-100 rounded-xl text-gray-500 cursor-not-allowed font-bold text-sm" />
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase">Setor</label>
                <input disabled value={usuario.setor} className="w-full mt-1 p-3 bg-gray-50 border border-gray-100 rounded-xl text-gray-500 cursor-not-allowed font-bold text-sm" />
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase">Unidade</label>
                <input disabled value={usuario.unidade} className="w-full mt-1 p-3 bg-gray-50 border border-gray-100 rounded-xl text-gray-500 cursor-not-allowed font-bold text-sm" />
              </div>
            </div>
          </div>

          {/* Campos de Relatório */}
          <div className="bg-white p-8 rounded-4xl shadow-sm border border-gray-100">
            <h2 className="text-sm font-black mb-6 text-indigo-600 flex items-center gap-2 border-b border-gray-50 pb-4 tracking-widest uppercase">
              <AlertCircle size={18}/> Detalhes da Ocorrência
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="text-xs font-black text-gray-800 uppercase tracking-tighter">1. Categoria</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-4 border border-gray-100 bg-gray-50 rounded-2xl cursor-pointer hover:bg-indigo-50 transition-all has-checked:bg-indigo-50 has-checked:border-indigo-200">
                    <input type="radio" name="categoria" value="software" required className="w-4 h-4 text-indigo-600" />
                    <span className="font-bold text-gray-700 flex items-center gap-2 text-sm italic"><Monitor size={18}/> Sistemas (Software)</span>
                  </label>
                  <label className="flex items-center gap-3 p-4 border border-gray-100 bg-gray-50 rounded-2xl cursor-pointer hover:bg-indigo-50 transition-all has-checked:bg-indigo-50 has-checked:border-indigo-200">
                    <input type="radio" name="categoria" value="hardware" className="w-4 h-4 text-indigo-600" />
                    <span className="font-bold text-gray-700 flex items-center gap-2 text-sm italic"><HardDrive size={18}/> Computador (Hardware)</span>
                  </label>
                  <label className="flex items-center gap-3 p-4 border border-gray-100 bg-gray-50 rounded-2xl cursor-pointer hover:bg-indigo-50 transition-all has-checked:bg-indigo-50 has-checked:border-indigo-200">
                    <input type="radio" name="categoria" value="periferico" className="w-4 h-4 text-indigo-600" />
                    <span className="font-bold text-gray-700 flex items-center gap-2 text-sm italic"><MousePointer2 size={18}/> Periféricos (Mouse/Imp)</span>
                  </label>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-xs font-black text-gray-800 uppercase tracking-tighter">2. Prioridade</label>
                  <select name="urgencia" required className="w-full mt-2 p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-sm">
                    <option value="">Selecione o impacto...</option>
                    <option value="baixa">BAIXA (ROTINA)</option>
                    <option value="media">MÉDIA (ATRAPALHA O FLUXO)</option>
                    <option value="alta">ALTA (SETOR PARADO)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-black text-gray-800 uppercase tracking-tighter">3. Onde está o erro?</label>
                  <input name="local" required className="w-full mt-2 p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-sm" placeholder="Ex: Guichê 03 - Impressora" />
                </div>
              </div>
            </div>

            <div className="mt-8">
              <label className="text-xs font-black text-gray-800 uppercase tracking-tighter">4. Descrição detalhada</label>
              <textarea name="descricao" required rows={4} className="w-full mt-2 p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none font-medium text-sm text-gray-600 shadow-inner" placeholder="Explique o que aconteceu, se aparece algum código de erro ou se o equipamento não liga..."></textarea>
            </div>
          </div>

          <div className="flex justify-end pb-10">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full md:w-auto px-16 py-5 bg-indigo-600 text-white rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95 disabled:opacity-50 tracking-widest text-xs"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
              ABRIR CHAMADO TÉCNICO
            </button>
          </div>
        </form>
      )}
    </div>
  );
}