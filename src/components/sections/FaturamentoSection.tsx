/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState } from "react";
import {
  FileText,
  ShieldCheck,
  Plus,
  Send,
  Download,
  Percent,
  TrendingUp,
  Server,
  FileCode,
  DollarSign,
  AlertCircle
} from "lucide-react";
import { NotaFiscal } from "../../types";

interface FaturamentoSectionProps {
  empresaId: string;
  notas: NotaFiscal[];
  onEmitirNota: (nova: Omit<NotaFiscal, "id" | "empresaId" | "status" | "xmlSimulado" | "dataEmissao">) => void;
  onCancelarNota: (notaId: string) => void;
}

export default function FaturamentoSection({
  empresaId,
  notas,
  onEmitirNota,
  onCancelarNota
}: FaturamentoSectionProps) {
  const [activeTab, setActiveTab] = useState<"notas" | "emitir" | "precos" | "comissao">("notas");

  const companyNotas = notas.filter((n) => n.empresaId === empresaId);

  // Invoice creator form states
  const [newNum, setNewNum] = useState("000000103");
  const [newTipo, setNewTipo] = useState<"NF-e" | "NFS-e" | "NFC-e">("NF-e");
  const [newCliente, setNewCliente] = useState("");
  const [newValor, setNewValor] = useState(5000);

  // XML / DANFE inspection modal
  const [selectedNotaForDanfe, setSelectedNotaForDanfe] = useState<NotaFiscal | null>(null);

  // SEFAZ simulate triggers
  const [sefazStatus, setSefazStatus] = useState<"Online" | "Contingência" | "Ocupada">("Online");

  const handleEmitirNotaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCliente || !newValor) return;
    onEmitirNota({
      numero: newNum,
      serie: "001",
      tipo: newTipo,
      clienteNome: newCliente,
      valorTotal: Number(newValor)
    });
    alert(`Nota Fiscal ${newTipo} emitida com sucesso! Protocolo SEFAZ recebido em XML.`);
    setNewCliente("");
    setNewValor(3000);
    setNewNum(String(Number(newNum) + 1).padStart(9, "0"));
    setActiveTab("notas");
  };

  // Preço Catalogo
  const catalogoPreco = [
    { codigo: "MET-4432", nome: "Eixo de Transmissão Aço Ligado H2", precoUni: "R$ 370,00", un: "UN", estoque: "320" },
    { codigo: "MET-3911", nome: "Mancal Retificado Hidraux S-15", precoUni: "R$ 1.200,00", un: "UN", estoque: "45" },
    { codigo: "MET-1205", nome: "Chapa Ferro Fundido Laminado 2x1", precoUni: "R$ 89,90", un: "M2", estoque: "1.200" },
    { codigo: "MET-8890", nome: "Bucha Bronze Auto-Lubrificante", precoUni: "R$ 45,00", un: "UN", estoque: "400" }
  ];

  // vendedor comissão
  const comissaoList = [
    { vendedor: "Ana Oliveira", faturado: 165000, comissaoIndex: "2.5%", totalPagar: 4125 },
    { vendedor: "Antônio Ferreira", faturado: 127500, comissaoIndex: "1.5%", totalPagar: 1912.5 },
    { vendedor: "Carlos Ramos (Suporte Técnico)", faturado: 28000, comissaoIndex: "1.0%", totalPagar: 280 }
  ];

  return (
    <div id="faturamento-layout" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Módulo Faturamento & Emissor Fiscal</h2>
          <p className="text-xs text-slate-500">Transmissão eletrônica de notas (NF-e, NFS-e, NFC-e) com validação XML e SEFAZ nacional.</p>
        </div>
      </div>

      {/* SEFAZ Monitor alert */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/20 md:col-span-2 flex items-center justify-between gap-3 text-xs text-emerald-800">
          <div className="flex items-center gap-2">
            <Server size={18} className="text-emerald-600 animate-pulse-slow" />
            <div>
              <p className="font-bold">Protocolo Autorizador SEFAZ SP / PR / RJ</p>
              <p className="text-[10px] text-emerald-600 font-mono">Status: {sefazStatus} - Resposta: 42ms (Ambiente Produção ativo)</p>
            </div>
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => setSefazStatus("Online")}
              className={`p-1 py-0.5 rounded text-[9px] font-bold ${sefazStatus === "Online" ? "bg-emerald-600 text-white" : "bg-white"}`}
            >
              Ativo
            </button>
            <button
              onClick={() => setSefazStatus("Contingência")}
              className={`p-1 py-0.5 rounded text-[9px] font-bold ${sefazStatus === "Contingência" ? "bg-indigo-600 text-white" : "bg-white"}`}
            >
              SVC
            </button>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-150 bg-white flex items-center justify-between text-xs font-mono">
          <div>
            <p className="text-slate-400 text-[10px] uppercase">Notas Emitidas</p>
            <p className="text-lg font-black">{companyNotas.length}</p>
          </div>
          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-500">
            <FileText size={16} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        {/* Navigation Section */}
        <div className="flex border-b border-slate-100 bg-slate-50/50 p-2 gap-2">
          <button
            onClick={() => setActiveTab("notas")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === "notas" ? "bg-slate-900 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <FileText size={14} /> Notas Transmitidas
          </button>
          <button
            onClick={() => setActiveTab("emitir")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === "emitir" ? "bg-slate-900 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Send size={14} /> Transmitir NF-e
          </button>
          <button
            onClick={() => setActiveTab("precos")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === "precos" ? "bg-slate-900 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <TrendingUp size={14} /> Tabela de Preços
          </button>
          <button
            onClick={() => setActiveTab("comissao")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === "comissao" ? "bg-slate-900 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Percent size={14} /> Comissão de Vendas
          </button>
        </div>

        <div className="p-6">
          {/* TAB: NOTAS TRANSMITIDAS */}
          {activeTab === "notas" && (
            <div className="space-y-4 animate-fade-in text-xs">
              <div className="overflow-x-auto border border-slate-100 rounded-xl">
                <table className="w-full text-left text-slate-700">
                  <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-3.5">Nº Nota / Série</th>
                      <th className="px-6 py-3.5">Categoria</th>
                      <th className="px-6 py-3.5">Cliente Destinatário</th>
                      <th className="px-6 py-3.5">Data Emissão</th>
                      <th className="px-6 py-3.5">Valor Total NFe</th>
                      <th className="px-6 py-3.5">Status SEFAZ</th>
                      <th className="px-6 py-3.5 text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {companyNotas.map((nota) => (
                      <tr key={nota.id} className="hover:bg-slate-50/50">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-bold text-slate-800">#{nota.numero}</p>
                            <p className="text-[10px] text-slate-400 font-mono">Série: {nota.serie}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-semibold">{nota.tipo}</td>
                        <td className="px-6 py-4">{nota.clienteNome}</td>
                        <td className="px-6 py-4 font-mono">{nota.dataEmissao}</td>
                        <td className="px-6 py-4 font-bold font-mono">
                          R$ {nota.valorTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-6 py-4 animate-fade-in">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              nota.status === "Emitida"
                                ? "bg-emerald-50 text-emerald-800"
                                : nota.status === "Processando"
                                ? "bg-indigo-50 text-indigo-805"
                                : "bg-rose-50 text-rose-800"
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${nota.status === "Emitida" ? "bg-emerald-500" : "bg-indigo-500"}`} />
                            {nota.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button
                            onClick={() => setSelectedNotaForDanfe(nota)}
                            className="bg-slate-100 hover:bg-slate-200 py-1 px-2.5 rounded font-bold text-slate-800"
                          >
                            Visualizar DANFE
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: EMITIR NOVA */}
          {activeTab === "emitir" && (
            <div className="max-w-md mx-auto p-6 border border-slate-200 rounded-2xl bg-slate-50 text-xs text-slate-705 animate-fade-in space-y-4">
              <div className="text-center font-sans">
                <h5 className="font-black text-sm text-slate-900">Emissão de Nota Fiscal de Vendas</h5>
                <p className="text-slate-400 text-[10px] mt-0.5">Autorização imediata com SEFAZ por chave NF-e.</p>
              </div>

              <form onSubmit={handleEmitirNotaSubmit} className="space-y-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-500">Número Sequencial (Sugerido)</label>
                  <input
                    type="text"
                    required
                    value={newNum}
                    onChange={(e) => setNewNum(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-white focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500 font-sans">Modelo Tipo (*)</label>
                    <select
                      value={newTipo}
                      onChange={(e) => setNewTipo(e.target.value as any)}
                      className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl"
                    >
                      <option value="NF-e">NF-e (Venda mercadoria)</option>
                      <option value="NFS-e">NFS-e (Bandeira de Serviços)</option>
                      <option value="NFC-e">NFC-e (Consumidor Rápido)</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500">Valor Total NFe (R$) (*)</label>
                    <input
                      type="number"
                      required
                      value={newValor}
                      onChange={(e) => setNewValor(Number(e.target.value))}
                      className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-white focus:outline-hidden font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-500">Cliente Destinatário (*)</label>
                  <input
                    type="text"
                    required
                    value={newCliente}
                    onChange={(e) => setNewCliente(e.target.value)}
                    placeholder="Ex: Tratores Case Sul S.A."
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-white focus:outline-hidden"
                  />
                </div>

                <div className="p-3.5 bg-amber-50 border border-amber-100 rounded-xl flex items-start gap-2 text-[10px] text-amber-800">
                  <AlertCircle size={16} className="shrink-0 text-amber-600 mt-0.5" />
                  <p className="leading-relaxed">
                    A transmissão gerará os impostos incidentes sobre a venda no simulador Simples Nacional do módulo Financeiro de forma contábil em DRE.
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Send size={14} /> Transmitir Lote SEFAZ
                </button>
              </form>
            </div>
          )}

          {/* TAB: TABELA DE PREÇOS */}
          {activeTab === "precos" && (
            <div className="space-y-4 animate-fade-in text-xs">
              <h5 className="font-bold text-slate-800 text-sm">Catálogo Homologado para Vendedores</h5>
              <div className="overflow-x-auto border border-slate-100 rounded-xl">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-500 uppercase text-[9px] tracking-wider border-b border-slate-100 font-mono">
                    <tr>
                      <th className="px-6 py-3">Cód. Produto</th>
                      <th className="px-6 py-3">Produto Industrial</th>
                      <th className="px-6 py-3">Und</th>
                      <th className="px-6 py-3">Estoque Fábrica</th>
                      <th className="px-6 py-3">Preço Unitário Tabela</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {catalogoPreco.map((item) => (
                      <tr key={item.codigo} className="hover:bg-slate-50/50">
                        <td className="px-6 py-3 font-mono text-indigo-700">{item.codigo}</td>
                        <td className="px-6 py-3 font-bold">{item.nome}</td>
                        <td className="px-6 py-3">{item.un}</td>
                        <td className="px-6 py-3 font-mono">{item.estoque}</td>
                        <td className="px-6 py-3 font-black text-slate-900 font-mono">{item.precoUni}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: COMISSÃO */}
          {activeTab === "comissao" && (
            <div className="space-y-4 animate-fade-in text-xs">
              <h5 className="font-bold text-slate-800 text-sm">Relação de Comissionamentos por Desempenho</h5>
              <div className="overflow-x-auto border border-slate-100 rounded-xl">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-500 uppercase text-[9px] tracking-wider border-b border-slate-100 font-mono">
                    <tr>
                      <th className="px-6 py-3">Consultor de Vendas</th>
                      <th className="px-6 py-3">Total Faturado no Período</th>
                      <th className="px-6 py-3">Alíquota Comissão</th>
                      <th className="px-6 py-3">Saldo a Receber BRL</th>
                      <th className="px-6 py-3">Situação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {comissaoList.map((com, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="px-6 py-3 font-bold">{com.vendedor}</td>
                        <td className="px-6 py-3 font-mono">R$ {com.faturado.toLocaleString("pt-BR")},00</td>
                        <td className="px-6 py-3 font-mono font-semibold text-indigo-700">{com.comissaoIndex}</td>
                        <td className="px-6 py-3 font-black text-emerald-700 font-mono">
                          R$ {com.totalPagar.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-6 py-3 text-emerald-600 font-bold">🟢 Integrado em Contas a Pagar</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* DANFE DETAILED INSPECTION MODAL */}
      {selectedNotaForDanfe && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-xl overflow-hidden animate-slide-up text-slate-700 text-[10px] font-mono leading-relaxed my-8 selection:bg-slate-100">
            {/* DANFE Header info */}
            <div className="bg-slate-900 text-white p-5 flex justify-between items-center font-sans shrink-0">
              <div>
                <h5 className="font-extrabold text-sm">Voucher Geral de Transmissão SEFAZ</h5>
                <p className="text-[10px] text-slate-400 mt-0.5">DANFE em tempo real - Ambiente Homologador do ERP</p>
              </div>
              <button
                onClick={() => setSelectedNotaForDanfe(null)}
                className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg border border-white/15"
              >
                Voltar
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* Box DANFE Layout */}
              <div className="border border-slate-400 p-4 space-y-4 bg-white text-slate-900 text-[9px] relative">
                {/* Visual DANFE watermark */}
                <div className="absolute inset-x-0 top-1/3 text-center text-slate-200/40 text-sm font-bold rotate-12 pointer-events-none select-none uppercase leading-tight font-sans">
                  SIMULAÇÃO FISCAL ERP NACIONAL<br/>SEM VALOR COMERCIAL
                </div>

                <div className="grid grid-cols-3 border-b border-slate-400 pb-3 gap-2">
                  <div className="col-span-2 space-y-1 text-xs">
                    <p className="font-extrabold font-sans text-xs">INDÚSTRIA METALÚRGICA ALFA LTDA</p>
                    <p>Rua das Indústrias, 442, Distrito Industrial - Campinas, SP</p>
                    <p>CNPJ: 12.345.678/0001-90 | I.E: 111.222.333.444</p>
                  </div>
                  <div className="border border-slate-400 p-2 text-center text-xs leading-none flex flex-col justify-center bg-slate-50">
                    <p className="font-bold text-indigo-700 uppercase font-sans">DANFE</p>
                    <p className="text-[9px] text-slate-400 mt-1">Nº {selectedNotaForDanfe.numero}</p>
                    <p className="text-[9px] text-slate-400">FL 1/1</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <p><strong>CHAVE DE ACESSO NF-E:</strong> 352605123456780001905500100000000{selectedNotaForDanfe.numero}ff221</p>
                  <p><strong>NATUREZA DA OPERAÇÃO:</strong> Venda de mercadorias para industrialização integral</p>
                </div>

                <div className="border border-slate-400 p-2 space-y-1 bg-slate-50 rounded-sm">
                  <p className="font-bold uppercase border-b border-slate-350 pb-1">Destinatário / Remetente</p>
                  <div className="grid grid-cols-2 gap-1 text-[9px]">
                    <p><strong>Razão Social:</strong> {selectedNotaForDanfe.clienteNome}</p>
                    <p><strong>Data Emissão:</strong> {selectedNotaForDanfe.dataEmissao}</p>
                    <p><strong>Endereço Sacado:</strong> Praça Industrial Central - SP</p>
                    <p><strong>Voucher Total:</strong> R$ {selectedNotaForDanfe.valorTotal.toFixed(2)}</p>
                  </div>
                </div>

                {/* Items grid info */}
                <div className="border border-slate-400 rounded-sm">
                  <div className="grid grid-cols-5 p-2 bg-slate-100 font-bold border-b border-slate-450 uppercase text-[8px]">
                    <span>Cód. Prod</span>
                    <span className="col-span-2">Descrição Fiscal NF</span>
                    <span className="text-right">UN</span>
                    <span className="text-right">Valor Líquido</span>
                  </div>
                  <div className="p-2 grid grid-cols-5 border-b border-slate-200">
                    <span>MET-4432</span>
                    <span className="col-span-2">Eixos de Transmissão Aço Ligado H2 (Regulado NCM)</span>
                    <span className="text-right">UN</span>
                    <span className="text-right font-bold">R$ {selectedNotaForDanfe.valorTotal.toFixed(2)}</span>
                  </div>
                </div>

                <div className="text-[8px] text-slate-400 italic font-mono flex items-center justify-between pt-2 border-t border-slate-300">
                  <span>XML Integrado SEFAZ v4.00</span>
                  <span>Chave SHA-256 Validada</span>
                </div>
              </div>

              {/* XML Source visual code drawer */}
              <div className="space-y-2">
                <p className="font-bold text-slate-500 font-sans text-xs">XML Originário Transmitido:</p>
                <pre className="p-4 bg-slate-950 text-emerald-400 rounded-xl text-[9px] leading-snug overflow-x-auto border border-slate-800">
                  <code>{selectedNotaForDanfe.xmlSimulado || `<!-- NFe XML simula --->`}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
