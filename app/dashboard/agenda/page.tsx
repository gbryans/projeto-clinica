"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Stethoscope, 
  CheckCircle, 
  ArrowLeft,
  Loader2,
  CalendarCheck
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AgendaPage() {
  const router = useRouter();
  const [pacientes, setPacientes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  // Estado do formulário de agendamento
  const [agendamento, setAgendamento] = useState({
    paciente_id: "",
    paciente_nome: "",
    data_consulta: "",
    hora_consulta: "",
    medico: ""
  });

  // Carregar pacientes ao abrir a página
  useEffect(() => {
    const fetchPacientes = async () => {
      const { data, error } = await supabase
        .from('pacientes')
        .select('id, nome')
        .order('nome', { ascending: true });

      if (error) console.error(error);
      else setPacientes(data || []);
      setLoading(false);
    };
    fetchPacientes();
  }, []);

  const handleSalvarAgendamento = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvando(true);

    // Encontrar o nome do paciente selecionado para salvar junto (facilita a listagem)
    const pacienteSelecionado = pacientes.find(p => p.id === agendamento.paciente_id);
    const dadosFinais = { 
      ...agendamento, 
      paciente_nome: pacienteSelecionado?.nome 
    };

    const { error } = await supabase
      .from('agendamentos')
      .insert([dadosFinais]);

    if (error) {
      alert("Erro ao agendar: " + error.message);
      setSalvando(false);
    } else {
      setSucesso(true);
      setTimeout(() => router.push("/dashboard"), 2000);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto bg-gray-50 min-h-screen">
      <header className="mb-8">
        <Link href="/dashboard" className="flex items-center gap-2 text-blue-600 font-bold mb-4">
          <ArrowLeft size={18} /> Voltar
        </Link>
        <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3 italic tracking-tighter">
          <CalendarCheck className="text-blue-600" size={32} /> AGENDAR CONSULTA
        </h1>
      </header>

      {sucesso ? (
        <div className="bg-white p-12 rounded-4xl text-center shadow-xl border border-green-100">
          <CheckCircle className="text-green-500 mx-auto mb-4" size={64} />
          <h2 className="text-2xl font-bold">Agendamento Realizado!</h2>
          <p className="text-gray-500 mt-2 font-medium">A consulta foi salva no sistema.</p>
        </div>
      ) : (
        <form onSubmit={handleSalvarAgendamento} className="space-y-6">
          
          <div className="bg-white p-8 rounded-4xl shadow-sm border border-gray-100 space-y-6">
            
            {/* Seleção de Paciente */}
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-2">
                <User size={14} /> Paciente Cadastrado
              </label>
              <select 
                required
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500"
                value={agendamento.paciente_id}
                onChange={(e) => setAgendamento({...agendamento, paciente_id: e.target.value})}
              >
                <option value="">Selecione o paciente...</option>
                {pacientes.map(p => (
                  <option key={p.id} value={p.id}>{p.nome}</option>
                ))}
              </select>
              {pacientes.length === 0 && !loading && (
                <p className="text-red-500 text-[10px] font-bold mt-2 italic">Nenhum paciente encontrado. Cadastre-o primeiro!</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Data */}
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-2">
                  <CalendarIcon size={14} /> Data da Consulta
                </label>
                <input 
                  type="date" 
                  required
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => setAgendamento({...agendamento, data_consulta: e.target.value})}
                />
              </div>

              {/* Hora */}
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-2">
                  <Clock size={14} /> Horário
                </label>
                <input 
                  type="time" 
                  required
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => setAgendamento({...agendamento, hora_consulta: e.target.value})}
                />
              </div>
            </div>

            {/* Médico */}
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-2">
                <Stethoscope size={14} /> Médico Responsável
              </label>
              <select 
                required
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setAgendamento({...agendamento, medico: e.target.value})}
              >
                <option value="">Selecione o médico...</option>
                <option value="Dr. Augusto (Clínico Geral)">Dr. Augusto (Clínico Geral)</option>
                <option value="Dra. Ana (Pediatria)">Dra. Ana (Pediatria)</option>
                <option value="Dr. Ricardo (Ortopedia)">Dr. Ricardo (Ortopedia)</option>
              </select>
            </div>

          </div>

          <button 
            type="submit" 
            disabled={salvando || pacientes.length === 0}
            className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black shadow-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {salvando ? <Loader2 className="animate-spin" /> : "CONFIRMAR AGENDAMENTO"}
          </button>

        </form>
      )}
    </div>
  );
}