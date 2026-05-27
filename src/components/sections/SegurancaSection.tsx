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
  const [activeTab, setActiveTab] = useState<"lgpd" | "ips" | "mfa" | "audit">("lgpd");

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

  return (
    <div id="seguranca-section-layout" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Módulo de Segurança & Governança LGPD</h2>
          <p className="text-xs text-slate-500 font-sans">Gestão de privacidade de dados, auditorias cibernéticas, restrições de IP de acesso e autenticação multifator.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-100 bg-slate-50/50 p-2 gap-2 text-xs">
          <button
            onClick={() => setActiveTab("lgpd")}
            className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-1.5 transition ${
              activeTab === "lgpd" ? "bg-slate-900 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Shield size={14} /> Privacidade LGPD
          </button>
          <button
            onClick={() => setActiveTab("ips")}
            className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-1.5 transition ${
              activeTab === "ips" ? "bg-slate-900 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Globe size={14} /> Whitelist de IPs
          </button>
          <button
            onClick={() => setActiveTab("mfa")}
            className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-1.5 transition ${
              activeTab === "mfa" ? "bg-slate-900 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Fingerprint size={14} /> Autenticação MFA
          </button>
          <button
            onClick={() => setActiveTab("audit")}
            className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-1.5 transition ${
              activeTab === "audit" ? "bg-slate-900 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Database size={14} /> Log de Auditoria ({auditLogs.length})
          </button>
        </div>

        <div className="p-6 text-xs text-slate-700 leading-normal">
          {/* TAB: LGPD */}
          {activeTab === "lgpd" && (
            <div className="space-y-6 animate-fade-in font-sans">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 border border-slate-200 rounded-2xl bg-slate-50 space-y-4">
                  <h4 className="font-extrabold text-sm text-slate-900">Termo de Consentimento & Termos de Uso</h4>
                  <p className="text-zinc-550">
                    Sua empresa opera em conformidade direta com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018). Todos os colaboradores assinam o termo de consentimento no primeiro login.
                  </p>

                  <div className="flex items-center gap-2 p-2.5 bg-white border rounded-xl">
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
                      <p className="font-bold text-slate-800">Consentimento de Cookies e Logs ativo</p>
                      <p className="text-[9px] text-slate-400">Armazenamento conforme GDPR/LGPD</p>
                    </div>
                  </div>
                </div>

                <div className="p-5 border border-slate-200 rounded-2xl bg-white space-y-4 flex flex-col justify-between">
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-slate-900 text-sm">Direito ao Esquecimento (Artigo 16)</h4>
                    <p className="text-zinc-500">
                      Permite que colaboradores ou parceiros solicitem a remoção ou anonimização de suas fichas cadastrais inativas após o período tributário de guarda constitucional.
                    </p>
                  </div>
                  <button
                    onClick={handleErasureRequest}
                    className="w-full py-2.5 bg-rose-50 text-rose-700 border border-rose-200 font-bold hover:bg-rose-100/40 rounded-xl transition cursor-pointer text-center"
                  >
                    Excluir Dados Inativos de Colaboradores
                  </button>
                </div>
              </div>

              {/* Encryption state banner */}
              <div className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/20 flex items-center justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <LucideLock size={20} className="text-indigo-650 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-black text-slate-905">Criptografia RSA-2045 Ativa em Banco de Dados</h5>
                    <p className="text-[10px] text-zinc-500 mt-1">Todos os holerites, folhas de ponto e demonstrativos contábeis são hash-criptografados na camada física.</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsCriptoActive(!isCriptoActive);
                    onAddAuditLog(`Criptografia de dados alterada`);
                  }}
                  className={`py-1 px-3.5 rounded font-extrabold text-[10px] transition ${
                    isCriptoActive ? "bg-indigo-600 text-white" : "bg-slate-300 text-slate-700"
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
                <h4 className="font-bold text-slate-800 text-sm">Restrição por Endereço IP do Tenant</h4>
                <p className="text-zinc-400 text-[10px] mt-0.5">Dispositivos externos que não pertençam aos IPs abaixo serão bloqueados de operar o ERP.</p>
              </div>

              <form onSubmit={handleAddIp} className="flex gap-2">
                <input
                  type="text"
                  required
                  value={newIp}
                  onChange={(e) => setNewIp(e.target.value)}
                  placeholder="Ex: 200.10.45.22"
                  className="grow p-2.5 border rounded-xl text-xs bg-white focus:outline-hidden"
                />
                <button
                  type="submit"
                  className="bg-slate-900 border text-white font-sans font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1 cursor-pointer hover:bg-slate-800"
                >
                  Adicionar IP
                </button>
              </form>

              <div className="space-y-1.5 border border-slate-100 p-4 bg-slate-50/55 rounded-xl">
                <p className="font-bold text-[10px] uppercase text-slate-400">IPs Autorizados de Suas Filiais:</p>
                <div className="divide-y text-xs font-mono text-indigo-950 font-bold">
                  {allowedIps.map((ip, i) => (
                    <div key={i} className="py-2.5 flex justify-between items-center">
                      <span>🌐 {ip}</span>
                      <span className="text-[10px] bg-emerald-50 text-emerald-800 px-1.5 rounded-xs font-sans">Ativo</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: MFA MULTIFACTOR */}
          {activeTab === "mfa" && (
            <div className="space-y-6 animate-fade-in max-w-sm mx-auto p-4 border rounded-2xl bg-slate-50/50 text-center">
              <Fingerprint size={32} className="mx-auto text-indigo-650" />
              <div className="space-y-1 font-sans">
                <h4 className="font-extrabold text-slate-900 text-sm">Autenticação Duplo Fator (MFA)</h4>
                <p className="text-zinc-500">Adiciona uma camada extra de conformidade por token SMS/Authenticator no login.</p>
              </div>

              <div className="p-3 bg-white border rounded-xl space-y-2 relative">
                <p className="text-[10px] text-slate-400 uppercase font-mono">SEU CODE QR SECRET CORPORATIVO</p>
                <div className="w-24 h-24 bg-slate-200 border rounded flex items-center justify-center mx-auto">
                  {/* Mock MFA QR */}
                  <svg className="w-20 h-20 text-zinc-900" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M2,2 H8 V8 H2 Z M16,2 H22 V8 H16 Z M2,16 H8 V22 H2 Z M12,12 H14 V14 H12 Z M10,16 H14 V20 H10 Z" />
                  </svg>
                </div>
                <p className="text-xs font-extrabold font-mono tracking-widest text-indigo-750 font-sans mt-2">D7YF - A9X8 - 3310</p>
              </div>
              <p className="text-[10px] text-slate-400 font-sans">Escaneie para configurar o Google Authenticator ou MS Auth para seus gerentes.</p>
            </div>
          )}

          {/* TAB: LOGS DE AUDITORIA */}
          {activeTab === "audit" && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-slate-800 text-xs">Trilha Completa de Auditoria Cibernética (Logs)</h4>
                  <p className="text-[10px] text-slate-400">Rastreabilidade indelével de todas as alterações corporativas.</p>
                </div>
                <button
                  onClick={() => onAddAuditLog("Relatório geral de auditoria e trilha cibernética exportado")}
                  className="bg-slate-100 hover:bg-slate-200 border py-1.5 px-3 rounded text-[10px]"
                >
                  Exportar Trilha XML
                </button>
              </div>

              <div className="border border-slate-150 rounded-xl overflow-hidden bg-slate-50 font-mono text-[11px] h-72 overflow-y-auto p-4 space-y-2">
                {auditLogs.map((log) => (
                  <div key={log.id} className="p-2 bg-white rounded border border-slate-100 flex items-start justify-between gap-4">
                    <div>
                      <p className="font-bold text-slate-800 leading-tight">&gt;_ {log.acao}</p>
                      <p className="text-[10px] text-indigo-800 mt-1 font-sans">Por: {log.usuario}</p>
                    </div>
                    <span className="text-[9px] text-slate-400 shrink-0 mt-0.5">{log.data}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
