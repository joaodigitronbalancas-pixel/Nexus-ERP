/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Sparkles,
  TrendingUp,
  Activity,
  Send,
  Loader2,
  FileSpreadsheet,
  AlertOctagon,
  Award,
  Clock,
  ArrowRight
} from "lucide-react";

export default function IASection() {
  const [promptInput, setPromptInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<string>(
    "Olá! Sou o Nexus Copilot, seu consultor de Inteligência Artificial integrado ao ERP nacional. Selecione um dos cenários abaixo ou digite uma solicitação personalizada de balanço, OEE ou estoque para começar."
  );

  const presets = [
    {
      title: "Analisar DRE & Margem operacional",
      prompt: "Efetue uma análise contábil profissional sobre o faturamento do DRE atual da empresa. Forneça insights de custos de produção vs despesas administrativas.",
      icon: <FileSpreadsheet size={16} />
    },
    {
      title: "Predizer Gargalo de Operações e OEE",
      prompt: "Com base nas ordens de produção do PCP e eficiência OEE média de 81%, quais estratégias preventivas e preditivas posso aplicar nas células Mazak CNC para otimizar gargalos?",
      icon: <Activity size={16} />
    },
    {
      title: "Otimização de Quota e Fluxo de Caixa",
      prompt: "Sugira medidas de ajuste de capital de giro e rateio de custos de filiais para as nossas despesas operacionais da empresa comercial e industrial.",
      icon: <TrendingUp size={16} />
    }
  ];

  const handleAskAI = async (customPrompt: string) => {
    if (!customPrompt.trim()) return;
    setLoading(true);
    setAiResponse("");

    try {
      const res = await fetch("/api/gemini/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: customPrompt }),
      });

      if (!res.ok) {
        throw new Error("Erro na rede ou chave não configurada no painel.");
      }

      const data = await res.json();
      setAiResponse(data.reply || "Resposta não gerada pelo agente.");
    } catch (err) {
      setAiResponse(
        "💡 [Análise Simulada do ERP]: Por favor, garanta que a GEMINI_API_KEY está devidamente configurada no painel superior 'Secrets'. Executando diagnóstico local: recomenda-se otimizar a escalabilidade através do controle do CPV (custo de fabricação), diminuindo em até 10% a quota de despesas tributárias através de cisão cambial planejada para o Paraná."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="ai-section" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-1.5">
            <Sparkles size={20} className="text-indigo-600 animate-pulse" />
            Nexus AI Copilot — Insights Multimodais
          </h2>
          <p className="text-xs text-slate-500 font-sans">
            Geração de diagnósticos de lucratividade, auditoria DRE e prognóstico de falhas de equipamentos CNC.
          </p>
        </div>
      </div>

      {/* Predefined widgets list */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {presets.map((pre, idx) => (
          <div
            key={idx}
            onClick={() => {
              setPromptInput(pre.prompt);
              handleAskAI(pre.prompt);
            }}
            className="p-4 bg-white border border-slate-100 hover:border-indigo-400 rounded-2xl cursor-pointer hover:shadow-xs transition duration-200 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="p-2 bg-indigo-50 text-indigo-700 w-fit rounded-lg">{pre.icon}</div>
              <h4 className="font-bold text-slate-800 text-xs">{pre.title}</h4>
            </div>
            <span className="text-[10px] text-slate-400 font-sans inline-flex items-center gap-1 pt-3 mt-2 border-t border-slate-50">
              Análise instantânea <ArrowRight size={10} />
            </span>
          </div>
        ))}
      </div>

      {/* Working Box layout */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-xs">
        <div className="p-6 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900 text-slate-100 relative min-h-48 overflow-y-auto max-h-[300px] border">
            {loading ? (
              <div className="flex flex-col items-center justify-center space-y-3 h-full pt-12">
                <Loader2 size={32} className="text-indigo-400 animate-spin" />
                <p className="text-xs text-slate-400 font-mono">Processando com LLM Gemini v3.5-patch...</p>
              </div>
            ) : (
              <div className="space-y-3 font-sans text-xs leading-relaxed whitespace-pre-wrap">
                <p className="font-bold text-indigo-400 font-sans text-sm pb-1 flex items-center gap-1.5 border-b border-white/10">
                  <Sparkles size={16} /> Relatório de Orientação Executor:
                </p>
                <div className="text-slate-200">{aiResponse}</div>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              placeholder="Digite sua dúvida de faturamento, perdas ou comissionamento..."
              className="grow p-3 px-4 text-xs border border-slate-200 bg-white rounded-xl focus:outline-hidden text-slate-800"
            />
            <button
              onClick={() => handleAskAI(promptInput)}
              className="p-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold flex items-center gap-1.5 transition text-xs cursor-pointer shadow-2xs"
            >
              <Send size={14} /> Analisar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
