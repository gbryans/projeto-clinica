"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { 
  Search, History, ArrowLeft, Calendar, User, Stethoscope, 
  Pill, Loader2, ChevronRight, Edit3, Check, X, Save, AlertCircle 
} from "lucide-react";
import Link from "next/link";

export default function HistoricoClinicoPage() {
  const [busca, setBusca] = useState("");
  const [pacientesEncontrados, setPacientesEncontrados] = useState<any[]>([]);
  const [historico, setHistorico] = useState<any[]>([]);
  const [pacienteSelecionado, setPacienteSelecionado] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [buscandoHistorico, setBuscandoHistorico] = useState(false);

  const [idSendoEditado, setIdSendoEditado] = useState<string | null>(null);
  const [tempDados, setTempDados] = useState<any>(null);
  const [salvandoEdicao, setSalvandoEdicao] = useState(false);

  const pesquisarPaciente = async () => {
    if (!busca) return;
    setLoading(true);
    setPacienteSelecionado(null);
    setHistorico([]);

    const { data, error } = await supabase
      .from('pacientes')
      .select('*')
      .ilike('nome', `%${busca}%`);

    if (!error) setPacientesEncontrados(data || []);
    setLoading(false);
  };

  const carregarHistorico = async (paciente: any) => {
    setPacienteSelecionado(paciente);
    setBuscandoHistorico(true);
    setPacientesEncontrados([]);

    // BUSCA PELO NOME (Certifique-se que na tabela 'prontuarios' o nome está igual)
    const { data, error } = await supabase
      .from('prontuarios')
      .select('*')
      .eq('paciente_nome', paciente.nome)
      .order('data_atendimento', { ascending: false });

    if (error) console.error("Erro ao carregar:", error);
    setHistorico(data || []);
    setBuscandoHistorico(false);
  };

  const salvarAlteracoes = async (id: string) => {
    if (!id) return;
    setSalvandoEdicao(true);
    const { error } = await supabase
      .from('prontuarios')
      .update({
        queixa_principal: tempDados.queixa_principal,
        diagnostico: tempDados.diagnostico,
        prescricao: tempDados.prescricao
      })
      .eq('id', id);

    if (!error) {
      setIdSendoEditado(null);
      carregarHistorico(pacienteSelecionado);
    } else {
      alert("Erro: " + error.message);
    }
    setSalvandoEdicao(false);
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto bg-gray-50 min-h-screen font-sans">
      
      <header className="mb-8">
        <Link href="/dashboard" className="flex items-center gap-2 text-blue-600 font-bold mb-4">
          <ArrowLeft size={18} /> Painel
        </Link>
        <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3 uppercase italic tracking-tighter">
          <History className="text-blue-600" size={32} /> Histórico Clínico
        </h1>
      </header>

      {/* BARRA DE PESQUISA */}
      <div className="mb-8 flex gap-2">
        <input 
          type="text" 
          placeholder="Digite o nome do paciente..."
          className="flex-1 p-4 bg-white border-2 border-blue-100 rounded-2xl shadow-sm outline-none focus:border-blue-500 font-bold text-lg"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
        <button onClick={pesquisarPaciente} className="bg-blue-600 text-white px-8 rounded-2xl font-black hover:bg-blue-700 shadow-lg shadow-blue-200">
          {loading ? <Loader2 className="animate-spin" /> : "PESQUISAR"}
        </button>
      </div>

      {/* LISTA DE PACIENTES */}
      {pacientesEncontrados.length > 0 && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden mb-8 animate-in slide-in-from-top-2">
          {pacientesEncontrados.map(p => (
            <button key={p.id} onClick={() => carregarHistorico(p)} className="w-full p-5 text-left flex items-center justify-between hover:bg-blue-50 border-b last:border-0 group">
              <div>
                <span className="font-black uppercase text-gray-900 group-hover:text-blue-600 transition-colors">{p.nome}</span>
                <p className="text-[10px] text-gray-400 font-bold uppercase">CPF: {p.cpf}</p>
              </div>
              <ChevronRight className="text-gray-300" />
            </button>
          ))}
        </div>
      )}

      {/* CONTEÚDO DO HISTÓRICO */}
      {pacienteSelecionado && (
        <div className="space-y-6">
          <div className="bg-blue-600 p-8 rounded-[40px] text-white shadow-2xl flex justify-between items-center relative overflow-hidden">
             <div className="relative z-10">
                <p className="text-[10px] font-black uppercase opacity-60 tracking-widest">Prontuário Ativo</p>
                <h2 className="text-3xl font-black uppercase tracking-tighter">{pacienteSelecionado.nome}</h2>
             </div>
             <User size={80} className="absolute -right-4 -bottom-4 opacity-10" />
          </div>

          {buscandoHistorico ? (
            <div className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-blue-600" size={40} /></div>
          ) : historico.length === 0 ? (
            <div className="bg-white p-20 rounded-[40px] border-2 border-dashed border-gray-200 text-center">
              <AlertCircle className="mx-auto mb-4 text-gray-300" size={48} />
              <p className="font-black text-gray-400 uppercase italic">Nenhum registro encontrado para este paciente.</p>
            </div>
          ) : (
            <div className="space-y-10 mt-10">
              {historico.map((atendimento) => (
                <div key={atendimento.id} className="relative pl-10 border-l-4 border-blue-100 ml-4 pb-4">
                  <div className="absolute -left-[14px] top-0 w-6 h-6 bg-white border-4 border-blue-600 rounded-full shadow-md"></div>
                  
                  <div className="bg-white p-8 rounded-[35px] border border-gray-100 shadow-xl hover:shadow-2xl transition-all">
                    
                    {/* CABEÇALHO DO ATENDIMENTO */}
                    <div className="flex justify-between items-center mb-8 border-b border-gray-50 pb-6">
                      <div className="bg-blue-50 px-4 py-2 rounded-2xl flex items-center gap-2 text-blue-700 font-black text-xs uppercase">
                        <Calendar size={16} /> {new Date(atendimento.data_atendimento).toLocaleDateString('pt-BR')}
                      </div>

                      {/* O BOTÃO DE EDITAR AGORA ESTÁ EM DESTAQUE */}
                      {idSendoEditado === atendimento.id ? (
                        <div className="flex gap-2">
                          <button onClick={() => salvarAlteracoes(atendimento.id)} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-2xl text-[11px] font-black flex items-center gap-2 shadow-lg shadow-green-100">
                            {salvandoEdicao ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} SALVAR ALTERAÇÕES
                          </button>
                          <button onClick={() => setIdSendoEditado(null)} className="bg-gray-100 text-gray-500 px-6 py-2.5 rounded-2xl text-[11px] font-black hover:bg-gray-200">
                            DESCARTAR
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => { setIdSendoEditado(atendimento.id); setTempDados({...atendimento}); }} 
                          className="bg-gray-900 hover:bg-blue-600 text-white px-6 py-2.5 rounded-2xl text-[11px] font-black flex items-center gap-2 transition-all shadow-lg"
                        >
                          <Edit3 size={14} /> EDITAR ESTE REGISTRO
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      {/* LADO ESQUERDO: AVALIAÇÃO */}
                      <div className="space-y-6">
                        <h4 className="text-[11px] font-black text-blue-600 uppercase tracking-[3px] flex items-center gap-2">
                           <Stethoscope size={16} /> Avaliação Médica
                        </h4>
                        
                        {idSendoEditado === atendimento.id ? (
                          <div className="space-y-4">
                            <div>
                              <label className="text-[9px] font-black text-gray-400 uppercase mb-1 block">Queixa Principal:</label>
                              <textarea className="w-full p-4 bg-gray-50 border-2 border-blue-50 rounded-2xl text-sm font-medium focus:border-blue-500 outline-none" rows={3} value={tempDados.queixa_principal} onChange={e => setTempDados({...tempDados, queixa_principal: e.target.value})} />
                            </div>
                            <div>
                              <label className="text-[9px] font-black text-gray-400 uppercase mb-1 block">Diagnóstico:</label>
                              <textarea className="w-full p-4 bg-gray-50 border-2 border-blue-50 rounded-2xl text-sm font-bold italic focus:border-blue-500 outline-none" rows={3} value={tempDados.diagnostico} onChange={e => setTempDados({...tempDados, diagnostico: e.target.value})} />
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div className="bg-gray-50 p-5 rounded-3xl">
                               <p className="text-[10px] font-black text-gray-400 uppercase mb-2">Relato do Paciente:</p>
                               <p className="text-sm text-gray-700 font-medium leading-relaxed">{atendimento.queixa_principal}</p>
                            </div>
                            <div className="bg-blue-50/50 p-5 rounded-3xl border-l-8 border-blue-600">
                               <p className="text-[10px] font-black text-blue-400 uppercase mb-2">Conclusão Diagnóstica:</p>
                               <p className="text-sm text-gray-900 font-black italic">{atendimento.diagnostico}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* LADO DIREITO: PRESCRIÇÃO */}
                      <div className="space-y-6">
                        <h4 className="text-[11px] font-black text-red-600 uppercase tracking-[3px] flex items-center gap-2">
                           <Pill size={16} /> Prescrição na Data
                        </h4>
                        
                        {idSendoEditado === atendimento.id ? (
                          <div>
                            <label className="text-[9px] font-black text-gray-400 uppercase mb-1 block">Medicamentos e Orientações:</label>
                            <textarea className="w-full p-5 bg-red-50/30 border-2 border-red-100 rounded-3xl text-sm font-black text-red-700 focus:border-red-500 outline-none" rows={8} value={tempDados.prescricao} onChange={e => setTempDados({...tempDados, prescricao: e.target.value})} />
                          </div>
                        ) : (
                          <div className="bg-red-50 p-8 rounded-[35px] border-l-8 border-red-500 min-h-[200px] shadow-inner">
                            <p className="text-sm font-black text-red-700 whitespace-pre-wrap leading-relaxed">
                              {atendimento.prescricao}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-50 flex justify-between items-center text-[10px] font-black text-gray-300 uppercase tracking-widest">
                       <span>Médico: {atendimento.medico_nome}</span>
                       <span className="text-blue-200">ID Atendimento: #{atendimento.id.slice(0,8)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}