"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { 
  Users, 
  Trash2, 
  ArrowLeft, 
  Plus, 
  Mail, 
  ShieldCheck, 
  Building2,
  RefreshCw,
  Search
} from "lucide-react";
import Link from "next/link";

export default function ListaFuncionariosPage() {
  const [funcionarios, setFuncionarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");

  // Função para buscar funcionários do Supabase
  const carregarFuncionarios = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('perfis')
      .select('*')
      .order('nome', { ascending: true });

    if (error) {
      alert("Erro ao carregar lista: " + error.message);
    } else {
      setFuncionarios(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    carregarFuncionarios();
  }, []);

  // Função para deletar um funcionário
  const deletarFuncionario = async (id: string, nome: string) => {
    if (confirm(`Tem certeza que deseja remover o acesso de ${nome}?`)) {
      const { error } = await supabase
        .from('perfis')
        .delete()
        .eq('id', id);

      if (error) {
        alert("Erro ao excluir!");
      } else {
        carregarFuncionarios(); // Recarrega a lista após excluir
      }
    }
  };

  // Filtro de busca simples
  const funcionariosFiltrados = funcionarios.filter(f => 
    f.nome.toLowerCase().includes(busca.toLowerCase()) || 
    f.email.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto bg-gray-50 min-h-screen font-sans">
      
      {/* Cabeçalho */}
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link href="/dashboard" className="flex items-center gap-2 text-blue-600 font-semibold mb-2 hover:underline">
            <ArrowLeft size={18} /> Voltar ao Painel
          </Link>
          <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3 tracking-tighter">
            <Users className="text-blue-600" size={32} /> Gestão de Acessos
          </h1>
          <p className="text-gray-500 font-medium">Controle quem pode entrar no sistema da clínica.</p>
        </div>

        <Link 
          href="/dashboard/funcionarios" 
          className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all active:scale-95 text-sm"
        >
          <Plus size={20} /> Novo Funcionário
        </Link>
      </header>

      {/* Barra de Busca */}
      <div className="mb-6 relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input 
          type="text" 
          placeholder="Buscar por nome ou e-mail..."
          className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
          <RefreshCw size={40} className="animate-spin mb-4 text-blue-600" />
          <p className="font-bold">Sincronizando com o banco de dados...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {funcionariosFiltrados.map((func) => (
            <div key={func.id} className="bg-white p-6 rounded-4xl border border-gray-100 shadow-sm hover:shadow-md transition-all relative group">
              
              {/* Badge de Nível de Acesso */}
              <div className={`absolute top-6 right-6 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                func.cargo === 'ADMIN' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
              }`}>
                {func.cargo}
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 font-black text-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  {func.nome.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 leading-tight">{func.nome}</h3>
                  <p className="text-xs text-gray-400 font-medium flex items-center gap-1 mt-1">
                    <Mail size={12} /> {func.email}
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-gray-50">
                <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                  <ShieldCheck size={16} className="text-blue-500" />
                  Setor: <span className="text-gray-800 font-bold">{func.setor}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                  <Building2 size={16} className="text-blue-500" />
                  Unidade: <span className="text-gray-800 font-bold">{func.unidade}</span>
                </div>
              </div>

              {/* Botão de Deletar (Escondido, aparece no hover) */}
              <button 
                onClick={() => deletarFuncionario(func.id, func.nome)}
                className="mt-6 w-full py-3 bg-red-50 text-red-500 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={18} /> Remover Acesso
              </button>
            </div>
          ))}
        </div>
      )}

      {!loading && funcionariosFiltrados.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-400 font-bold">Nenhum funcionário encontrado.</p>
        </div>
      )}
    </div>
  );
}