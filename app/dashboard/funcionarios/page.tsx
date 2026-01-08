"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Users, Save, Globe, Building2, ShieldCheck, 
  Lock, AlertTriangle, ArrowLeft, User 
} from "lucide-react";
import Link from "next/link";

export default function FuncionariosPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  // Estado do formulário
  const [formData, setFormData] = useState({
    nome: "", email: "", telefone: "", profissao: "", funcao: "",
    setor: "", unidade: "", organizacao: "", gerente: "",
    idioma: "Português", login: "", senha: ""
  });

  // 1. Verificação de Segurança (Apenas ADMIN entra)
  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (role !== "ADMIN") {
      setIsAuthorized(false);
      const timer = setTimeout(() => {
        router.push("/dashboard");
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Funcionário Cadastrado:", formData);
    alert("Funcionário salvo com sucesso!");
  };

  if (isAuthorized === null) return null;

  // Tela de Acesso Negado
  if (isAuthorized === false) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6 text-center font-sans">
        <div className="bg-white p-10 rounded-3xl shadow-2xl max-w-sm border border-red-100">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="text-red-600" size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Acesso Restrito</h2>
          <p className="text-gray-500 mb-6">Você não tem permissão para acessar esta área.</p>
          <div className="flex items-center justify-center gap-2 text-red-500 font-bold animate-pulse">
            <AlertTriangle size={18} /> Redirecionando...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto bg-gray-50 min-h-screen font-sans">
      <header className="mb-8">
        <Link href="/dashboard" className="flex items-center gap-2 text-blue-600 font-semibold mb-4 hover:underline">
          <ArrowLeft size={18} /> Voltar ao Painel
        </Link>
        <div className="flex items-center gap-4">
          <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-lg">
            <Users size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Cadastro de Equipe</h1>
            <p className="text-gray-500">Preencha os dados do novo colaborador.</p>
          </div>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* BLOCO 1: Pessoal e Contato */}
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-blue-600 border-b pb-2">
            <User size={20}/> Dados Pessoais & Contato
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <label className="text-sm font-bold text-gray-700">Nome Completo</label>
              <input name="nome" onChange={handleChange} required className="w-full mt-2 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
            </div>
            <div>
              <label className="text-sm font-bold text-gray-700">Telefone</label>
              <input name="telefone" onChange={handleChange} className="w-full mt-2 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="(00) 00000-0000" />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-bold text-gray-700">E-mail Corporativo</label>
              <input name="email" type="email" onChange={handleChange} className="w-full mt-2 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="text-sm font-bold text-gray-700 flex items-center gap-1">
                <Globe size={14}/> Idioma Preferido
              </label>
              <select name="idioma" onChange={handleChange} className="w-full mt-2 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none">
                <option value="Português">Português (BR)</option>
                <option value="Inglês">Inglês (US)</option>
                <option value="Espanhol">Espanhol (ES)</option>
              </select>
            </div>
          </div>
        </div>

        {/* BLOCO 2: Estrutura Organizacional */}
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-purple-600 border-b pb-2">
            <Building2 size={20}/> Organização & Função
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="text-sm font-bold text-gray-700">Organização</label>
              <input name="organizacao" onChange={handleChange} className="w-full mt-2 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none" />
            </div>
            <div>
              <label className="text-sm font-bold text-gray-700">Localização/Unidade</label>
              <input name="unidade" onChange={handleChange} className="w-full mt-2 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none" />
            </div>
            <div>
              <label className="text-sm font-bold text-gray-700">Setor</label>
              <input name="setor" onChange={handleChange} className="w-full mt-2 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none" />
            </div>
            <div>
              <label className="text-sm font-bold text-gray-700">Gerente</label>
              <input name="gerente" onChange={handleChange} className="w-full mt-2 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none" />
            </div>
            <div className="lg:col-span-2">
              <label className="text-sm font-bold text-gray-700">Profissão</label>
              <input name="profissao" onChange={handleChange} className="w-full mt-2 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none" />
            </div>
            <div className="lg:col-span-2">
              <label className="text-sm font-bold text-gray-700">Função/Cargo</label>
              <input name="funcao" onChange={handleChange} className="w-full mt-2 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none" />
            </div>
          </div>
        </div>

        {/* BLOCO 3: Credenciais */}
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-green-600 border-b pb-2">
            <ShieldCheck size={20}/> Credenciais do Sistema
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-bold text-gray-700">Usuário de Login</label>
              <input name="login" onChange={handleChange} required className="w-full mt-2 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none" />
            </div>
            <div>
              <label className="text-sm font-bold text-gray-700">Senha Temporária</label>
              <input name="senha" type="password" onChange={handleChange} required className="w-full mt-2 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none" />
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-end gap-4 pb-10">
          <button type="button" onClick={() => router.back()} className="px-8 py-4 rounded-2xl font-bold text-gray-500 hover:bg-gray-200 transition-all">
            Cancelar
          </button>
          <button type="submit" className="px-12 py-4 bg-blue-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-xl active:scale-95">
            <Save size={20}/> Finalizar Cadastro
          </button>
        </div>
      </form>
    </div>
  );
}