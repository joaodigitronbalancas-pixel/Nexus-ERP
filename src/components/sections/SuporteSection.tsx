/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  MessageSquare,
  Plus,
  Send,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertOctagon,
  CornerDownRight
} from "lucide-react";
import { TicketSuporte } from "../../types";

interface SuporteSectionProps {
  empresaId: string;
  tickets: TicketSuporte[];
  onAddTicket: (assunto: string, categoria: string, prioridade: "Baixa" | "Media" | "Alta") => void;
  onAdicionarMensagemCliente: (ticketId: string, mensagem: string) => void;
}

export default function SuporteSection({
  empresaId,
  tickets,
  onAddTicket,
  onAdicionarMensagemCliente
}: SuporteSectionProps) {
  const companyTkts = tickets.filter((t) => t.empresaId === empresaId);

  const [selectedTktId, setSelectedTktId] = useState<string | null>(null);
  const [showNovoTktModal, setShowNovoTktModal] = useState(false);

  // New ticket fields
  const [novoAssunto, setNovoAssunto] = useState("");
  const [novaCat, setNovaCat] = useState("Financeiro");
  const [novaPrioridade, setNovaPrioridade] = useState<"Baixa" | "Media" | "Alta font-bold">("Media" as any);

  // reply field
  const [mensagemTexto, setMensagemTexto] = useState("");

  const handleOpenTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoAssunto) return;
    onAddTicket(novoAssunto, novaCat, novaPrioridade as any);
    setNovoAssunto("");
    setShowNovoTktModal(false);
    alert("Ticket aberto com sucesso! Nossa equipe SaaS responderá em até 4 horas conforme SLA.");
  };

  const handleEnviarMensagem = () => {
    if (!selectedTktId || !mensagemTexto.trim()) return;
    onAdicionarMensagemCliente(selectedTktId, mensagemTexto);
    setMensagemTexto("");
  };

  const selectedTkt = companyTkts.find((t) => t.id === selectedTktId);

  return (
    <div id="suporte-section-layout" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Suporte Técnico & Contratos de SLA</h2>
          <p className="text-xs text-slate-500 font-sans">Abertura de chamados sob demanda (Tickets) e monitoramento de cronogramas contratuais.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Ticket List Column */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-800 text-xs">Seus Chamados de Suporte</h4>
                  <p className="text-[10px] text-slate-400">Tempo médio de resposta contratada: 4h</p>
                </div>
                <button
                  onClick={() => setShowNovoTktModal(true)}
                  className="bg-slate-900 hover:bg-slate-850 text-white font-bold p-1.5 px-3 rounded-xl text-xs flex items-center gap-1 transition cursor-pointer"
                >
                  <Plus size={14} /> Abrir Ticket
                </button>
              </div>

              <div className="space-y-2 max-h-[350px] overflow-y-auto">
                {companyTkts.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTktId(t.id)}
                    className={`p-3.5 border rounded-xl flex flex-col gap-2 cursor-pointer transition text-xs ${
                      selectedTktId === t.id
                        ? "border-indigo-400 bg-indigo-50/20"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-slate-800 line-clamp-1">{t.assunto}</span>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                          t.status === "Aberto"
                            ? "bg-rose-50 text-rose-700"
                            : t.status === "Em Atendimento"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-emerald-50 text-emerald-800"
                        }`}
                      >
                        {t.status}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
                      <span>Cat: {t.categoria}</span>
                      <span>SLA: {t.slaHoras}h</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat conversation area */}
            <div className="md:col-span-2">
              {selectedTkt ? (
                <div className="p-4 border border-slate-200 rounded-2xl bg-slate-50 flex flex-col h-[400px] justify-between">
                  <div className="border-b pb-2 flex justify-between items-center shrink-0">
                    <div>
                      <h5 className="font-bold text-xs text-slate-800">{selectedTkt.assunto}</h5>
                      <p className="text-[10px] text-indigo-750 font-mono">Prioridade: {selectedTkt.prioridade}</p>
                    </div>
                    <span className="text-[10px] font-bold bg-white border p-1 rounded-sm">{selectedTkt.id}</span>
                  </div>

                  <div className="grow my-4 space-y-3 overflow-y-auto p-2">
                    {selectedTkt.mensagens.map((msg, i) => (
                      <div
                        key={i}
                        className={`flex flex-col max-w-[80%] rounded-xl p-3 text-xs ${
                          msg.deAdmin
                            ? "mr-auto bg-white border border-slate-200 text-slate-800 rounded-bl-none"
                            : "ml-auto bg-slate-900 text-white rounded-br-none"
                        }`}
                      >
                        <span className="font-bold text-[9px] opacity-75 mb-1">
                          {msg.deAdmin ? "SaaS Support Agent" : "Sua Empresa (Contratante)"}
                        </span>
                        <p>{msg.mensagem}</p>
                        <span className="text-[8px] opacity-65 text-right mt-1">
                          {new Date(msg.data).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                    ))}
                  </div>

                  {selectedTkt.status !== "Resolvido" ? (
                    <div className="flex gap-2 shrink-0 bg-white p-2 rounded-xl border border-slate-200">
                      <input
                        type="text"
                        value={mensagemTexto}
                        onChange={(e) => setMensagemTexto(e.target.value)}
                        placeholder="Escrever mensagem oficial de retorno..."
                        className="grow text-xs border-0 focus:ring-0 focus:outline-hidden"
                      />
                      <button
                        onClick={handleEnviarMensagem}
                        className="p-1 px-3 bg-slate-100 uppercase text-[10px] font-bold font-sans tracking-wide text-slate-900 border hover:bg-slate-200 rounded cursor-pointer transition"
                      >
                        Enviar
                      </button>
                    </div>
                  ) : (
                    <div className="p-3 bg-emerald-50 text-emerald-800 text-center rounded-xl text-[10px]">
                      Ticket solucionado pelo Suporte Técnico SaaS.
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-full border border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-8 text-center text-slate-400 text-xs">
                  <MessageSquare size={24} className="mb-2 text-slate-300" />
                  <h5 className="font-bold text-slate-700">Selecione um Ticket</h5>
                  <p className="text-slate-500">Clique em qualquer chamado na lista ao lado para interagir e sanar suas dúvidas com o suporte.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CREATE NEW TICKET MODAL */}
      {showNovoTktModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full border border-slate-200 shadow-xl overflow-hidden animate-slide-up text-slate-700 text-xs">
            <div className="p-5 bg-slate-900 text-white">
              <h5 className="text-sm font-bold">Abrir Ticket com Suporte Técnico</h5>
            </div>
            <form onSubmit={handleOpenTicket} className="p-5 space-y-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-505">Assunto Principal (*)</label>
                <input
                  type="text"
                  required
                  value={novoAssunto}
                  onChange={(e) => setNovoAssunto(e.target.value)}
                  placeholder="Ex: Dificuldade na conciliação contábil..."
                  className="w-full p-2.5 border border-slate-205 rounded-xl text-xs bg-white focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-bold text-slate-500">Módulo / Área (*)</label>
                  <select
                    value={novaCat}
                    onChange={(e) => setNovaCat(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-205 rounded-xl text-xs focus:outline-hidden"
                  >
                    <option value="Administrativo">Administrativo</option>
                    <option value="Financeiro">Financeiro / Contábil</option>
                    <option value="PCP / Industrial">PCP / Industrial</option>
                    <option value="Faturamento">Faturamento / XML SEFAZ</option>
                    <option value="Recursos Humanos">Recursos Humanos / DP</option>
                    <option value="Acesso / Limites">Quota / Alteração Plano</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-550">Urgência do SLA (*)</label>
                  <select
                    value={novaPrioridade}
                    onChange={(e) => setNovaPrioridade(e.target.value as any)}
                    className="w-full p-2.5 bg-white border border-slate-205 rounded-xl text-xs focus:outline-hidden"
                  >
                    <option value="Baixa">Comum / Baixa (SLA 24h)</option>
                    <option value="Media">Relevante / Média (SLA 12h)</option>
                    <option value="Alta">Urgente / Alta (SLA 4h)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNovoTktModal(false)}
                  className="px-3 py-1.5 border border-slate-201 rounded-lg text-slate-500"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-slate-900 text-white font-bold rounded-lg cursor-pointer"
                >
                  Transmitir Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
