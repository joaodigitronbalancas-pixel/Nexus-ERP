/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Building2,
  Users,
  CreditCard,
  MessageSquare,
  Activity,
  AlertTriangle,
  Lock as LucideLock,
  Unlock,
  ShieldAlert,
  Server,
  Plus,
  TrendingUp,
  Search,
  CheckCircle2,
  XCircle,
  FileSpreadsheet,
  Globe,
  Cpu,
  RefreshCw,
  Eye,
  ShieldCheck,
  Power,
  Sliders,
  ChevronRight
} from "lucide-react";
import { Empresa, Plano, TicketSuporte, LogAuditoria, PlanoTipo, SolicitacaoAcesso } from "../../types";

interface SuperAdminDashboardProps {
  empresas: Empresa[];
  planos: Plano[];
  tickets: TicketSuporte[];
  logs: LogAuditoria[];
  solicitacoes?: SolicitacaoAcesso[];
  onToggleEmpresaStatus: (empresaId: string) => void;
  onUpdateEmpresaPlano: (empresaId: string, planoId: string) => void;
  onCreateEmpresa: (nova: Omit<Empresa, "id" | "dataCadastro" | "logoColor">) => void;
  onResponderTicket: (ticketId: string, resposta: string) => void;
  onAprovarSolicitacao?: (id: string) => void;
  onRejeitarSolicitacao?: (id: string) => void;
  onSimulaEmpresa?: (empresaId: string | null) => void;
  simulandoEmpresaId?: string | null;
}

