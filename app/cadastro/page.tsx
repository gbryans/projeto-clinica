"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authSchema } from "@/lib/validations";
import { User, Mail, Phone, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(authSchema),
  });

  const onSubmit = (data: any) => console.log(data);

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-blue-600 p-6 text-white text-center">
          <h2 className="text-2xl font-bold">Criar Conta</h2>
          <p className="text-blue-100 text-sm mt-1">Sua clínica em boas mãos</p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-5">
          {/* Campo Nome */}
          <div className="space-y-1">
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400" size={18}/>
              <input {...register("nome")} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="Nome Completo" />
            </div>
            {errors.nome && <p className="text-red-500 text-xs pl-1">{errors.nome.message as string}</p>}
          </div>

          {/* Campo Email */}
          <div className="space-y-1">
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={18}/>
              <input {...register("email")} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="E-mail" />
            </div>
            {errors.email && <p className="text-red-500 text-xs pl-1">{errors.email.message as string}</p>}
          </div>

          {/* Campo Telefone */}
          <div className="space-y-1">
            <div className="relative">
              <Phone className="absolute left-3 top-3 text-gray-400" size={18}/>
              <input {...register("telefone")} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="Telefone" />
            </div>
            {errors.telefone && <p className="text-red-500 text-xs pl-1">{errors.telefone.message as string}</p>}
          </div>

          {/* Campo Senha */}
          <div className="space-y-1">
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={18}/>
              <input type="password" {...register("senha")} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="Senha (6+ dígitos e @#$)" />
            </div>
            {errors.senha && <p className="text-red-500 text-xs pl-1">{errors.senha.message as string}</p>}
          </div>

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg shadow-blue-200">
            Cadastrar Clínica <ArrowRight size={18}/>
          </button>

          <p className="text-center text-sm text-gray-500">
            Já possui acesso? <Link href="/login" className="text-blue-600 font-semibold hover:underline">Fazer Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}