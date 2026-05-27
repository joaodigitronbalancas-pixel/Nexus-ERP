/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Kanban,
  Target,
  Plus,
  ArrowRight,
  TrendingUp,
  FileSpreadsheet,
  Layers,
  Search,
  DollarSign,
  Briefcase,
  CheckCircle,
  FileText
} from "lucide-react";
import { LeadCRM } from "../../types";

interface ComercialSectionProps {
  empresaId: string;
  leads: LeadCRM[];
  onAddLead: (novo: Omit<LeadCRM, "id" | "empresaId" | "dataAtualizacao" | "notas">) => void;
  onUpdateLeadEstagio: (leadId: string, novoEstagio: "Prospecção" | "Contato" | "Proposta" | "Negociação" | "Fechado") => void;
  onAddLeadNota: (leadId: string, nota: string) => void;
}

export default function ComercialSection({
  empresaId,
  leads,
  onAddLead,
  onUpdateLeadEstagio,
  onAddLeadNota
}: ComercialSectionProps) {
  const [activeTab, setActiveTab] = useState<"crm" | "propostas" | "metas" | "performance">("crm");

  const companyLeads = leads.filter((l) => l.empresaId === empresaId);

  // Kanban pipeline columns
  const estagios: ("Prospecção" | "Contato" | "Proposta" | "Negociação" | "Fechado")[] = [
    "Prospecção",
    "Contato",
    "Proposta",
    "Negociação",
    "Fechado"
  ];

  // Lead creators fields
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [newNome, setNewNome] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newTel, setNewTel] = useState("");
  const [newValor, setNewValor] = useState(15000);
  const [newVendedor, setNewVendedor] = useState("Ana Oliveira");

  // Selected lead detailed inspection
  const [selectedLead, setSelectedLead] = useState<LeadCRM | null>(null);
  const [newNotaText, setNewNotaText] = useState("");

  // Simulated Propostas document creator
  const [showPropostaCreator, setShowPropostaCreator] = useState(false);
  const [propClient, setPropClient] = useState("");
  const [propValor, setPropValor] = useState(25000);
  const [propDesc, setPropDesc] = useState("Escopo de fornecimento de 150 eixos usinados...");

  const handleAddLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNome || !newValor) return;
    onAddLead({
      clienteNome: newNome,
      email: newEmail || "contato@parceiro.com",
      telefone: newTel || "(11) 90000-0000",
      valorEstimado: Number(newValor),
      estagio: "Prospecção",
      vendedorNome: newVendedor
    });
    setNewNome("");
    setNewEmail("");
    setNewTel("");
    setShowLeadModal(false);
  };

  const handleAddNotaSubmit = (leadId: string) => {
    if (!newNotaText.trim()) return;
    onAddLeadNota(leadId, newNotaText);
    setNewNotaText("");
  };

  // Math meters
  const totalPipelineBrl = companyLeads.reduce((sum, item) => sum + item.valorEstimado, 0);
  const totalFechadoBrl = companyLeads
    .filter((l) => l.estagio === "Fechado")
    .reduce((sum, item) => sum + item.valorEstimado, 0);

  const metaGlobalBrl = 300000;
  const percentMeta = (totalFechadoBrl / metaGlobalBrl) * 105;

  return (
    <div id="comercial-section" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Módulo de CRM & Pipeline de Vendas</h2>
          <p className="text-xs text-slate-500">Pipeline de leads, metas de vendas, gerador de propostas contratuais e comissões integradas em tempo real.</p>
        </div>
      </div>

      {/* Comercial quick KPI dials */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-sans text-xs">
        <div className="p-4 bg-white rounded-xl border border-slate-100 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-slate-400">Giro Total em Pipeline</span>
            <p className="text-lg font-black text-indigo-700 mt-1 font-mono">
              R$ {totalPipelineBrl.toLocaleString("pt-BR")},00
            </p>
          </div>
          <span className="p-2 bg-indigo-50 text-indigo-650 rounded-lg">
            <Layers size={18} />
          </span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-100 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-slate-400">Total Vendas Fechadas</span>
            <p className="text-lg font-black text-emerald-600 mt-1 font-mono">
              R$ {totalFechadoBrl.toLocaleString("pt-BR")},00
            </p>
          </div>
          <span className="p-2 bg-emerald-50 text-emerald-650 rounded-lg">
            <TrendingUp size={18} />
          </span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-100 shadow-2xs flex items-center justify-between">
          <div className="grow space-y-1">
            <span className="text-slate-400">Atingimento de Metas</span>
            <p className="text-lg font-black mt-1 text-slate-900">
              {percentMeta.toFixed(1)}% <span className="text-[10px] text-slate-450 font-normal">de R$ 300k</span>
            </p>
          </div>
          <span className="p-2 bg-amber-50 text-amber-600 rounded-lg">
            <Target size={18} />
          </span>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        {/* Nav Header */}
        <div className="flex border-b border-slate-101 bg-slate-50/50 p-2 gap-2">
          <button
            onClick={() => setActiveTab("crm")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === "crm" ? "bg-slate-900 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Kanban size={14} /> Pipeline CRM Kanban
          </button>
          <button
            onClick={() => setActiveTab("propostas")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === "propostas" ? "bg-slate-900 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Briefcase size={14} /> Gerador de Propostas
          </button>
          <button
            onClick={() => setActiveTab("metas")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === "metas" ? "bg-slate-900 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Target size={14} /> Metas Comerciais
          </button>
          <button
            onClick={() => setActiveTab("performance")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === "performance" ? "bg-slate-900 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <TrendingUp size={14} /> Equipe de Vendas
          </button>
        </div>

        <div className="p-6">
          {/* TAB: CRM KANBAN */}
          {activeTab === "crm" && (
            <div className="space-y-4 animate-fade-in text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-800 text-xs">Funil de Leads Ativo</h4>
                  <p className="text-[10px] text-zinc-550">Mova os leads para acelerar os fechamentos orçamentários.</p>
                </div>
                <button
                  onClick={() => setShowLeadModal(true)}
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3 py-2 rounded-xl inline-flex items-center gap-1 transition cursor-pointer"
                >
                  <Plus size={14} /> Novo lead CRM
                </button>
              </div>

              {/* Kanban Grid */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto min-w-[900px] h-96 items-start pb-4">
                {estagios.map((est) => {
                  const estLeads = companyLeads.filter((l) => l.estagio === est);
                  return (
                    <div key={est} className="bg-slate-50 border border-slate-150 p-3 rounded-2xl space-y-3 h-full overflow-y-auto">
                      <div className="flex justify-between items-center px-1 font-sans">
                        <span className="font-extrabold text-[10px] text-slate-600 uppercase tracking-wider">{est}</span>
                        <span className="bg-slate-200 text-slate-805 text-[9px] px-1.5 py-0.5 rounded-full font-mono font-bold">
                          {estLeads.length}
                        </span>
                      </div>

                      <div className="space-y-2">
                        {estLeads.map((ld) => (
                          <div
                            key={ld.id}
                            onClick={() => setSelectedLead(ld)}
                            className="p-3 bg-white border border-slate-100 rounded-xl space-y-1 shadow-2xs hover:border-indigo-400 cursor-pointer transition select-none"
                          >
                            <h5 className="font-black text-slate-800 text-xs leading-none">{ld.clienteNome}</h5>
                            <p className="text-[10px] text-indigo-750 font-bold font-mono">
                              R$ {ld.valorEstimado.toLocaleString("pt-BR")}
                            </p>
                            <div className="flex justify-between items-center pt-2 text-[8px] text-slate-400 border-t border-slate-50 font-sans">
                              <span>Saber mais</span>
                              <span>Resp: {ld.vendedorNome.split(" ")[0]}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB: PROPOSTAS */}
          {activeTab === "propostas" && (
            <div className="space-y-6 animate-fade-in text-xs text-slate-700">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Gerador Automático de Propostas Comerciais</h4>
                  <p className="text-slate-400 text-[10px]">Gere e imprima termos comerciais padrão para formalizar com leads.</p>
                </div>
                <button
                  onClick={() => setShowPropostaCreator(true)}
                  className="bg-slate-900 text-white text-xs font-bold px-3 py-2 rounded-xl"
                >
                  Criar Proposta Oficial
                </button>
              </div>

              {/* Simulated Propostas Paper */}
              <div className="border border-slate-300 p-6 bg-slate-50 rounded-2xl max-w-lg mx-auto font-serif text-[12px] leading-relaxed relative space-y-6 shadow-2xs">
                <div className="absolute top-0 inset-x-0 h-1 bg-slate-800" />
                <div className="text-center space-y-1 font-sans">
                  <h5 className="font-black text-xs uppercase tracking-widest text-slate-900 border-b pb-2">PROPOSTA COMERCIAL DE PRESTAÇÃO</h5>
                  <p className="text-[10px] text-slate-400 font-mono pt-1">Identificador: PRO-2026-NEXUS</p>
                </div>

                <div className="space-y-4">
                  <p><strong>REQUERENTE / COMPRADOR:</strong> {propClient || "Tratores Case Sul S.A."}</p>
                  <p>
                    <strong>ESCOPO DOS SERVIÇOS:</strong> {propDesc || "Escopo geral de fornecimento de materiais usinados, retificados e eixos sob-medida operacionais."}
                  </p>
                  <p>
                    <strong>VALOR COMERCIAL DO CONTRATO:</strong> <strong className="font-sans font-black text-slate-800">R$ {propValor.toLocaleString("pt-BR")},00</strong> (completamente integrado ao faturamento do ERP após transmissão da nota).
                  </p>
                  <p>
                    <strong>CONDIÇÕES DE PAGAMENTO:</strong> Mediante liquidação direta em boleto bancário faturado ou QR Code Pix em 30/60 dias.
                  </p>
                </div>

                <div className="border-t border-slate-300 pt-6 flex justify-between font-sans text-[10px] text-slate-500">
                  <div className="text-center space-y-1">
                    <div className="w-32 border-b border-slate-300 mx-auto" />
                    <p>Por Contratante</p>
                  </div>
                  <div className="text-center space-y-1">
                    <div className="w-32 border-b border-slate-300 mx-auto" />
                    <p>Por Comprador</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: METAS */}
          {activeTab === "metas" && (
            <div className="space-y-6 animate-fade-in text-xs text-slate-700">
              <h5 className="font-bold text-slate-800 text-sm flex items-center gap-1">
                <Target size={16} className="text-indigo-600" /> Metas Trimestrais de Vendas (Q2-2026)
              </h5>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 border border-slate-200 rounded-2xl bg-slate-50 space-y-4">
                  <h6 className="font-bold text-slate-805">Barra de Progresso com SEFAZ Real-Time</h6>
                  <div className="space-y-1 font-sans">
                    <div className="flex justify-between text-xs">
                      <span>Total Realizado:</span>
                      <strong className="font-bold">R$ {totalFechadoBrl.toLocaleString("pt-BR")},00</strong>
                    </div>
                    <div className="w-full bg-slate-205 h-3 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full animate-pulse-slow" style={{ width: `${percentMeta}%` }} />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400 pt-1">
                      <span>Início de período (Lançamentos)</span>
                      <span>Objetivo do plano: R$ 300.000,00</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 bg-indigo-950 text-indigo-100 rounded-2xl flex flex-col justify-between">
                  <div>
                    <h6 className="font-black text-white text-[13px]">Previsões e Insights Comerciais</h6>
                    <p className="text-[11px] text-indigo-305 leading-normal pt-1.5 font-sans">
                      Com os leads nas etapas de "Proposta" e "Negociação", a estimativa ponderada de conversão comercial aponta que a meta trimestral de R$ 300.000,00 será superada em até 12% no fechamento da competência atual de 2026.
                    </p>
                  </div>
                  <div className="p-2.5 bg-indigo-900 border border-indigo-800 rounded-xl mt-3 text-[10px] text-slate-200">
                    Sugerido: Estimular follow-up com <strong>Caterpillar S.A.</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: PERFORMANCE */}
          {activeTab === "performance" && (
            <div className="space-y-4 animate-fade-in text-xs">
              <h5 className="font-bold text-slate-805 text-sm">Leaderboard de Faturamento da Equipe</h5>
              <div className="space-y-3">
                <div className="p-4 border border-slate-100 rounded-xl bg-white flex items-center justify-between">
                  <div className="space-y-1 grow mr-6">
                    <p className="font-bold">Ana Oliveira (Consultora Comercial Sênior)</p>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full" style={{ width: "85%" }} />
                    </div>
                  </div>
                  <strong className="font-mono text-emerald-600 font-black">R$ 165.000,00 faturados</strong>
                </div>

                <div className="p-4 border border-slate-100 rounded-xl bg-white flex items-center justify-between">
                  <div className="space-y-1 grow mr-6">
                    <p className="font-bold">Antônio Ferreira (Diretor de Contas Globais)</p>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-indigo-600 h-full" style={{ width: "55%" }} />
                    </div>
                  </div>
                  <strong className="font-mono text-indigo-700 font-black">R$ 127.500,00 faturados</strong>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* LEAD DETAILED REVIEW DRAWER/MODAL */}
      {selectedLead && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full border border-slate-200 shadow-xl overflow-hidden animate-slide-up text-slate-705 text-xs">
            <div className="p-5 bg-slate-900 text-white flex justify-between items-center font-sans">
              <div>
                <span className="text-[10px] bg-indigo-505 text-white/80 border border-white/20 p-1 rounded font-bold">{selectedLead.estagio}</span>
                <h5 className="font-bold text-sm mt-2">{selectedLead.clienteNome}</h5>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="text-xs bg-white/10 hover:bg-white/20 px-3/2 py-2 rounded text-white"
              >
                Voltar
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="space-y-1 font-sans">
                <p><strong>Valor Planejado:</strong> R$ {selectedLead.valorEstimado.toLocaleString("pt-BR")}</p>
                <p><strong>Consultor Contábil:</strong> {selectedLead.vendedorNome}</p>
                <p><strong>E-mail:</strong> {selectedLead.email}</p>
                <p><strong>Ação Comercial de Avanço:</strong></p>
                <select
                  value={selectedLead.estagio}
                  onChange={(e) => onUpdateLeadEstagio(selectedLead.id, e.target.value as any)}
                  className="p-2 border border-slate-200 bg-white rounded-xl w-full text-xs font-bold font-sans mt-1"
                >
                  <option value="Prospecção">Prospecção</option>
                  <option value="Contato">Contato Inicial</option>
                  <option value="Proposta">Proposta Comercial</option>
                  <option value="Negociação">Negociação direta</option>
                  <option value="Fechado">Fechado ! (Ativar faturamento)</option>
                </select>
              </div>

              {/* Notes sections */}
              <div className="space-y-2 border-t border-slate-100 pt-3">
                <p className="font-black">Histórico de Atividades (Follow-up):</p>
                <div className="p-2 bg-slate-50 font-sans text-[11px] space-y-1.5 rounded-lg max-h-32 overflow-y-auto border">
                  {selectedLead.notas && selectedLead.notas.map((nt, index) => (
                    <p key={index} className="pb-1 border-b border-slate-200/55 text-slate-700 italic">
                      - {nt}
                    </p>
                  ))}
                </div>

                <div className="flex gap-1.5 pt-2">
                  <input
                    type="text"
                    value={newNotaText}
                    onChange={(e) => setNewNotaText(e.target.value)}
                    placeholder="Escrever nota de follow-up..."
                    className="grow p-2 border border-slate-200 rounded-lg text-xs"
                  />
                  <button
                    onClick={() => handleAddNotaSubmit(selectedLead.id)}
                    className="p-2 bg-slate-900 font-bold text-white rounded-lg px-3"
                  >
                    Gravar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL NOVO LEAD */}
      {showLeadModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 text-slate-700 text-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full border border-slate-200 shadow-xl overflow-hidden animate-slide-up">
            <div className="p-5 bg-slate-900 text-white">
              <h5 className="text-sm font-bold">Prospectar Novo Lead (CRM)</h5>
            </div>
            <form onSubmit={handleAddLeadSubmit} className="p-5 space-y-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-500">Razão Social / Nome do Lead (*)</label>
                <input
                  type="text"
                  required
                  value={newNome}
                  onChange={(e) => setNewNome(e.target.value)}
                  placeholder="Ex: Tratores Case Sul S.A."
                  className="w-full p-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-bold text-slate-500">Valor Estimado Contrato (*)</label>
                  <input
                    type="number"
                    required
                    value={newValor}
                    onChange={(e) => setNewValor(Number(e.target.value))}
                    className="w-full p-2 border border-slate-200 rounded-lg text-sm font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-500">Qualificado Para Vendedor</label>
                  <select
                    value={newVendedor}
                    onChange={(e) => setNewVendedor(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg text-sm"
                  >
                    <option value="Ana Oliveira">Ana Oliveira</option>
                    <option value="Antônio Ferreira">Antônio Ferreira</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-bold text-slate-500">E-mail Lead</label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="suprimentos@lead.com"
                    className="w-full p-2 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-500">Telefone Contato</label>
                  <input
                    type="text"
                    value={newTel}
                    onChange={(e) => setNewTel(e.target.value)}
                    placeholder="(51) 90000-0000"
                    className="w-full p-2 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowLeadModal(false)}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg text-slate-500"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold"
                >
                  Confirmar Qualificação
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL NOVO PROPOSTA CREATOR */}
      {showPropostaCreator && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 text-slate-700 text-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full border border-slate-200 shadow-xl overflow-hidden animate-slide-up">
            <div className="p-5 bg-slate-900 text-white text-center">
              <h5 className="text-sm font-bold">Gerar Declaração de Proposta</h5>
            </div>
            <div className="p-5 space-y-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-500">Lead Comprador</label>
                <input
                  type="text"
                  value={propClient}
                  onChange={(e) => setPropClient(e.target.value)}
                  placeholder="Ex: Tratores Case Sul S.A."
                  className="w-full p-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-500">Valor Planejado Proposta (R$)</label>
                <input
                  type="number"
                  value={propValor}
                  onChange={(e) => setPropValor(Number(e.target.value))}
                  className="w-full p-2 border border-slate-200 rounded-lg text-sm font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-500">Descrição Escopo Técnico</label>
                <textarea
                  value={propDesc}
                  onChange={(e) => setPropDesc(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg text-sm"
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowPropostaCreator(false)}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg text-slate-500"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    setShowPropostaCreator(false);
                    alert("A proposta comercial foi atualizada com o modelo e os valores inseridos!");
                  }}
                  className="px-3 py-1.5 bg-slate-900 text-white rounded-lg font-bold"
                >
                  Registrar Orçamento
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
