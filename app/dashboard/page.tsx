"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  LayoutDashboard, UserPlus, Calendar, LogOut, 
  Settings, HeartPulse, LifeBuoy, Ticket, Search, Bell
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const savedRole = localStorage.getItem("userRole");
    const savedName = localStorage.getItem("userName");
    
    if (!savedRole) {
      router.push("/login"); // Se não houver login, volta pra tela inicial
    } else {
      setRole(savedRole);
      setUserName(savedName || "Usuário");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* Sidebar Lateral */}
      <aside className="w-72 bg-white border-r border-gray-200 hidden md:flex flex-col shadow-sm">
        <div className="p-8">
          <h2 className="text-2xl font-black text-blue-600 italic">CLÍNICA</h2>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          <Link href="/dashboard" className="flex items-center gap-3 p-3 bg-blue-50 text-blue-700 rounded-xl font-bold">
            <LayoutDashboard size={20} /> Início
          </Link>

          {/* SÓ ADMIN VÊ GESTÃO DE EQUIPE */}
          {role === "ADMIN" && (
            <Link href="/dashboard/funcionarios" className="flex items-center gap-3 p-3 text-gray-600 hover:bg-gray-100 rounded-xl transition-all">
              <UserPlus size={20} />
              <span className="font-bold">Gestão de Equipe</span>
            </Link>
          )}

          {/* SÓ FUNCIONÁRIO (USER) VÊ PACIENTES */}
          {role === "USER" && (
            <Link href="/dashboard/pacientes" className="flex items-center gap-3 p-3 text-gray-600 hover:bg-gray-100 rounded-xl transition-all">
              <HeartPulse size={20} />
              <span className="font-bold">Pacientes</span>
            </Link>
          )}

          <Link href="/dashboard/agenda" className="flex items-center gap-3 p-3 text-gray-600 hover:bg-gray-100 rounded-xl transition-all">
            <Calendar size={20} />
            <span className="font-bold">Agenda</span>
          </Link>

          <hr className="my-4 border-gray-100" />

          {/* SUPORTE - VISÍVEL PARA TODOS */}
          <Link href="/dashboard/suporte" className="flex items-center gap-3 p-3 text-indigo-600 bg-indigo-50 rounded-xl font-bold transition-all">
            <LifeBuoy size={20} />
            <span>Suporte T.I.</span>
          </Link>

          {/* GESTÃO DE CHAMADOS - SÓ ADMIN VÊ */}
          {role === "ADMIN" && (
            <Link href="/dashboard/suporte/gestao" className="flex items-center gap-3 p-3 text-gray-600 hover:bg-gray-100 rounded-xl transition-all">
              <Ticket size={20} />
              <span className="font-bold">Gerenciar Chamados</span>
            </Link>
          )}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button onClick={handleLogout} className="flex items-center gap-3 w-full p-3 text-red-500 hover:bg-red-50 rounded-xl transition-all font-black">
            <LogOut size={20} /> SAIR
          </button>
        </div>
      </aside>

      {/* Conteúdo Central */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <h1 className="font-bold text-gray-400 uppercase tracking-widest text-xs">Dashboard Principal</h1>
          <div className="flex items-center gap-4">
             <div className="text-right">
                <p className="text-sm font-black text-gray-800 leading-tight">{userName}</p>
                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-tighter">{role}</p>
             </div>
             <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-blue-100">
                {userName.charAt(0)}
             </div>
          </div>
        </header>

        <div className="p-8">
          <h2 className="text-3xl font-black text-gray-800">Bem-vindo de volta! 👋</h2>
          <p className="text-gray-400 mt-1">O que você deseja fazer agora?</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
            {role === "ADMIN" ? (
              <Link href="/dashboard/funcionarios" className="p-8 bg-blue-600 rounded-4xl text-white shadow-xl hover:scale-[1.02] transition-all">
                <UserPlus size={40} className="mb-4 opacity-50" />
                <h3 className="text-xl font-black">Cadastrar Funcionário</h3>
                <p className="text-blue-100 text-sm mt-1">Gerencie a equipe da sua clínica.</p>
              </Link>
            ) : (
              <Link href="/dashboard/pacientes" className="p-8 bg-green-600 rounded-4xl text-white shadow-xl hover:scale-[1.02] transition-all">
                <HeartPulse size={40} className="mb-4 opacity-50" />
                <h3 className="text-xl font-black">Cadastrar Paciente</h3>
                <p className="text-green-100 text-sm mt-1">Inicie um novo prontuário médico.</p>
              </Link>
            )}

            <Link href="/dashboard/suporte" className="p-8 bg-indigo-600 rounded-4xl text-white shadow-xl hover:scale-[1.02] transition-all">
              <LifeBuoy size={40} className="mb-4 opacity-50" />
              <h3 className="text-xl font-black">Reportar Problema</h3>
              <p className="text-indigo-100 text-sm mt-1">Falar com a equipe de tecnologia.</p>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}