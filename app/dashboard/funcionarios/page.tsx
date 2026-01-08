"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { 
  UserPlus, 
  ArrowLeft, 
  Stethoscope, 
  Save, 
  Loader2, 
  ShieldCheck, 
  Phone, 
  Fingerprint, 
  Calendar, 
  MapPin,
  Briefcase,
  Building2
} from "lucide-react";
import Link from "next/link";

export default function CadastroFuncionarioPage() {
  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  
  const [form, setForm] = useState({
    nome: "",
    email: "",
    cpf: "",
    telefone: "",
    data_nascimento: "",
    endereco: "",
    cargo: "Administrativo",
    setor: "Recepção",
    especialidade: "",
    crm: "",
    unidade: "Matriz",
    status: "Ativo"
  });

  // --- FUNÇÕES DE MÁSCARA (Formatação Automática) ---
  const maskCPF = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
      .slice(0, 14);
  };

  const maskPhone = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/^(\d{2})(\d)/g, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .slice(0, 15);
  };

  const maskDate = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "$1/$2")
      .replace(/(\d{2})(\d)/, "$1/$2")
      .slice(0, 10);
  };

  // --- ENVIO PARA O BANCO DE DADOS ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from('perfis')
      .insert([form]);

    if (error) {
      console.error(error);
      alert("Erro ao cadastrar: " + error.message);
      setLoading(false);
    } else {
      setSucesso(true);
      setLoading(false);
      // Reseta o formulário
      setForm({
        nome: "", email: "", cpf: "", telefone: "", data_nascimento: "",
        endereco: "", cargo: "Administrativo", setor: "Recepção",
        especialidade: "", crm: "", unidade: "Matriz", status: "Ativo"
      });
      setTimeout(() => setSucesso(false), 3000);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto bg-gray-50 min-h-screen font-sans text-gray-900">
      
      <header className="mb-8">
        <Link href="/dashboard" className="flex items-center gap-2 text-indigo-600 font-bold mb-4 hover:underline">
          <ArrowLeft size={18} /> Voltar ao Painel
        </Link>
        <div className="flex items-center gap-4">
          <div className="bg-indigo-600 p-3 rounded-2xl text-white shadow-lg">
            <UserPlus size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic">Novo Colaborador</h1>
            <p className="text-gray-500 font-medium text-sm">Registre os dados pessoais e profissionais da equipe.</p>
          </div>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* BLOCO 1: DADOS PESSOAIS */}
        <div className="bg-white p-8 rounded-4xl shadow-sm border border-gray-100">
          <h2 className="text-[10px] font-black mb-6 text-indigo-600 flex items-center gap-2 border-b border-gray-50 pb-4 tracking-widest uppercase">
            <ShieldCheck size={18}/> Informações Pessoais
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="text-[10px] font-black text-gray-400 uppercase">Nome Completo</label>
              <input 
                required 
                className="w-full mt-1 p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-sm"
                value={form.nome}
                onChange={e => setForm({...form, nome: e.target.value})}
              />
            </div>

            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1"><Fingerprint size={12}/> CPF</label>
              <input 
                required 
                placeholder="000.000.000-00"
                className="w-full mt-1 p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-sm"
                value={form.cpf}
                onChange={e => setForm({...form, cpf: maskCPF(e.target.value)})}
              />
            </div>

            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1"><Calendar size={12}/> Data de Nascimento</label>
              <input 
                required 
                placeholder="DD/MM/AAAA"
                className="w-full mt-1 p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-sm"
                value={form.data_nascimento}
                onChange={e => setForm({...form, data_nascimento: maskDate(e.target.value)})}
              />
            </div>

            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1"><Phone size={12}/> Telefone de Contato</label>
              <input 
                required 
                placeholder="(00) 00000-0000"
                className="w-full mt-1 p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-sm"
                value={form.telefone}
                onChange={e => setForm({...form, telefone: maskPhone(e.target.value)})}
              />
            </div>

            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase">E-mail Profissional</label>
              <input 
                required 
                type="email"
                className="w-full mt-1 p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-sm"
                value={form.email}
                onChange={e => setForm({...form, email: e.target.value})}
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1"><MapPin size={12}/> Endereço Residencial</label>
              <input 
                required 
                placeholder="Rua, Número, Bairro, Cidade - UF"
                className="w-full mt-1 p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-sm"
                value={form.endereco}
                onChange={e => setForm({...form, endereco: e.target.value})}
              />
            </div>
          </div>
        </div>

        {/* BLOCO 2: DADOS PROFISSIONAIS */}
        <div className="bg-white p-8 rounded-4xl shadow-sm border border-gray-100">
          <h2 className="text-[10px] font-black mb-6 text-indigo-600 flex items-center gap-2 border-b border-gray-50 pb-4 tracking-widest uppercase">
            <Briefcase size={18}/> Atribuições na Clínica
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">Cargo</label>
              <select 
                className="w-full mt-1 p-4 bg-gray-50 border border-gray-200 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                value={form.cargo}
                onChange={e => setForm({...form, cargo: e.target.value})}
              >
                <option value="Administrativo">Administrativo</option>
                <option value="Médico">Médico</option>
                <option value="Enfermeiro(a)">Enfermeiro(a)</option>
                <option value="Recepção">Recepção</option>
                <option value="Gerência">Gerência</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">Setor</label>
              <select 
                className="w-full mt-1 p-4 bg-gray-50 border border-gray-200 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                value={form.setor}
                onChange={e => setForm({...form, setor: e.target.value})}
              >
                <option value="Recepção">Recepção</option>
                <option value="Atendimento Clínico">Atendimento Clínico</option>
                <option value="Financeiro">Financeiro</option>
                <option value="Limpeza/Copa">Limpeza/Copa</option>
                <option value="TI/Suporte">TI/Suporte</option>
                <option value="Diretoria">Diretoria</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1"><Building2 size={12}/> Unidade</label>
              <select 
                className="w-full mt-1 p-4 bg-gray-50 border border-gray-200 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                value={form.unidade}
                onChange={e => setForm({...form, unidade: e.target.value})}
              >
                <option value="Matriz">Unidade Matriz</option>
                <option value="Filial 01">Filial Sul</option>
                <option value="Filial 02">Filial Norte</option>
              </select>
            </div>
          </div>

          {/* CAMPOS EXCLUSIVOS PARA MÉDICO */}
          {form.cargo === "Médico" && (
            <div className="mt-8 p-6 bg-indigo-50 rounded-3xl border border-indigo-100 animate-in fade-in zoom-in space-y-6">
              <h3 className="text-[10px] font-black text-indigo-600 uppercase flex items-center gap-2">
                <Stethoscope size={16} /> Registro Médico Profissional
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Especialidade Clínica</label>
                  <input 
                    required 
                    placeholder="Ex: Cardiologia, Pediatria..."
                    className="w-full mt-1 p-4 bg-white border border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-sm"
                    value={form.especialidade}
                    onChange={e => setForm({...form, especialidade: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Número do CRM</label>
                  <input 
                    required 
                    placeholder="000000-UF"
                    className="w-full mt-1 p-4 bg-white border border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-sm"
                    value={form.crm}
                    onChange={e => setForm({...form, crm: e.target.value})}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end pb-10">
          <button 
            type="submit" 
            disabled={loading}
            className="w-full md:w-auto px-16 py-5 bg-indigo-600 text-white rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 disabled:opacity-50 tracking-widest text-sm"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            {sucesso ? "COLABORADOR CADASTRADO!" : "FINALIZAR CADASTRO"}
          </button>
        </div>
      </form>
    </div>
  );
}