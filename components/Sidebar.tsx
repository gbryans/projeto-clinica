"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { 
  LayoutDashboard, UserCircle, Calendar, 
  ClipboardList, DollarSign, LogOut, ChevronDown,
  History, Users, ShieldCheck, Menu, X
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SidebarMenu() {
  const router = useRouter();
  const [menuAberto, setMenuAberto] = useState(false);

  // Dados que você confirmou que estão ativos
  const usuario = {
    nome: "Dr. Augusto",
    cargo: "Diretoria",
    nivel_acesso: "ADMIN",
    unidade: "Matriz"
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  // Áreas que o ADMIN (Dr. Augusto) pode acessar
  const areas = [
    { label: "Painel Geral", href: "/dashboard", icon: <LayoutDashboard size={18}/> },
    { label: "Agenda Médica", href: "/dashboard/agenda", icon: <Calendar size={18}/> },
    { label: "Novo Atendimento", href: "/dashboard/pacientes/atendimento", icon: <ClipboardList size={18}/> },
    { label: "Histórico Clínico", href: "/dashboard/pacientes/historico", icon: <History size={18}/> },
    { label: "Gestão de Equipe", href: "/dashboard/funcionarios/lista", icon: <Users size={18}/> },
    { label: "Financeiro", href: "/dashboard/financeiro", icon: <DollarSign size={18}/> },
  ];

  return (
    <div className="relative inline-block text-left font-sans">
      
      {/* BOTÃO QUE MOSTRA O NOME E ABRE O MENU */}
      <button 
        onClick={() => setMenuAberto(!menuAberto)}
        className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-gray-200 shadow-md hover:border-blue-300 transition-all active:scale-95 z-50 relative"
      >
        <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-100">
          {menuAberto ? <X size={20} /> : <Menu size={20} />}
        </div>
        
        <div className="text-left pr-2">
          <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest leading-none mb-1">
            {usuario.unidade}
          </p>
          <p className="text-sm font-black text-gray-900 uppercase tracking-tighter">
            {usuario.nome}
          </p>
        </div>
        
        <ChevronDown 
          size={16} 
          className={`text-gray-400 transition-transform duration-300 ${menuAberto ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* O MENU SUSPENSO QUE APARECE AO CLICAR */}
      {menuAberto && (
        <>
          {/* Camada invisível para fechar o menu ao clicar fora */}
          <div 
            className="fixed inset-0 z-40 bg-black/5 backdrop-blur-[1px]" 
            onClick={() => setMenuAberto(false)}
          ></div>
          
          <div className="absolute left-0 mt-4 w-72 bg-white rounded-[32px] shadow-2xl border border-gray-100 py-6 z-50 animate-in fade-in slide-in-from-top-5 duration-300">
            
            <div className="px-8 mb-6">
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-[3px] mb-1">Acessos Restritos</p>
              <div className="flex items-center gap-2 text-blue-600">
                <ShieldCheck size={14} />
                <span className="text-[11px] font-bold uppercase">{usuario.cargo}</span>
              </div>
            </div>

            <nav className="px-4 space-y-1">
              {areas.map((area, index) => (
                <Link 
                  key={index}
                  href={area.href}
                  onClick={() => setMenuAberto(false)}
                  className="flex items-center gap-4 p-4 rounded-2xl text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all font-bold text-sm group"
                >
                  <span className="bg-gray-50 p-2 rounded-lg group-hover:bg-white group-hover:shadow-sm transition-all">
                    {area.icon}
                  </span>
                  {area.label}
                </Link>
              ))}
            </nav>

            <div className="mt-6 pt-4 px-4 border-t border-gray-50">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-4 p-4 rounded-2xl text-red-500 hover:bg-red-50 transition-all font-black text-xs uppercase tracking-widest"
              >
                <div className="bg-red-100 p-2 rounded-lg">
                  <LogOut size={16} />
                </div>
                Encerrar Sessão
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}