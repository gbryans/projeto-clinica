"use client";

import { useState } from "react";
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  User, 
  CheckCircle2, 
  CircleDashed,
  Plus,
  ArrowLeft,
  X,
  Stethoscope
} from "lucide-react";
import Link from "next/link";

export default function AgendaPage() {
  // Estado para controlar a abertura do Modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Simulação de dados da agenda (Poderia vir de uma API no futuro)
  const [agendamentos, setAgendamentos] = useState([
    { id: 1, hora: "08:30", paciente: "Ana Beatriz", tipo: "Consulta Geral", status: "finalizado" },
    { id: 2, hora: "09:15", paciente: "Carlos Eduardo", tipo: "Retorno", status: "confirmado" },
    { id: 3, hora: "10:00", paciente: "Mariana Costa", tipo: "Exame de Sangue", status: "confirmado" },
    { id: 4, hora: "11:30", paciente: "Roberto Alencar", tipo: "Avaliação", status: "pendente" },
  ]);

  // Estado para o novo agendamento no formulário do modal
  const [novoAgendamento, setNovoAgendamento] = useState({
    paciente: "",
    hora: "",
    tipo: "Consulta Geral"
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const agendamentoFinal = {
      id: Date.now(),
      ...novoAgendamento,
      status: "confirmado"
    };
    setAgendamentos([...agendamentos, agendamentoFinal].sort((a, b) => a.hora.localeCompare(b.hora)));
    setIsModalOpen(false); // Fecha o modal
    setNovoAgendamento({ paciente: "", hora: "", tipo: "Consulta Geral" }); // Limpa o form
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto bg-gray-50 min-h-screen font-sans relative">
      
      {/* Cabeçalho */}
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link href="/dashboard" className="flex items-center gap-2 text-blue-600 font-semibold mb-2 hover:underline">
            <ArrowLeft size={18} /> Voltar ao Painel
          </Link>
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
            <CalendarIcon className="text-blue-600" size={32} /> Agenda do Dia
          </h1>
        </div>

        <div className="flex items-center gap-2 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
          <button className="p-2 hover:bg-gray-100 rounded-xl transition-all"><ChevronLeft size={20}/></button>
          <span className="px-4 font-bold text-gray-700">08 de Janeiro, 2026</span>
          <button className="p-2 hover:bg-gray-100 rounded-xl transition-all"><ChevronRight size={20}/></button>
        </div>
      </header>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Total Hoje</p>
          <p className="text-3xl font-black text-gray-800">{agendamentos.length}</p>
        </div>
        <div className="bg-green-50 p-6 rounded-3xl border border-green-100">
          <p className="text-green-600 text-xs font-bold uppercase tracking-widest">Confirmados</p>
          <p className="text-3xl font-black text-green-700">
            {agendamentos.filter(a => a.status === "confirmado").length}
          </p>
        </div>
        <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100">
          <p className="text-blue-600 text-xs font-bold uppercase tracking-widest">Aguardando</p>
          <p className="text-3xl font-black text-blue-700">
            {agendamentos.filter(a => a.status === "pendente").length}
          </p>
        </div>
      </div>

      {/* Tabela de Horários */}
      <div className="bg-white rounded-4xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
          <h2 className="font-bold text-gray-800 text-lg">Cronograma</h2>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95"
          >
            <Plus size={18} /> Novo Agendamento
          </button>
        </div>

        <div className="divide-y divide-gray-50">
          {agendamentos.map((item) => (
            <div key={item.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-all group">
              <div className="flex items-center gap-6">
                <div className="flex flex-col items-center">
                  <span className="text-lg font-black text-gray-800">{item.hora}</span>
                  <Clock size={16} className="text-gray-300" />
                </div>
                <div className="h-10 w-px bg-gray-100 hidden md:block"></div>
                <div>
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-blue-500" />
                    <span className="font-bold text-gray-800">{item.paciente}</span>
                  </div>
                  <p className="text-sm text-gray-500">{item.tipo}</p>
                </div>
              </div>
              <div>
                <span className={`flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full uppercase ${
                  item.status === 'confirmado' ? 'text-green-600 bg-green-100' : 
                  item.status === 'pendente' ? 'text-orange-600 bg-orange-100' : 'text-gray-400 bg-gray-100'
                }`}>
                  {item.status === 'pendente' && <CircleDashed size={14} className="animate-spin" />}
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- MODAL DE NOVO AGENDAMENTO --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Background Overlay */}
          <div 
            className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsModalOpen(false)}
          ></div>

          {/* Modal Content */}
          <div className="relative bg-white w-full max-w-md rounded-4xl shadow-2xl p-8 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-gray-800 flex items-center gap-2">
                <Stethoscope className="text-blue-600" /> Agendar
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              <div>
                <label className="text-sm font-bold text-gray-700 ml-1">Paciente</label>
                <input 
                  required
                  type="text"
                  placeholder="Nome do paciente"
                  className="w-full mt-1.5 p-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={novoAgendamento.paciente}
                  onChange={(e) => setNovoAgendamento({...novoAgendamento, paciente: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-bold text-gray-700 ml-1">Horário</label>
                  <input 
                    required
                    type="time"
                    className="w-full mt-1.5 p-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    value={novoAgendamento.hora}
                    onChange={(e) => setNovoAgendamento({...novoAgendamento, hora: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-700 ml-1">Tipo</label>
                  <select 
                    className="w-full mt-1.5 p-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    value={novoAgendamento.tipo}
                    onChange={(e) => setNovoAgendamento({...novoAgendamento, tipo: e.target.value})}
                  >
                    <option>Consulta Geral</option>
                    <option>Retorno</option>
                    <option>Exame</option>
                    <option>Urgência</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 text-gray-500 font-bold hover:bg-gray-100 rounded-2xl transition-all"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95"
                >
                  Confirmar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}