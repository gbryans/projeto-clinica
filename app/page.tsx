"use client";

import Link from "next/link";
import { ArrowRight, Activity } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 font-sans">
      {/* Círculo Decorativo de Fundo */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-blue-50/50 blur-3xl rounded-full -z-10" />

      <main className="text-center max-w-2xl">
        <div className="flex justify-center mb-6">
          <div className="bg-blue-600 p-4 rounded-3xl text-white shadow-2xl shadow-blue-200">
            <Activity size={40} />
          </div>
        </div>

        <h1 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tighter mb-6">
          Gestão Médica <span className="text-blue-600">Inteligente.</span>
        </h1>

        <p className="text-lg text-gray-500 mb-10 leading-relaxed">
          Otimize o atendimento da sua clínica com prontuários digitais, 
          agendas em tempo real e suporte técnico integrado.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/login" 
            className="px-10 py-4 bg-gray-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-all shadow-xl active:scale-95"
          >
            Acessar Sistema <ArrowRight size={20} />
          </Link>
          
          <Link 
            href="/dashboard/suporte" 
            className="px-10 py-4 bg-white text-gray-600 border border-gray-200 rounded-2xl font-bold hover:bg-gray-50 transition-all"
          >
            Suporte Externo
          </Link>
        </div>
      </main>

      <footer className="mt-20 text-sm text-gray-400 font-medium">
        © 2026 Clínica Viva — Todos os direitos reservados.
      </footer>
    </div>
  );
}