export default function SuperAdminDashboard({
  empresas,
  planos,
  tickets,
  logs,
  solicitacoes = [],
  onToggleEmpresaStatus,
  onUpdateEmpresaPlano,
  onCreateEmpresa,
  onResponderTicket,
  onAprovarSolicitacao,
  onRejeitarSolicitacao,
  onSimulaEmpresa,
  simulandoEmpresaId = null
}: SuperAdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<"empresas" | "tickets" | "planos" | "audit" | "solicitacoes" | "status">("empresas");

  // New Empresa fields
  const [showNewEmpresaModal, setShowNewEmpresaModal] = useState(false);
  const [newNome, setNewNome] = useState("");
  const [newCnpj, setNewCnpj] = useState("");
  const [newContato, setNewContato] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newTelefone, setNewTelefone] = useState("");
  const [newPlano, setNewPlano] = useState("plano_basico");

  // Ticket reply states
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [respostaTexto, setRespostaTexto] = useState("");

  const [searchText, setSearchText] = useState("");

  // SaaS KPIs
  const mrr = empresas
    .filter(e => e.status === "Ativo")
    .reduce((sum, emp) => {
      const p = planos.find(pl => pl.id === emp.planoId);
      return sum + (p?.preco || 0);
    }, 0);

  const arr = mrr * 12;
  const totalClientes = empresas.length;
  const clientesAtivos = empresas.filter(e => e.status === "Ativo").length;
  const ticketsAbertos = tickets.filter(t => t.status !== "Resolvido").length;
  const solicitacoesPendentes = solicitacoes.filter(s => s.status === "Pendente").length;

  const handleCreateEmpresaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNome || !newCnpj || !newEmail) return alert("Preencha os campos obrigatórios");

    onCreateEmpresa({
      nome: newNome,
      cnpj: newCnpj,
      contato: newContato || "Contato Geral",
      email: newEmail,
      telefone: newTelefone || "(11) 90000-0000",
      status: "Ativo",
      planoId: newPlano,
      limiteUsuarios: newPlano === "plano_basico" ? 5 : newPlano === "plano_profissional" ? 20 : 999,
      limiteFiliais: newPlano === "plano_basico" ? 1 : newPlano === "plano_profissional" ? 3 : 99
    });

    // Reset Form
    setNewNome("");
    setNewCnpj("");
    setNewContato("");
    setNewEmail("");
    setNewTelefone("");
    setShowNewEmpresaModal(false);
  };

  const handleResponderTicketSubmit = (ticketId: string) => {
    if (!respostaTexto.trim()) return;
    onResponderTicket(ticketId, respostaTexto);
    setRespostaTexto("");
    setSelectedTicketId(null);
  };

  const filteredEmpresas = empresas.filter(
    e =>
      e.nome.toLowerCase().includes(searchText.toLowerCase()) ||
      e.cnpj.includes(searchText) ||
      e.email.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div id="super-admin-layout" className="space-y-6 animate-fade-in text-slate-100">
      {/* SaaS Alert bar - Futuristic Cyber Header */}
      <div className="relative overflow-hidden p-6 rounded-3xl border border-indigo-500/30 bg-slate-950/90 shadow-[0_0_25px_rgba(99,102,241,0.15)] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-80 h-32 bg-indigo-600/10 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-24 bg-purple-600/10 blur-[80px] pointer-events-none" />
        
        <div className="flex items-center gap-4 relative z-10">
          <div className="p-3 bg-linear-to-tr from-indigo-500 to-purple-600 text-white rounded-2xl shadow-[0_0_15px_rgba(99,102,241,0.5)]">
            <Cpu size={24} className="animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[9px] font-black tracking-widest bg-indigo-500/20 text-indigo-300 uppercase border border-indigo-500/40 animate-pulse">
                SaaS MASTER CONSOLE
              </span>
              <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                Live Network
              </span>
            </div>
            <h4 className="text-xl font-black text-white font-sans mt-0.5 tracking-tight">Console de Controle Global do Super Admin</h4>
            <p className="text-xs text-slate-400">Total autoridade sobre empresas contratantes, assinaturas, tickets e acessos multitenant.</p>
          </div>
        </div>

        {/* Dynamic Tenant impersonation selector directly on top */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto relative z-10">
          <div className="bg-slate-900/90 border border-slate-750 p-1.5 px-3 rounded-2xl text-xs flex items-center gap-2 shrink-0">
            <Globe size={14} className="text-indigo-400" />
            <span className="text-slate-400">Ambiente de Operação:</span>
            <select
              value={simulandoEmpresaId || ""}
              onChange={(e) => onSimulaEmpresa && onSimulaEmpresa(e.target.value ? e.target.value : null)}
              className="bg-transparent font-extrabold text-indigo-300 focus:outline-hidden cursor-pointer"
            >
              <option value="" className="bg-slate-900 text-white">Console Master (Global)</option>
              {empresas.map((emp) => (
                <option key={emp.id} value={emp.id} className="bg-slate-900 text-white">
                  Simular: {emp.nome} ({emp.status})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs bg-slate-900/90 py-2 px-4 rounded-2xl border border-slate-750 text-slate-300 font-mono">
            <Server size={14} className="text-emerald-400 animate-pulse" />
            Cloud Ingress active (Port 3000)
          </div>
        </div>
      </div>

      {/* Grid de Métricas Globais - Styled Futuristic/Fintech */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="p-5 bg-gradient-to-br from-slate-950 to-slate-900 rounded-3xl border border-slate-800 shadow-md relative overflow-hidden flex items-center justify-between group hover:border-indigo-500/40 transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl" />
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Recorrência Mensal (MRR)</span>
            <p className="text-2xl font-black font-mono text-white tracking-tight">
              R$ {mrr.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </p>
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <TrendingUp size={12} /> +12.4% este mês
            </span>
          </div>
          <div className="p-3 bg-indigo-600/15 text-indigo-400 rounded-2xl border border-indigo-500/20 group-hover:bg-indigo-600/30 transition-colors">
            <CreditCard size={22} className="text-indigo-400" />
          </div>
        </div>

        {/* KPI 2 */}
        <div className="p-5 bg-gradient-to-br from-slate-950 to-slate-900 rounded-3xl border border-slate-800 shadow-md relative overflow-hidden flex items-center justify-between group hover:border-purple-500/40 transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-xl" />
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Projeção Anual (ARR)</span>
            <p className="text-2xl font-black font-mono text-white tracking-tight">
              R$ {arr.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </p>
            <span className="text-[10px] text-zinc-500 font-mono">Consolidado em base ativa</span>
          </div>
          <div className="p-3 bg-purple-600/15 text-purple-400 rounded-2xl border border-purple-500/20 group-hover:bg-purple-600/30 transition-colors">
            <Activity size={22} className="text-purple-400" />
          </div>
        </div>

        {/* KPI 3 */}
        <div className="p-5 bg-gradient-to-br from-slate-950 to-slate-900 rounded-3xl border border-slate-800 shadow-md relative overflow-hidden flex items-center justify-between group hover:border-emerald-500/40 transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl" />
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Licenciamento SaaS</span>
            <p className="text-2xl font-black text-white tracking-tight">
              {clientesAtivos} <span className="text-xs font-normal text-slate-500">/ {totalClientes} tenants ativos</span>
            </p>
            <div className="w-28 bg-slate-800 h-1 rounded-full mt-1.5 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full"
                style={{ width: `${(clientesAtivos / totalClientes) * 100}%` }}
              ></div>
            </div>
          </div>
          <div className="p-3 bg-emerald-600/15 text-emerald-400 rounded-2xl border border-emerald-500/20 group-hover:bg-emerald-600/30 transition-colors">
            <Building2 size={22} className="text-emerald-400" />
          </div>
        </div>

        {/* KPI 4 */}
        <div className="p-5 bg-gradient-to-br from-slate-950 to-slate-900 rounded-3xl border border-slate-800 shadow-md relative overflow-hidden flex items-center justify-between group hover:border-amber-500/40 transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl" />
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Aprovações & Suporte</span>
            <p className="text-2xl font-black text-white tracking-tight">
              {ticketsAbertos + solicitacoesPendentes}{" "}
              <span className="text-xs font-normal text-slate-500">pendentes</span>
            </p>
            <span className="text-xs text-amber-400 font-semibold flex items-center gap-1 font-mono">
              {solicitacoesPendentes} aprovações | {ticketsAbertos} tickets
            </span>
          </div>
          <div className="p-3 bg-amber-600/15 text-amber-400 rounded-2xl border border-amber-500/20 group-hover:bg-amber-600/30 transition-colors">
            <ShieldAlert size={22} className="text-amber-400" />
          </div>
        </div>
      </div>

      {/* Main SaaS Administration Center Card */}
      <div className="bg-slate-950/80 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl backdrop-blur-2xl">
        
        {/* Futuristic Tab Bar with glow indicators */}
        <div className="flex flex-wrap border-b border-slate-850 p-2 gap-2 bg-slate-900/60">
          <button
            onClick={() => setActiveTab("empresas")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "empresas"
                ? "bg-indigo-600 text-white shadow-[0_0_12px_rgba(99,102,241,0.4)]"
                : "text-slate-400 hover:text-white hover:bg-slate-800/40"
            }`}
          >
            🏢 Empresas Contratantes
          </button>
          
          <button
            onClick={() => setActiveTab("solicitacoes")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "solicitacoes"
                ? "bg-indigo-600 text-white shadow-[0_0_12px_rgba(99,102,241,0.4)]"
                : "text-slate-405 hover:text-white hover:bg-slate-800/40"
            }`}
          >
            🔑 Double-Approval Center
            {solicitacoesPendentes > 0 && (
              <span className="bg-amber-500 text-slate-950 text-[9px] px-2 py-0.5 rounded-full font-black animate-pulse">
                {solicitacoesPendentes} REQ
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("tickets")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "tickets"
                ? "bg-indigo-600 text-white shadow-[0_0_12px_rgba(99,102,241,0.4)]"
                : "text-slate-450 hover:text-white hover:bg-slate-800/40"
            }`}
          >
            💬 Fila de Suporte SLA
            {ticketsAbertos > 0 && (
              <span className="bg-rose-500 text-white text-[9px] px-2 py-0.5 rounded-full font-black animate-bounce">
                {ticketsAbertos}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("planos")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "planos"
                ? "bg-indigo-600 text-white shadow-[0_0_12px_rgba(99,102,241,0.4)]"
                : "text-slate-400 hover:text-white hover:bg-slate-800/40"
            }`}
          >
            📋 Modelos de Quota & Planos
          </button>
          
          <button
            onClick={() => setActiveTab("audit")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "audit"
                ? "bg-indigo-600 text-white shadow-[0_0_12px_rgba(99,102,241,0.4)]"
                : "text-slate-405 hover:text-white hover:bg-slate-800/40"
            }`}
          >
            🛡️ Logs de Segurança LGPD
          </button>

          <button
            onClick={() => setActiveTab("status")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "status"
                ? "bg-indigo-600 text-white shadow-[0_0_12px_rgba(99,102,241,0.4)]"
                : "text-slate-400 hover:text-white hover:bg-slate-800/40"
            }`}
          >
            📡 Status do Ecossistema
          </button>
        </div>

        <div className="p-6">
          
          {/* TAB 1: EMPRESAS CLIENTES */}
          {activeTab === "empresas" && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full sm:w-80">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                    <Search size={16} />
                  </span>
                  <input
                    type="text"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    placeholder="Filtrar por nome, cnpj ou email..."
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-indigo-500 focus:bg-slate-950 focus:ring-1 focus:ring-indigo-500/30 transition-all"
                  />
                </div>
                <button
                  onClick={() => setShowNewEmpresaModal(true)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 border border-indigo-400/20 text-white px-4 py-2.5 rounded-xl text-xs font-extrabold transition cursor-pointer shadow-[0_0_15px_rgba(99,102,241,0.2)]"
                >
                  <Plus size={16} /> Integrar Novo Tenant
                </button>
              </div>

              <div className="overflow-x-auto border border-slate-900 rounded-2xl">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-widest text-[9px] border-b border-slate-850">
                    <tr>
                      <th className="px-6 py-4 font-black">Empresa Contratante</th>
                      <th className="px-6 py-4 font-black text-center">Status</th>
                      <th className="px-6 py-4 font-black">Plano Ativo</th>
                      <th className="px-6 py-4 font-black">Limites de Quota</th>
                      <th className="px-6 py-4 font-black text-right">Ação Operacional SaaS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900">
                    {filteredEmpresas.map((emp) => {
                      const p = planos.find((pl) => pl.id === emp.planoId);
                      const isSim_ativo = simulandoEmpresaId === emp.id;
                      return (
                        <tr key={emp.id} className={`hover:bg-slate-900/40 transition-colors ${isSim_ativo ? 'bg-indigo-600/5 border-l-2 border-indigo-500' : ''}`}>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-indigo-950 border border-indigo-800/40 text-indigo-400 font-extrabold text-lg shadow-[inset_0_0_8px_rgba(99,102,241,0.15)]">
                                {emp.nome.charAt(0)}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h5 className="font-bold text-white text-sm">{emp.nome}</h5>
                                  {isSim_ativo && (
                                    <span className="px-1.5 py-0.5 rounded text-[8px] font-black bg-indigo-500 text-white uppercase tracking-widest">
                                      Impersonado
                                    </span>
                                  )}
                                </div>
                                <div className="text-[10px] text-slate-500 space-y-0.5 mt-1 font-mono">
                                  <p>CNPJ: {emp.cnpj}</p>
                                  <p>Responsável: {emp.contato} ({emp.email})</p>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold ${
                                emp.status === "Ativo"
                                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                  : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                              }`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${emp.status === "Ativo" ? "bg-emerald-400 animate-pulse" : "bg-rose-400"}`} />
                              {emp.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-extrabold text-white text-xs px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-1.5 w-fit">
                              <span className="w-1 h-3 rounded-full bg-indigo-500" />
                              {p?.nome || "Sem plano"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-slate-450 font-mono text-[10px]">
                            <p>Usuários: Max {emp.limiteUsuarios}</p>
                            <p>Filiais: Max {emp.limiteFiliais}</p>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <select
                                value={emp.planoId}
                                onChange={(e) => onUpdateEmpresaPlano(emp.id, e.target.value)}
                                className="text-[10px] bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-white focus:border-indigo-500 focus:outline-hidden"
                              >
                                {planos.map((pl) => (
                                  <option key={pl.id} value={pl.id} className="bg-slate-950 text-white">
                                    Plano {pl.nome}
                                  </option>
                                ))}
                              </select>
                              
                              <button
                                onClick={() => onSimulaEmpresa && onSimulaEmpresa(emp.id)}
                                title="Entrar no ERP da Empresa"
                                className="p-2 rounded-lg border border-slate-800 bg-slate-900 hover:bg-indigo-600 hover:text-white hover:border-indigo-500 transition-colors cursor-pointer text-slate-400"
                              >
                                <Eye size={13} />
                              </button>

                              <button
                                onClick={() => onToggleEmpresaStatus(emp.id)}
                                title={emp.status === "Ativo" ? "Suspender Acesso" : "Ativar Acesso"}
                                className={`p-2 rounded-lg border transition ${
                                  emp.status === "Ativo"
                                    ? "bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500 hover:text-white"
                                    : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500 hover:text-white"
                                } cursor-pointer`}
                              >
                                {emp.status === "Ativo" ? <LucideLock size={13} /> : <Unlock size={13} />}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: DOUBLE-APPROVAL CENTER (NEW KEYWORKFLOW) */}
          {activeTab === "solicitacoes" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-extrabold text-white flex items-center gap-2">
                    <ShieldCheck className="text-indigo-400" size={18} />
                    Portal Multitenant de Dupla Autorização & RBAC
                  </h4>
                  <p className="text-xs text-slate-400">
                    Módulos Administrativos, RH e Financeiros são bloqueados de fábrica para funcionários. O Dono da Empresa solicita a liberação, e o Super Admin aprova abaixo para entrar em vigor.
                  </p>
                </div>
                <div className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-full text-[10px] font-mono text-indigo-400">
                  Double Check Ativo
                </div>
              </div>

              {solicitacoes.length === 0 ? (
                <div className="p-12 border border-dashed border-slate-800 rounded-2xl text-center space-y-2 text-slate-500">
                  <ShieldCheck size={36} className="mx-auto opacity-30 text-indigo-400" />
                  <p className="text-sm font-bold text-slate-400">Nenhuma solicitação de acesso processada</p>
                  <p className="text-xs">Liberações de módulos iniciam zeradas até os donos das empresas as requisitarem.</p>
                </div>
              ) : (
                <div className="overflow-x-auto border border-slate-900 rounded-2xl">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-900/80 text-slate-405 uppercase tracking-widest text-[9px] border-b border-slate-850">
                      <tr>
                        <th className="px-6 py-4 font-black">Identificação / Empresa</th>
                        <th className="px-6 py-4 font-black">Módulo Solicitado</th>
                        <th className="px-6 py-4 font-black">Justificativa Operacional</th>
                        <th className="px-6 py-4 font-black">Hierarquia / Nível Solicitante</th>
                        <th className="px-6 py-4 font-black text-center">Status</th>
                        <th className="px-6 py-4 font-black text-right">Ação Rápida Super Admin</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-1000">
                      {solicitacoes.map((sol) => (
                        <tr key={sol.id} className="hover:bg-slate-900/40 transition-colors">
                          <td className="px-6 py-4">
                            <div>
                              <span className="text-[10px] bg-slate-900 text-zinc-400 p-1 rounded font-mono font-bold">{sol.id}</span>
                              <h5 className="font-extrabold text-white mt-1.5">{sol.empresaNome}</h5>
                              <p className="text-[10px] text-indigo-300 mt-0.5">Solicitante: {sol.solicitanteNome}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 font-extrabold border border-indigo-500/20 text-xs">
                              {sol.departamentoSolicitado}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-slate-400 max-w-xs leading-normal">{sol.motivo}</p>
                            <span className="text-[9px] text-slate-500 font-mono mt-1 block">Timestamp: {new Date(sol.data).toLocaleString("pt-BR")}</span>
                          </td>
                          <td className="px-6 py-4 font-mono font-bold text-white uppercase text-[10px]">
                            {sol.nivelRequerido}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-black tracking-widest uppercase ${
                                sol.status === "Aprovado"
                                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                  : sol.status === "Reprovado"
                                  ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                                  : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                              }`}
                            >
                              {sol.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            {sol.status === "Pendente" ? (
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => onAprovarSolicitacao && onAprovarSolicitacao(sol.id)}
                                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-[10px] tracking-wider uppercase transition-colors cursor-pointer"
                                >
                                  Aprovar
                                </button>
                                <button
                                  onClick={() => onRejeitarSolicitacao && onRejeitarSolicitacao(sol.id)}
                                  className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-50 text-white font-black text-[10px] tracking-wider uppercase transition-colors cursor-pointer"
                                >
                                  Rejeitar
                                </button>
                              </div>
                            ) : (
                              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Concluído</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: TICKETS SUPORTE */}
          {activeTab === "tickets" && (
            <div className="space-y-6">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                Suporte Técnico aos Clientes (SLA Monitor)
              </h4>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* List of general tickets */}
                <div className="space-y-3">
                  {tickets.map((tkt) => {
                    const isAberto = tkt.status !== "Resolvido";
                    return (
                      <div
                        key={tkt.id}
                        onClick={() => setSelectedTicketId(tkt.id)}
                        className={`p-4 rounded-xl border transition-all duration-250 cursor-pointer flex flex-col gap-3 leading-normal ${
                          selectedTicketId === tkt.id
                            ? "bg-slate-900 border-indigo-500 ring-2 ring-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.1)]"
                            : isAberto
                            ? "bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900"
                            : "bg-slate-900/20 border-slate-900 opacity-60"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-[9px] font-bold tracking-widest text-indigo-400 uppercase">{tkt.empresaNome}</span>
                            <h5 className="font-extrabold text-white mt-1">{tkt.assunto}</h5>
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                              tkt.status === "Aberto"
                                ? "bg-rose-500/10 text-rose-450 border border-rose-500/20"
                                : tkt.status === "Em Atendimento"
                                ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            }`}
                          >
                            {tkt.status}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-550 border-t border-slate-850 pt-2 font-mono">
                          <p>Módulo: <span className="font-bold text-slate-350">{tkt.categoria}</span></p>
                          <p>SLA Previsto: <span className="text-indigo-400">{tkt.slaHoras} horas</span></p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Reply panel */}
                <div>
                  {selectedTicketId ? (
                    (() => {
                      const activeTkt = tickets.find((t) => t.id === selectedTicketId);
                      if (!activeTkt) return null;
                      return (
                        <div className="p-5 border border-slate-800 rounded-2xl bg-slate-900/80 space-y-4 shadow-lg">
                          <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
                            <div>
                              <h5 className="font-extrabold text-white text-sm">Resolução do Atendimento</h5>
                              <p className="text-xs text-slate-500">{activeTkt.empresaNome}</p>
                            </div>
                            <span className="text-[10px] bg-slate-950 border border-slate-850 text-indigo-350 py-1 px-2.5 rounded-full font-mono">{activeTkt.id}</span>
                          </div>

                          <div className="h-64 overflow-y-auto space-y-3 p-3 bg-slate-950 border border-slate-900 rounded-xl">
                            {activeTkt.mensagens.map((msg, i) => (
                              <div
                                key={i}
                                className={`flex flex-col max-w-[85%] rounded-xl p-3 text-xs leading-normal ${
                                  msg.deAdmin
                                    ? "ml-auto bg-indigo-600 text-white rounded-br-none"
                                    : "mr-auto bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none"
                                }`}
                              >
                                <span className="font-black text-[9px] opacity-75 mb-1 tracking-wider uppercase">
                                  {msg.deAdmin ? "SaaS Master Support" : "Cliente"}
                                </span>
                                <p>{msg.mensagem}</p>
                                <span className="text-[9px] opacity-60 text-right mt-1.5 font-mono">
                                  {new Date(msg.data).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                                </span>
                              </div>
                            ))}
                          </div>

                          {activeTkt.status !== "Resolvido" ? (
                            <div className="space-y-3">
                              <textarea
                                value={respostaTexto}
                                onChange={(e) => setRespostaTexto(e.target.value)}
                                placeholder="Digite sua resposta oficial de suporte..."
                                className="w-full text-xs p-3 bg-slate-950 border border-slate-800 rounded-xl focus:outline-hidden focus:border-indigo-500 text-white font-sans placeholder-slate-600"
                                rows={3}
                              />
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => handleResponderTicketSubmit(activeTkt.id)}
                                  className="px-4 py-2 bg-indigo-650 hover:bg-indigo-600 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors"
                                >
                                  Enviar Resposta Oficial
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-center text-xs flex items-center justify-center gap-1.5">
                              <CheckCircle2 size={16} /> Ticket marcado como Resolvido.
                            </div>
                          )}
                        </div>
                      );
                    })()
                  ) : (
                    <div className="h-full border border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center p-8 text-center text-slate-500 space-y-2">
                      <MessageSquare size={24} className="mb-1 text-slate-600 animate-bounce" />
                      <h5 className="font-bold text-slate-400">Canal de Atendimento</h5>
                      <p className="text-xs max-w-xs">Selecione um chamado da fila ao lado para ver e responder ao cliente contratante no chat.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PLANOS */}
          {activeTab === "planos" && (
            <div className="space-y-6">
              <div>
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <Sliders size={18} className="text-indigo-400" />
                  Metrificação de Planos & Quotas SaaS
                </h4>
                <p className="text-xs text-slate-400">Limitações autorizadas para usuários, filiais e IA no ERP.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {planos.map((pl) => (
                  <div key={pl.id} className="p-6 border border-slate-800 rounded-2xl bg-slate-950 flex flex-col justify-between hover:border-indigo-500/40 transition relative overflow-hidden group">
                    {pl.nome === PlanoTipo.PROFISSIONAL && (
                      <span className="absolute top-2 right-2 bg-indigo-600 text-white text-[8px] font-black px-2 py-0.5 rounded-full tracking-widest uppercase">
                        RECOMENDADO
                      </span>
                    )}
                    <div className="space-y-5">
                      <div>
                        <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">CATEGORIA</span>
                        <h4 className="text-xl font-black text-white">{pl.nome}</h4>
                      </div>
                      <div className="space-y-1">
                        <p className="text-2xl font-black font-mono text-white tracking-tight">
                          R$ {pl.preco.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </p>
                        <span className="text-[10px] text-zinc-500">faturamento recorrente mensal</span>
                      </div>

                      <div className="border-t border-slate-850 pt-4 space-y-3 text-xs text-slate-350">
                        <p className="font-extrabold text-slate-205">Limites das Quotas:</p>
                        <div className="flex justify-between text-[11px]">
                          <span>Usuários por tenant:</span>
                          <span className="font-mono font-bold text-white">{pl.maxUsuarios === 999 ? "Ilimitado" : pl.maxUsuarios}</span>
                        </div>
                        <div className="flex justify-between text-[11px]">
                          <span>Filiais integradas:</span>
                          <span className="font-mono font-bold text-white">{pl.maxFiliais === 99 ? "Ilimitada" : pl.maxFiliais}</span>
                        </div>
                        <div className="pt-2 font-extrabold text-slate-200">Módulos inclusos de fábrica:</div>
                        <ul className="grid grid-cols-2 gap-1.5 text-[10px] text-slate-400 font-mono">
                          {pl.modules.map((m, idx) => (
                            <li key={idx} className="flex items-center gap-1">
                              <span className="w-1 h-1 bg-indigo-400 rounded-full" />
                              {m}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="border-t border-slate-850 mt-6 pt-4 space-y-2">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-405">Inteligência Artificial (Nexus AI)</span>
                        <span className={`px-2 py-0.5 rounded font-mono font-bold text-[9px] ${pl.iaLiberada ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-slate-900 text-slate-500"}`}>
                          {pl.iaLiberada ? "SIM" : "NÃO"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">Acesso API (Webhooks)</span>
                        <span className={`px-2 py-0.5 rounded font-mono font-bold text-[9px] ${pl.apiLiberada ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-slate-900 text-slate-500"}`}>
                          {pl.apiLiberada ? "SIM" : "NÃO"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: AUDITORIA GERAL LGPD */}
          {activeTab === "audit" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-extrabold text-white flex items-center gap-1.5">
                    <ShieldAlert size={18} className="text-rose-500 animate-pulse" />
                    Auditoria de Segurança & logs de Acesso (LGPD Compliance)
                  </h4>
                  <p className="text-xs text-slate-400">Rastreamento completo em tempo real de sessões, alterações financeiras, cadastrais e ações de Donos de Empresas.</p>
                </div>
                <div className="text-xs bg-slate-900 border border-slate-800 p-2 rounded-xl flex items-center gap-2 text-slate-400 font-mono">
                  <Activity size={14} className="text-indigo-400 animate-spin" /> Stream de eventos ativo
                </div>
              </div>

              <div className="overflow-x-auto border border-slate-900 rounded-2xl font-mono text-[11px]">
                <table className="w-full text-left">
                  <thead className="bg-slate-900 text-slate-400 border-b border-slate-850 uppercase text-[9px] tracking-widest">
                    <tr>
                      <th className="px-6 py-3.5">Timestamp UTC</th>
                      <th className="px-6 py-3.5 text-center">Nível</th>
                      <th className="px-6 py-3.5">Identidade</th>
                      <th className="px-6 py-3.5">Operação Executada</th>
                      <th className="px-6 py-3.5 text-right">IP Origem</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-1000 text-slate-300">
                    {logs.map((lg) => (
                      <tr key={lg.id} className="hover:bg-slate-900/30 transition-colors">
                        <td className="px-6 py-3 text-slate-500">
                          {new Date(lg.data).toLocaleString("pt-BR")}
                        </td>
                        <td className="px-6 py-3 text-center">
                          <span
                            className={`px-2 py-0.5 rounded-sm font-black text-[9px] ${
                              lg.nivel === "SYSTEM"
                                ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                                : lg.nivel === "SECURITY"
                                ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                                : "bg-slate-900 text-slate-400"
                            }`}
                          >
                            {lg.nivel}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-white font-bold">{lg.usuarioNome}</td>
                        <td className="px-6 py-3 text-slate-300 font-sans">{lg.acao}</td>
                        <td className="px-6 py-3 text-slate-500 text-right">{lg.ip}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: STATUS SERVIDORES */}
          {activeTab === "status" && (
            <div className="space-y-6">
              <div>
                <h4 className="text-base font-extrabold text-white flex items-center gap-2">
                  <Activity size={18} className="text-emerald-400" />
                  Monitoramento Global do Ambiente SaaS
                </h4>
                <p className="text-xs text-slate-400">Status em tempo real das máquinas, banco de dados isolados e barramento de contingência.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-5 border border-slate-850 rounded-2xl bg-slate-950 space-y-4">
                  <h5 className="font-bold text-white text-sm flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Servidores Cloud Run
                  </h5>
                  <div className="space-y-2 text-xs font-mono text-slate-400">
                    <div className="flex justify-between">
                      <span>Uptime:</span>
                      <span className="text-emerald-400 font-bold">100.00%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tempo de Resposta:</span>
                      <span className="text-slate-200">14ms average</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Uso CPU Máx:</span>
                      <span className="text-slate-200">2.1%</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 border border-slate-850 rounded-2xl bg-slate-950 space-y-4">
                  <h5 className="font-bold text-white text-sm flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                    Banco de Dados Isolated
                  </h5>
                  <div className="space-y-2 text-xs font-mono text-slate-400">
                    <div className="flex justify-between">
                      <span>SaaS Tenants Isolation:</span>
                      <span className="text-indigo-400 font-bold">Ativo (Strict Schema)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Backup automático:</span>
                      <span className="text-emerald-400 font-bold">Habilitado</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sincronização:</span>
                      <span className="text-slate-200">Tempo Real Local</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 border border-slate-850 rounded-2xl bg-slate-950 space-y-4">
                  <h5 className="font-bold text-white text-sm flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                    MFA & Criptografia AES
                  </h5>
                  <div className="space-y-2 text-xs font-mono text-slate-400">
                    <div className="flex justify-between">
                      <span>Criptografia ponta-a-ponta:</span>
                      <span className="text-emerald-400 font-bold">Ativa</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Modo MFA Token:</span>
                      <span className="text-emerald-400 font-bold">Ativo no login</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Requisitos LGPD:</span>
                      <span className="text-emerald-400 font-bold">100% de conformidade</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* MODAL CRIAR EMPRESA - FUTURISTIC */}
      {showNewEmpresaModal && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in text-slate-100">
          <div className="bg-slate-900 rounded-3xl max-w-md w-full border border-slate-800 shadow-2xl overflow-hidden animate-scale-up">
            <div className="p-6 bg-linear-to-r from-indigo-900 to-purple-950 text-white border-b border-indigo-950">
              <h4 className="text-lg font-black font-sans flex items-center gap-2">
                <Building2 size={20} className="text-indigo-400 animate-pulse" />
                Integrar Novo Tenant Contratante
              </h4>
              <p className="text-xs text-slate-300 mt-1">Sua conta Super Admin pode provisionar novos ambientes isolados instantaneamente.</p>
            </div>
            
            <form onSubmit={handleCreateEmpresaSubmit} className="p-6 space-y-4 text-slate-250">
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 tracking-wider uppercase block">Razão Social / Nome Fantasia (*)</label>
                <input
                  type="text"
                  required
                  value={newNome}
                  onChange={(e) => setNewNome(e.target.value)}
                  placeholder="Ex: Alimentos Sabor Brasil S.A."
                  className="w-full text-xs p-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-hidden focus:border-indigo-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 tracking-wider uppercase block">CNPJ (*)</label>
                  <input
                    type="text"
                    required
                    value={newCnpj}
                    onChange={(e) => setNewCnpj(e.target.value)}
                    placeholder="00.000.000/0000-00"
                    className="w-full text-xs p-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-hidden focus:border-indigo-500 font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 tracking-wider uppercase block">Plano SaaS (*)</label>
                  <select
                    value={newPlano}
                    onChange={(e) => setNewPlano(e.target.value)}
                    className="w-full text-xs p-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-hidden focus:border-indigo-500 font-bold"
                  >
                    {planos.map((pl) => (
                      <option key={pl.id} value={pl.id} className="bg-slate-950 text-white">
                        {pl.nome}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 tracking-wider uppercase block">Contato Responsável Principal</label>
                <input
                  type="text"
                  value={newContato}
                  onChange={(e) => setNewContato(e.target.value)}
                  placeholder="Ex: Carlos Eduardo"
                  className="w-full text-xs p-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-hidden focus:border-indigo-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 tracking-wider uppercase block">E-mail Corporativo (*)</label>
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="diretoria@empresa.com"
                    className="w-full text-xs p-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-hidden focus:border-indigo-500 font-medium"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 tracking-wider uppercase block">Telefone Comercial</label>
                  <input
                    type="text"
                    value={newTelefone}
                    onChange={(e) => setNewTelefone(e.target.value)}
                    placeholder="(11) 99999-5555"
                    className="w-full text-xs p-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-hidden focus:border-indigo-500 font-medium"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800 mt-6">
                <button
                  type="button"
                  onClick={() => setShowNewEmpresaModal(false)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-bold text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black tracking-wider uppercase cursor-pointer shadow-[0_0_15px_rgba(99,102,241,0.3)] transition"
                >
                  Provisionar Ambientes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
