"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ReCAPTCHA from "react-google-recaptcha";
import { Lock, Mail, LogIn, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  // Estados para capturar dados e validações
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [captchaOk, setCaptchaOk] = useState(false);
  const [erro, setErro] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErro(""); // Limpa erros anteriores

    // 1. Validação do reCAPTCHA
    if (!captchaOk) {
      setErro("Por favor, prove que você não é um robô.");
      return;
    }

    // 2. Simulação de Login (Mock)
    // No futuro, isso será substituído por uma chamada ao Banco de Dados
    if (email === "teste@clinica.com" && senha === "123456@") {
      // Simulamos o salvamento do cargo do usuário no navegador
      localStorage.setItem("userRole", "ADMIN");
      router.push("/dashboard");
    } else {
      setErro("E-mail ou senha incorretos. Use teste@clinica.com / 123456@");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6 bg-gray-50">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl p-8 space-y-8 border border-gray-100">

        {/* Cabeçalho */}
        <div className="text-center">
          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <LogIn className="text-green-600" size={30} />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">Bem-vindo</h2>
          <p className="text-gray-500 mt-2">Acesse o painel da sua clínica</p>
        </div>

        {/* Alerta de Erro */}
        {erro && (
          <div className="flex items-center gap-2 bg-red-50 text-red-700 p-3 rounded-xl text-sm border border-red-100 animate-pulse">
            <AlertCircle size={18} />
            <span>{erro}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Input E-mail */}
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 text-gray-400" size={18} />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-mail"
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-green-500 outline-none transition-all"
            />
          </div>

          {/* Input Senha */}
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
            <input
              type="password"
              required
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Senha"
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-green-500 outline-none transition-all"
            />
          </div>

          {/* Container do reCAPTCHA */}
          <div className="flex justify-center py-2 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <ReCAPTCHA
              sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
              onChange={(value: string | null) => setCaptchaOk(!!value)}
            />
          </div>

          {/* Botão Entrar */}
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl font-bold transition-all shadow-lg shadow-green-100 active:scale-95 disabled:opacity-50"
          >
            Entrar no Sistema
          </button>
        </form>

        {/* Footer do Card */}
        <p className="text-center text-sm text-gray-500">
          Novo por aqui?{" "}
          <Link href="/cadastro" className="text-green-600 font-bold hover:underline">
            Crie sua conta
          </Link>
        </p>
      </div>
    </div>
  );
}