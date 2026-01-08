"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  LifeBuoy, Send, ArrowLeft, User, Monitor, 
  AlertCircle, CheckCircle2, HardDrive, MousePointer2 
} from "lucide-react";
import Link from "next/link";

export default function SuporteTIPage() {
  const router = useRouter();
  const [usuario, setUsuario] = useState({ nome: "", setor: "", unidade: "" });
  const [enviado, setEnviado] = useState(false);

  useEffect(() => {
    // Busca dados salvos no localStorage no momento do login
    setUsuario({
      nome: localStorage.getItem("userName") || "Não Identificado",
      setor: localStorage.getItem("userSetor") || "Geral",
      unidade: localStorage.getItem("userUnidade") || "Geral",
    });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEnviado(true);
    setTimeout(() => router.push("/dashboard"), 3000);
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto bg-gray-50 min-h-screen font-sans">
      <header className="mb-8">
        <Link href="/dashboard" className="flex items-center gap-2 text-indigo-600 font-semibold mb-4 hover:underline">
          <ArrowLeft size={18} /> Voltar ao Painel
        </Link>
        <div className="flex items-center gap-4">
          <div className="bg-indigo-600 p-3 rounded-2xl text-white shadow-lg">
            <LifeBuoy size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Suporte T.I.</h1>
            <p className="text-gray-500 font-medium">Relate erros de hardware, software ou periféricos.</p>
          </div>
        </div>
      </header>

      {enviado ? (
        <div className="bg-white p-12 rounded-4xl text-center shadow-xl border border-green-100 animate-in fade-in zoom-in">
          <CheckCircle2 className="text-green-500 mx-auto mb-4" size={64} />
          <h2 className="text-2xl font-bold text-gray-800">Chamado Enviado!</h2>
          <p className="text-gray-500 mt-2">A equipe técnica foi notificada. Redirecionando...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dados Automáticos */}
          <div className="bg-white p-6 rounded-4xl shadow-sm border border-gray-100">
            <h2 className="text-xs font-bold mb-6 text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <User size={14}/> Identificação do Solicitante
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-500">Nome do Funcionário</label>
                <input disabled value={usuario.nome} className="w-full mt-1 p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-400 font-medium cursor-not-allowed" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500">Setor Atual</label>
                <input disabled value={usuario.setor} className="w-full mt-1 p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-400 font-medium cursor-not-allowed" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500">Unidade</label>
                <input disabled value={usuario.unidade} className="w-full mt-1 p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-400 font-medium cursor-not-allowed" />
              </div>
            </div>
          </div>

          {/* Formulário de Erro */}
          <div className="bg-white p-8 rounded-4xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold mb-6 text-indigo-600 flex items-center gap-2 border-b pb-4">
              <AlertCircle size={20}/> Relatório da Ocorrência
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="text-sm font-bold text-gray-700">O que está com problema?</label>
                <div className="space-y-2">
                  {['software', 'hardware', 'periferico'].map((cat) => (
                    <label key={cat} className="flex items-center gap-3 p-4 border border-gray-100 bg-gray-50 rounded-2xl cursor-pointer hover:bg-indigo-50 transition-all">
                      <input type="radio" name="categoria" value={cat} required className="w-4 h-4 text-indigo-600" />
                      <span className="capitalize font-semibold text-gray-700 flex items-center gap-2">
                        {cat === 'software' && <Monitor size={18}/>}
                        {cat === 'hardware' && <HardDrive size={18}/>}
                        {cat === 'periferico' && <MousePointer2 size={18}/>}
                        {cat}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-sm font-bold text-gray-700">Nível de Urgência</label>
                  <select required className="w-full mt-2 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none">
                    <option value="">Selecione...</option>
                    <option value="baixa">Baixa (Rotina)</option>
                    <option value="media">Média (Atrapalha fluxo)</option>
                    <option value="alta">Alta (Setor Parado)</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-700">Onde o erro ocorre?</label>
                  <input required className="w-full mt-2 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Ex: Impressora sala 3" />
                </div>
              </div>
            </div>

            <div className="mt-8">
              <label className="text-sm font-bold text-gray-700">Descrição do Problema</label>
              <textarea required rows={4} className="w-full mt-2 p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none" placeholder="Explique o que aconteceu..."></textarea>
            </div>
          </div>

          <div className="flex justify-end pb-10">
            <button type="submit" className="w-full md:w-auto px-16 py-4 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95">
              <Send size={20}/> Abrir Chamado Técnico
            </button>
          </div>
        </form>
      )}
    </div>
  );
}