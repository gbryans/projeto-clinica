"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { 
  LayoutDashboard, UserCircle, Users, Calendar, 
  ClipboardList, DollarSign, Settings, LogOut, ChevronDown 
} from "lucide-react";
import Link from "next/link";

export default function SidebarMenu() {
  const [usuario, setUsuario] = useState<any>(null);
  const [menuAberto, setMenuAberto] = useState(false);

  useEffect(() => {
    async function obterPerfil() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('perfis')
          .select('nome, cargo, nivel_acesso')
          .eq('email', user.email)
          .single();
        setUsuario(data);
      }
    }
    obterPerfil();
  }, []);

  // DEFINIÇÃO DE PERMISSÕES POR ÁREA
  const areas = [
    { 
      label: "Painel Geral", 
      href: "/dashboard", 
      icon: <LayoutDashboard size={18}/>, 
      permitido: ["Admin", "Médico", "Recepcionista"] 
    },
    { 
      label: "Agenda", 
      href: "/dashboard/agenda", 
      icon: <Calendar size={18}/>, 
      permitido: ["Admin", "Médico", "Recepcionista"] 
    },
    { 
      label: "Atendimento", 
      href: "/dashboard/pacientes/atendimento", 
      icon: <ClipboardList size={18}/>, 
      permitido: ["Admin", "Médico"] 
    },
    { 
      label: "Gestão de Equipe", 
      href: "/dashboard/funcionarios/lista", 
      icon: <Users size={18}/>, 
      permitido: ["Admin"] 
    },
    { 
      label: "Financeiro", 
      href: "/dashboard/financeiro", 
      icon: <DollarSign size={18}/>, 
      permitido: ["Admin"] 
    },
  ];

  if (!usuario) return null;

  return (
    <div className="relative inline-block text-left font-sans">
      {/* BOTÃO DO MENU SUSPENSO */}
      <button 
        onClick={() => setMenuAberto(!menuAberto)}
        className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-gray-100 shadow-sm hover:bg-gray-50 transition-all"
      >
        <div className="bg-indigo-600 p-2 rounded-xl text-white">
          <UserCircle size={20} />
        </div>
        <div className="text-left hidden md:block">
          <p className="text-xs font-black text-gray-900 uppercase tracking-tighter">{usuario.nome}</p>
          <p className="text-[9px] font-bold text-indigo-500 uppercase">{usuario.cargo}</p>
        </div>
        <ChevronDown size={16} className={`text-gray-400 transition-transform ${menuAberto ? 'rotate-180' : ''}`} />
      </button>

      {/* MENU DROP-DOWN */}
      {menuAberto && (
        <div className="absolute right-0 mt-3 w-64 bg-white rounded-3xl shadow-2xl border border-gray-100 py-3 z-50 animate-in fade-in zoom-in-95 duration-200">
          <div className="px-5 py-2 mb-2 border-b border-gray-50">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Acessos Disponíveis</p>
          </div>

          <div className="space-y-1 px-2">
            {areas.map((area, index) => {
              // SÓ MOSTRA SE O NIVEL DO USUARIO ESTIVER NA LISTA DE PERMITIDOS
              if (area.permitido.includes(usuario.nivel_acesso) || area.permitido.includes(usuario.cargo)) {
                return (
                  <Link 
                    key={index}
                    href={area.href}
                    onClick={() => setMenuAberto(false)}
                    className="flex items-center gap-3 p-3 rounded-xl text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors font-bold text-sm"
                  >
                    {area.icon}
                    {area.label}
                  </Link>
                );
              }
              return null;
            })}
          </div>

          <div className="mt-3 pt-3 border-t border-gray-50 px-2">
            <button 
              onClick={() => supabase.auth.signOut()}
              className="w-full flex items-center gap-3 p-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors font-bold text-sm"
            >
              <LogOut size={18} />
              Sair do Sistema
            </button>
          </div>
        </div>
      )}
    </div>
  );
}