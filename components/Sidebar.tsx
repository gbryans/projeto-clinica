"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { 
  LayoutDashboard, Calendar, ClipboardList, 
  DollarSign, LogOut, ChevronDown, History, 
  Users, Stethoscope, ShieldCheck 
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SidebarMenu() {
  const router = useRouter();
  const [menuAberto, setMenuAberto] = useState(false);

  // Áreas do sistema. 
  // Nota: No futuro, podemos filtrar este array baseando-se em props de permissão.
  const areas = [
    { label: "Painel Geral", href: "/dashboard", icon: <LayoutDashboard size={18}/> },
    { label: "Agenda Médica", href: "/dashboard/agenda", icon: <Calendar size={18}/> },
    { label: "Novo Atendimento", href: "/dashboard/pacientes/atendimento", icon: <ClipboardList size={18}/> },
    { label: "Histórico Clínico", href: "/dashboard/pacientes/historico", icon: <History size={18}/> },
    { label: "Gestão de Equipe", href: "/dashboard/funcionarios/lista", icon: <Users size={18}/> },
    { label: "Financeiro", href: "/dashboard/financeiro", icon: <DollarSign size={18}/> },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="relative inline-block text-left font-sans">
      
      {/* BOTÃO DO MENU (ESTETOSCÓPIO) */}
      <button 
        onClick={() => setMenuAberto(!menuAberto)}
        className="flex items-center gap-3 bg-white p-2.5 rounded-2xl border border-gray-200 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all active:scale-95 z-50 relative"
      >
        <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-100">
          <Stethoscope size={22} />
        </div>
        
        <div className="text-left pr-1 hidden sm:block">
          <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest leading-none mb-1">
            Menu de
          </p>
          <p className="text-sm font-black text-gray-900 uppercase tracking-tighter">
            Acessos
          </p>
        </div>
        
        <ChevronDown 
          size={16} 
          className={`text-gray-400 transition-transform duration-300 ${menuAberto ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* DROPDOWN DE OPÇÕES */}
      {menuAberto && (
        <>
          {/* Overlay invisível para fechar ao clicar fora */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setMenuAberto(false)}
          ></div>
          
          <div className="absolute left-0 mt-3 w-64 bg-white rounded-[24px] shadow-2xl border border-gray-100 py-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            
            <div className="px-6 py-2 mb-2 border-b border-gray-50">
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <ShieldCheck size={12} /> Áreas Disponíveis
              </p>
            </div>

            <nav className="px-3 space-y-0.5">
              {areas.map((area, index) => (
                <Link 
                  key={index}
                  href={area.href}
                  onClick={() => setMenuAberto(false)}
                  className="flex items-center gap-3 p-3 rounded-xl text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all font-bold text-sm group"
                >
                  <span className="text-gray-400 group-hover:text-indigo-600 transition-colors">
                    {area.icon}
                  </span>
                  {area.label}
                </Link>
              ))}
            </nav>

            <div className="mt-4 pt-3 px-3 border-t border-gray-50">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 p-3 rounded-xl text-red-500 hover:bg-red-50 transition-all font-bold text-sm"
              >
                <LogOut size={18} />
                Sair do Sistema
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}