/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  FileSpreadsheet,
  Plus,
  QrCode,
  Barcode,
  Percent,
  Calculator,
  RotateCcw,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { MovimentacaoFinanceira } from "../../types";

interface FinanceiroSectionProps {
  empresaId: string;
  transacoes: MovimentacaoFinanceira[];
  onAddTransacao: (nova: Omit<MovimentacaoFinanceira, "id" | "empresaId">) => void;
  onLiquidarTransacao: (transacaoId: string) => void;
}

export default function FinanceiroSection({
  empresaId,
  transacoes,
  onAddTransacao,
  onLiquidarTransacao
}: FinanceiroSectionProps) {
  const [activeTab, setActiveTab] = useState<"fluxo" | "comprovante" | "dre" | "custos">("fluxo");

  const companyTrans = transacoes.filter((t) => t.empresaId === empresaId);

  // New Transaction Form states
  const [showTransModal, setShowTransModal] = useState(false);
  const [newDesc, setNewDesc] = useState("");
  const [newTipo, setNewTipo] = useState<"Receita" | "Despesa">("Receita");
  const [newValor, setNewValor] = useState(100);
  const [newCentro, setNewCentro] = useState("Vendas Gerais");
  const [newCat, setNewCat] = useState("Faturamento");
  const [newStatus, setNewStatus] = useState<"Pago" | "Pendente">("Pago");

  // Pix/Boleto generator
  const [selectedTransForReceipt, setSelectedTransForReceipt] = useState<MovimentacaoFinanceira | null>(null);
  const [receiptType, setReceiptType] = useState<"pix" | "boleto">("pix");

  // Computational states
  const totalReceitas = companyTrans
    .filter((t) => t.tipo === "Receita" && t.status === "Pago")
    .reduce((sum, t) => sum + t.valor, 0);

  const totalDespesas = companyTrans
    .filter((t) => t.tipo === "Despesa" && t.status === "Pago")
    .reduce((sum, t) => sum + t.valor, 0);

  const saldoLiquido = totalReceitas - totalDespesas;

  // DRE Math Model
  const receitaBruta = companyTrans.filter((t) => t.tipo === "Receita").reduce((sum, t) => sum + t.valor, 0);
  const custosVenda = companyTrans.filter((t) => t.tipo === "Despesa" && t.centroCusto.includes("Produção")).reduce((sum, t) => sum + t.valor, 0);
  const despesasOp = companyTrans.filter((t) => t.tipo === "Despesa" && !t.centroCusto.includes("Produção")).reduce((sum, t) => sum + t.valor, 0);
  const resultadoAntesImposto = receitaBruta - custosVenda - despesasOp;
  const impostoSimulado = resultadoAntesImposto > 0 ? resultadoAntesImposto * 0.08 : 0; // 8% Simulado Simples Nacional
  const lucroLiquido = resultadoAntesImposto - impostoSimulado;

  const handleAddTransSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDesc || !newValor) return;
    onAddTransacao({
      descricao: newDesc,
      tipo: newTipo,
      valor: Number(newValor),
      centroCusto: newCentro,
      data: new Date().toISOString().split("T")[0],
      categoria: newCat,
      status: newStatus
    });
    setNewDesc("");
    setNewValor(100);
    setShowTransModal(false);
  };

  return (
    <div id="financeiro-section-layout" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Módulo Gestão Financeira Inteligente</h2>
          <p className="text-xs text-slate-500">Controlo de contas a pagar e receber, demonstrativos contábeis consolidados (DRE) e emissões automáticas.</p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-white border border-slate-100 rounded-2xl flex items-center justify-between shadow-2xs">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Receitas Validadas</span>
            <p className="text-xl font-black font-mono text-emerald-600">
              R$ {totalReceitas.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </p>
            <p className="text-[10px] text-slate-500 font-mono">Consolidado em conta corrente</p>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <ArrowUpRight size={22} />
          </div>
        </div>

        <div className="p-5 bg-white border border-slate-100 rounded-2xl flex items-center justify-between shadow-2xs">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Despesas Quitadas</span>
            <p className="text-xl font-black font-mono text-rose-600">
              R$ {totalDespesas.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </p>
            <p className="text-[10px] text-slate-500 font-mono">Débitos reconciliados</p>
          </div>
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
            <ArrowDownRight size={22} />
          </div>
        </div>

        <div className="p-5 bg-white border border-slate-100 rounded-2xl flex items-center justify-between shadow-2xs">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Saldo de Caixa Atual</span>
            <p className={`text-xl font-black font-mono ${saldoLiquido >= 0 ? "text-slate-900" : "text-rose-700"}`}>
              R$ {saldoLiquido.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </p>
            <p className="text-[10px] text-slate-500 font-mono">Eficácia operacional</p>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <Wallet size={22} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-100 bg-slate-50/50 p-2 gap-2">
          <button
            onClick={() => setActiveTab("fluxo")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === "fluxo" ? "bg-slate-900 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Calculator size={14} /> Caixa & Lançamentos
          </button>
          <button
            onClick={() => setActiveTab("comprovante")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === "comprovante" ? "bg-slate-900 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <QrCode size={14} /> Pix & Boletos Cobrança
          </button>
          <button
            onClick={() => setActiveTab("dre")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === "dre" ? "bg-slate-900 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <FileSpreadsheet size={14} /> Demonstrativo DRE
          </button>
          <button
            onClick={() => setActiveTab("custos")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === "custos" ? "bg-slate-900 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Percent size={14} /> Centros de Custo
          </button>
        </div>

        <div className="p-6">
          {/* TAB: fluxo */}
          {activeTab === "fluxo" && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-800">Contas a Pagar & Receber</h4>
                  <p className="text-xs text-slate-400 font-mono">Faturamento acumulado: {companyTrans.length} transações.</p>
                </div>
                <button
                  onClick={() => setShowTransModal(true)}
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3 py-2 rounded-xl inline-flex items-center gap-1 transition cursor-pointer"
                >
                  <Plus size={14} /> Novo Lançamento
                </button>
              </div>

              <div className="overflow-x-auto border border-slate-100 rounded-xl">
                <table className="w-full text-left text-sm text-slate-700">
                  <thead className="bg-slate-50 text-xs text-slate-500 uppercase border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-3">Lançamento / Histórico</th>
                      <th className="px-6 py-3">Tipo</th>
                      <th className="px-6 py-3">Competência</th>
                      <th className="px-6 py-3">Centro de Custo</th>
                      <th className="px-6 py-3">Valor BRL</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3 text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {companyTrans.map((t) => (
                      <tr key={t.id} className="hover:bg-slate-50/50">
                        <td className="px-6 py-4 font-bold text-slate-800">{t.descricao}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] ${t.tipo === "Receita" ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-800"}`}>
                            {t.tipo === "Receita" ? "Receita" : "Despesa"}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-mono">{t.data}</td>
                        <td className="px-6 py-4">{t.centroCusto}</td>
                        <td className="px-6 py-4 font-black font-mono">
                          R$ {t.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 font-bold ${t.status === "Pago" ? "text-emerald-700" : "text-amber-600"}`}>
                            {t.status === "Pago" ? "🟢 Liquidado" : "🟡 Pendente"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {t.status === "Pendente" ? (
                            <button
                              onClick={() => onLiquidarTransacao(t.id)}
                              className="text-[10px] bg-slate-900 text-white py-1 px-2.5 rounded font-bold hover:bg-emerald-600 transition"
                            >
                              Quitar
                            </button>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-semibold italic">Sem pendências</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: COMPROVANTE */}
          {activeTab === "comprovante" && (
            <div className="space-y-6 animate-fade-in">
              <div className="max-w-xl space-y-2">
                <h4 className="font-bold text-slate-800">Emissor de Boletos Registrados e instantâneo PIX</h4>
                <p className="text-xs text-slate-400">Emissão de recebíveis vinculados ao fluxo de contas a receber do ERP.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Pending collections selects */}
                <div className="space-y-3">
                  <h5 className="font-bold text-slate-800 text-xs">Escolha o Recebível Pendente:</h5>
                  <div className="space-y-2 h-72 overflow-y-auto">
                    {companyTrans
                      .filter((t) => t.tipo === "Receita")
                      .map((t) => (
                        <div
                          key={t.id}
                          onClick={() => setSelectedTransForReceipt(t)}
                          className={`p-3 border rounded-xl flex justify-between items-center cursor-pointer hover:bg-slate-50 transition ${
                            selectedTransForReceipt?.id === t.id ? "border-indigo-400 bg-indigo-50/20" : "border-slate-200"
                          }`}
                        >
                          <div>
                            <p className="font-bold text-slate-800 text-xs">{t.descricao}</p>
                            <p className="text-[10px] text-slate-400 font-mono">Vencimento: {t.data}</p>
                          </div>
                          <span className="font-bold text-slate-900 font-mono text-xs">
                            R$ {t.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Simulated Output Layout */}
                <div>
                  {selectedTransForReceipt ? (
                    <div className="p-5 border border-slate-200 rounded-2xl bg-slate-50 text-slate-800 relative space-y-4">
                      <div className="flex gap-2 p-0.5 bg-slate-200 rounded-lg">
                        <button
                          onClick={() => setReceiptType("pix")}
                          className={`flex-1 font-bold py-1 px-2.5 rounded text-[11px] transition ${
                            receiptType === "pix" ? "bg-slate-900 text-white" : "text-slate-600"
                          }`}
                        >
                          PIX Dinâmico (QR)
                        </button>
                        <button
                          onClick={() => setReceiptType("boleto")}
                          className={`flex-1 font-bold py-1 px-2.5 rounded text-[11px] transition ${
                            receiptType === "boleto" ? "bg-slate-900 text-white" : "text-slate-600"
                          }`}
                        >
                          Boleto Bancário (Nacional)
                        </button>
                      </div>

                      {receiptType === "pix" ? (
                        <div className="text-center space-y-3 animate-fade-in">
                          <h6 className="font-bold text-xs text-slate-700">QR Code Pix para Cobrança Imediata</h6>
                          <div className="w-40 h-40 bg-white border border-slate-200 rounded-xl flex items-center justify-center mx-auto shadow-2xs">
                            {/* Realistic placeholder visual QR code */}
                            <svg className="w-32 h-32 text-indigo-950" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M2,2 H8 V8 H2 Z M4,4 H6 V6 H4 Z M2,10 H6 V14 H2 Z M2,16 H8 V22 H2 Z M4,18 H6 V20 H4 Z M10,2 H14 V6 H10 Z M16,2 H22 V8 H16 Z M18,4 H20 V6 H18 Z M10,10 H14 V14 H10 Z M16,10 H22 V14 H16 Z M10,16 H14 V20 H10 Z M16,16 H20 V18 H16 Z M16,20 H18 V22 H16 Z M20,20 H22 V22 H20 Z" />
                            </svg>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[13px] font-black font-mono">
                              R$ {selectedTransForReceipt.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                            </p>
                            <p className="text-[10px] text-zinc-500 max-w-[80%] mx-auto leading-normal">
                              Chave Aleatória Pix simulated: <strong className="font-mono text-indigo-700 break-all">fba11b8b-e8df-4ef1-90cf-c44dcf5511b8</strong>
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="border border-slate-300 p-4 bg-white rounded-xl space-y-4 text-[10px] font-mono leading-tight animate-fade-in relative">
                          <div className="flex justify-between pb-2 border-b border-dashed border-slate-200">
                            <strong>ERP BANKING S.A.</strong>
                            <span className="font-bold text-indigo-700">033-7 | 03399.01102</span>
                          </div>
                          <div>
                            <p><strong>Cedente:</strong> Nexus ERP Multi-Tenant Ltda</p>
                            <p><strong>Sacado:</strong> Comercial Metrópole Ltda</p>
                            <p><strong>Valor do Documento:</strong> R$ {selectedTransForReceipt.valor.toFixed(2)}</p>
                            <p><strong>Vencimento:</strong> {selectedTransForReceipt.data}</p>
                          </div>
                          <div className="pt-2 border-t border-slate-100 flex flex-col items-center gap-1.5 bg-slate-50 p-2 rounded">
                            <span className="text-slate-400">Barcode Simulado</span>
                            <div className="w-full h-8 bg-zinc-950 flex gap-[1px]">
                              {Array.from({ length: 48 }).map((_, idx) => (
                                <div key={idx} className="h-full bg-black shrink-0" style={{ width: idx % 3 === 0 ? "3px" : "1px" }} />
                              ))}
                            </div>
                            <span className="text-[9px] font-mono select-all">34191.79001 01043.513184 91020.150008 7 98210000{selectedTransForReceipt.valor.toFixed(0)}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="h-full border border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-8 text-center text-slate-400 text-xs">
                      <QrCode size={24} className="mb-2 text-slate-300 animate-pulse-slow" />
                      <h5 className="font-bold text-slate-700 mb-1">Visualizador Caixa de Recebimento</h5>
                      <p className="text-slate-500">Escolha um item de faturamento na coluna ao lado para emitir Pix ou gerar boleto para o cliente.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB: DRE */}
          {activeTab === "dre" && (
            <div className="space-y-4 animate-fade-in text-xs font-mono">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div>
                  <h4 className="font-bold text-slate-800 font-sans text-sm">Demonstração do Resultado do Exercício consolidado (DRE)</h4>
                  <p className="text-[10px] text-slate-400">Análise de competência acumulada no mês corrente de 2026.</p>
                </div>
                <div className="p-1 px-3 bg-indigo-50 border border-indigo-100 text-indigo-800 text-[10px] rounded-lg">
                  Exercício: <strong className="font-bold font-sans">2026/05</strong>
                </div>
              </div>

              <div className="border border-slate-250 rounded-xl overflow-hidden bg-slate-50 text-slate-800">
                <div className="grid grid-cols-2 p-3 font-bold bg-slate-200/60 text-slate-900 border-b border-slate-200 uppercase text-[10px] tracking-wider">
                  <span>Estrutura de Resultados Contábil</span>
                  <span className="text-right">Valor Consolidado</span>
                </div>
                <div className="divide-y divide-slate-200">
                  <div className="grid grid-cols-2 p-3">
                    <span>(+) RECEITA BRUTA COM VENDAS/SERVIÇOS</span>
                    <span className="text-right text-emerald-700 font-bold">R$ {receitaBruta.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="grid grid-cols-2 p-3 pl-6 text-slate-500 italic">
                    <span>(-) Deduções de Devoluções e Abatimentos Estornados</span>
                    <span className="text-right">- R$ 0,00</span>
                  </div>
                  <div className="grid grid-cols-2 p-3 bg-zinc-100/50">
                    <span>(=) RECEITA OPERACIONAL LÍQUIDA</span>
                    <span className="text-right font-extrabold text-slate-900">R$ {receitaBruta.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="grid grid-cols-2 p-3">
                    <span>(-) CUSTOS DOS PRODUTOS VENDIDOS (CPV / Matéria-prima)</span>
                    <span className="text-right text-rose-700 font-bold">- R$ {custosVenda.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="grid grid-cols-2 p-3 bg-zinc-100/50 font-bold">
                    <span>(=) RESULTADO OPERACIONAL BRUTO</span>
                    <span className="text-right">R$ {(receitaBruta - custosVenda).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="grid grid-cols-2 p-3">
                    <span>(-) DESPESAS ADMINISTRATIVAS E VENDAS OPERACIONAIS</span>
                    <span className="text-right text-rose-700">- R$ {despesasOp.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="grid grid-cols-2 p-3 bg-zinc-100/50 font-bold">
                    <span>(=) RESULTADO LÍQUIDO ANTES DA CONTRIBUIÇÃO FISCAL</span>
                    <span className="text-right">R$ {resultadoAntesImposto.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="grid grid-cols-2 p-3">
                    <span>(-) IMPOSTOS INCIDENTES (Taxa Integrada Simples Simulado)</span>
                    <span className="text-right text-rose-700 font-bold">- R$ {impostoSimulado.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="grid grid-cols-2 p-3.5 bg-slate-900 text-white rounded-b-xl font-bold uppercase tracking-wider text-[11px]">
                    <span>(=) RESULTADO LÍQUIDO DO PERÍODO (LUCRO/PREJUÍZO)</span>
                    <span className="text-right text-emerald-400 font-black">
                      R$ {lucroLiquido.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: CUSTOS */}
          {activeTab === "custos" && (
            <div className="space-y-6 animate-fade-in text-xs">
              <h4 className="font-bold text-slate-800 text-sm">Rateios por Centros de Custo Operacionais</h4>
              <p className="text-xs text-slate-400">Classificação integrada de lançamentos no ERP.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 border border-slate-200 rounded-2xl bg-white space-y-4">
                  <h5 className="font-bold text-slate-800 text-[13px] flex items-center gap-1">
                    <TrendingUp size={16} className="text-indigo-600" /> Detalhes Gerais
                  </h5>
                  <ul className="space-y-3 font-sans">
                    <li className="flex justify-between pb-2 border-b border-slate-100">
                      <span>Industrial Vendas & Logística (Comercial)</span>
                      <strong className="font-mono text-emerald-600">R$ {companyTrans.filter(t => t.centroCusto.includes("Vendas")).reduce((sum, t) => sum + t.valor, 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</strong>
                    </li>
                    <li className="flex justify-between pb-2 border-b border-slate-100">
                      <span>Infraestrutura Fábrica & Operações</span>
                      <strong className="font-mono text-rose-600">R$ {companyTrans.filter(t => t.centroCusto.includes("Fábrica") || t.centroCusto.includes("Produção")).reduce((sum, t) => sum + t.valor, 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</strong>
                    </li>
                    <li className="flex justify-between">
                      <span>Despesas Administrativas (Jurídico, TI)</span>
                      <strong className="font-mono text-rose-600 font-bold">R$ {companyTrans.filter(t => t.centroCusto.includes("Jurídico")).reduce((sum, t) => sum + t.valor, 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</strong>
                    </li>
                  </ul>
                </div>

                <div className="p-5 bg-indigo-950 text-indigo-200 rounded-2xl flex flex-col justify-between">
                  <div>
                    <h5 className="font-bold text-white text-sm">Eficiência Integrada de Rateio</h5>
                    <p className="text-[11px] text-indigo-300 mt-1 max-w-[90%] leading-normal">
                      Sua empresa possui regras automáticas de provisionamento por competência tributária municipal. Os lançamentos fiscais são rateados imediatamente no caixa do faturamento.
                    </p>
                  </div>
                  <div className="p-3.5 bg-indigo-900 border border-indigo-800 rounded-xl space-y-1 mt-4">
                    <span className="text-[10px] text-indigo-400 font-bold uppercase font-mono">INSIGHT DO ERP</span>
                    <p className="text-xs text-indigo-50 leading-relaxed font-sans">
                      Seu saldo operacional de caixa atingiu <strong className="text-white text-xs">R$ {saldoLiquido.toLocaleString("pt-BR")}</strong>, o que confere estabilidade financeira suficiente para planejar o pagamento antecipado do estoque Gerdau.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODAL NOVO LANÇAMENTO */}
      {showTransModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full border border-slate-200 shadow-xl overflow-hidden animate-slide-up text-slate-700">
            <div className="p-5 bg-slate-900 text-white">
              <h5 className="text-sm font-bold font-sans">Cadastrar Lançamento de Caixa</h5>
            </div>
            <form onSubmit={handleAddTransSubmit} className="p-5 space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-500">Descrição / Histórico (*)</label>
                <input
                  type="text"
                  required
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Ex: Pagamento Internet Copel..."
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-bold text-slate-500">Sentido Patrimonial (*)</label>
                  <select
                    value={newTipo}
                    onChange={(e) => setNewTipo(e.target.value as any)}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-sm"
                  >
                    <option value="Receita">📈 Receita / Entrada</option>
                    <option value="Despesa">📉 Despesa / Saída</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-500 font-sans">Valor Comercial (R$) (*)</label>
                  <input
                    type="number"
                    required
                    value={newValor}
                    onChange={(e) => setNewValor(Number(e.target.value))}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-sm font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-bold text-slate-500">Centro de Custos (*)</label>
                  <input
                    type="text"
                    required
                    value={newCentro}
                    onChange={(e) => setNewCentro(e.target.value)}
                    placeholder="Ex: Produção Geral"
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-505">Status Liquidação (*)</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as any)}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-sm"
                  >
                    <option value="Pago">Liquidado / Pago</option>
                    <option value="Pendente">Aguardar Compensação</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-500">Categoria Contábil (*)</label>
                <input
                  type="text"
                  required
                  value={newCat}
                  onChange={(e) => setNewCat(e.target.value)}
                  placeholder="Ex: ICMS recolhimento, Matéria-prima..."
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-sm"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-105">
                <button
                  type="button"
                  onClick={() => setShowTransModal(false)}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg text-slate-500"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold"
                >
                  Gravar Lançamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
