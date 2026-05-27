import React, { useState, useEffect } from "react";
import { Activity, Cpu, Server, Database, Globe, RefreshCcw, Wifi, FileInput } from "lucide-react";

interface TelemetryProps {
  realtimeActive: boolean;
}

export default function CentralOperacoes({ realtimeActive }: TelemetryProps) {
  const [latency, setLatency] = useState(14); // ms
  const [cpu, setCpu] = useState(24); // %
  const [ram, setRam] = useState(5.2); // GB
  const [nfeStatus, setNfeStatus] = useState("OPERACIONAL");
  const [whatsStatus, setWhatsStatus] = useState("CONECTADO");
  const [queueSize, setQueueSize] = useState(0);

  const [logs, setLogs] = useState<string[]>([
    "[13:30:11] Gateway SaaS: Conexão bem-sucedida com PostgreSQL Cluster - Us-East1",
    "[13:31:04] Redis Cache: Invalidado chunk de permissões de empresas devido a atualização",
    "[13:32:48] Emissor NFe: Chave Sefaz validada (Protocolo ICP-Brasil)",
    "[13:33:14] Webhook Zapier: Disparado WhatsApp ao cliente com sucesso"
  ]);

  useEffect(() => {
    if (!realtimeActive) return;

    const interval = setInterval(() => {
      // Fluctuate stats
      setCpu((prev) => {
        const next = prev + (Math.random() > 0.5 ? 4 : -4);
        return Math.max(10, Math.min(85, next));
      });
      setLatency((prev) => {
        const next = prev + (Math.random() > 0.5 ? 2 : -2);
        return Math.max(8, Math.min(42, next));
      });
      setRam((prev) => {
        const next = prev + (Math.random() > 0.5 ? 0.05 : -0.05);
        return Math.max(4.8, Math.min(6.1, parseFloat(next.toFixed(2))));
      });
      setQueueSize((prev) => Math.floor(Math.random() * 8));

      // Append logs occasionally
      if (Math.random() > 0.7) {
        const stamps = new Date().toLocaleTimeString("pt-BR");
        const entryOptions = [
          `[${stamps}] Sincronizador: Multi-tenant tenant_alfa atualizou dados de CRM`,
          `[${stamps}] Sefaz API: Tempo de resposta regular 18ms`,
          `[${stamps}] WhatsApp API: Dispositivo verificado ativo`,
          `[${stamps}] Backup Engine: Ponto de restauração agendado gerado com sucesso`,
          `[${stamps}] Segurança: Token JWT validado para usuário virtual`
        ];
        const newLog = entryOptions[Math.floor(Math.random() * entryOptions.length)];
        setLogs((prev) => [newLog, ...prev.slice(0, 15)]);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [realtimeActive]);

  return (
    <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/90 rounded-3xl p-6 text-white space-y-6" id="central-operacoes-widget">
      
      {/* Visual Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[9px] bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 font-mono px-2.5 py-1 rounded-full uppercase font-black tracking-wider flex items-center gap-1.5 w-fit">
            <span className={`w-1.5 h-1.5 rounded-full ${realtimeActive ? "bg-emerald-400 animate-ping" : "bg-slate-400"}`} />
            Sistemas Realtime Core Telemetria
          </span>
          <h3 className="text-lg font-black mt-1">Status de barramento e infraestrutura corporativa</h3>
          <p className="text-xs text-slate-400 font-sans">Monitoramento do tempo de resposta das apis tributárias nacionais, filas redis e computação.</p>
        </div>

        {/* Realtime LED indicator */}
        <div className="flex items-center gap-2">
          <div className="p-2.5 bg-slate-950 border border-slate-850 rounded-2xl flex items-center gap-2 text-xs">
            <span className="text-slate-500 text-[10px] font-mono">Realtime Stream:</span>
            <div className="flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${realtimeActive ? "bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]" : "bg-slate-700"}`} />
              <span className="text-[10px] font-mono font-bold">{realtimeActive ? "ATIVO" : "CONGELADO"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of hardware parameters */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 bg-slate-950 border border-slate-850 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[10px] font-mono">PING LATENCY</span>
            <Wifi size={14} className="text-indigo-400" />
          </div>
          <p className="text-xl font-mono font-black text-indigo-400">
            {latency} <span className="text-xs font-sans text-slate-400">ms</span>
          </p>
          <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
            <div className="bg-indigo-505 bg-indigo-500 h-full transition-all duration-300" style={{ width: `${(latency / 50) * 100}%` }} />
          </div>
        </div>

        <div className="p-4 bg-slate-950 border border-slate-850 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[10px] font-mono">LOAD CPU</span>
            <Cpu size={14} className="text-purple-400" />
          </div>
          <p className="text-xl font-mono font-black text-purple-400">
            {cpu} <span className="text-xs font-sans text-slate-400">%</span>
          </p>
          <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
            <div className={`h-full transition-all duration-300 ${cpu > 70 ? "bg-rose-500" : cpu > 40 ? "bg-amber-400" : "bg-purple-500"}`} style={{ width: `${cpu}%` }} />
          </div>
        </div>

        <div className="p-4 bg-slate-950 border border-slate-850 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[10px] font-mono">REST RAM</span>
            <Server size={14} className="text-amber-400" />
          </div>
          <p className="text-xl font-mono font-black text-amber-400">
            {ram} <span className="text-xs font-sans text-slate-400">GB</span>
          </p>
          <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
            <div className="bg-amber-400 h-full transition-all duration-300" style={{ width: `${(ram / 16) * 100}%` }} />
          </div>
        </div>

        <div className="p-4 bg-slate-950 border border-slate-850 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[10px] font-mono">FILA REDIS QUEUE</span>
            <Database size={14} className="text-emerald-400" />
          </div>
          <p className="text-xl font-mono font-black text-emerald-400">
            {queueSize} <span className="text-xs font-sans text-slate-400">jobs</span>
          </p>
          <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
            <div className="bg-emerald-400 h-full transition-all duration-300" style={{ width: `${(queueSize / 8) * 100}%` }} />
          </div>
        </div>
      </div>

      {/* API Integrations Active Statuses */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-slate-950 border border-slate-850 p-3.5 rounded-2xl flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Globe size={15} className="text-indigo-400" />
            <span className="font-bold">Emissão NF-e (Sefaz 4.0)</span>
          </div>
          <span className="font-mono text-[10px] bg-emerald-500/10 text-emerald-400 p-1 px-2 border border-emerald-500/20 rounded-lg">
            {nfeStatus}
          </span>
        </div>

        <div className="bg-slate-950 border border-slate-850 p-3.5 rounded-2xl flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Activity size={15} className="text-purple-400" />
            <span className="font-bold">Gateway Bancário (PIX)</span>
          </div>
          <span className="font-mono text-[10px] bg-emerald-500/10 text-emerald-400 p-1 px-2 border border-emerald-500/20 rounded-lg">
            CONECTADO
          </span>
        </div>

        <div className="bg-slate-950 border border-slate-850 p-3.5 rounded-2xl flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <FileInput size={15} className="text-emerald-400" />
            <span className="font-bold">WhatsApp Broker SaaS</span>
          </div>
          <span className="font-mono text-[10px] bg-emerald-500/10 text-emerald-400 p-1 px-2 border border-emerald-500/20 rounded-lg">
            {whatsStatus}
          </span>
        </div>
      </div>

      {/* Log console drawer */}
      <div className="space-y-2">
        <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">Log de Processamento e Auditoria Interna:</p>
        <div className="bg-slate-950 border border-slate-850 rounded-2xl p-4 h-32 overflow-y-auto font-mono text-[10px] text-zinc-400 space-y-1.5 scrollbar-thin">
          {logs.map((lg, idx) => (
            <p key={idx} className={lg.includes("Segurança") ? "text-rose-400" : lg.includes("Sefaz") ? "text-amber-300" : ""}>
              {lg}
            </p>
          ))}
        </div>
      </div>

    </div>
  );
}
