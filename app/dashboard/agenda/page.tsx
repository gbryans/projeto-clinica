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
  CalendarCheck,
  Trash2,
  List,
  AlertCircle
} from "lucide-react";
import Link from "next/link";

export default function AgendaPage() {
  const [pacientes, setPacientes] = useState<any[]>([]);
  const [medicos, setMedicos] = useState<any[]>([]);
  const [agendamentos, setAgendamentos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  const [agendamento, setAgendamento] = useState({
    paciente_id: "",
    paciente_nome: "",
    data_consulta: "",
    hora_consulta: "",
    medico: "",
    status: "agendado"
  });

  // Carregar dados do banco de dados
  const carregarDados = async () => {
    setLoading(true);
    
    // 1. Busca Pacientes
    const { data: listaPacientes } = await supabase
      .from('pacientes')
      .select('id, nome')
      .order('nome', { ascending: true });
    
    // 2. Busca Funcionários que são MÉDICOS e estão ATIVOS
    const { data: listaMedicos } = await supabase
      .from('perfis')
      .select('nome, especialidade, setor')
      .eq('cargo', 'Médico')
      .eq('status', 'Ativo')
      .order('nome', { ascending: true });

    // 3. Busca Agendamentos ordenados por data e hora
    const { data: listaAgendas } = await supabase
      .from('agendamentos')
      .select('*')
      .order('data_consulta', { ascending: true })
      .order('hora_consulta', { ascending: true });

    setPacientes(listaPacientes || []);
    setMedicos(listaMedicos || []);
    setAgendamentos(listaAgendas || []);
    setLoading(false);
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const handleSalvarAgendamento = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvando(true);

    // Validação de Duplicidade (Mesmo Médico, Data e Hora)
    const { data: existente } = await supabase
      .from('agendamentos')
      .select('id')
      .eq('medico', agendamento.medico)
      .eq('data_consulta', agendamento.data_consulta)
      .eq('hora_consulta', agendamento.hora_consulta)
      .maybeSingle();

    if (existente) {
      alert(`⚠️ Conflito: O ${agendamento.medico} já possui um paciente neste horário.`);
      setSalvando(false);
      return;
    }

    const pacienteSelecionado = pacientes.find(p => p.id === agendamento.paciente_id);
    const dadosFinais = { 
      ...agendamento, 
      paciente_nome: pacienteSelecionado?.nome 
    };

    const { error } = await supabase.from('agendamentos').insert([dadosFinais]);

    if (error) {
      alert("Erro ao agendar: " + error.message);
      setSalvando(false);
    } else {
      setSucesso(true);
      setTimeout(() => {
        setSucesso(false);
        setAgendamento({ 
          paciente_id: "", paciente_nome: "", data_consulta: "", 
          hora_consulta: "", medico: "", status: "agendado" 
        });
        carregarDados();
      }, 1500);
      setSalvando(false);
    }
  };

  const excluirAgendamento = async (id: string) => {
    if (confirm("Deseja realmente cancelar este agendamento?")) {
      const { error } = await supabase.from('agendamentos').delete().eq('id', id);
      if (!error) carregarDados();
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto bg-gray-50 min-h-screen font-sans">
      <header className="mb-8">
        <Link href="/dashboard" className="flex items-center gap-2 text-blue-600 font-bold mb-4">
          <ArrowLeft size={18} /> Painel Principal
        </Link>
        <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3 italic tracking-tighter uppercase">
          <CalendarCheck className="text-blue-600" size={32} /> Central de Agendamentos
        </h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* FORMULÁRIO DE NOVO AGENDAMENTO */}
        <div className="space-y-6">
          <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <CalendarIcon size={16} /> Reservar Horário
          </h2>
          
          <form onSubmit={handleSalvarAgendamento} className="bg-white p-6 rounded-4xl shadow-sm border border-gray-100 space-y-4">
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase">Paciente</label>
              <select 
                required
                className="w-full mt-1 p-3.5 bg-gray-50 border border-gray-200 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500"
                value={agendamento.paciente_id}
                onChange={(e) => setAgendamento({...agendamento, paciente_id: e.target.value})}
              >
                <option value="">Selecione o paciente...</option>
                {pacientes.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase">Data da Consulta</label>
                <input type="date" required className="w-full mt-1 p-3.5 bg-gray-50 border border-gray-200 rounded-xl font-bold text-sm" 
                  value={agendamento.data_consulta} onChange={(e) => setAgendamento({...agendamento, data_consulta: e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase">Horário</label>
                <input type="time" required className="w-full mt-1 p-3.5 bg-gray-50 border border-gray-200 rounded-xl font-bold text-sm" 
                  value={agendamento.hora_consulta} onChange={(e) => setAgendamento({...agendamento, hora_consulta: e.target.value})} />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase">Médico (Corpo Clínico)</label>
              <select 
                required 
                className="w-full mt-1 p-3.5 bg-gray-50 border border-gray-200 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500"
                value={agendamento.medico} 
                onChange={(e) => setAgendamento({...agendamento, medico: e.target.value})}
              >
                <option value="">Selecione um médico disponível...</option>
                {medicos.length > 0 ? (
                  medicos.map((m, idx) => (
                    <option key={idx} value={m.nome}>
                      {m.nome} — {m.especialidade}
                    </option>
                  ))
                ) : (
                  <option disabled>Nenhum médico ativo encontrado</option>
                )}
              </select>
              {medicos.length === 0 && !loading && (
                <p className="text-[10px] text-red-500 font-bold mt-1 flex items-center gap-1 uppercase">
                  <AlertCircle size={10} /> Cadastre um funcionário como 'Médico' primeiro.
                </p>
              )}
            </div>

            <button 
              type="submit" 
              disabled={salvando} 
              className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-sm hover:bg-blue-700 shadow-lg shadow-blue-100 flex justify-center items-center gap-2 transition-all active:scale-95"
            >
              {salvando ? <Loader2 className="animate-spin" /> : "CONFIRMAR AGENDAMENTO"}
            </button>
            {sucesso && <p className="text-center text-green-600 font-bold text-xs animate-bounce italic">✓ Agendamento salvo com sucesso!</p>}
          </form>
        </div>

        {/* LISTA DE AGENDAMENTOS ABAIXO/LADO */}
        <div className="space-y-6">
          <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <List size={16} /> Próximos Horários Marcados
          </h2>

          <div className="bg-white rounded-4xl border border-gray-100 shadow-sm overflow-hidden min-h-[400px]">
            {loading ? (
              <div className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-blue-600" size={32} /></div>
            ) : agendamentos.length === 0 ? (
              <div className="p-20 text-center text-gray-300 font-bold italic text-sm">Nenhum agendamento encontrado.</div>
            ) : (
              <div className="divide-y divide-gray-50">
                {agendamentos.map((item) => (
                  <div key={item.id} className="p-5 flex items-center justify-between hover:bg-gray-50 transition-colors group">
                    <div className="flex gap-4 items-center">
                      <div className="bg-blue-50 p-3 rounded-2xl text-blue-600 flex flex-col items-center justify-center min-w-[70px] border border-blue-100 shadow-sm">
                        <span className="text-xs font-black uppercase">{item.hora_consulta.slice(0,5)}</span>
                        <span className="text-[9px] font-bold opacity-70">
                          {new Date(item.data_consulta).toLocaleDateString('pt-BR', {day:'2-digit', month:'2-digit'})}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-black text-gray-900 text-sm uppercase tracking-tighter">{item.paciente_nome}</h4>
                        <p className="text-[10px] text-gray-500 font-bold flex items-center gap-1 italic uppercase">
                          <Stethoscope size={10} className="text-blue-400" /> {item.medico}
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => excluirAgendamento(item.id)} 
                      className="text-gray-200 hover:text-red-500 transition-all p-2 hover:bg-red-50 rounded-lg"
                      title="Cancelar Agendamento"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}