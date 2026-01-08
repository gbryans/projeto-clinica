"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { 
  Search, 
  History, 
  ArrowLeft, 
  Calendar, 
  User, 
  Stethoscope, 
  Pill, 
  FileText,
  Loader2,
  ChevronRight,
  Edit3,
  Check,
  X,
  Save
} from "lucide-react";
import Link from "next/link";

export default function HistoricoClinicoPage() {
  const [busca, setBusca] = useState("");
  const [pacientesEncontrados, setPacientesEncontrados] = useState<any[]>([]);
  const [historico, setHistorico] = useState<any[]>([]);
  const [pacienteSelecionado, setPacienteSelecionado] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [buscandoHistorico, setBuscandoHistorico] = useState(false);

  // Estados para Edição
  const [editandoId, setEditandoId] = useState<string | null>(null);
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

    const { data, error } = await supabase
      .from('prontuarios')
      .select('*')
      .eq('paciente_nome', paciente.nome)
      .order('data_atendimento', { ascending: false });

    if (!error) setHistorico(data || []);
    setBuscandoHistorico(false);
  };

  const salvarAlteracoes = async (id: string) => {
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
      setEditandoId(null);
      // Recarrega o histórico para mostrar os dados atualizados
      carregarHistorico(pacienteSelecionado);
    } else {
      alert("Erro ao atualizar: " + error.message);
    }
    setSalvandoEdicao(false);
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto bg-gray-50 min-h-screen font-sans text-gray-900">
      
      <header className="mb-8">
        <Link href="/dashboard" className="flex items-center gap-2 text-blue-600 font-bold mb-4 hover:underline">
          <ArrowLeft size={18} /> Painel Principal
        </Link>
        <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3 tracking-tighter uppercase italic">
          <History className="text-blue-600" size={32} /> Histórico Clínico
        </h1>
      </header>

      {/* BARRA DE PESQUISA */}
      <div className="mb-8 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Nome do paciente..."
            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-blue-500 font-bold"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && pesquisarPaciente()}
          />
        </div>
        <button onClick={pesquisarPaciente} className="bg-blue-600 text-white px-8 rounded-2xl font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
          {loading ? <Loader2 className="animate-spin" /> : "BUSCAR"}
        </button>
      </div>

      {/* LISTA DE PACIENTES ENCONTRADOS */}
      {pacientesEncontrados.length > 0 && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden mb-8 animate-in fade-in slide-in-from-top-4">
          <p className="p-4 bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b">Resultados da busca:</p>
          {pacientesEncontrados.map(p => (
            <button key={p.id} onClick={() => carregarHistorico(p)} className="w-full p-5 text-left flex items-center justify-between hover:bg-blue-50 transition-colors border-b border-gray-50 last:border-0">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-black">{p.nome.charAt(0)}</div>
                <div>
                  <h3 className="font-black text-gray-900 uppercase text-sm">{p.nome}</h3>
                  <p className="text-xs text-gray-400 font-medium italic">CPF: {p.cpf}</p>
                </div>
              </div>
              <ChevronRight className="text-gray-300" />
            </button>
          ))}
        </div>
      )}

      {/* EXIBIÇÃO DA TIMELINE */}
      {pacienteSelecionado && (
        <div className="space-y-6 animate-in fade-in">
          <div className="bg-blue-600 p-6 rounded-4xl text-white shadow-xl flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase opacity-70 tracking-widest">Paciente Selecionado:</p>
              <h2 className="text-2xl font-black uppercase tracking-tighter">{pacienteSelecionado.nome}</h2>
            </div>
            <User size={40} className="opacity-20" />
          </div>

          {buscandoHistorico ? (
            <div className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-blue-600" size={40} /></div>
          ) : historico.length === 0 ? (
            <div className="bg-white p-20 rounded-4xl border-2 border-dashed border-gray-200 text-center text-gray-400">
              <FileText className="mx-auto mb-4 opacity-20" size={48} />
              <p className="font-bold">Nenhum atendimento registrado.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {historico.map((atendimento) => (
                <div key={atendimento.id} className="relative pl-8 border-l-2 border-blue-200 ml-4">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 bg-blue-600 rounded-full ring-4 ring-white"></div>
                  
                  <div className="bg-white p-6 rounded-4xl border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-6 border-b border-gray-50 pb-4">
                      <div className="flex items-center gap-2 text-blue-600 font-black text-sm uppercase">
                        <Calendar size={16} /> {new Date(atendimento.data_atendimento).toLocaleDateString('pt-BR')}
                      </div>
                      
                      {/* BOTÕES DE AÇÃO */}
                      {editandoId === atendimento.id ? (
                        <div className="flex gap-2">
                          <button onClick={() => salvarAlteracoes(atendimento.id)} disabled={salvandoEdicao} className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-lg text-[10px] font-black uppercase hover:bg-green-200 transition-all">
                            {salvandoEdicao ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />} Salvar
                          </button>
                          <button onClick={() => setEditandoId(null)} className="flex items-center gap-1 bg-gray-100 text-gray-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase hover:bg-gray-200 transition-all">
                            <X size={12} /> Cancelar
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => { setEditandoId(atendimento.id); setTempDados(atendimento); }} className="flex items-center gap-1 text-gray-400 hover:text-blue-600 transition-all text-[10px] font-black uppercase">
                          <Edit3 size={12} /> Editar Registro
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* COLUNA: DIAGNÓSTICO */}
                      <div className="space-y-4">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1"><Stethoscope size={14} /> Avaliação Médica</h4>
                        {editandoId === atendimento.id ? (
                          <div className="space-y-3">
                            <label className="text-[10px] font-bold text-gray-400">Queixa:</label>
                            <textarea className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500" rows={2} value={tempDados.queixa_principal} onChange={e => setTempDados({...tempDados, queixa_principal: e.target.value})} />
                            <label className="text-[10px] font-bold text-gray-400">Diagnóstico:</label>
                            <textarea className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500" rows={2} value={tempDados.diagnostico} onChange={e => setTempDados({...tempDados, diagnostico: e.target.value})} />
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <p className="text-sm font-medium text-gray-700"><span className="font-black text-gray-900">Queixa:</span> {atendimento.queixa_principal}</p>
                            <p className="text-sm font-medium text-gray-700 italic bg-blue-50 p-3 rounded-xl border-l-4 border-blue-400">{atendimento.diagnostico}</p>
                          </div>
                        )}
                      </div>

                      {/* COLUNA: PRESCRIÇÃO */}
                      <div className="space-y-4">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1"><Pill size={14} className="text-red-500" /> Prescrição Médica</h4>
                        {editandoId === atendimento.id ? (
                          <textarea className="w-full p-4 bg-red-50 border border-red-100 rounded-xl text-sm font-bold text-red-700 outline-none focus:ring-2 focus:ring-red-500" rows={5} value={tempDados.prescricao} onChange={e => setTempDados({...tempDados, prescricao: e.target.value})} />
                        ) : (
                          <div className="p-4 bg-red-50 rounded-2xl border-l-4 border-red-400 text-sm font-bold text-red-700 italic">
                            {atendimento.prescricao}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-50 flex justify-between items-center">
                      <span className="text-[10px] font-bold text-gray-400 italic">Responsável: {atendimento.medico_nome}</span>
                      {atendimento.status === 'concluido' && <span className="flex items-center gap-1 text-green-500 font-black text-[9px] uppercase tracking-widest"><Save size={10}/> Registro Validado</span>}
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