/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Shield,
  Fingerprint,
  Lock as LucideLock,
  Globe,
  Settings,
  EyeOff,
  UserX,
  FileCheck,
  CheckCircle,
  Database
} from "lucide-react";

interface SegurancaSectionProps {
  empresaId: string;
  auditLogs: { id: string; acao: string; usuario: string; data: string }[];
  onAddAuditLog: (acao: string) => void;
}

export default function SegurancaSection({
  empresaId,
  auditLogs,
  onAddAuditLog
}: SegurancaSectionProps) {
  const [activeTab, setActiveTab] = useState<"lgpd" | "ips" | "mfa" | "audit" | "diagnostics">("lgpd");

  // Whitelisted IPs
  const [allowedIps, setAllowedIps] = useState<string[]>([
    "189.12.33.250",
    "177.42.213.11",
    "200.56.90.100"
  ]);
  const [newIp, setNewIp] = useState("");

  // LGPD states
  const [isCriptoActive, setIsCriptoActive] = useState(true);
  const [isLgpdCheck, setIsLgpdCheck] = useState(true);

  // Diagnostics states
  const [diagnosticsLoading, setDiagnosticsLoading] = useState(false);
  const [healthData, setHealthData] = useState<any>(null);
  const [isolationData, setIsolationData] = useState<any>(null);
  const [backupData, setBackupData] = useState<any>(null);

  const handleAddIp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIp.trim()) return;
    setAllowedIps([...allowedIps, newIp.trim()]);
    onAddAuditLog(`IP ${newIp} cadastrado na Whitelist da Tenant`);
    setNewIp("");
    alert("Endereço IP autorizado com sucesso!");
  };

  const handleErasureRequest = () => {
    const doubleCheck = window.confirm("Deseja mesmo solicitar a exclusão de dados inativos (Direito ao Esquecimento - Art 16 LGPD)?");
    if (doubleCheck) {
      onAddAuditLog("Solicitação de exclusão de dados inativos base LGPD registrada.");
      alert("Solicitação enviada de forma segura para o oficial DPO da plataforma SaaS.");
    }
  };

  // Live REST API Callers
  const checkHealthz = async () => {
    setDiagnosticsLoading(true);
    try {
      const res = await fetch("/api/health");
      const data = await res.json();
      setHealthData(data);
      onAddAuditLog("Diagnosticamento em tempo real do barramento de microserviços executado");
    } catch (err: any) {
      alert("Falha ao comunicar com o cluster Master: " + err.message);
    } finally {
      setDiagnosticsLoading(false);
    }
  };

  const validateIsolation = async () => {
    setDiagnosticsLoading(true);
    try {
      const res = await fetch("/api/tenant/validate", {
        headers: {
          "X-Tenant-ID": empresaId,
          "X-User-Role": "DonoEmpresa",
          "X-User-Name": "Antonio"
        }
      });
      const data = await res.json();
      setIsolationData(data);
      onAddAuditLog("Auditoria cibernética e teste de vazamento de dados concluído");
    } catch (err: any) {
      alert("Erro ao validar isolamento lógico: " + err.message);
    } finally {
      setDiagnosticsLoading(false);
    }
  };

  const triggerPitBackup = async () => {
    setDiagnosticsLoading(true);
    try {
      const res = await fetch("/api/db/backup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Tenant-ID": empresaId,
          "X-User-Role": "DonoEmpresa",
          "X-User-Name": "Antonio"
        }
      });
      const data = await res.json();
      setBackupData(data);
      onAddAuditLog(`SaaS PITR backup requisitado. ID do dump gerado: ${data.backupId}`);
    } catch (err: any) {
      alert("Falha de comunicação na fila de backup: " + err.message);
    } finally {
      setDiagnosticsLoading(false);
    }
  };

  return (
    <div id="seguranca-section-layout" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Módulo de Segurança & Governança LGPD</h2>
          <p className="text-xs text-slate-500 font-sans">Gestão de privacidade de dados, auditorias cibernéticas, restrições de IP de acesso e autenticação multifator.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#0b1020] rounded-2xl border border-slate-100 dark:border-white/5 shadow-xs overflow-hidden">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-950/25 p-2 gap-2 text-xs">
          <button
            onClick={() => setActiveTab("lgpd")}
            className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              activeTab === "lgpd" ? "bg-slate-900 dark:bg-violet-650 text-white shadow-xs" : "text-slate-650 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-white/5"
            }`}
          >
            <Shield size={14} /> Privacidade LGPD
          </button>
          <button
            onClick={() => setActiveTab("ips")}
            className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              activeTab === "ips" ? "bg-slate-900 dark:bg-violet-650 text-white shadow-xs" : "text-slate-650 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-white/5"
            }`}
          >
            <Globe size={14} /> Whitelist de IPs
          </button>
          <button
            onClick={() => setActiveTab("mfa")}
            className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              activeTab === "mfa" ? "bg-slate-900 dark:bg-violet-650 text-white shadow-xs" : "text-slate-650 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-white/5"
            }`}
          >
            <Fingerprint size={14} /> Autenticação MFA
          </button>
          <button
            onClick={() => setActiveTab("audit")}
            className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              activeTab === "audit" ? "bg-slate-900 dark:bg-violet-650 text-white shadow-xs" : "text-slate-650 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-white/5"
            }`}
          >
            <Database size={14} /> Log de Auditoria ({auditLogs.length})
          </button>
          <button
            onClick={() => setActiveTab("diagnostics")}
            className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              activeTab === "diagnostics" ? "bg-indigo-600 dark:bg-indigo-600 text-white shadow-xs" : "text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/20"
            }`}
          >
            <span>⚡</span> Diagnósticos Enterprise
          </button>
        </div>

        <div className="p-6 text-xs text-slate-700 dark:text-slate-305 leading-normal">
          {/* TAB: LGPD */}
          {activeTab === "lgpd" && (
            <div className="space-y-6 animate-fade-in font-sans">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 border border-slate-200 dark:border-white/5 rounded-2xl bg-slate-50 dark:bg-slate-950/50 space-y-4">
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Termo de Consentimento & Termos de Uso</h4>
                  <p className="text-slate-550 dark:text-slate-400">
                    Sua empresa opera em conformidade direta com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018). Todos os colaboradores assinam o termo de consentimento no primeiro login.
                  </p>

                  <div className="flex items-center gap-2 p-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-xl">
                    <input
                      type="checkbox"
                      checked={isLgpdCheck}
                      onChange={(e) => {
                        setIsLgpdCheck(e.target.checked);
                        onAddAuditLog(`Consentimento LGPD alterado para ${e.target.checked}`);
                      }}
                      className="w-4 h-4 rounded text-indigo-650"
                    />
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-205">Consentimento de Cookies e Logs ativo</p>
                      <p className="text-[9px] text-slate-400">Armazenamento conforme GDPR/LGPD</p>
                    </div>
                  </div>
                </div>

                <div className="p-5 border border-slate-200 dark:border-white/5 rounded-2xl bg-white dark:bg-slate-950/20 space-y-4 flex flex-col justify-between">
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">Direito ao Esquecimento (Artigo 16)</h4>
                    <p className="text-slate-505 dark:text-slate-400">
                      Permite que colaboradores ou parceiros solicitem a remoção ou anonimização de suas fichas cadastrais inativas após o período tributário de guarda constitucional.
                    </p>
                  </div>
                  <button
                    onClick={handleErasureRequest}
                    className="w-full py-2.5 bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40 font-bold hover:bg-rose-100/40 rounded-xl transition cursor-pointer text-center"
                  >
                    Excluir Dados Inativos de Colaboradores
                  </button>
                </div>
              </div>

              {/* Encryption state banner */}
              <div className="p-4 rounded-xl border border-indigo-100 dark:border-violet-950/30 bg-indigo-50/20 dark:bg-violet-950/10 flex items-center justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <LucideLock size={20} className="text-indigo-650 dark:text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-black text-slate-900 dark:text-white">Criptografia RSA-2045 Ativa em Banco de Dados</h5>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Todos os holerites, folhas de ponto e demonstrativos contábeis são hash-criptografados na camada física.</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsCriptoActive(!isCriptoActive);
                    onAddAuditLog(`Criptografia de dados alterada`);
                  }}
                  className={`py-1 px-3.5 rounded font-extrabold text-[10px] transition cursor-pointer ${
                    isCriptoActive ? "bg-indigo-600 text-white" : "bg-slate-300 dark:bg-slate-700 text-slate-705 dark:text-slate-305"
                  }`}
                >
                  {isCriptoActive ? "Ativo" : "Pausado"}
                </button>
              </div>
            </div>
          )}

          {/* TAB: WHITELIST IPS */}
          {activeTab === "ips" && (
            <div className="space-y-4 animate-fade-in max-w-lg mx-auto">
              <div>
                <h4 className="font-bold text-slate-800 dark:text-white text-sm">Restrição por Endereço IP do Tenant</h4>
                <p className="text-slate-505 dark:text-slate-400 text-[10px] mt-0.5">Dispositivos externos que não pertençam aos IPs abaixo serão bloqueados de operar o ERP.</p>
              </div>

              <form onSubmit={handleAddIp} className="flex gap-2">
                <input
                  type="text"
                  required
                  value={newIp}
                  onChange={(e) => setNewIp(e.target.value)}
                  placeholder="Ex: 200.10.45.22"
                  className="grow p-2.5 border border-slate-250 dark:border-white/10 rounded-xl text-xs bg-white dark:bg-slate-950 focus:outline-hidden"
                />
                <button
                  type="submit"
                  className="bg-slate-900 dark:bg-violet-650 border border-slate-300 dark:border-white/5 text-white font-sans font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1 cursor-pointer hover:bg-slate-800"
                >
                  Adicionar IP
                </button>
              </form>

              <div className="space-y-1.5 border border-slate-100 dark:border-white/5 p-4 bg-slate-50/55 dark:bg-slate-950/10 rounded-xl">
                <p className="font-bold text-[10px] uppercase text-slate-400">IPs Autorizados de Suas Filiais:</p>
                <div className="divide-y divide-slate-100 dark:divide-white/5 text-xs font-mono text-indigo-950 dark:text-indigo-305 font-bold">
                  {allowedIps.map((ip, i) => (
                    <div key={i} className="py-2.5 flex justify-between items-center">
                      <span>🌐 {ip}</span>
                      <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-400 px-1.5 rounded-xs font-sans">Ativo</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: MFA MULTIFACTOR */}
          {activeTab === "mfa" && (
            <div className="space-y-6 animate-fade-in max-w-sm mx-auto p-4 border border-slate-200 dark:border-white/5 rounded-2xl bg-slate-50/50 dark:bg-slate-950/20 text-center">
              <Fingerprint size={32} className="mx-auto text-indigo-650 dark:text-indigo-400" />
              <div className="space-y-1 font-sans">
                <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">Autenticação Duplo Fator (MFA)</h4>
                <p className="text-slate-505 dark:text-slate-400">Adiciona uma camada extra de conformidade por token SMS/Authenticator no login.</p>
              </div>

              <div className="p-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-xl space-y-2 relative">
                <p className="text-[10px] text-slate-450 dark:text-slate-400 uppercase font-mono">SEU CORE QR SECRET CORPORATIVO</p>
                <div className="w-24 h-24 bg-slate-200 dark:bg-slate-800 border dark:border-white/5 rounded flex items-center justify-center mx-auto">
                  <svg className="w-20 h-20 text-zinc-900 dark:text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M2,2 H8 V8 H2 Z M16,2 H22 V8 H16 Z M2,16 H8 V22 H2 Z M12,12 H14 V14 H12 Z M10,16 H14 V20 H10 Z" />
                  </svg>
                </div>
                <p className="text-xs font-extrabold font-mono tracking-widest text-indigo-755 dark:text-indigo-300 font-sans mt-2">D7YF - A9X8 - 3310</p>
              </div>
              <p className="text-[10px] text-slate-400 font-sans">Escaneie para configurar o Google Authenticator ou MS Auth para seus gerentes.</p>
            </div>
          )}

          {/* TAB: LOGS DE AUDITORIA */}
          {activeTab === "audit" && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-slate-850 dark:text-white text-xs">Trilha Completa de Auditoria Cibernética (Logs)</h4>
                  <p className="text-[10px] text-slate-400">Rastreabilidade indelével de todas as alterações corporativas.</p>
                </div>
                <button
                  onClick={() => onAddAuditLog("Relatório geral de auditoria e trilha cibernética exportado")}
                  className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-white/5 py-1.5 px-3 rounded text-[10px] cursor-pointer text-slate-800 dark:text-white"
                >
                  Exportar Trilha XML
                </button>
              </div>

              <div className="border border-slate-150 dark:border-white/5 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-950/30 font-mono text-[11px] h-72 overflow-y-auto p-4 space-y-2">
                {auditLogs.map((log) => (
                  <div key={log.id} className="p-2 bg-white dark:bg-slate-950 rounded border border-slate-100 dark:border-white/5 flex items-start justify-between gap-4">
                    <div>
                      <p className="font-bold text-slate-805 dark:text-slate-205 leading-tight">&gt;_ {log.acao}</p>
                      <p className="text-[10px] text-indigo-850 dark:text-indigo-400 mt-1 font-sans">Por: {log.usuario}</p>
                    </div>
                    <span className="text-[9px] text-slate-400 shrink-0 mt-0.5">{log.data}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: DIAGNOSTICS */}
          {activeTab === "diagnostics" && (
            <div className="space-y-6 animate-fade-in font-sans">
              <div className="p-4 bg-indigo-50/40 dark:bg-indigo-950/10 border border-indigo-100 dark:border-indigo-900/30 rounded-2xl">
                <h4 className="text-sm font-extrabold text-indigo-905 dark:text-indigo-300 flex items-center gap-1.5">
                  🛡️ Console Executivo de Auditoria & DevOps (Live REST Integration)
                </h4>
                <p className="text-[10px] bg-indigo-100 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400 max-w-fit px-2 py-0.5 rounded-md font-bold mt-1">SaaS MULTI-TENANT CONTEXT: ACTIVE</p>
                <p className="text-zinc-550 dark:text-slate-400 text-xs mt-2 leading-relaxed">
                  Utilize esta mesa técnica para gerenciar e simular as estratégias cloud do ERP de forma ativa. Os disparadores abaixo efetuam requisições legítimas ao servidor Express, enviando tokens de Tenant isolados para a prevenção de leak de dados no PostgreSQL (OWASP Level 4).
                </p>
              </div>

              {diagnosticsLoading && (
                <div className="py-2 px-4 bg-amber-50 dark:bg-amber-950/10 border border-amber-200 dark:border-amber-900/30 text-amber-800 dark:text-amber-400 font-mono text-[10px] rounded-lg animate-pulse-slow">
                  ⚡ Executando requisição no barramento microserviços com cabeçalhos de segurança autorizados...
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* 1. Health Diagnostic */}
                <div className="p-5 border border-slate-200 dark:border-white/5 rounded-2xl bg-white dark:bg-slate-950/35 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-mono uppercase bg-emerald-50 text-emerald-700 dark:bg-emerald-950/15 dark:text-emerald-400 px-2 py-0.5 rounded font-black">API MONITORING</span>
                    <h5 className="font-bold text-slate-900 dark:text-white text-xs mt-1.5">Server Health Checks (/api/health)</h5>
                    <p className="text-[10.5px] text-zinc-500 dark:text-slate-400">Analisa a latência de comunicação, carga heap de memória interna, e conexões pendentes do banco PostgreSQL.</p>
                  </div>
                  
                  {healthData && (
                    <pre className="p-2.5 bg-slate-950 text-[9.5px] font-mono text-emerald-400 rounded-xl overflow-x-auto border border-white/5 h-28 leading-snug">
                      {JSON.stringify(healthData, null, 2)}
                    </pre>
                  )}

                  <button
                    onClick={checkHealthz}
                    disabled={diagnosticsLoading}
                    className="w-full py-2 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-bold rounded-xl transition cursor-pointer text-center text-xs"
                  >
                    Analisar Cluster Master
                  </button>
                </div>

                {/* 2. Tenant Isolation Validator */}
                <div className="p-5 border border-slate-200 dark:border-white/5 rounded-2xl bg-white dark:bg-slate-950/35 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-mono uppercase bg-indigo-50 text-indigo-700 dark:bg-indigo-950/15 dark:text-indigo-400 px-2 py-0.5 rounded font-black">OWASP AUDITING</span>
                    <h5 className="font-bold text-slate-900 dark:text-white text-xs mt-1.5">Tenancy Validator (/api/tenant/validate)</h5>
                    <p className="text-[10.5px] text-zinc-500 dark:text-slate-400">Executa uma rotina de controle analisando se há vazamento transversal de dados ou falhas de RLS (Row Level Security).</p>
                  </div>

                  {isolationData && (
                    <pre className="p-2.5 bg-slate-950 text-[9.5px] font-mono text-indigo-400 rounded-xl overflow-x-auto border border-white/5 h-28 leading-snug">
                      {JSON.stringify(isolationData, null, 2)}
                    </pre>
                  )}

                  <button
                    onClick={validateIsolation}
                    disabled={diagnosticsLoading}
                    className="w-full py-2 bg-indigo-650 hover:bg-indigo-600 text-white font-bold rounded-xl transition cursor-pointer text-center text-xs"
                  >
                    Auditar Segurança RLS
                  </button>
                </div>

                {/* 3. PITR Database Backup */}
                <div className="p-5 border border-slate-200 dark:border-white/5 rounded-2xl bg-white dark:bg-slate-950/35 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-mono uppercase bg-violet-50 text-violet-700 dark:bg-violet-950/15 dark:text-violet-400 px-2 py-0.5 rounded font-black">RECOVERY PIPELINE</span>
                    <h5 className="font-bold text-slate-900 dark:text-white text-xs mt-1.5">Zero-Downtime PITR Backup (/api/db/backup)</h5>
                    <p className="text-[10.5px] text-zinc-500 dark:text-slate-400">Trigger para backup point-in-time e exportação criptografada (AES-256GCM) aos baldes Cloud de forma blindada.</p>
                  </div>

                  {backupData && (
                    <pre className="p-2.5 bg-slate-950 text-[9.5px] font-mono text-violet-400 rounded-xl overflow-x-auto border border-white/5 h-28 leading-snug">
                      {JSON.stringify(backupData, null, 2)}
                    </pre>
                  )}

                  <button
                    onClick={triggerPitBackup}
                    disabled={diagnosticsLoading}
                    className="w-full py-2 bg-violet-650 hover:bg-violet-600 text-white font-bold rounded-xl transition cursor-pointer text-center text-xs"
                  >
                    Fazer Live Backup (S3)
                  </button>
                </div>

              </div>

              {/* Resilience circuit status warning */}
              <div className="p-4 rounded-xl border border-rose-100 dark:border-rose-950/30 bg-rose-50/20 dark:bg-rose-950/10 flex items-start gap-2.5">
                <CheckCircle size={16} className="text-emerald-500 mt-0.5" />
                <div className="text-[10.5px] leading-relaxed text-zinc-505 dark:text-slate-400">
                  <span className="font-bold text-slate-900 dark:text-white">Isolamento Ativo Conforme OWASP ASVS:</span> O servidor inspeciona a assinatura em cada cabeçalho de requisição. A assinatura digital simula a validação criptografada do tenant da sessão correntemente ativa. Isso preserva a conformidade jurídica com a LGPD e garante que nenhuma operação inter-tenants vaze em memória.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
