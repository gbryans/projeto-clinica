"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { 
  History, ArrowLeft, Calendar, User, Stethoscope, 
  Pill, Loader2, ChevronRight, Edit3, Save, Printer, FileText 
} from "lucide-react";
import Link from "next/link";
import { jsPDF } from "jspdf"; // Importação da biblioteca

export default function HistoricoClinicoPage() {
  // ... (mantenha os estados anteriores de busca e historico)
  const [busca, setBusca] = useState("");
  const [pacientesEncontrados, setPacientesEncontrados] = useState<any[]>([]);
  const [historico, setHistorico] = useState<any[]>([]);
  const [pacienteSelecionado, setPacienteSelecionado] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // --- FUNÇÃO PARA GERAR O PDF ---
  const gerarPDF = (atendimento: any) => {
    const doc = new jsPDF();
    const dataFormatada = new Date(atendimento.data_atendimento).toLocaleDateString('pt-BR');

    // 1. Cabeçalho da Clínica
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(30, 64, 175); // Azul Indigo
    doc.text("MINHA CLÍNICA MÉDICA", 105, 20, { align: "center" });
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.setFont("helvetica", "normal");
    doc.text("Rua da Saúde, 123 - Centro | Contato: (11) 99999-9999", 105, 28, { align: "center" });
    doc.line(20, 35, 190, 35); // Linha divisória

    // 2. Título do Documento
    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.setFont("helvetica", "bold");
    doc.text("RECEITUÁRIO MÉDICO", 105, 50, { align: "center" });

    // 3. Dados do Paciente
    doc.setFontSize(12);
    doc.text(`PACIENTE: ${pacienteSelecionado.nome.toUpperCase()}`, 20, 65);
    doc.setFont("helvetica", "normal");
    doc.text(`DATA: ${dataFormatada}`, 190, 65, { align: "right" });

    // 4. Conteúdo da Prescrição
    doc.setFont("helvetica", "bold");
    doc.text("PRESCRIÇÃO:", 20, 80);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    // Quebra o texto automaticamente para não sair da folha
    const splitText = doc.splitTextToSize(atendimento.prescricao, 170);
    doc.text(splitText, 20, 90);

    // 5. Rodapé / Assinatura
    const pageHeight = doc.internal.pageSize.height;
    doc.line(60, pageHeight - 40, 150, pageHeight - 40); // Linha de assinatura
    doc.setFontSize(10);
    doc.text(atendimento.medico_nome, 105, pageHeight - 35, { align: "center" });
    doc.text("Médico Responsável", 105, pageHeight - 30, { align: "center" });

    // 6. Abrir ou baixar
    doc.save(`receita_${pacienteSelecionado.nome}_${dataFormatada}.pdf`);
  };

  // ... (mantenha as funções pesquisarPaciente e carregarHistorico iguais)

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto bg-gray-50 min-h-screen">
      {/* ... Header e Busca ... */}

      {pacienteSelecionado && (
        <div className="space-y-6">
          {/* Título com Nome do Paciente */}
          <div className="bg-blue-600 p-8 rounded-[40px] text-white shadow-xl flex justify-between items-center">
             <h2 className="text-3xl font-black uppercase">{pacienteSelecionado.nome}</h2>
             <Printer size={40} className="opacity-20" />
          </div>

          <div className="space-y-8">
            {historico.map((atendimento) => (
              <div key={atendimento.id} className="bg-white p-8 rounded-[35px] border border-gray-100 shadow-lg relative">
                
                <div className="flex justify-between items-start mb-6 border-b pb-4">
                  <div>
                    <span className="bg-blue-50 px-3 py-1 rounded-lg text-blue-700 font-black text-xs uppercase">
                      Atendimento em {new Date(atendimento.data_atendimento).toLocaleDateString()}
                    </span>
                    <p className="text-[10px] text-gray-400 font-bold mt-2 uppercase">Médico: {atendimento.medico_nome}</p>
                  </div>

                  {/* BOTÕES DE AÇÃO */}
                  <div className="flex gap-2">
                    <button 
                      onClick={() => gerarPDF(atendimento)}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2.5 rounded-2xl text-[11px] font-black flex items-center gap-2 transition-all"
                    >
                      <Printer size={14} /> IMPRIMIR RECEITA
                    </button>
                    
                    <button 
                      onClick={() => {/* Lógica de Editar */}} 
                      className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-2xl text-[11px] font-black flex items-center gap-2 shadow-lg"
                    >
                      <Edit3 size={14} /> EDITAR
                    </button>
                  </div>
                </div>

                {/* Conteúdo resumido no histórico */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-[10px] font-black text-gray-400 uppercase mb-2">Diagnóstico</h4>
                    <p className="text-sm font-bold italic text-gray-800">{atendimento.diagnostico}</p>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black text-red-400 uppercase mb-2">Prescrição</h4>
                    <p className="text-sm font-medium text-red-700 truncate">{atendimento.prescricao}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}