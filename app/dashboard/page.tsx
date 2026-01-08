"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  Calendar, 
  LogOut, 
  Settings, 
  HeartPulse, 
  ShieldCheck,
  Search,
  Bell
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [userName, setUserName] = useState("Usuário");

  useEffect(() => {
    const savedRole = localStorage.getItem("userRole");
    setRole(savedRole);
    setUserName(savedRole === "ADMIN" ? "Administrador" : "Colaborador");
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* Sidebar Lateral */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col shadow-sm">
        <div className="p-6">
          <h2 className="text-2xl font-black text-blue-600 tracking-tight">CLÍNICA</h2>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          <p className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Principal</p>
          
          <Link href="/dashboard" className="flex items-center gap-3 p-3 bg-blue-50 text-blue-700 rounded-xl font-bold transition-all">
            <LayoutDashboard size={20} /> Início
          </Link>

          {role === "ADMIN" && (
            <Link href="/dashboard/funcionarios" className="flex items-center gap-3 p-3 text-gray-600 hover:bg-gray-100 rounded-xl transition-all group">
              <UserPlus size={20} className="group-hover:text-blue-600" />
              <span className="font-medium text-gray-700">Gestão de Equipe</span>
            </Link>
          )}

          {role !== "ADMIN" && (
            <Link href="/dashboard/pacientes" className="flex items-center gap-3 p-3 text-gray-600 hover:bg-green-50 rounded-xl transition-all group">
              <HeartPulse size={20} className="group-hover:text-green-600" />
              <span className="font-medium text-gray-700">Pacientes</span>
            </Link>
          )}

          <Link href="/dashboard/agenda" className="flex items-center gap-3 p-3 text-gray-600 hover:bg-gray-100 rounded-xl transition-all">
            <Calendar size={20} />
            <span className="font-medium text-gray-700">Agenda Médica</span>
          </Link>

          <p className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-6 mb-2">Sistema</p>
          
          <Link href="/dashboard/configuracoes" className="flex items-center gap-3 p-3 text-gray-600 hover:bg-gray-100 rounded-xl transition-all">
            <Settings size={20} />
            <span className="font-medium text-gray-700">Configurações</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full p-3 text-red-500 hover:bg-red-50 rounded-xl transition-all font-bold"
          >
            <LogOut size={20} /> Sair do Sistema
          </button>
        </div>
      </aside>

      {/* Conteúdo Principal */}
      <main className="flex-1">
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar pacientes ou prontuários..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-all relative">
              <Bell size={22} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-10 w-px bg-gray-200 mx-2"></div>
            <div className="text-right">
              <p className="text-sm font-bold text-gray-800">{userName}</p>
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-tighter">
                {role === "ADMIN" ? "Acesso Total" : "Acesso Limitado"}
              </p>
            </div>
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold">
              {userName.charAt(0)}
            </div>
          </div>
        </header>

        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight">
              Olá, {userName}! 👋
            </h1>
            <p className="text-gray-500">Aqui está o resumo da clínica hoje.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {role === "ADMIN" ? (
              <Link href="/dashboard/funcionarios" className="md:col-span-2 group relative overflow-hidden bg-blue-600 p-8 rounded-4xl text-white shadow-xl shadow-blue-100 flex flex-col justify-between h-48 transition-all hover:scale-[1.01]">
                <ShieldCheck className="absolute -right-5 -top-5 opacity-10 rotate-12" size={200} />
                <h2 className="text-2xl font-bold z-10 text-white">Gerenciar Equipe</h2>
                <div className="z-10 bg-white/20 w-fit px-4 py-2 rounded-xl backdrop-blur-md font-bold text-sm">
                  Acessar Painel de RH →
                </div>
              </Link>
            ) : (
              <Link href="/dashboard/pacientes" className="md:col-span-2 group relative overflow-hidden bg-green-600 p-8 rounded-4xl text-white shadow-xl shadow-green-100 flex flex-col justify-between h-48 transition-all hover:scale-[1.01]">
                <HeartPulse className="absolute -right-5 -top-5 opacity-10 rotate-12" size={200} />
                <h2 className="text-2xl font-bold z-10 text-white">Novo Atendimento</h2>
                <div className="z-10 bg-white/20 w-fit px-4 py-2 rounded-xl backdrop-blur-md font-bold text-sm text-white">
                  Iniciar Prontuário →
                </div>
              </Link>
            )}

            <div className="bg-white p-8 rounded-4xl border border-gray-100 shadow-sm flex flex-col justify-between">
              <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Próxima Consulta</p>
              <div>
                <p className="text-xl font-bold text-gray-800">14:30</p>
                <p className="text-gray-500 text-sm">João Pedro Silva</p>
              </div>
              <div className="text-blue-600 font-bold text-xs hover:underline cursor-pointer">Ver Agenda Completa</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}