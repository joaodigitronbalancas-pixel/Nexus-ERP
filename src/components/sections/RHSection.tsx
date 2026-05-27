/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Users,
  Clock,
  FileSpreadsheet,
  ShieldCheck,
  Plus,
  TrendingUp,
  FileText,
  BookmarkCheck,
  Star,
  Activity,
  Award
} from "lucide-react";
import { Funcionario, RegistroPonto, Holerite, NivelHierarquico } from "../../types";

interface RHSectionProps {
  empresaId: string;
  funcionarios: Funcionario[];
  ponto: RegistroPonto[];
  holerites: Holerite[];
  onAddFuncionario: (novo: Omit<Funcionario, "id" | "empresaId">) => void;
  onUpdateFuncioarioStatus: (funcionarioId: string, novoStatus: "Ativo" | "Férias" | "Inativo") => void;
  onRegistrarPonto: (funcionarioId: string, tipo: "entrada" | "saidaAlmoco" | "retornoAlmoco" | "saida") => void;
  onAddAvaliacao: (funcionarioId: string, nota: number, feedback: string) => void;
  onAddEpi: (funcionarioId: string, epiNome: string) => void;
}

export default function RHSection({
  empresaId,
  funcionarios,
  ponto,
  holerites,
  onAddFuncionario,
  onUpdateFuncioarioStatus,
  onRegistrarPonto,
  onAddAvaliacao,
  onAddEpi
}: RHSectionProps) {
  const [activeTab, setActiveTab] = useState<"funcionarios" | "ponto" | "folha" | "epi">("funcionarios");

  const companyFuncs = funcionarios.filter((f) => f.empresaId === empresaId);
  const companyPonto = ponto.filter(p => companyFuncs.some(f => f.id === p.funcionarioId));
  const companyHolerites = holerites.filter(h => companyFuncs.some(f => f.id === h.funcionarioId));

  // New Employee Input States
  const [showFuncModal, setShowFuncModal] = useState(false);
  const [newNome, setNewNome] = useState("");
  const [newCpf, setNewCpf] = useState("");
  const [newCargo, setNewCargo] = useState("");
  const [newDep, setNewDep] = useState("Produção");
  const [newSalario, setNewSalario] = useState(2500);

  // Punch card inputs
  const [selectedPunchFunc, setSelectedPunchFunc] = useState("");
  const [selectedPunchTipo, setSelectedPunchTipo] = useState<"entrada" | "saidaAlmoco" | "retornoAlmoco" | "saida">("entrada");

  // Performance Assessment
  const [selectedReviewFunc, setSelectedReviewFunc] = useState<string | null>(null);
  const [reviewNota, setReviewNota] = useState(5);
  const [reviewFeedback, setReviewFeedback] = useState("");

  // EPI allocation
  const [selectedEpiFunc, setSelectedEpiFunc] = useState("");
  const [epiNome, setEpiNome] = useState("Óculos de Proteção");

  // Holerite inspector
  const [selectedHolerite, setSelectedHolerite] = useState<Holerite | null>(null);

  const handleAddFuncSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNome || !newCpf) return;
    onAddFuncionario({
      nome: newNome,
      cpf: newCpf,
      cargo: newCargo || "Operador I",
      departamento: newDep,
      salario: Number(newSalario) || 2000,
      status: "Ativo",
      horasBanco: 0,
      epiEntregues: [],
      avaliacoes: [],
      dataAdmissao: new Date().toISOString().split("T")[0]
    });
    setNewNome("");
    setNewCpf("");
    setNewCargo("");
    setShowFuncModal(false);
  };

  const handlePunchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPunchFunc) return;
    onRegistrarPonto(selectedPunchFunc, selectedPunchTipo);
    alert(`Ponto biométrico (${selectedPunchTipo.toUpperCase()}) registrado para o funcionário!`);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReviewFunc) return;
    onAddAvaliacao(selectedReviewFunc, reviewNota, reviewFeedback);
    setReviewFeedback("");
    setSelectedReviewFunc(null);
  };

  const handleEpiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEpiFunc) return;
    onAddEpi(selectedEpiFunc, epiNome);
    alert(`EPI (${epiNome}) registrado no prontuário do colaborador!`);
  };

  return (
    <div id="rh-section-layout" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Módulo Recursos Humanos & DP</h2>
          <p className="text-xs text-slate-500">Prontuário de colaboradores, cartões de ponto mecânicos, folha tributária e entrega de vestimentas de segurança.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        {/* Navigation Section */}
        <div className="flex border-b border-slate-100 bg-slate-50/50 p-2 gap-2">
          <button
            onClick={() => setActiveTab("funcionarios")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === "funcionarios" ? "bg-slate-900 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Users size={14} /> Colaboradores
          </button>
          <button
            onClick={() => setActiveTab("ponto")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === "ponto" ? "bg-slate-900 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Clock size={14} /> Relógio de Ponto
          </button>
          <button
            onClick={() => setActiveTab("folha")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === "folha" ? "bg-slate-900 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <FileSpreadsheet size={14} /> Holerites & Folha
          </button>
          <button
            onClick={() => setActiveTab("epi")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === "epi" ? "bg-slate-900 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <ShieldCheck size={14} /> EPIs & Segurança
          </button>
        </div>

        <div className="p-6">
          {/* TAB: COLABORADORES */}
          {activeTab === "funcionarios" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-800">Folha Geral de Colaboradores</h4>
                  <p className="text-xs text-slate-400">Ambiente multiempresa com controle de status ativo/férias.</p>
                </div>
                <button
                  onClick={() => setShowFuncModal(true)}
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3 py-2 rounded-xl inline-flex items-center gap-1 transition cursor-pointer"
                >
                  <Plus size={14} /> Admitir Colaborador
                </button>
              </div>

              <div className="overflow-x-auto border border-slate-100 rounded-xl">
                <table className="w-full text-left text-sm text-slate-700">
                  <thead className="bg-slate-50 text-xs text-slate-500 uppercase border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-3">Nome / CPF</th>
                      <th className="px-6 py-3">Cargo / Departamento</th>
                      <th className="px-6 py-3">Admissão</th>
                      <th className="px-6 py-3">Banco de Horas</th>
                      <th className="px-6 py-3">Salário Inicial</th>
                      <th className="px-6 py-3">Situação</th>
                      <th className="px-6 py-3 text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {companyFuncs.map((func) => (
                      <tr key={func.id} className="hover:bg-slate-50/50">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-bold text-slate-800">{func.nome}</p>
                            <p className="text-[10px] text-slate-400 font-mono">CPF: {func.cpf}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-semibold text-slate-700">{func.cargo}</p>
                            <p className="text-[10px] text-indigo-600">{func.departamento}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-mono">{func.dataAdmissao}</td>
                        <td className="px-6 py-4 font-mono">
                          <span className={`font-bold ${func.horasBanco >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                            {func.horasBanco >= 0 ? `+${func.horasBanco}` : func.horasBanco}h
                          </span>
                        </td>
                        <td className="px-6 py-4 font-semibold font-mono">
                          R$ {func.salario.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-6 py-4 animate-fade-in">
                          <select
                            value={func.status}
                            onChange={(e) => onUpdateFuncioarioStatus(func.id, e.target.value as any)}
                            className={`p-1 rounded-sm text-[10px] font-bold ${
                              func.status === "Ativo"
                                ? "bg-emerald-50 text-emerald-800"
                                : func.status === "Férias"
                                ? "bg-blue-50 text-blue-805"
                                : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            <option value="Ativo">🟢 Ativo</option>
                            <option value="Férias">🔵 Férias</option>
                            <option value="Inativo">🔴 Inativo</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 text-right space-x-1">
                          <button
                            onClick={() => setSelectedReviewFunc(func.id)}
                            className="bg-slate-100 hover:bg-slate-205 py-1 px-2 rounded text-[10px] font-bold text-slate-700"
                            title="Avaliar Desempenho"
                          >
                            ⭐ Avaliar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Collapsible evaluation logs if exists */}
              <div className="p-4 bg-slate-50 rounded-2xl">
                <h5 className="font-bold text-xs text-slate-700 mb-2 flex items-center gap-1">
                  <Award size={14} className="text-amber-500" /> Prontuário de Feedback & Desempenho
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {companyFuncs
                    .filter(f => f.avaliacoes && f.avaliacoes.length > 0)
                    .map(f => (
                      <div key={f.id} className="p-3 bg-white border border-slate-200 rounded-xl space-y-1.5 text-xs shadow-2xs">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-slate-800">{f.nome}</span>
                          <div className="flex text-amber-400">
                            {Array.from({ length: f.avaliacoes[0].nota }).map((_, i) => (
                              <Star key={i} size={12} fill="currentColor" />
                            ))}
                          </div>
                        </div>
                        <p className="text-slate-505 italic">"{f.avaliacoes[0].feedback}"</p>
                        <p className="text-[10px] text-slate-400 text-right mt-1">Data: {f.avaliacoes[0].data}</p>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: RELÓGIO DE PONTO */}
          {activeTab === "ponto" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Visual stamping widget */}
                <div className="p-5 border border-slate-200 rounded-2xl bg-slate-50 space-y-4 shadow-2xs">
                  <div className="text-center">
                    <h5 className="font-black text-slate-800 text-sm">Estação de Registro Biométrico</h5>
                    <p className="text-[10px] text-slate-400">Simulador de cabeçote físico de controle facial/biométrico.</p>
                  </div>

                  <form onSubmit={handlePunchSubmit} className="space-y-3 text-xs text-slate-700">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-500">Funcionário (*)</label>
                      <select
                        value={selectedPunchFunc}
                        onChange={(e) => setSelectedPunchFunc(e.target.value)}
                        required
                        className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-hidden"
                      >
                        <option value="">Selecione para carona biometria...</option>
                        {companyFuncs.map((f) => (
                          <option key={f.id} value={f.id}>
                            {f.nome} ({f.cargo})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-500">Marcador de Ponto (*)</label>
                      <select
                        value={selectedPunchTipo}
                        onChange={(e) => setSelectedPunchTipo(e.target.value as any)}
                        required
                        className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-hidden"
                      >
                        <option value="entrada">Entrada Geral (08h00)</option>
                        <option value="saidaAlmoco">Saída Intervalo (12h00)</option>
                        <option value="retornoAlmoco">Retorno Almoço (13h00)</option>
                        <option value="saida">Saída Expediente (17h00)</option>
                      </select>
                    </div>

                    <p className="text-[10px] text-slate-400 text-center bg-white p-2 rounded-lg font-mono">
                      Timestamp: {new Date().toLocaleTimeString("pt-BR")} (UTC-3)
                    </p>

                    <button
                      type="submit"
                      className="w-full py-2 bg-slate-900 border border-slate-950 text-white font-bold rounded-xl active:bg-slate-950 hover:bg-slate-800 transition text-xs shadow-xs cursor-pointer"
                    >
                      Bater Ponto Biométrico (Touch)
                    </button>
                  </form>
                </div>

                {/* Grid table representation */}
                <div className="md:col-span-2 space-y-3">
                  <h5 className="font-bold text-slate-800 text-sm">Logs de Marcação (Relógio Ativo)</h5>
                  <div className="overflow-x-auto border border-slate-100 rounded-xl h-72">
                    <table className="w-full text-left text-xs text-slate-700">
                      <thead className="bg-slate-50 text-slate-500 border-b border-slate-100 uppercase text-[9px] tracking-wider sticky top-0">
                        <tr>
                          <th className="px-4 py-2.5">Nome</th>
                          <th className="px-4 py-2.5">Data</th>
                          <th className="px-4 py-2.5">Entrada</th>
                          <th className="px-4 py-2.5">S. Almoço</th>
                          <th className="px-4 py-2.5">R. Almoço</th>
                          <th className="px-4 py-2.5">Saída</th>
                          <th className="px-4 py-2.5">Totalizado</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-mono">
                        {companyPonto.map((pt) => (
                          <tr key={pt.id} className="hover:bg-slate-50/10">
                            <td className="px-4 py-2.5 font-sans font-semibold text-slate-800">{pt.funcionarioNome}</td>
                            <td className="px-4 py-2.5">{pt.data}</td>
                            <td className="px-4 py-2.5 text-emerald-600">{pt.entrada}</td>
                            <td className="px-4 py-2.5 text-rose-500">{pt.saidaAlmoco}</td>
                            <td className="px-4 py-2.5 text-emerald-600">{pt.retornoAlmoco}</td>
                            <td className="px-4 py-2.5 text-rose-500">{pt.saida}</td>
                            <td className="px-4 py-2.5 font-bold text-slate-900">{pt.horasTrabalhadas}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: FOLHA & HOLERITES */}
          {activeTab === "folha" && (
            <div className="space-y-6">
              <h4 className="font-bold text-slate-800">Recibo de Pagamento Eletrônico</h4>
              <p className="text-xs text-slate-400">Geração de holerite com desconto automático de encargos (CLT).</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                {/* Holerites list */}
                <div className="space-y-3">
                  <h5 className="font-bold text-slate-800 text-xs">Selecione o Demonstrativo de Competência:</h5>
                  {companyHolerites.map((hol) => (
                    <div
                      key={hol.id}
                      onClick={() => setSelectedHolerite(hol)}
                      className={`p-4 border rounded-xl flex items-center justify-between cursor-pointer hover:bg-slate-50 transition ${
                        selectedHolerite?.id === hol.id ? "border-indigo-500 bg-indigo-50/30" : "border-slate-200"
                      }`}
                    >
                      <div className="flex gap-3 items-center">
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded">
                          <FileText size={16} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-850 text-xs">{hol.funcionarioNome}</p>
                          <p className="text-[10px] text-slate-400">{hol.mesReferencia}</p>
                        </div>
                      </div>
                      <div className="text-right font-mono text-xs">
                        <p className="font-bold text-slate-900 flex items-center gap-1 justify-end">
                          R$ {hol.liquido.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </p>
                        <p className="text-[10px] text-emerald-600">Salário Líquido</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Printable dynamic paystub layout */}
                <div>
                  {selectedHolerite ? (
                    <div className="p-6 border border-slate-300 bg-white rounded-2xl space-y-4 shadow-sm text-slate-800 relative overflow-hidden font-mono text-[11px] leading-tight max-w-md mx-auto">
                      <div className="absolute top-0 left-0 right-0 h-1 bg-slate-900" />
                      <div className="text-center border-b border-slate-200 pb-3">
                        <h4 className="font-black text-xs uppercase tracking-wider text-slate-900 font-sans">Recibo de Pagamento de Salário</h4>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">Empresa Cliente: Nexus ERP Multi-Tenant</p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[10px]">
                        <p><strong>Cód/Colaborador:</strong> {selectedHolerite.funcionarioId.replace("func_alfa_", "")}</p>
                        <p><strong>Referência:</strong> {selectedHolerite.mesReferencia}</p>
                        <p className="col-span-2"><strong>Funcionário:</strong> {selectedHolerite.funcionarioNome}</p>
                        <p className="col-span-2"><strong>Cargo ID:</strong> Operador Técnico Metalúrgico</p>
                      </div>

                      <div className="border border-slate-200 rounded-sm overflow-hidden mt-3">
                        <div className="grid grid-cols-4 bg-slate-100 p-2 font-bold text-[9px] border-b border-slate-200 uppercase">
                          <span className="col-span-2">Descrição da Rubrica</span>
                          <span className="text-right">Proventos</span>
                          <span className="text-right">Descontos</span>
                        </div>
                        <div className="divide-y divide-slate-100">
                          {selectedHolerite.proventos.map((prov, i) => (
                            <div key={i} className="grid grid-cols-4 p-2">
                              <span className="col-span-2">{prov.descricao}</span>
                              <span className="text-right text-emerald-700 font-bold">R$ {prov.valor.toFixed(2)}</span>
                              <span className="text-right text-slate-400">-</span>
                            </div>
                          ))}
                          {selectedHolerite.descontos.map((desc, i) => (
                            <div key={i} className="grid grid-cols-4 p-2">
                              <span className="col-span-2 text-rose-700">{desc.descricao}</span>
                              <span className="text-right text-slate-400">-</span>
                              <span className="text-right text-rose-700 font-semibold">R$ {desc.valor.toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 p-2 bg-slate-900 text-white rounded-sm">
                        <span>Total Líquido a Receber</span>
                        <span className="text-right font-bold text-emerald-400 text-xs font-mono">
                          R$ {selectedHolerite.liquido.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full border border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-8 text-center text-slate-400 text-xs">
                      <FileText size={24} className="mb-2" />
                      <h5 className="font-bold text-slate-700 mb-1">Visualizador de Holerites</h5>
                      <p className="text-slate-500">Selecione o demonstrativo líquido de um colaborador para emitir o PDF.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB: EPI */}
          {activeTab === "epi" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* EPI Assignment tool */}
                <div className="p-5 border border-slate-200 rounded-2xl bg-slate-50 text-slate-700 space-y-4">
                  <div>
                    <h5 className="font-black text-sm">Ficha de Fornecimento de EPI (C.A.)</h5>
                    <p className="text-[10px] text-slate-400">Emitir termo de entrega de equipamentos obrigatórios sob a NR-6.</p>
                  </div>
                  <form onSubmit={handleEpiSubmit} className="space-y-3 text-xs">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-500 font-sans">Colaborador da Produção (*)</label>
                      <select
                        value={selectedEpiFunc}
                        onChange={(e) => setSelectedEpiFunc(e.target.value)}
                        required
                        className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl"
                      >
                        <option value="">Selecione o funcionário operacional...</option>
                        {companyFuncs.map((f) => (
                          <option key={f.id} value={f.id}>
                            {f.nome} - {f.departamento}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-500 font-sans">EPI Autorizado (C.A.) (*)</label>
                      <select
                        value={epiNome}
                        onChange={(e) => setEpiNome(e.target.value)}
                        required
                        className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl"
                      >
                        <option value="Óculos de Proteção Contra Impacto">Óculos de Proteção Contra Impacto</option>
                        <option value="Abafador de Ruídos Tipo Concha">Abafador de Ruídos Tipo Concha</option>
                        <option value="Botina de Segurança com Bico de Aço">Botina de Segurança com Bico de Aço</option>
                        <option value="Avental de Raspas de Couro">Avental de Raspas de Couro</option>
                        <option value="Luva de Proteção Kevlar Alta Temperatura">Luva de Proteção Kevlar Alta Temperatura</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition cursor-pointer"
                    >
                      Vincular EPI à Ficha
                    </button>
                  </form>
                </div>

                {/* EPI grid overview */}
                <div className="space-y-3">
                  <h5 className="font-bold text-slate-800 text-sm">Ficha Individual Ativa de C.A.</h5>
                  <div className="space-y-3 h-72 overflow-y-auto">
                    {companyFuncs.map((f) => (
                      <div key={f.id} className="p-3 bg-white border border-slate-150 rounded-xl text-xs space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-extrabold text-slate-800">{f.nome}</span>
                          <span className="text-[10px] font-semibold text-indigo-700">{f.cargo}</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {f.epiEntregues && f.epiEntregues.length > 0 ? (
                            f.epiEntregues.map((epi, idx) => (
                              <span key={idx} className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-100 text-[10px] font-mono">
                                🛡️ {epi}
                              </span>
                            ))
                          ) : (
                            <span className="text-slate-400 italic text-[10px]">Não há EPIs distribuídos</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODAL ADMISSÃO */}
      {showFuncModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full border border-slate-200 shadow-xl overflow-hidden animate-slide-up text-slate-700">
            <div className="p-5 bg-slate-900 text-white">
              <h5 className="text-sm font-bold">Ficha de Admissão de Trabalhador</h5>
            </div>
            <form onSubmit={handleAddFuncSubmit} className="p-5 space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-500">Nome Oficial do Colaborador (*)</label>
                <input
                  type="text"
                  required
                  value={newNome}
                  onChange={(e) => setNewNome(e.target.value)}
                  placeholder="Nome completo sem abreviações"
                  className="w-full p-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-bold text-slate-500">CPF (*)</label>
                  <input
                    type="text"
                    required
                    value={newCpf}
                    onChange={(e) => setNewCpf(e.target.value)}
                    placeholder="000.000.000-00"
                    className="w-full p-2 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-500">Salário Base (CLT) (*)</label>
                  <input
                    type="number"
                    required
                    value={newSalario}
                    onChange={(e) => setNewSalario(Number(e.target.value))}
                    className="w-full p-2 border border-slate-200 rounded-lg text-sm font-mono"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-bold text-slate-500">Cargo Corporativo (*)</label>
                  <input
                    type="text"
                    required
                    value={newCargo}
                    onChange={(e) => setNewCargo(e.target.value)}
                    placeholder="Ex: Controlador PCP"
                    className="w-full p-2 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-500">Departamento (*)</label>
                  <select
                    value={newDep}
                    onChange={(e) => setNewDep(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg text-sm"
                  >
                    <option value="Diretoria">Diretoria</option>
                    <option value="Recursos Humanos">Recursos Humanos</option>
                    <option value="Financeiro">Financeiro / Contábil</option>
                    <option value="Produção">Fábrica e PCP</option>
                    <option value="Comercial">Vendas e Comercial</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowFuncModal(false)}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg text-slate-500"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-slate-900 text-white rounded-lg font-bold"
                >
                  Registrar Admissão
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL AVALIAÇÃO DE DESEMPENHO */}
      {selectedReviewFunc && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full border border-slate-200 shadow-xl overflow-hidden animate-slide-up text-slate-700">
            <div className="p-5 bg-slate-900 text-white">
              <h5 className="text-sm font-bold">Avaliação de Desempenho Periódica</h5>
            </div>
            <form onSubmit={handleReviewSubmit} className="p-5 space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-500">Classificação (Estrelas de 1 a 5) (*)</label>
                <select
                  value={reviewNota}
                  onChange={(e) => setReviewNota(Number(e.target.value))}
                  className="w-full p-2 border border-slate-200 rounded-lg text-sm"
                >
                  <option value={5}>⭐⭐⭐⭐⭐ (Foco Completo / Ideal)</option>
                  <option value={4}>⭐⭐⭐⭐ (Muito Produtivo)</option>
                  <option value={3}>⭐⭐⭐ (Dentro do Acordado)</option>
                  <option value={2}>⭐⭐ (Necessita Assistência)</option>
                  <option value={1}>⭐ (Fora do Perfil)</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-500">Feedback Estruturado (*)</label>
                <textarea
                  required
                  value={reviewFeedback}
                  onChange={(e) => setReviewFeedback(e.target.value)}
                  placeholder="Detalhamento do comportamento do colaborador..."
                  className="w-full p-2 border border-slate-200 rounded-lg text-sm"
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedReviewFunc(null)}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg text-slate-500"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-slate-900 text-white rounded-lg font-bold"
                >
                  Gravar Prontuário
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
