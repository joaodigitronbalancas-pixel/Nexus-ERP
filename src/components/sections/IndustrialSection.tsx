/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Factory,
  Cog,
  Wrench,
  CheckCircle,
  Activity,
  Plus,
  Play,
  RotateCcw,
  Gauge,
  AlertTriangle,
  Flame,
  Clock
} from "lucide-react";
import { OrdemProducao, Maquina } from "../../types";

interface IndustrialSectionProps {
  empresaId: string;
  ordensProducao: OrdemProducao[];
  maquinas: Maquina[];
  onAddOrdemProducao: (nova: Omit<OrdemProducao, "id" | "empresaId">) => void;
  onUpdateOrdemStatus: (opId: string, novoStatus: "Planejada" | "Em Producao" | "Pausada" | "Concluida") => void;
  onUpdateMaquinaStatus: (maquinaId: string, novoStatus: "Operando" | "Manutencao" | "Ociosa") => void;
}

export default function IndustrialSection({
  empresaId,
  ordensProducao,
  maquinas,
  onAddOrdemProducao,
  onUpdateOrdemStatus,
  onUpdateMaquinaStatus
}: IndustrialSectionProps) {
  const [activeTab, setActiveTab] = useState<"pcp" | "maquinas" | "qualidade" | "kpi">("pcp");

  const companyOps = ordensProducao.filter((op) => op.empresaId === empresaId);

  // New OP Form state
  const [showOpModal, setShowOpModal] = useState(false);
  const [newCod, setNewCod] = useState("OP-2026-2213");
  const [newProd, setNewProd] = useState("");
  const [newQtd, setNewQtd] = useState(250);
  const [newMaterialLoss, setNewMaterialLoss] = useState(0);

  const handleAddOpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProd) return;
    onAddOrdemProducao({
      codigo: newCod,
      produtoNome: newProd,
      quantidadePlanejada: Number(newQtd),
      quantidadeProduzida: 0,
      status: "Planejada",
      dataInicio: new Date().toISOString().split("T")[0],
      dataFimPrevia: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      perdaMaterialKg: Number(newMaterialLoss) || 0
    });
    alert("Ordem de Produção (OP) inserida no Planejamento (PCP)!");
    setNewProd("");
    setNewCod(`OP-2026-${Math.floor(Math.random() * 9000) + 1000}`);
    setShowOpModal(false);
  };

  // Math variables for industrial charts
  const totalKgPerdas = companyOps.reduce((sum, item) => sum + item.perdaMaterialKg, 0);
  const totalPlanejado = companyOps.reduce((sum, item) => sum + item.quantidadePlanejada, 0);
  const totalProduzido = companyOps.reduce((sum, item) => sum + item.quantidadeProduzida, 0);
  const percentEmProgresso = totalPlanejado > 0 ? (totalProduzido / totalPlanejado) * 100 : 0;

  return (
    <div id="industrial-layout" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Módulo Planejamento & Controle de Produção (PCP)</h2>
          <p className="text-xs text-slate-500">Monitorização em tempo real de linhas de usinagem, ordens de serviço fabris (OPs) e eficácia OEE.</p>
        </div>
      </div>

      {/* Industrial Quick Stats bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-slate-100 bg-white shadow-2xs font-sans text-xs">
          <p className="text-slate-400">Total OPs Planejadas</p>
          <p className="text-xl font-black mt-1 text-indigo-700">{companyOps.length}</p>
        </div>
        <div className="p-4 rounded-xl border border-slate-100 bg-white shadow-2xs font-sans text-xs">
          <p className="text-slate-400">Progresso Produção Geral</p>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-xl font-black text-slate-800">{percentEmProgresso.toFixed(1)}%</p>
            <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full animate-pulse-slow" style={{ width: `${percentEmProgresso}%` }}></div>
            </div>
          </div>
        </div>
        <div className="p-4 rounded-xl border border-slate-100 bg-white shadow-2xs font-sans text-xs">
          <p className="text-slate-400">Perdas Mecânicas (Insumos)</p>
          <p className="text-xl font-black mt-1 text-rose-600 font-mono">{totalKgPerdas.toFixed(1)} Kg</p>
        </div>
        <div className="p-4 rounded-xl border border-slate-100 bg-white shadow-2xs font-sans text-xs">
          <p className="text-slate-400">OEE Equipamento Escopo</p>
          <p className="text-xl font-black mt-1 text-emerald-600 font-mono">81.5%<span className="text-[10px] font-normal text-slate-400"> ideal</span></p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-105 bg-slate-50/50 p-2 gap-2">
          <button
            onClick={() => setActiveTab("pcp")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === "pcp" ? "bg-slate-900 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Factory size={14} /> Ordens de Produção (OP)
          </button>
          <button
            onClick={() => setActiveTab("maquinas")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === "maquinas" ? "bg-slate-900 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Cog size={14} /> Monitor de Máquinas
          </button>
          <button
            onClick={() => setActiveTab("qualidade")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === "qualidade" ? "bg-slate-900 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <CheckCircle size={14} /> Controle de Qualidade
          </button>
          <button
            onClick={() => setActiveTab("kpi")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === "kpi" ? "bg-slate-900 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Gauge size={14} /> Rendimento e OEE
          </button>
        </div>

        <div className="p-6">
          {/* TAB: PCP */}
          {activeTab === "pcp" && (
            <div className="space-y-4 animate-fade-in text-xs text-slate-705">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-800 text-xs">Acompanhamento do PCP Ativo</h4>
                  <p className="text-[10px] text-slate-400">Fluxo cronometrado das usinagens e retificações.</p>
                </div>
                <button
                  onClick={() => setShowOpModal(true)}
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3 py-2 rounded-xl inline-flex items-center gap-1 transition cursor-pointer"
                >
                  <Plus size={14} /> Gerar Ordem de Produção
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {companyOps.map((op) => {
                  const percentOp = op.quantidadePlanejada > 0 ? (op.quantidadeProduzida / op.quantidadePlanejada) * 100 : 0;
                  return (
                    <div key={op.id} className="p-4 border border-zinc-200 rounded-xl bg-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1 md:w-1/3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono bg-white border px-2 py-0.5 rounded font-extrabold text-[10px]">
                            {op.codigo}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded font-bold text-[9px] ${
                              op.status === "Em Producao"
                                ? "bg-indigo-50 text-indigo-800 animate-pulse-slow"
                                : op.status === "Concluida"
                                ? "bg-emerald-50 text-emerald-800"
                                : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            • {op.status}
                          </span>
                        </div>
                        <h5 className="font-black text-[13px] text-slate-900 leading-tight pt-1">{op.produtoNome}</h5>
                      </div>

                      <div className="w-full md:w-1/3 space-y-1">
                        <div className="flex justify-between items-center text-[10px]">
                          <span>Progresso Unidades:</span>
                          <span className="font-mono font-bold text-slate-900">{op.quantidadeProduzida} / {op.quantidadePlanejada} un</span>
                        </div>
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition ${op.status === "Concluida" ? "bg-emerald-500" : "bg-indigo-600"}`}
                            style={{ width: `${percentOp}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-[10px] md:w-1/4 justify-end font-sans">
                        {op.status === "Planejada" && (
                          <button
                            onClick={() => onUpdateOrdemStatus(op.id, "Em Producao")}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold p-1 px-3 rounded flex items-center gap-1 transition"
                          >
                            <Play size={10} fill="currentColor" /> Iniciar
                          </button>
                        )}
                        {op.status === "Em Producao" && (
                          <button
                            onClick={() => onUpdateOrdemStatus(op.id, "Concluida")}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold p-1 px-3 rounded flex items-center gap-1 transition"
                          >
                            Concluir
                          </button>
                        )}
                        {op.status === "Concluida" && (
                          <span className="text-emerald-600 font-bold flex items-center gap-1">
                            <CheckCircle size={14} /> OP Integrada
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB: MONITOR MAQUINAS */}
          {activeTab === "maquinas" && (
            <div className="space-y-4 animate-fade-in text-xs">
              <h5 className="font-bold text-slate-800 text-sm">Disponibilidade Geral de Ativos Industriais</h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {maquinas.map((maq) => (
                  <div key={maq.id} className="p-4 border border-slate-200 bg-white rounded-xl shadow-2xs relative flex flex-col justify-between hover:border-slate-350 transition">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className={`px-2 py-0.5 rounded font-bold text-[9px] ${
                          maq.status === "Operando"
                            ? "bg-emerald-50 text-emerald-800"
                            : maq.status === "Manutencao"
                            ? "bg-rose-50 text-rose-800"
                            : "bg-slate-100 text-slate-500"
                        }`}>
                          • {maq.status}
                        </span>
                        <span className="font-bold text-indigo-700 text-[10px] bg-indigo-50 px-1.5 py-0.5 rounded-sm font-mono">OEE {maq.eficienciaOEE}%</span>
                      </div>
                      <h6 className="font-black text-slate-800 text-[13px] leading-tight pt-1 flex items-center gap-1">
                        <Flame size={14} className={maq.status === "Operando" ? "text-amber-500 animate-pulse" : "text-slate-300"} />
                        {maq.nome}
                      </h6>
                      <p className="text-[10px] text-zinc-500">Próxima Parada: <span className="font-mono text-slate-700 font-bold">{maq.proximaManutencao}</span></p>
                    </div>

                    <div className="border-t border-slate-50 mt-4 pt-2 flex justify-between">
                      <button
                        onClick={() => onUpdateMaquinaStatus(maq.id, "Operando")}
                        className="text-[9px] text-emerald-700 bg-emerald-50 hover:bg-emerald-100 font-bold p-1 rounded transition"
                      >
                        Ligar
                      </button>
                      <button
                        onClick={() => onUpdateMaquinaStatus(maq.id, "Manutencao")}
                        className="text-[9px] text-rose-700 bg-rose-50 hover:bg-rose-100 font-bold p-1 rounded transition"
                      >
                        Consertar
                      </button>
                      <button
                        onClick={() => onUpdateMaquinaStatus(maq.id, "Ociosa")}
                        className="text-[9px] text-slate-500 bg-slate-100 hover:bg-slate-200 font-bold p-1 rounded transition"
                      >
                        Pausar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: QUALIDADE */}
          {activeTab === "qualidade" && (
            <div className="space-y-6 animate-fade-in text-xs text-slate-750">
              <div className="flex items-center gap-2">
                <CheckCircle size={18} className="text-indigo-600" />
                <h5 className="font-bold text-slate-800 text-sm">Controle de Qualidade (ISO / SGQ)</h5>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 border border-slate-200 rounded-2xl bg-slate-50 space-y-4">
                  <h6 className="font-bold text-slate-800">Checklist de Aprovação Termo Técnico</h6>
                  <ul className="space-y-2 font-sans text-xs">
                    <li className="flex items-center gap-2 text-slate-650 bg-white p-2 rounded border border-slate-150">
                      <span className="p-0.5 bg-emerald-100 text-emerald-700 rounded-xs">✓</span>
                      Medição via Micrômetro com Desvio de Tolerenacia Máx ±0.02mm
                    </li>
                    <li className="flex items-center gap-2 text-slate-650 bg-white p-2 rounded border border-slate-150">
                      <span className="p-0.5 bg-emerald-100 text-emerald-700 rounded-xs">✓</span>
                      Dureza de Tratamento Térmico Aço Carbono Rockwell C-45
                    </li>
                    <li className="flex items-center gap-2 text-slate-650 bg-white p-2 rounded border border-slate-150">
                      <span className="p-0.5 bg-emerald-100 text-emerald-700 rounded-xs">✓</span>
                      Furação com Rosca Calibradora M12 sem rebarba ou desgaste
                    </li>
                  </ul>
                </div>

                <div className="p-5 bg-slate-900 text-slate-100 rounded-2xl flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-amber-500 uppercase font-mono">Boletim de Retrabalho</span>
                    <h6 className="font-extrabold text-[13px] text-white">Taxa Geral de Sucata/Perdas: <strong>1.5%</strong></h6>
                    <p className="text-[11px] text-slate-400 leading-normal font-sans pt-1">
                      Sua célula Mazak apresentou desvio de calibragem que resultou na perda de {totalKgPerdas.toFixed(1)} Kg de sucata de bronze laminado. O operador efetuou o balanceamento do cabeçote.
                    </p>
                  </div>
                  <div className="p-3 bg-slate-800 rounded-xl mt-3 text-[10px] text-slate-350">
                    Última Inspeção: <strong className="text-white">Hoje - Antônio Ferreira (Diretor Técnico)</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: RENDIMENTO */}
          {activeTab === "kpi" && (
            <div className="space-y-6 animate-fade-in text-xs">
              <h5 className="font-bold text-slate-800 text-sm">Dashboard de KPIs de Produtividade Industrial</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 border border-slate-200 rounded-2xl bg-white space-y-4">
                  <h6 className="font-bold text-slate-800">Indicador OEE Integrado (Disponibilidade x Qualidade x Performance)</h6>
                  <div className="space-y-3 font-sans">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span>Disponibilidade da Linha (Trabalhado / Agendado):</span>
                        <strong className="font-mono text-indigo-700">92.4%</strong>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-indigo-600 h-full" style={{ width: "92.4%" }}></div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span>Performance Velocidade (Usinagem CNC):</span>
                        <strong className="font-mono text-indigo-700">85.0%</strong>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-indigo-605 h-full" style={{ width: "85%" }}></div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span>Índice de Qualidade (Peças Aprovadas / Produzido):</span>
                        <strong className="font-mono text-emerald-600">98.5%</strong>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full" style={{ width: "98.5%" }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] text-indigo-405 font-bold uppercase font-mono tracking-wider">Metas da Célula Fabril</span>
                    <h6 className="text-[13px] font-extrabold">Otimização das manutenções de eixos</h6>
                    <p className="text-[11px] text-indigo-200 leading-normal pt-1.5 font-sans">
                      Com a manutenção preventiva agendada para Mazak CNC, prevemos uma redução de recalibragem de 12 minutos por lote, aumentando o OEE geral consolidado em até 4%.
                    </p>
                  </div>
                  <div className="p-3 bg-white/5 border border-white/10 rounded-xl mt-4 font-mono text-[10px]">
                    Status: <strong className="text-emerald-400">Progresso Conforme o Planejado</strong>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODAL NOVA OP */}
      {showOpModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in text-slate-750">
          <div className="bg-white rounded-2xl max-w-sm w-full border border-slate-200 shadow-xl overflow-hidden animate-slide-up text-slate-700">
            <div className="p-5 bg-slate-900 text-white">
              <h5 className="text-sm font-bold">Cadastrar Ordem de Produção (OP)</h5>
            </div>
            <form onSubmit={handleAddOpSubmit} className="p-5 space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-500">Código Sequencial OP (*)</label>
                <input
                  type="text"
                  required
                  value={newCod}
                  onChange={(e) => setNewCod(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg text-sm font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-500">Produto a Usinar (*)</label>
                <input
                  type="text"
                  required
                  value={newProd}
                  onChange={(e) => setNewProd(e.target.value)}
                  placeholder="Ex: Mancais Helicoidais Retificados"
                  className="w-full p-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-bold text-slate-500">Unidades Planejadas (*)</label>
                  <input
                    type="number"
                    required
                    value={newQtd}
                    onChange={(e) => setNewQtd(Number(e.target.value))}
                    className="w-full p-2 border border-slate-200 rounded-lg text-sm font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-500">Previsão Perdas Insumo (Kg)</label>
                  <input
                    type="number"
                    value={newMaterialLoss}
                    onChange={(e) => setNewMaterialLoss(Number(e.target.value))}
                    className="w-full p-2 border border-slate-200 rounded-lg text-sm font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowOpModal(false)}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg text-slate-500"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold"
                >
                  Confirmar PCP
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
