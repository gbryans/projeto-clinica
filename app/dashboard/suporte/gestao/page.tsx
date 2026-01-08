"use client";

import { useState, useEffect } from "react";
import { 
  Ticket, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowLeft,
  MoreVertical,
  User,
  Monitor,
  HardDrive,
  MousePointer2
} from "lucide-react";
import Link from "next/link";

export default function GestaoSuportePage() {
  // Simulação de chamados vindos dos funcionários
  const [chamados, setChamados] = useState([
    { 
      id: "#8821", 
      funcionario: "Ana Silva", 
      setor: "Recepção", 
      categoria: "software", 
      problema: "Erro ao salvar prontuário", 
      urgencia: "alta", 
      status: "pendente",
      data: "08/01/2026 10:15"
    },
    { 
      id: "#8819", 
      funcionario: "Carlos Eduardo", 
      setor: "Triagem", 
      categoria: "periferico", 
      problema: "Impressora não imprime etiquetas", 
      urgencia: "media", 
      status: "em_andamento",
      data: "08/01/2026 09:30"
    },
    { 
      id: "#8815", 
      funcionario: "Mariana Costa", 
      setor: "Financeiro", 
      categoria: "hardware", 
      problema: "Monitor pisca constantemente", 
      urgencia: "baixa", 
      status: "concluido",
      data: "07/01/2026 16:45"
    }
  ]);

  const getUrgencyColor = (urgencia: string) => {
    switch(urgencia) {
      case 'alta': return 'text-red-600 bg-red-50 border-red-100';
      case 'media': return 'text-orange-600 bg-orange-50 border-orange-100';
      default: return 'text-blue-600 bg-blue-50 border-blue-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'concluido': return <CheckCircle2 size={16} className="text-green-500" />;
      case 'em_andamento': return <Clock size={16} className="text-blue-500 animate-pulse" />;
      default: return <AlertTriangle size={16} className="text-orange-500" />;
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen font-sans">
      
      {/* Cabeçalho */}
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link href="/dashboard" className="flex items-center gap-2 text-indigo-600 font-semibold mb-2 hover:underline">
            <ArrowLeft size={18} /> Voltar ao Painel
          </Link>
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
            <Ticket className="text-indigo-600" size={32} /> Gestão de Chamados T.I.
          </h1>
          <p className="text-gray-500">Monitorize e resolva os problemas técnicos da clínica.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="Procurar chamado..." className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <button className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50">
            <Filter size={20} />
          </button>
        </div>
      </header>

      {/* Tabela de Chamados */}
      <div className="bg-white rounded-4xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-widest">ID / Data</th>
              <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Solicitante</th>
              <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Problema</th>
              <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Urgência</th>
              <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {chamados.map((ticket) => (
              <tr key={ticket.id} className="hover:bg-gray-50/50 transition-all group">
                <td className="p-4">
                  <span className="font-bold text-gray-800 block">{ticket.id}</span>
                  <span className="text-[10px] text-gray-400 font-medium">{ticket.data}</span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-xs">
                      {ticket.funcionario.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">{ticket.funcionario}</p>
                      <p className="text-[11px] text-gray-500">{ticket.setor}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    {ticket.categoria === 'software' && <Monitor size={14} className="text-indigo-400" />}
                    {ticket.categoria === 'hardware' && <HardDrive size={14} className="text-indigo-400" />}
                    {ticket.categoria === 'periferico' && <MousePointer2 size={14} className="text-indigo-400" />}
                    <span className="text-[10px] font-bold text-indigo-400 uppercase">{ticket.categoria}</span>
                  </div>
                  <p className="text-sm text-gray-700 font-medium leading-tight">{ticket.problema}</p>
                </td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${getUrgencyColor(ticket.urgencia)}`}>
                    {ticket.urgencia}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-gray-600">
                    {getStatusIcon(ticket.status)}
                    <span className="capitalize">{ticket.status.replace('_', ' ')}</span>
                  </div>
                </td>
                <td className="p-4 text-right">
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all">
                    <MoreVertical size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer com contador */}
      <div className="mt-6 flex justify-between items-center text-sm text-gray-500 font-medium">
        <p>A mostrar {chamados.length} chamados ativos</p>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50">Anterior</button>
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50">Próximo</button>
        </div>
      </div>
    </div>
  );
}