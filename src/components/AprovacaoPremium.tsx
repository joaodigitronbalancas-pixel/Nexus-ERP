import React, { useState } from "react";
import { Check, X, Shield, ArrowRight, UserCheck, Play, Layers, MessageSquare, AlertCircle } from "lucide-react";

interface ApprovalProps {
  onAddAuditLog: (msg: string) => void;
  onEmitAlert: (title: string, category: string) => void;
}

export default function AprovacaoPremium({ onAddAuditLog, onEmitAlert }: ApprovalProps) {
  const [currentStep, setCurrentStep] = useState(0); // 0: Solicitado, 1: Gerente, 2: Diretor, 3: Financeiro, 4: Concluído
  const [approvalType, setApprovalType] = useState("Aduana / Logística de Insumos CNC");
  const [comments, setComments] = useState<string[]>([]);
  const [inputText, setInputText] = useState("");

  const steps = [
    { title: "Solicitado", role: "DP Antônio", color: "text-slate-400 bg-slate-900 border-slate-700" },
    { title: "Gerente", role: "R.H. Márcia", color: "text-indigo-400 bg-indigo-950/40 border-indigo-800/60" },
    { title: "Diretor", role: "Diretoria Carlos", color: "text-purple-400 bg-purple-950/40 border-purple-800/60" },
    { title: "Financeiro", role: "Fin. Bruno", color: "text-amber-400 bg-amber-950/40 border-amber-800/60" },
    { title: "Aprovado", role: "SaaS Gateway", color: "text-emerald-400 bg-emerald-950/40 border-emerald-800/60" }
  ];

  const handleNextStep = (isApproved: boolean) => {
    if (isApproved) {
      if (currentStep < 4) {
        const next = currentStep + 1;
        setCurrentStep(next);
        const actionStr = `[Duplo Deferimento] Etapa de Aprovação do Fluxo '${approvalType}' avançou para: ${steps[next].title} (${steps[next].role})`;
        onAddAuditLog(actionStr);
        onEmitAlert(actionStr, "🟢 Operacional");
        
        if (next === 4) {
          onEmitAlert(`🎉 Lote de faturamento '${approvalType}' foi 100% aprovado pelo Conselho Multitenant!`, "🟢 Operacional");
        }
      }
    } else {
      setCurrentStep(0);
      onAddAuditLog(`[Dupla Recusa] Fluxo de liberação '${approvalType}' rejeitado de volta para o início.`);
      onEmitAlert(`🔴 Crítico: Pedido administrativo para '${approvalType}' foi REJEITADO de volta ao rascunho por violação de regras de faturamento`, "🔴 Crítico");
    }
  };

  const handleAddComment = () => {
    if (!inputText.trim()) return;
    setComments([...comments, `${steps[currentStep]?.role || "Visitante"}: ${inputText}`]);
    setInputText("");
    onAddAuditLog(`Comentário anexado no despacho eletrônico: ${inputText}`);
  };

  return (
    <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/90 rounded-3xl p-6 text-white space-y-6 relative overflow-hidden" id="aprovacao-premium-widget">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[9px] bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-mono px-2.5 py-1 rounded-full uppercase font-black tracking-wider">
            Conselho SaaS Audit Flow
          </span>
          <h3 className="text-lg font-black mt-1">Timeline de Despacho & Assinatura Multi-Nível</h3>
          <p className="text-xs text-slate-400">Arranjo de consentimento de liberação de contas e verba de filiais.</p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={approvalType}
            onChange={(e) => {
              setApprovalType(e.target.value);
              setCurrentStep(0);
            }}
            className="p-1 px-3 bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-xl"
          >
            <option value="Aduana / Logística de Insumos CNC">Aduana / Logística de CNC</option>
            <option value="Provisão Adicional Saúde Colaboradores">Adicional Plano de Saúde RH</option>
            <option value="Faturamento Contrato Grande Concessionário">Faturamento Concessionário</option>
          </select>
        </div>
      </div>

      {/* Visual Timeline Nodes with interactive progress indicator */}
      <div className="relative py-4">
        <div className="absolute top-[37px] left-8 right-8 h-1 bg-slate-800 rounded-full" />
        {/* Animated Progress Line */}
        <div
          className="absolute top-[37px] left-8 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 rounded-full transition-all duration-500"
          style={{ width: `${(currentStep / 4) * 85}%` }}
        />

        <div className="relative z-10 grid grid-cols-5 gap-2 text-center">
          {steps.map((st, idx) => {
            const isCompleted = idx < currentStep;
            const isActive = idx === currentStep;
            return (
              <div key={idx} className="flex flex-col items-center space-y-2 group">
                {/* Node circle */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    isCompleted
                      ? "bg-emerald-500 border-emerald-400 text-slate-950 shadow-[0_0_10px_rgba(16,185,129,0.4)]"
                      : isActive
                      ? "bg-indigo-600 border-indigo-400 text-white animate-pulse shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                      : "bg-slate-950 border-slate-800 text-slate-500"
                  }`}
                >
                  {isCompleted ? <Check size={18} className="stroke-[3]" /> : <span className="text-xs font-mono font-bold">{idx + 1}</span>}
                </div>
                
                <div className="space-y-0.5">
                  <p className={`text-[11px] font-black ${isActive ? "text-indigo-300" : isCompleted ? "text-slate-300" : "text-slate-500"}`}>
                    {st.title}
                  </p>
                  <span className="text-[8px] font-mono text-slate-500 block truncate max-w-[65px]">{st.role}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Control Actions / Comments Log */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-800/40 bg-slate-950/20 p-4 rounded-2xl">
        <div className="space-y-3">
          <p className="text-xs font-mono text-zinc-400 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            Petição: <strong className="text-white font-sans">{approvalType}</strong>
          </p>

          <div className="p-3 bg-slate-950 border border-slate-850 rounded-xl space-y-1.5 text-xs text-slate-300 font-sans">
            <p className="font-bold flex items-center gap-1.5 text-slate-200">
              <Shield size={13} className="text-indigo-400" /> 
              Status de Consentimento de Consórcio:
            </p>
            {currentStep < 4 ? (
              <p>Etapa ativa aguardando parecer digital de: <strong className="text-indigo-400 font-mono font-bold">{steps[currentStep].role}</strong></p>
            ) : (
              <p className="text-emerald-400 font-bold flex items-center gap-1 font-sans">🎉 Fluxo finalizado e chaves ICP-Brasil lavradas no cartório digital!</p>
            )}
          </div>

          <div className="flex gap-2">
            <button
              disabled={currentStep >= 4}
              onClick={() => handleNextStep(true)}
              className="flex-1 p-2.5 px-4 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 disabled:opacity-40 text-slate-950 font-black text-xs rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <Check size={14} className="stroke-[3]" /> Deferir Parecer
            </button>
            <button
              disabled={currentStep === 0 || currentStep >= 4}
              onClick={() => handleNextStep(false)}
              className="p-2.5 bg-rose-600/20 text-rose-400 hover:bg-rose-600 hover:text-white disabled:opacity-40 text-xs font-bold rounded-xl flex items-center gap-1.5 transition cursor-pointer"
            >
              <X size={14} /> Rejeitar
            </button>
          </div>
        </div>

        {/* Comments section */}
        <div className="space-y-2 flex flex-col justify-between">
          <div className="space-y-1.5">
            <p className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
              <MessageSquare size={12} /> Despacho Eletrônico Interno:
            </p>
            <div className="bg-slate-950 border border-slate-850 rounded-xl p-3 h-20 overflow-y-auto space-y-1 text-[10px] text-slate-400 leading-normal font-mono">
              {comments.length === 0 ? (
                <span className="text-slate-600 italic">Nenhum comentário adicionado ainda.</span>
              ) : (
                comments.map((c, i) => <p key={i}>• {c}</p>)
              )}
            </div>
          </div>

          <div className="flex gap-1.5">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Adicionar nota técnica..."
              className="flex-1 bg-slate-950 text-white text-[10px] p-2 px-3 border border-slate-800 rounded-lg focus:outline-none"
            />
            <button
              onClick={handleAddComment}
              className="p-2 bg-slate-850 hover:bg-slate-700 text-white rounded-lg text-[10px] font-extrabold cursor-pointer"
            >
              Inserir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
