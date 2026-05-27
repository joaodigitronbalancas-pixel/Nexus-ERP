import React, { useState } from "react";
import { Zap, Play, CheckCircle, ToggleLeft, ToggleRight, Radio, ArrowRight, Settings, Plus, Star } from "lucide-react";

interface AutomationProps {
  onAddAuditLog: (msg: string) => void;
  onEmitAlert: (title: string, category: string) => void;
}

export default function CentralAutomacoes({ onAddAuditLog, onEmitAlert }: AutomationProps) {
  const [rules, setRules] = useState([
    {
      id: "rule_1",
      trigger: "boleto vencer",
      action: "enviar WhatsApp",
      active: true,
      count: 14,
      priority: "🔴 Crítico"
    },
    {
      id: "rule_2",
      trigger: "nota fiscal emitida",
      action: "enviar e-mail + criar tarefa",
      active: true,
      count: 48,
      priority: "🔵 Informativo"
    },
    {
      id: "rule_3",
      trigger: "maquina industrial em falha",
      action: "enviar WhatsApp + avisar financeiro",
      active: true,
      count: 2,
      priority: "🟡 Atenção"
    },
    {
      id: "rule_4",
      trigger: "novo documento registrado",
      action: "enviar e-mail ao diretor",
      active: false,
count: 0,
      priority: "🟢 Operacional"
    }
  ]);

  const [triggerInput, setTriggerInput] = useState("boleto vencer");
  const [actionInput, setActionInput] = useState("enviar WhatsApp");
  const [priorityInput, setPriorityInput] = useState("🟡 Atenção");

  const [testingId, setTestingId] = useState<string | null>(null);

  const handleToggleRule = (id: string) => {
    setRules(
      rules.map((r) => {
        if (r.id === id) {
          onAddAuditLog(`Automação [Módulo Zapier] '${r.trigger}' -> '${r.action}' alterada para: ${!r.active ? "Ativo" : "Inativo"}`);
          return { ...r, active: !r.active };
        }
        return r;
      })
    );
  };

  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    const newR = {
      id: `rule_${Date.now()}`,
      trigger: triggerInput,
      action: actionInput,
      active: true,
      count: 0,
      priority: priorityInput
    };
    setRules([...rules, newR]);
    onAddAuditLog(`Nova regra de automação criada: SE '${triggerInput}' ENTÃO '${actionInput}'`);
    onEmitAlert(`⚡ Nova Regra de Automação Ativa!`, "🔵 Informativo");
  };

  const handleTestRule = (rule: typeof rules[0]) => {
    setTestingId(rule.id);
    onAddAuditLog(`Teste manual de disparo disparado para: SE '${rule.trigger}' ENTÃO '${rule.action}'`);
    
    // Simulate synth beep
    try {
      const actx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = actx.createOscillator();
      const gain = actx.createGain();
      osc.connect(gain);
      gain.connect(actx.destination);
      osc.frequency.setValueAtTime(800, actx.currentTime);
      gain.gain.setValueAtTime(0.08, actx.currentTime);
      osc.start();
      osc.stop(actx.currentTime + 0.12);
    } catch {}

    setTimeout(() => {
      setTestingId(null);
      // Update rules counter
      setRules(
        rules.map((r) => (r.id === rule.id ? { ...r, count: r.count + 1 } : r))
      );
      onEmitAlert(`⚡ Automação disparada com sucesso! ${rule.action.toUpperCase()} completado referente ao evento '${rule.trigger}'`, rule.priority);
    }, 850);
  };

  return (
    <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/90 rounded-3xl p-6 text-white space-y-6" id="central-automacoes-widget">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[9px] bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-mono px-2.5 py-1 rounded-full uppercase font-black tracking-wider">
            Nexus Workflow Automation Hub
          </span>
          <h3 className="text-lg font-black mt-1">Servidor de Gatilhos & Webhooks Ativos</h3>
          <p className="text-xs text-slate-400">Desenhe cenários inteligentes integrados com WhatsApp, SMTP, Discord e filas de robôs.</p>
        </div>
      </div>

      {/* Editor visual block */}
      <form onSubmit={handleCreateRule} className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-slate-950/40 border border-slate-800/60 p-4 rounded-2xl text-xs">
        <div className="space-y-1">
          <label className="text-slate-500 font-mono text-[10px] block">SE OCORRER (GATILHO):</label>
          <select
            value={triggerInput}
            onChange={(e) => setTriggerInput(e.target.value)}
            className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl text-white"
          >
            <option value="boleto vencer">Boleto Vencer</option>
            <option value="nota fiscal emitida">Duplicata Emitida</option>
            <option value="maquina industrial em falha">Máquina CNC em Alerta</option>
            <option value="novo lead comercial capturado">Novo Lead Conquistado</option>
            <option value="aviso de ferias pendente">Aviso de Férias Pendente</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-slate-500 font-mono text-[10px] block">ENTÃO FAZER (AÇÃO):</label>
          <select
            value={actionInput}
            onChange={(e) => setActionInput(e.target.value)}
            className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl text-white"
          >
            <option value="enviar WhatsApp">Enviar WhatsApp ao Cliente</option>
            <option value="criar tarefa operacional">Atribuir Tarefa ao Gerente</option>
            <option value="avisar financeiro (Slack/Teams)">Avisar Financeiro via Slack</option>
            <option value="enviar e-mail corporativo">Disparar Email Corporativo</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-slate-500 font-mono text-[10px] block">PRIORIDADE EVENTO:</label>
          <select
            value={priorityInput}
            onChange={(e) => setPriorityInput(e.target.value)}
            className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl text-white"
          >
            <option value="🔴 Crítico">🔴 Crítico</option>
            <option value="🟡 Atenção">🟡 Atenção</option>
            <option value="🟢 Operacional">🟢 Operacional</option>
            <option value="🔵 Informativo">🔵 Informativo</option>
          </select>
        </div>

        <div className="flex items-end">
          <button
            type="submit"
            className="w-full p-2 bg-indigo-650 hover:bg-indigo-550 text-white font-extrabold rounded-xl transition cursor-pointer flex items-center justify-center gap-1"
          >
            <Plus size={14} className="stroke-[3]" /> Registrar Fluxo
          </button>
        </div>
      </form>

      {/* Rules Active Grid list */}
      <div className="space-y-2.5">
        <p className="text-[10px] font-mono text-zinc-500 uppercase font-bold tracking-widest flex items-center gap-1.5 px-1">
          <Radio className="w-3 h-3 text-indigo-400 animate-ping" />
          Regras de Operação Registradas do Tenant ({rules.length})
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className={`p-4 rounded-2xl border-2 transition duration-250 flex items-center justify-between ${
                rule.active
                  ? "bg-slate-900/40 border-slate-800"
                  : "bg-slate-950/20 border-slate-905 opacity-55"
              }`}
            >
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="p-1 px-2 bg-slate-950 text-indigo-400 rounded-lg text-[9px] font-mono font-bold">
                    SE: {rule.trigger}
                  </span>
                  <ArrowRight size={10} className="text-slate-600" />
                  <span className="p-1 px-2 bg-indigo-950/40 text-rose-300 rounded-lg text-[9px] font-mono font-bold">
                    ENTÃO: {rule.action}
                  </span>
                </div>

                <div className="flex items-center gap-2 pt-2 text-[10px] text-slate-400 font-mono">
                  <span>Prioridade: <strong className="text-white font-sans">{rule.priority}</strong></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                  <span>Disparos: <strong className="text-indigo-400 font-sans">{rule.count}</strong></span>
                </div>
              </div>

              {/* Toggle and test triggers */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleTestRule(rule)}
                  disabled={!rule.active || testingId === rule.id}
                  className="p-2 bg-slate-950 hover:bg-slate-850 p-2 border border-slate-850 text-indigo-400 rounded-xl transition cursor-interactive disabled:opacity-40"
                  title="Testar Execução"
                >
                  <Play size={12} className={testingId === rule.id ? "animate-spin" : ""} />
                </button>

                <button
                  onClick={() => handleToggleRule(rule.id)}
                  className="text-slate-400 hover:text-white transition cursor-pointer"
                >
                  {rule.active ? (
                    <ToggleRight className="w-7 h-7 text-indigo-500" />
                  ) : (
                    <ToggleLeft className="w-7 h-7 text-slate-600" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
