"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { 
  UserPlus, 
  ArrowLeft, 
  Save, 
  HeartPulse, 
  FileText, 
  ShieldCheck,
  Loader2,
  CheckCircle2
} from "lucide-react";
import Link from "next/link";

export default function CadastroPacientePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  // Estado inicial do formulário
  const [form, setForm] = useState({
    nome: "",
    cpf: "",
    data_nascimento: "",
    email: "",
    convenio: "Particular",
    alergias: "",
    medicamentos: "",
    tipo_sanguineo: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Enviar para a tabela 'pacientes' no Supabase
    const { error } = await supabase
      .from('pacientes')
      .insert([form]);

    if (error) {
      console.error("Erro ao salvar paciente:", error.message);
      alert("Erro ao salvar: " + error.message);
      setLoading(false);
    } else {
      setSucesso(true);
      setLoading(false);
      // Após 2 segundos, redireciona para a agenda
      setTimeout(() => router.push("/dashboard/agenda"), 2000);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto bg-gray-50 min-h-screen font-sans">
      
      <header className="mb-8">
        <Link href="/dashboard" className="flex items-center gap-2 text-blue-600 font-semibold mb-4 hover:underline">
          <ArrowLeft size={18} /> Voltar ao Painel
        </Link>
        <div className="flex items-center gap-4">
          <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-lg">
            <UserPlus size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic">Novo Paciente</h1>
            <p className="text-gray-500 font-medium text-sm">Preencha os dados para abrir o prontuário digital.</p>
          </div>
        </div>
      </header>

      {sucesso ? (
        <div className="bg-white p-12 rounded-4xl text-center shadow-xl border border-green-100 animate-in fade-in zoom-in">
          <CheckCircle2 className="text-green-500 mx-auto mb-4" size={64} />
          <h2 className="text-2xl font-bold text-gray-800">Paciente Cadastrado!</h2>
          <p className="text-gray-500 mt-2 text-sm">Os dados foram salvos. Redirecionando para a agenda...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Informações Pessoais */}
          <div className="bg-white p-8 rounded-4xl shadow-sm border border-gray-100">
            <h2 className="text-xs font-black mb-6 text-blue-600 flex items-center gap-2 border-b border-gray-50 pb-4 tracking-widest uppercase">
              <FileText size={18}/> Dados Pessoais
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="text-[10px] font-black text-gray-400 uppercase">Nome Completo</label>
                <input 
                  required 
                  className="w-full mt-1 p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-sm"
                  placeholder="Nome do paciente"
                  onChange={e => setForm({...form, nome: e.target.value})}
                />
              </div>
              
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase">CPF</label>
                <input 
                  required 
                  className="w-full mt-1 p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-sm"
                  placeholder="000.000.000-00"
                  onChange={e => setForm({...form, cpf: e.target.value})}
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase">Data de Nascimento</label>
                <input 
                  required 
                  type="date"
                  className="w-full mt-1 p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-sm"
                  onChange={e => setForm({...form, data_nascimento: e.target.value})}
                />
              </div>
            </div>
          </div>

          {/* Informações Médicas */}
          <div className="bg-white p-8 rounded-4xl shadow-sm border border-gray-100">
            <h2 className="text-sm font-black mb-6 text-red-500 flex items-center gap-2 border-b border-gray-50 pb-4 tracking-widest uppercase">
              <HeartPulse size={18}/> Informações Médicas
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase">Convênio</label>
                <select 
                  className="w-full mt-1 p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-sm"
                  onChange={e => setForm({...form, convenio: e.target.value})}
                >
                  <option value="Particular">Particular</option>
                  <option value="Unimed">Unimed</option>
                  <option value="Bradesco Saúde">Bradesco Saúde</option>
                  <option value="Amil">Amil</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase">Tipo Sanguíneo</label>
                <select 
                  className="w-full mt-1 p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-sm"
                  onChange={e => setForm({...form, tipo_sanguineo: e.target.value})}
                >
                  <option value="">Não informado</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="text-[10px] font-black text-gray-400 uppercase">Alergias Conhecidas</label>
                <textarea 
                  rows={2}
                  className="w-full mt-1 p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium text-sm italic"
                  placeholder="Ex: Penicilina, Corantes..."
                  onChange={e => setForm({...form, alergias: e.target.value})}
                ></textarea>
              </div>
            </div>
          </div>

          <div className="flex justify-end pb-10">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full md:w-auto px-16 py-5 bg-blue-600 text-white rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95 disabled:opacity-50 tracking-widest text-sm"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              FINALIZAR CADASTRO
            </button>
          </div>
        </form>
      )}
    </div>
  );
}