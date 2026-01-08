"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { 
  Ticket, Search, Filter, Clock, CheckCircle2, 
  AlertTriangle, ArrowLeft, MoreVertical, 
  Monitor, HardDrive, MousePointer2, RefreshCw
} from "lucide-react";
import Link from "next/link";

export default function GestaoSuportePage() {
  const [chamados, setChamados] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Função para buscar chamados do Supabase
  const buscarChamados = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('chamados')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Erro ao buscar chamados:", error.message);
    } else {
      setChamados(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    buscarChamados();
  }, []);

  // Função para atualizar status do chamado
  const atualizarStatus = async (id: string, novoStatus: string) => {
    const { error } = await supabase
      .from('chamados')
      .update({ status: novoStatus })
      .eq('id', id);

    if (error) {
      alert("Erro ao atualizar status");
    } else {
      buscarChamados(); // Recarrega a lista
    }
  };

  const getUrgencyStyle = (urgencia: string) => {
    switch(urgencia) {
      case 'alta': return 'text-red-600 bg-red-50 border-red-100';
      case 'media': return 'text-orange-600 bg-orange-50 border-orange-100';
      default: return 'text-blue-600 bg-blue-50 border-blue-100';
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen font-sans">
      
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link href="/dashboard" className="flex items-center gap-2 text-indigo-600 font-semibold mb-2 hover:underline">
            <ArrowLeft size={18} /> Voltar ao Painel
          </Link>
          <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3 tracking-tighter">
            <Ticket className="text-indigo-600" size={32} /> Painel T.I.
          </h1>
          <p className="text-gray-500 font-medium">Gerencie os tickets de suporte em tempo real.</p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={buscarChamados}
            className="p-3 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-all"
            title="Atualizar lista"
          >
            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
          </button>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="Filtrar chamados..." className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 w-64" />
          </div>
        </div>
      </header>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
          <RefreshCw size={40} className="animate-spin mb-4" />
          <p className="font-bold">Carregando chamados do banco de dados...</p>
        </div>
      ) : (
        <div className="bg-white rounded-4xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Solicitante</th>
                <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Problema / Categoria</th>
                <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Urgência</th>
                <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Status Atual</th>
                <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {chamados.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-gray-50/30 transition-all group">
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-sm">
                        {ticket.solicitante.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-800">{ticket.solicitante}</p>
                        <p className="text-[11px] text-gray-400 font-bold uppercase">{ticket.setor}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-2 mb-1">
                      {ticket.categoria === 'software' && <Monitor size={14} className="text-indigo-500" />}
                      {ticket.categoria === 'hardware' && <HardDrive size={14} className="text-indigo-500" />}
                      {ticket.categoria === 'periferico' && <MousePointer2 size={14} className="text-indigo-500" />}
                      <span className="text-[10px] font-black text-indigo-500 uppercase tracking-tighter">{ticket.categoria}</span>
                    </div>
                    <p className="text-sm text-gray-600 font-medium line-clamp-1 italic">"{ticket.descricao}"</p>
                  </td>
                  <td className="p-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${getUrgencyStyle(ticket.urgencia)}`}>
                      {ticket.urgencia}
                    </span>
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-2">
                      {ticket.status === 'concluido' ? (
                        <span className="flex items-center gap-1.5 text-xs font-bold text-green-600">
                          <CheckCircle2 size={16} /> Resolvido
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-xs font-bold text-orange-500">
                          <Clock size={16} className="animate-pulse" /> {ticket.status.replace('_', ' ')}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-5 text-right">
                    <select 
                      onChange={(e) => atualizarStatus(ticket.id, e.target.value)}
                      value={ticket.status}
                      className="text-xs font-bold bg-gray-100 border-none rounded-lg p-2 outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                    >
                      <option value="pendente">Pendente</option>
                      <option value="em_andamento">Em Andamento</option>
                      <option value="concluido">Concluído</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {chamados.length === 0 && (
            <div className="p-20 text-center text-gray-400 font-medium">
              Nenhum chamado aberto no momento.
            </div>
          )}
        </div>
      )}
    </div>
  );
}