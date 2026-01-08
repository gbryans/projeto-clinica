"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { 
  Save, 
  User, 
  Stethoscope, 
  Pill, 
  ArrowLeft, 
  Loader2, 
  CheckCircle2,
  FileText,
  AlertCircle
} from "lucide-react";
import Link from "next/link";

export default function AtendimentoPage() {
  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [pacientes, setPacientes] = useState<any[]>([]);
  const [medicos, setMedicos] = useState<any[]>([]);

  const [form, setForm] = useState({
    paciente_id: "",
    paciente_nome: "",
    medico_nome: "",
    queixa_principal: "",
    diagnostico: "",
    prescricao: "",
    data_atendimento: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    carregarDadosIniciais();
  }, []);

  async function carregarDadosIniciais() {
    // Busca pacientes para o select
    const { data: p } = await supabase.from('pacientes').select('id, nome').order('nome');
    // Busca médicos ATIVOS para o select
    const { data: m } = await supabase.from('perfis').select('nome').eq('cargo', 'Médico').eq('status', 'Ativo');
    
    setPacientes(p || []);
    setMedicos(m || []);
  }

  const handleSalvarProntuario = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.paciente_id || !form.medico_nome) {
      alert("Selecione o paciente e o médico responsável.");
      return;
    }

    setLoading(true);

    // Encontra o nome do paciente pelo ID para salvar no prontuário
    const nomeDoPaciente = pacientes.find(p => p.id === form.paciente_id)?.nome;

    const { error } = await supabase
      .from('prontuarios')
      .insert([{
        ...form,
        paciente_nome: nomeDoPaciente // Garante que o nome salvo é idêntico ao da tabela pacientes
      }]);

    if (error) {
      alert("Erro ao salvar: " + error.message);
    } else {
      setSucesso(true);
      setForm({ ...form, queixa_principal: "", diagnostico: "", prescricao: "" });
      setTimeout(() => setSucesso(false), 3000);
    }
    setLoading(false);
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto bg-gray-50 min-h-screen font-sans">
      <header className="mb-8">
        <Link href="/dashboard" className="flex items-center gap-2 text-blue-600 font-bold mb-4 hover:underline">
          <ArrowLeft size={18} /> Voltar
        </Link>
        <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3 uppercase italic tracking-tighter">
          <Stethoscope className="text-blue-600" size={32} /> Realizar Atendimento
        </h1>
      </header>

      <form onSubmit={handleSalvarProntuario} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLUNA ESQUERDA: SELEÇÃO E QUEIXA */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                  <User size={14}/> Paciente
                </label>
                <select 
                  required
                  className="w-full mt-2 p-4 bg-gray-50 border-none rounded-2xl font-bold text-sm focus:ring-2 focus:ring-blue-500"
                  value={form.paciente_id}
                  onChange={e => setForm({...form, paciente_id: e.target.value})}
                >
                  <option value="">Selecione o paciente...</option>
                  {pacientes.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                  <Stethoscope size={14}/> Médico Responsável
                </label>
                <select 
                  required
                  className="w-full mt-2 p-4 bg-gray-50 border-none rounded-2xl font-bold text-sm focus:ring-2 focus:ring-blue-500"
                  value={form.medico_nome}
                  onChange={e => setForm({...form, medico_nome: e.target.value})}
                >
                  <option value="">Selecione o médico...</option>
                  {medicos.map(m => <option key={m.nome} value={m.nome}>{m.nome}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Queixa Principal / Anamnese</label>
              <textarea 
                required
                className="w-full mt-2 p-6 bg-gray-50 border-none rounded-[30px] font-medium text-sm focus:ring-2 focus:ring-blue-500"
                rows={5}
                placeholder="Descreva o que o paciente está sentindo..."
                value={form.queixa_principal}
                onChange={e => setForm({...form, queixa_principal: e.target.value})}
              />
            </div>

            <div>
              <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Diagnóstico Clínico</label>
              <textarea 
                required
                className="w-full mt-2 p-6 bg-blue-50/30 border-none rounded-[30px] font-bold text-sm focus:ring-2 focus:ring-blue-500 italic"
                rows={3}
                placeholder="Conclusão médica sobre o caso..."
                value={form.diagnostico}
                onChange={e => setForm({...form, diagnostico: e.target.value})}
              />
            </div>
          </div>
        </div>

        {/* COLUNA DIREITA: PRESCRIÇÃO E SALVAR */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 space-y-6">
            <h3 className="text-[10px] font-black text-red-500 uppercase tracking-widest flex items-center gap-2">
              <Pill size={18} /> Prescrição Médica
            </h3>
            <textarea 
              required
              className="w-full p-6 bg-red-50/30 border-none rounded-[30px] font-black text-red-700 text-sm focus:ring-2 focus:ring-red-500"
              rows={12}
              placeholder="1. Medicamento X ...&#10;2. Orientações ..."
              value={form.prescricao}
              onChange={e => setForm({...form, prescricao: e.target.value})}
            />

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-5 bg-blue-600 text-white rounded-[25px] font-black uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center gap-3"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
              {sucesso ? "CONCLUÍDO!" : "FINALIZAR ATENDIMENTO"}
            </button>
            
            {sucesso && (
              <div className="flex items-center gap-2 text-green-600 font-bold text-xs justify-center animate-bounce">
                <CheckCircle2 size={16} /> Prontuário salvo no histórico!
              </div>
            )}
          </div>

          <div className="bg-indigo-900 p-8 rounded-[40px] text-white shadow-xl relative overflow-hidden">
             <FileText className="absolute -right-4 -bottom-4 opacity-10" size={100} />
             <h4 className="font-black uppercase text-xs opacity-60 mb-2">Dica de Segurança</h4>
             <p className="text-xs font-medium leading-relaxed">
               Todos os atendimentos salvos aqui podem ser editados posteriormente pelo menu de Histórico Clínico caso haja necessidade de correção.
             </p>
          </div>
        </div>
      </form>
    </div>
  );
}