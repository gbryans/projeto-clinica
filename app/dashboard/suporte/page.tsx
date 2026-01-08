"use client";

import { useState, useEffect } from "react";
import { 
  LifeBuoy, 
  Send, 
  ArrowLeft, 
  User, 
  Monitor, 
  AlertCircle, 
  Clock, 
  CheckCircle2,
  HardDrive,
  MousePointer2
} from "lucide-react";
import Link from "next/link";

export default function SuporteTIPage() {
  const [usuario, setUsuario] = useState({ nome: "", setor: "", unidade: "", cargo: "" });
  const [enviado, setEnviado] = useState(false);

  // Simula o carregamento dos dados do funcionário logado
  useEffect(() => {
    // No seu sistema, esses dados seriam salvos no login
    const nomeSalvo = localStorage.getItem("userName") || "Funcionário Padrão";
    const setorSalvo = localStorage.getItem("userSetor") || "Recepção Central";
    const unidadeSalva = localStorage.getItem("userUnidade") || "Unidade Matriz";
    
    setUsuario({ nome: nomeSalvo, setor: setorSalvo, unidade: unidadeSalva, cargo: "Colaborador" });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEnviado(true);
    // Aqui enviaria para o banco de dados/E-mail da T.I.
    setTimeout(() => setEnviado(false), 5000);
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto bg-gray-50 min-h-screen font-sans">
      
      <header className="mb-8">
        <Link href="/dashboard" className="flex items-center gap-2 text-blue-600 font-semibold mb-4 hover:underline">
          <ArrowLeft size={18} /> Voltar ao Painel
        </Link>
        <div className="flex items-center gap-4">
          <div className="bg-indigo-600 p-3 rounded-2xl text-white shadow-lg">
            <LifeBuoy size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Suporte T.I.</h1>
            <p className="text-gray-500">Relate problemas técnicos para nossa equipe de tecnologia.</p>
          </div>
        </div>
      </header>

      {enviado ? (
        <div className="bg-green-100 border border-green-200 p-8 rounded-4xl text-center animate-in fade-in zoom-in">
          <CheckCircle2 className="text-green-600 mx-auto mb-4" size={48} />
          <h2 className="text-2xl font-bold text-green-800">Chamado Aberto!</h2>
          <p className="text-green-700">Obrigado. A equipe de T.I. recebeu seu relatório e entrará em contato em breve.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* BLOCO 1: Seus Dados (Auto-preenchidos e bloqueados) */}
          <div className="bg-white p-6 md:p-8 rounded-4xl shadow-sm border border-gray-100 opacity-80">
            <h2 className="text-sm font-bold mb-6 flex items-center gap-2 text-gray-500 uppercase tracking-widest">
              <User size={16}/> Informações do Solicitante (Automático)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="text-xs font-bold text-gray-400">Nome</label>
                <input disabled value={usuario.nome} className="w-full mt-1 p-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400">Setor</label>
                <input disabled value={usuario.setor} className="w-full mt-1 p-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400">Unidade</label>
                <input disabled value={usuario.unidade} className="w-full mt-1 p-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed" />
              </div>
            </div>
          </div>

          {/* BLOCO 2: Detalhes do Erro */}
          <div className="bg-white p-6 md:p-8 rounded-4xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-indigo-600 border-b pb-2">
              <AlertCircle size={20}/> Detalhes da Ocorrência
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Categoria do Erro */}
              <div>
                <label className="text-sm font-bold text-gray-700">Categoria do Problema</label>
                <div className="grid grid-cols-1 gap-2 mt-2">
                  <label className="flex items-center gap-3 p-3 border border-gray-100 bg-gray-50 rounded-xl cursor-pointer hover:bg-indigo-50 transition-all">
                    <input type="radio" name="categoria" value="software" className="w-4 h-4 text-indigo-600" required />
                    <div className="flex items-center gap-2 text-gray-700 font-medium">
                      <Monitor size={18} className="text-indigo-500"/> Software (Sistemas, Login)
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-3 border border-gray-100 bg-gray-50 rounded-xl cursor-pointer hover:bg-indigo-50 transition-all">
                    <input type="radio" name="categoria" value="hardware" className="w-4 h-4 text-indigo-600" />
                    <div className="flex items-center gap-2 text-gray-700 font-medium">
                      <HardDrive size={18} className="text-indigo-500"/> Hardware (PC, Monitor)
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-3 border border-gray-100 bg-gray-50 rounded-xl cursor-pointer hover:bg-indigo-50 transition-all">
                    <input type="radio" name="categoria" value="periferico" className="w-4 h-4 text-indigo-600" />
                    <div className="flex items-center gap-2 text-gray-700 font-medium">
                      <MousePointer2 size={18} className="text-indigo-500"/> Periféricos (Mouse, Impressora)
                    </div>
                  </label>
                </div>
              </div>

              {/* Urgência e Local */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-bold text-gray-700">Nível de Urgência</label>
                  <select required className="w-full mt-2 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none">
                    <option value="">Selecione...</option>
                    <option value="baixa">Baixa (Não impede o trabalho)</option>
                    <option value="media">Média (Atrapalha tarefas)</option>
                    <option value="alta">Alta (Setor parado / Urgente)</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-700">Onde o erro ocorre?</label>
                  <input required name="local" className="w-full mt-2 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Ex: Tela de login, Impressora da sala 02" />
                </div>
              </div>
            </div>

            <div className="mt-6">
              <label className="text-sm font-bold text-gray-700">Explicação sobre o problema</label>
              <textarea 
                required
                rows={4} 
                className="w-full mt-2 p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none" 
                placeholder="Descreva detalhadamente o que aconteceu..."
              ></textarea>
            </div>
          </div>

          <div className="flex justify-end gap-4 pb-12">
            <button type="submit" className="w-full md:w-auto px-12 py-4 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95">
              <Send size={20}/> Abrir Chamado Técnico
            </button>
          </div>
        </form>
      )}
    </div>
  );
}