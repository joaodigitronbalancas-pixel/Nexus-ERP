import React, { useState, useEffect } from "react";
import { Sparkles, TrendingUp, AlertOctagon, TrendingDown, Target, Zap, Award, BarChart3, Clock, Play, HelpCircle, Activity, LayoutGrid, CheckSquare } from "lucide-react";
import AprovacaoPremium from "../AprovacaoPremium";
import CentralAutomacoes from "../CentralAutomacoes";
import CentralOperacoes from "../CentralOperacoes";
import MarketplaceInterno from "../MarketplaceInterno";

interface DashboardExecProps {
  onAddAuditLog: (msg: string) => void;
  empresaId: string;
  activeCompany?: any;
  virtualUser?: any;
}

export default function DashboardExecutivoIA({ onAddAuditLog, empresaId, activeCompany, virtualUser }: DashboardExecProps) {
  const [realtimeActive, setRealtimeActive] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState<"overview" | "workflows" | "automations" | "telemetry" | "apps">("overview");
  
  // Simulated changing variables for live widgets
  const [cashProjection, setCashProjection] = useState(12); // days until negative (will change on interval if realtime is on)
  const [productionDrop, setProductionDrop] = useState(8); // % drop
  const [alerts, setAlerts] = useState([
    { id: 1, text: "Fluxo de caixa ficará negativo em 12 dias se mantiver despesas comerciais", type: "critical", date: "Hoje" },
    { id: 2, text: "RH possui 2 férias vencidas pendentes de despacho", type: "warning", date: "Hoje" },
    { id: 3, text: "Produção Mazak CNC caiu 8% devido a atraso no setup do lote de hoje", type: "warning", date: "Hoje" },
    { id: 4, text: "Comercial / CRM abaixo da meta de conversão trimestral em 4.5%", type: "info", date: "Ontem" },
    { id: 5, text: "Cliente 'Alfa Distribuidora' com alto risco de inadimplência faturas", type: "critical", date: "Ontem" }
  ]);

  const [aiReport, setAiReport] = useState<string>("");
  const [generatingAi, setGeneratingAi] = useState(false);

  // Trigger web view notifications with sounds!
  const [toasts, setToasts] = useState<Array<{ id: string; title: string; category: string }>>([]);

  const emitLiveAlert = (title: string, category: string) => {
    const toastId = `tst_${Date.now()}_${Math.random()}`;
    setToasts((prev) => [{ id: toastId, title, category }, ...prev]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== toastId));
    }, 4500);
  };

  useEffect(() => {
    if (!realtimeActive) return;

    const interval = setInterval(() => {
      // Simulate cash fluctuation
      setCashProjection((prev) => {
        const coin = Math.random() > 0.6;
        if (coin) {
          const next = prev + (Math.random() > 0.5 ? 1 : -1);
          return Math.max(5, Math.min(25, next));
        }
        return prev;
      });

      // Simulate OEE setup efficiency drop
      setProductionDrop((prev) => {
        const change = (Math.random() - 0.5) * 2;
        return parseFloat(Math.max(2, Math.min(18, prev + change)).toFixed(1));
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [realtimeActive]);

  const generateAIEstimate = async () => {
    setGeneratingAi(true);
    setAiReport("");
    onAddAuditLog("Solicitada recomendação analítica executiva de IA para o consórcio administrativo");

    try {
      const res = await fetch("/api/gemini/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Gere um boletim de recomendação executiva para os seguintes riscos identificados: Fluxo de caixa negativo estimado em ${cashProjection} dias, Queda na eficiência Mazak CNC de ${productionDrop}%, Risco de inadimplência Alfa Distribuidora. Assente como consultor corporativo sênior nacional sugerindo prazos tributários de rateio.`
        })
      });

      if (res.ok) {
        const data = await res.json();
        setAiReport(data.reply);
      } else {
        throw new Error();
      }
    } catch {
      // High-quality local generative fallback report
      setAiReport(
        `💡 [RECOMENDAÇÃO OPERACIONAL NEXUS IA] — Emitido em ${new Date().toLocaleDateString("pt-BR")}:\n\n` +
        `1. RISCO FINANCEIRO NOVO DRE:\n` +
        `• O fluxo de caixa está projetado para limite de sustentação em ${cashProjection} dias. Ação recomendada: Executar corte preventivo de 12% em marketing e suspender o repasse tributário retroativo do ICMS Paraná das filiais pelo prazo de 10 dias úteis para recomposição rápida.\n\n` +
        `2. OTMIZAÇÃO INDUSTRIAL CNC (SLA PCP):\n` +
        `• O setup de CNC Mazak gerou o desvio de faturamento de ${productionDrop}%. Medida imediata: Redefinir a escala de operadores no turno da tarde para manutenção preditiva em paralelo ao processamento.\n\n` +
        `3. TRATATIVA COMERCIAL COM ALFA DISTRIBUIDORA:\n` +
        `• Notificado risco do endividamento passivo. Bloqueie as novas remessas comerciais sob consignação até quitação de boletos emitidos há mais de 30 dias.`
      );
    } finally {
      setGeneratingAi(false);
    }
  };

  return (
    <div id="executive-ai-dashboard" className="p-0.5 space-y-6 text-slate-900 font-sans">
      
      {/* Toast Overlay Notifications */}
      <div className="fixed top-20 right-6 z-50 pointer-events-none space-y-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="p-4 bg-slate-950/95 backdrop-blur-md border border-indigo-500/30 rounded-2xl shadow-2xl flex items-start gap-3 pointer-events-auto animate-slide-in w-80 text-white"
          >
            <div className="p-1.5 bg-indigo-505 bg-indigo-500/10 border border-indigo-400/20 text-indigo-400 rounded-lg">
              <Zap size={15} className="animate-pulse" />
            </div>
            <div className="flex-1 space-y-0.5">
              <span className="text-[9px] font-mono uppercase tracking-widest text-[#a78bfa] block font-extrabold">{t.category}</span>
              <p className="text-[11px] font-medium leading-relaxed font-sans">{t.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Futuristic Banner with Glow Elements */}
      <div className="p-6 bg-gradient-to-r from-slate-950 to-indigo-950/90 rounded-3xl border border-slate-800 relative z-10 overflow-hidden text-white flex flex-col md:flex-row md:items-center md:justify-between gap-6 shadow-xl">
        <div className="absolute top-0 right-0 h-40 w-40 bg-purple-500/10 blur-[90px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-10 h-32 w-32 bg-indigo-505 bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none" />

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="p-1 px-2.5 bg-purple-500/20 border border-purple-400/30 text-purple-300 font-mono text-[9px] rounded-full font-black animate-pulse uppercase tracking-widest">
              Nexus AI Control Tower
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight font-sans">
            Painel Executivo Avançado Inteligente
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed font-sans max-w-2xl">
            Console geral de faturamento, duplicatas, PCP, segurança e workflows operacionais com IA.
          </p>
        </div>

        {/* Realtime Stream Switcher */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setRealtimeActive(!realtimeActive)}
            className={`p-2 px-4 rounded-xl font-black text-xs transition duration-200 cursor-pointer flex items-center gap-2 border-2 ${
              realtimeActive
                ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400/90 hover:bg-emerald-500/20"
                : "bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700"
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${realtimeActive ? "bg-emerald-400 animate-ping" : "bg-slate-700"}`} />
            {realtimeActive ? "Streaming: Ligado" : "Streaming: Desligado"}
          </button>
        </div>
      </div>

      {/* Exec navigation level tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200/60 pb-1.5 text-xs font-bold text-slate-500">
        <button
          onClick={() => setActiveSubTab("overview")}
          className={`p-2 px-4 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === "overview" ? "bg-slate-900 text-white shadow-xs" : "hover:bg-slate-100"
          }`}
        >
          <BarChart3 size={14} /> Vista Geral Executiva
        </button>
        
        <button
          onClick={() => setActiveSubTab("workflows")}
          className={`p-2 px-4 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === "workflows" ? "bg-slate-900 text-white shadow-xs" : "hover:bg-slate-100"
          }`}
        >
          <CheckSquare size={14} /> Fluxo Multínivel de Despachos
        </button>

        <button
          onClick={() => setActiveSubTab("automations")}
          className={`p-2 px-4 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === "automations" ? "bg-slate-900 text-white shadow-xs" : "hover:bg-slate-100"
          }`}
        >
          <Zap size={14} /> Central de Automações
        </button>

        <button
          onClick={() => setActiveSubTab("telemetry")}
          className={`p-2 px-4 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === "telemetry" ? "bg-slate-900 text-white shadow-xs" : "hover:bg-slate-100"
          }`}
        >
          <Activity size={14} /> Telemetria de Sistemas Sandbox
        </button>

        <button
          onClick={() => setActiveSubTab("apps")}
          className={`p-2 px-4 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === "apps" ? "bg-slate-900 text-white shadow-xs" : "hover:bg-slate-100"
          }`}
        >
          <LayoutGrid size={14} /> Marketplace de Conectores
        </button>
      </div>

      {/* Sub tabs execution areas */}
      {activeSubTab === "overview" && (
        <div className="space-y-6">
          
          {/* Executive KPI Stats Indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="p-4 bg-white border border-slate-200/80 rounded-2xl flex items-center justify-between shadow-xs hover:border-slate-300 transition duration-200">
              <div className="space-y-1">
                <span className="text-[10px] text-zinc-400 font-mono font-bold uppercase tracking-wider block">Fluxo de Caixa Limite</span>
                <p className={`text-xl font-bold ${cashProjection < 15 ? "text-rose-600 animate-pulse" : "text-amber-500"}`}>
                  {cashProjection} Dias Restantes
                </p>
                <span className="text-[9px] text-slate-500 font-sans block flex items-center gap-1">
                  <TrendingDown size={11} className="text-rose-500" /> Baixa liquidez simulada
                </span>
              </div>
              <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
                <AlertOctagon size={18} />
              </div>
            </div>

            <div className="p-4 bg-white border border-slate-200/80 rounded-2xl flex items-center justify-between shadow-xs hover:border-slate-300 transition duration-200">
              <div className="space-y-1">
                <span className="text-[10px] text-zinc-400 font-mono font-bold uppercase tracking-wider block">Eficiência OEE PCP CNC</span>
                <p className="text-xl font-bold text-slate-800">
                  {81.2}% (Setup de Lote)
                </p>
                <span className="text-[9px] text-slate-500 font-sans block flex items-center gap-1">
                  <TrendingDown size={11} className="text-rose-500" /> Perda de {productionDrop}% de tempo
                </span>
              </div>
              <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                <TrendingDown size={18} />
              </div>
            </div>

            <div className="p-4 bg-white border border-slate-200/80 rounded-2xl flex items-center justify-between shadow-xs hover:border-slate-300 transition duration-200">
              <div className="space-y-1">
                <span className="text-[10px] text-zinc-400 font-mono font-bold uppercase tracking-wider block">Previsão DRE Ebitda</span>
                <p className="text-xl font-bold text-emerald-600">
                  + 24.8% Projetado
                </p>
                <span className="text-[9px] text-emerald-600 font-sans block flex items-center gap-1">
                  <TrendingUp size={11} /> Margem saudável
                </span>
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <TrendingUp size={18} />
              </div>
            </div>

            <div className="p-4 bg-white border border-slate-200/80 rounded-2xl flex items-center justify-between shadow-xs hover:border-slate-300 transition duration-200">
              <div className="space-y-1">
                <span className="text-[10px] text-zinc-400 font-mono font-bold uppercase tracking-wider block">Conectores Operantes</span>
                <p className="text-xl font-bold text-indigo-600">
                  4 Integrados
                </p>
                <span className="text-[9px] text-slate-500 font-sans block flex items-center gap-1">
                  Todos em conformidade LGPD
                </span>
              </div>
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                <Award size={18} />
              </div>
            </div>

          </div>

          {/* AI Alert Center & Strategic generative insights recommendations */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Live Alerts list (Left panel) */}
            <div className="lg:col-span-5 bg-white border border-slate-150 rounded-3xl p-5 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <AlertOctagon size={16} className="text-rose-500 animate-pulse" />
                  Alertas Críticos & Desvios ({alerts.length})
                </h3>
                <span className="text-[9px] bg-slate-100 p-0.5 px-2 rounded-full font-mono text-slate-500">Live Feed</span>
              </div>

              <div className="space-y-2 h-[290px] overflow-y-auto pr-1">
                {alerts.map((al) => (
                  <div
                    key={al.id}
                    className={`p-3 border rounded-xl flex items-start gap-2.5 transition text-xs leading-relaxed ${
                      al.type === "critical"
                        ? "bg-rose-50/60 border-rose-100/80 text-rose-900"
                        : al.type === "warning"
                        ? "bg-amber-50/60 border-amber-100/80 text-amber-900"
                        : "bg-blue-50/60 border-blue-100/80 text-blue-900"
                    }`}
                  >
                    <span className="text-base shrink-0 mt-0.5">
                      {al.type === "critical" ? "🔴" : al.type === "warning" ? "🟡" : "🔵"}
                    </span>
                    <div className="flex-1 space-y-0.5">
                      <p className="font-sans text-[11px] font-semibold">{al.text}</p>
                      <span className="text-[9px] text-slate-400 block font-mono">Disparou: {al.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Advisor console (Right panel) */}
            <div className="lg:col-span-7 bg-slate-950 text-white rounded-3xl p-5 space-y-4 shadow-md border border-slate-800 flex flex-col justify-between min-h-[350px]">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-white text-sm flex items-center gap-1.5">
                    <Sparkles size={16} className="text-indigo-400 animate-pulse" />
                    Nexus AI Advisor — Diagnóstico Corporativo
                  </h3>
                  <span className="text-[9px] bg-indigo-505 bg-indigo-500/10 text-indigo-300 p-0.5 px-2 border border-indigo-400/20 rounded-full font-mono font-bold">
                    Gemini Enterprise
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-normal font-sans">
                  Processamento preditivo cruzando desvios industriais de PCP com capacidade de capital de giro estimando reservas cambiais.
                </p>
              </div>

              {/* Response render area */}
              <div className="flex-1 p-4 bg-slate-900/60 border border-slate-850 rounded-2xl overflow-y-auto max-h-[180px] text-[11px] font-mono leading-relaxed whitespace-pre-wrap text-slate-200">
                {generatingAi ? (
                  <div className="flex flex-col items-center justify-center space-y-2 py-8">
                    <Activity size={24} className="text-indigo-400 animate-spin" />
                    <span className="text-[10px] text-zinc-400">Varrendo matrizes fiscais e OEE...</span>
                  </div>
                ) : aiReport ? (
                  aiReport
                ) : (
                  <div className="text-slate-500 italic text-center py-8">
                     Recomendação diagnóstica do consórcio de IA vazia. Clique abaixo para rodar auditoria analítica inteligente.
                  </div>
                )}
              </div>

              {/* Core trigger button */}
              <button
                onClick={generateAIEstimate}
                disabled={generatingAi}
                className="w-full p-2.5 bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 hover:from-indigo-500 hover:to-pink-400 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-45 shadow-lg shadow-indigo-600/20"
              >
                <Sparkles size={13} className="animate-spin" /> Rodar Diagnóstico Executivo Geral
              </button>

            </div>

          </div>

        </div>
      )}

      {activeSubTab === "workflows" && (
        <AprovacaoPremium onAddAuditLog={onAddAuditLog} onEmitAlert={emitLiveAlert} />
      )}

      {activeSubTab === "automations" && (
        <CentralAutomacoes onAddAuditLog={onAddAuditLog} onEmitAlert={emitLiveAlert} />
      )}

      {activeSubTab === "telemetry" && (
        <CentralOperacoes realtimeActive={realtimeActive} />
      )}

      {activeSubTab === "apps" && (
        <MarketplaceInterno onAddAuditLog={onAddAuditLog} onEmitAlert={emitLiveAlert} />
      )}

    </div>
  );
}
