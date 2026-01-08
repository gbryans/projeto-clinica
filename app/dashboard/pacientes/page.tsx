"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  HeartPulse, 
  Save, 
  ArrowLeft, 
  User, 
  IdCard, 
  Activity, 
  ShieldPlus, 
  PhoneCall 
} from "lucide-react";
import Link from "next/link";

export default function CadastroPacientePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nome: "", cpf: "", dataNascimento: "", email: "", telefone: "",
    convenio: "", numCarteirinha: "", 
    tipoSanguineo: "", alergias: "", medicamentos: "",
    contatoEmergencia: "", telEmergencia: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Paciente Cadastrado:", formData);
    alert("Paciente cadastrado com sucesso!");
    router.push("/dashboard");
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto bg-gray-50 min-h-screen font-sans">
      {/* Cabeçalho */}
      <header className="mb-8">
        <Link href="/dashboard" className="flex items-center gap-2 text-green-600 font-semibold mb-4 hover:underline">
          <ArrowLeft size={18} /> Voltar ao Painel
        </Link>
        <div className="flex items-center gap-4">
          <div className="bg-green-600 p-3 rounded-2xl text-white shadow-lg shadow-green-100">
            <HeartPulse size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Novo Paciente</h1>
            <p className="text-gray-500">Inicie o prontuário preenchendo os dados básicos.</p>
          </div>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* BLOCO 1: Identificação */}
        <div className="bg-white p-6 md:p-8 rounded-4xl shadow-sm border border-gray-100 transition-all">
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-green-600 border-b pb-2">
            <User size={20}/> Dados de Identificação
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <label className="text-sm font-bold text-gray-700">Nome Completo</label>
              <input name="nome" onChange={handleChange} required className="w-full mt-2 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none" placeholder="Nome do paciente" />
            </div>
            <div>
              <label className="text-sm font-bold text-gray-700">CPF</label>
              <input name="cpf" onChange={handleChange} required className="w-full mt-2 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none" placeholder="000.000.000-00" />
            </div>
            <div>
              <label className="text-sm font-bold text-gray-700">Data de Nascimento</label>
              <input name="dataNascimento" type="date" onChange={handleChange} required className="w-full mt-2 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-bold text-gray-700">E-mail</label>
              <input name="email" type="email" onChange={handleChange} className="w-full mt-2 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none" placeholder="paciente@email.com" />
            </div>
          </div>
        </div>

        {/* BLOCO 2: Saúde e Alergias */}
        <div className="bg-white p-6 md:p-8 rounded-4xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-red-600 border-b pb-2">
            <Activity size={20}/> Informações de Saúde
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="text-sm font-bold text-gray-700">Tipo Sanguíneo</label>
              <select name="tipoSanguineo" onChange={handleChange} className="w-full mt-2 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none">
                <option value="">Selecione...</option>
                <option value="A+">A+</option><option value="A-">A-</option>
                <option value="B+">B+</option><option value="B-">B-</option>
                <option value="AB+">AB+</option><option value="AB-">AB-</option>
                <option value="O+">O+</option><option value="O-">O-</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-bold text-gray-700">Alergias (se houver)</label>
              <input name="alergias" onChange={handleChange} className="w-full mt-2 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none" placeholder="Ex: Penicilina, Corantes..." />
            </div>
            <div className="md:col-span-3">
              <label className="text-sm font-bold text-gray-700">Medicamentos em uso contínuo</label>
              <textarea name="medicamentos" onChange={handleChange} rows={2} className="w-full mt-2 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none resize-none" placeholder="Liste os medicamentos..."></textarea>
            </div>
          </div>
        </div>

        {/* BLOCO 3: Convênio e Emergência */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 md:p-8 rounded-4xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-blue-600 border-b pb-2">
              <ShieldPlus size={20}/> Convênio Médico
            </h2>
            <div className="space-y-4">
              <input name="convenio" onChange={handleChange} placeholder="Nome do Plano" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
              <input name="numCarteirinha" onChange={handleChange} placeholder="Nº da Carteirinha" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>

          <div className="bg-white p-6 md:p-8 rounded-4xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-orange-600 border-b pb-2">
              <PhoneCall size={20}/> Emergência
            </h2>
            <div className="space-y-4">
              <input name="contatoEmergencia" onChange={handleChange} placeholder="Nome do Contato" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" />
              <input name="telEmergencia" onChange={handleChange} placeholder="Telefone de Emergência" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" />
            </div>
          </div>
        </div>

        {/* Ações */}
        <div className="flex justify-end gap-4 pb-12">
          <button type="button" onClick={() => router.back()} className="px-8 py-4 rounded-2xl font-bold text-gray-500 hover:bg-gray-100 transition-all">
            Cancelar
          </button>
          <button type="submit" className="px-12 py-4 bg-green-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-green-700 transition-all shadow-xl shadow-green-100 active:scale-95">
            <Save size={20}/> Cadastrar Paciente
          </button>
        </div>
      </form>
    </div>
  );
}