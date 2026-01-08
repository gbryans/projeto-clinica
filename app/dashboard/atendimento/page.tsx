"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { 
  ClipboardList, 
  Stethoscope, 
  Pill, 
  Save, 
  ArrowLeft,
  Search,
  CheckCircle2,
  Loader2,
  User
} from "lucide-react";
import Link from "next/link";

export default function AtendimentoPage() {
  const [agendamentos, setAgendamentos] = useState<any[]>([]);
  const [selecionado, setSelecionado] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);

  const [prontuario, setProntuario] = useState({
    queixa_principal: "",
    diagnostico: "",
    prescricao: ""
  });

  useEffect(() => {
    buscarAgendamentosDoDia();
  }, []);

  async function buscarAgendamentosDoDia() {
    const hoje = new Date().toISOString().split('T')[0];
    const { data } = await supabase
      .from('agendamentos')
      .select('*')
      .eq('data_consulta', hoje)
      .eq('status', 'agendado');
    
    setAgendamentos(data || []);
    setLoading(false);
  }

  const finalizarAtendimento = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvando(true);

    const dadosAtendimento = {
      agendamento_id: selecionado.id,
      paciente_nome: selecionado.paciente_nome,
      medico_nome: selecionado.medico,
      ...prontuario
    };

    // 1. Salva o prontuário
    const { error: erroProntuario } = await supabase.from('prontuarios').insert([dadosAtendimento]);

    if (!erroProntuario) {
      // 2. Atualiza o status do agendamento para "concluido"
      await supabase.from('agendamentos').update({ status: 'concluido' }).eq('id', selecionado.id);
      
      alert("Atendimento finalizado com sucesso!");
      setSelecionado(null);
      setProntuario({ queixa_principal: "", diagnostico: "", prescricao: "" });
      buscarAgendamentosDoDia();
    }
    setSalvando(false);
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto bg-gray-50 min-h-screen font-sans">
      <header className="mb-8">
        <Link href="/dashboard" className="flex items-center gap-2 text-blue-600 font-bold mb-2">
          <ArrowLeft size={18} /> Painel Principal
        </Link>
        <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3 tracking-tighter uppercase italic">
          <Stethoscope className="text-blue-600" size={32} /> Prontuário Digital
        </h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LISTA DE PACIENTES AGUARDANDO */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <Search size={14} /> Fila de Espera (Hoje)
          </h2>
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-8 text-center"><Loader2 className="animate-spin mx-auto text-blue-600" /></div>
            ) : agendamentos.length === 0 ? (
              <div className="p-8 text-center text-gray-400 font-bold italic text-sm">Nenhum paciente para hoje.</div>
            ) : (
              agendamentos.map(ag => (
                <button 
                  key={ag.id}
                  onClick={() => setSelecionado(ag)}
                  className={`w-full p-4 text-left border-b border-gray-50 last:border-0 transition-all flex items-center justify-between ${selecionado?.id === ag.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : 'hover:bg-gray-50'}`}
                >
                  <div>
                    <p className="font-black text-gray-900 text-sm uppercase">{ag.paciente_nome}</p>
                    <p className="text-[10px] text-gray-500 font-bold italic">{ag.hora_consulta.slice(0,5)} • {ag.medico}</p>
                  </div>
                  <User size={18} className={selecionado?.id === ag.id ? 'text-blue-600' : 'text-gray-300'} />
                </button>
              ))
            )}
          </div>
        </div>

        {/* ÁREA DO PRONTUÁRIO */}
        <div className="lg:col-span-2">
          {selecionado ? (
            <form onSubmit={finalizarAtendimento} className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <div className="bg-white p-8 rounded-4xl shadow-sm border border-gray-100 space-y-6">
                <div className="flex justify-between items-start border-b border-gray-50 pb-6">
                  <div>
                    <span className="text-[10px] font-black bg-blue-100 text-blue-600 px-3 py-1 rounded-full uppercase">Em Atendimento</span>
                    <h2 className="text-2xl font-black text-gray-900 mt-2 uppercase">{selecionado.paciente_nome}</h2>
                  </div>
                  <ClipboardList className="text-gray-200" size={40} />
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-black text-gray-700 uppercase tracking-tighter">Queixa Principal / Motivo</label>
                    <textarea 
                      required
                      className="w-full mt-2 p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-medium text-sm"
                      rows={3}
                      placeholder="Relato do paciente..."
                      value={prontuario.queixa_principal}
                      onChange={e => setProntuario({...prontuario, queixa_principal: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-black text-gray-700 uppercase tracking-tighter">Diagnóstico Médico</label>
                    <textarea 
                      required
                      className="w-full mt-2 p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-medium text-sm"
                      rows={3}
                      placeholder="Avaliação clínica..."
                      value={prontuario.diagnostico}
                      onChange={e => setProntuario({...prontuario, diagnostico: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-black text-gray-700 uppercase tracking-tighter flex items-center gap-2">
                      <Pill size={16} className="text-red-500" /> Prescrição / Medicamentos
                    </label>
                    <textarea 
                      required
                      className="w-full mt-2 p-4 bg-gray-50 border border-red-100 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none font-bold text-sm text-red-600 italic"
                      rows={4}
                      placeholder="Receituário..."
                      value={prontuario.prescricao}
                      onChange={e => setProntuario({...prontuario, prescricao: e.target.value})}
                    />
                  </div>
                </div>

                <button 
                  disabled={salvando}
                  className="w-full py-5 bg-green-600 text-white rounded-2xl font-black shadow-xl hover:bg-green-700 transition-all flex items-center justify-center gap-2"
                >
                  {salvando ? <Loader2 className="animate-spin" /> : <CheckCircle2 size={24} />}
                  FINALIZAR CONSULTA E SALVAR
                </button>
              </div>
            </form>
          ) : (
            <div className="h-full min-h-[400px] bg-white rounded-4xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center text-gray-400 p-10 text-center">
              <User size={48} className="mb-4 opacity-20" />
              <p className="font-bold text-lg">Selecione um paciente na fila ao lado</p>
              <p className="text-sm font-medium">Os dados do prontuário aparecerão aqui para edição.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}