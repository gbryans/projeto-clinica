"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Limpa qualquer login anterior para evitar conflitos
    localStorage.clear();

    // Lógica de Simulação de Usuários
    if (email === "admin@clinica.com" && senha === "123456@") {
      localStorage.setItem("userRole", "ADMIN");
      localStorage.setItem("userName", "Dr. Augusto (Admin)");
      localStorage.setItem("userSetor", "Direção Clínica");
      localStorage.setItem("userUnidade", "Unidade Matriz");
      router.push("/dashboard");
    } 
    else if (email === "funcionario@clinica.com" && senha === "123456@") {
      localStorage.setItem("userRole", "USER");
      localStorage.setItem("userName", "Ana Silva");
      localStorage.setItem("userSetor", "Recepção");
      localStorage.setItem("userUnidade", "Unidade Matriz");
      router.push("/dashboard");
    } 
    else {
      alert("Credenciais inválidas!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
      <div className="bg-white p-8 rounded-4xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-blue-600 italic tracking-tighter">CLÍNICA</h1>
          <p className="text-gray-400 font-bold text-sm mt-2 uppercase tracking-widest">Acesso ao Sistema</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="email" 
              required
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="E-mail corporativo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="password" 
              required
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="Sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>

          <button 
            type="submit"
            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all active:scale-95"
          >
            ENTRAR NO SISTEMA <ArrowRight size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}