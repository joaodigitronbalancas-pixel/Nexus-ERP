/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Building,
  CheckSquare,
  FileText,
  Calendar,
  Users,
  Search,
  Plus,
  Trash2,
  Lock,
  Stamp,
  Globe,
  GitBranch,
  CheckCircle2,
  MapPin,
  Clock,
  ArrowRight
} from "lucide-react";
import { Filial, Cliente, Fornecedor, Tarefa, Documento } from "../../types";

interface AdministrativoSectionProps {
  empresaId: string;
  filiais: Filial[];
  clientes: Cliente[];
  fornecedores: Fornecedor[];
  documentos: Documento[];
  tarefas: Tarefa[];
  onAddFilial: (nova: Omit<Filial, "id" | "empresaId">) => void;
  onAddCliente: (novo: Omit<Cliente, "id" | "empresaId">) => void;
  onAddFornecedor: (novo: Omit<Fornecedor, "id" | "empresaId">) => void;
  onAddTarefa: (nova: Omit<Tarefa, "id" | "empresaId">) => void;
  onUpdateTarefaStatus: (tarefaId: string, novoStatus: "Pendente" | "Em Progresso" | "Concluido") => void;
  onAddDocumento: (novo: Omit<Documento, "id" | "empresaId">) => void;
  onAssinarDocumento: (documentoId: string) => void;
}

export default function AdministrativoSection({
  empresaId,
  filiais,
  clientes,
  fornecedores,
  documentos,
  tarefas,
  onAddFilial,
  onAddCliente,
  onAddFornecedor,
  onAddTarefa,
  onUpdateTarefaStatus,
  onAddDocumento,
  onAssinarDocumento
}: AdministrativoSectionProps) {
  const [activeTab, setActiveTab] = useState<"filiais" | "organograma" | "documentos" | "tarefas" | "parceiros">("filiais");

  // Filtering variables
  const companyFiliais = filiais.filter((f) => f.empresaId === empresaId);
  const companyClientes = clientes.filter((c) => c.empresaId === empresaId);
  const companyFornecedores = fornecedores.filter((forn) => forn.empresaId === empresaId);
  const companyDocumentos = documentos.filter((d) => d.empresaId === empresaId);
  const companyTarefas = tarefas.filter((t) => t.empresaId === empresaId);

  // New item modals / inputs
  const [showFilialModal, setShowFilialModal] = useState(false);
  const [newFilialNome, setNewFilialNome] = useState("");
  const [newFilialCnpj, setNewFilialCnpj] = useState("");
  const [newFilialCidade, setNewFilialCidade] = useState("");
  const [newFilialEstado, setNewFilialEstado] = useState("");

  const [showDocModal, setShowDocModal] = useState(false);
  const [newDocTitulo, setNewDocTitulo] = useState("");
  const [newDocCat, setNewDocCat] = useState("Contratos");
  const [newDocFile, setNewDocFile] = useState<File | null>(null);

  const [showTarefaModal, setShowTarefaModal] = useState(false);
  const [newTarTitulo, setNewTarTitulo] = useState("");
  const [newTarDesc, setNewTarDesc] = useState("");
  const [newTarResp, setNewTarResp] = useState("");
  const [newTarPrioridade, setNewTarPrioridade] = useState<"Baixa" | "Media" | "Alta">("Media");
  const [newTarLimite, setNewTarLimite] = useState("");

  const [showParceiroModal, setShowParceiroModal] = useState(false);
  const [parceiroTipo, setParceiroTipo] = useState<"Cliente" | "Fornecedor">("Cliente");
  const [newParcNome, setNewParcNome] = useState("");
  const [newParcCnpj, setNewParcCnpj] = useState("");
  const [newParcExtra, setNewParcExtra] = useState(""); // Segmento of Supplier or City of Client
  const [newParcEmail, setNewParcEmail] = useState("");

  // Handler submissions
  const handleAddFilialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFilialNome || !newFilialCnpj) return;
    onAddFilial({
      nome: newFilialNome,
      cnpj: newFilialCnpj,
      cidade: newFilialCidade || "São Paulo",
      estado: newFilialEstado || "SP"
    });
    setNewFilialNome("");
    setNewFilialCnpj("");
    setNewFilialCidade("");
    setNewFilialEstado("");
    setShowFilialModal(false);
  };

  const handleAddDocSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocTitulo) return;
    onAddDocumento({
      titulo: newDocTitulo + ".pdf",
      categoria: newDocCat,
      dataEnvio: new Date().toISOString().split("T")[0],
      tamanho: "1.2 MB",
      tipo: "PDF",
      assinadoDigitalmente: false
    });
    setNewDocTitulo("");
    setShowDocModal(false);
  };

  const handleAddTarefaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTarTitulo) return;
    onAddTarefa({
      titulo: newTarTitulo,
      descricao: newTarDesc,
      responsavelNome: newTarResp || "Antônio Ferreira",
      status: "Pendente",
      prioridade: newTarPrioridade,
      dataLimite: newTarLimite || "2026-06-15"
    });
    setNewTarTitulo("");
    setNewTarDesc("");
    setNewTarResp("");
    setShowTarefaModal(false);
  };

  const handleAddParceiroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newParcNome || !newParcCnpj) return;
    if (parceiroTipo === "Cliente") {
      onAddCliente({
        nome: newParcNome,
        cpfCnpj: newParcCnpj,
        email: newParcEmail,
        cidade: newParcExtra || "Campinas"
      });
    } else {
      onAddFornecedor({
        nome: newParcNome,
        cnpj: newParcCnpj,
        segmento: newParcExtra || "Insumos Gerais",
        email: newParcEmail
      });
    }
    setNewParcNome("");
    setNewParcCnpj("");
    setNewParcExtra("");
    setNewParcEmail("");
    setShowParceiroModal(false);
  };

  const organogramaNos = [
    { nome: "Conselho / Diretoria S.A.", cargo: "Diretor Presidente (CEO)", dep: "Presidência", responsavel: "Antônio Ferreira", avatar: "💼" },
    { nome: "Gerência Técnica", cargo: "Gerente Operacional & Industrial", dep: "Fábrica e PCP", responsavel: "Carlos Ramos", avatar: "🏭" },
    { nome: "Administrativo & Financeiro", cargo: "Chefe Administrativo Sênior", dep: "Financeiro / Fiscal / Contabilidade", responsavel: "Bruno Silva", avatar: "💰" },
    { nome: "Recursos Humanos", cargo: "Gestora Corporativa de Talentos", dep: "RH & DP", responsavel: "Márcia Souza", avatar: "👩‍💼" },
    { nome: "Setor de Vendas Internas", cargo: "Supervisora Comercial", dep: "Comercial / CRM", responsavel: "Ana Oliveira", avatar: "📈" }
  ];

  return (
    <div id="administrativo-layout" className="space-y-6">
      {/* Title Subheader */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Módulo Administrativo & Workflow</h2>
          <p className="text-xs text-slate-500">Unidades de negócio, alocações de cargos, agenda de atividades e assinaturas criptográficas.</p>
        </div>
      </div>

      {/* Internal Tabs view */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        <div className="flex flex-wrap border-b border-slate-100 bg-slate-50/50 p-2 gap-2">
          <button
            onClick={() => setActiveTab("filiais")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === "filiais" ? "bg-slate-900 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Building size={14} /> Filiais & Sedes
          </button>
          <button
            onClick={() => setActiveTab("organograma")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === "organograma" ? "bg-slate-900 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <GitBranch size={14} /> Organograma Funcional
          </button>
          <button
            onClick={() => setActiveTab("documentos")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === "documentos" ? "bg-slate-900 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Stamp size={14} /> Documentos & Assinatura ICP
          </button>
          <button
            onClick={() => setActiveTab("tarefas")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === "tarefas" ? "bg-slate-900 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <CheckSquare size={14} /> Agenda & Tarefas
          </button>
          <button
            onClick={() => setActiveTab("parceiros")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === "parceiros" ? "bg-slate-900 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Users size={14} /> Clientes & Fornecedores
          </button>
        </div>

        <div className="p-6">
          {/* TAB: FILIAIS */}
          {activeTab === "filiais" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-800">Unidades Organizacionais</h4>
                  <p className="text-xs text-slate-400 font-mono">Total filial ativa: {companyFiliais.length}</p>
                </div>
                <button
                  onClick={() => setShowFilialModal(true)}
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3 py-2 rounded-xl inline-flex items-center gap-1 transition cursor-pointer"
                >
                  <Plus size={14} /> Nova Filial
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {companyFiliais.map((fil) => (
                  <div key={fil.id} className="p-5 border border-slate-200 rounded-2xl bg-slate-50 flex items-start gap-4 hover:border-slate-400 transition">
                    <div className="p-3 bg-white rounded-xl border border-slate-200 text-indigo-600 shadow-2xs">
                      <Globe size={20} />
                    </div>
                    <div className="space-y-2">
                      <h5 className="font-bold text-slate-800 text-sm leading-tight">{fil.nome}</h5>
                      <div className="space-y-1 text-xs text-slate-500 font-mono">
                        <p className="flex items-center gap-1"><MapPin size={12} className="text-slate-400" /> {fil.cidade}, {fil.estado}</p>
                        <p>CNPJ: {fil.cnpj}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: ORGANOGRAMA */}
          {activeTab === "organograma" && (
            <div className="space-y-6">
              <div className="text-center max-w-md mx-auto space-y-1 pb-4">
                <h4 className="font-black text-slate-800">Círculos de Escopo de Autoridade</h4>
                <p className="text-xs text-slate-400">Fluxograma estrutural de responsabilidade e governança integrada.</p>
              </div>

              {/* Node cards chain layout */}
              <div className="flex flex-col items-center gap-8 relative">
                {organogramaNos.map((node, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && (
                      <div className="w-0.5 h-8 bg-slate-300 text-slate-400 flex items-center justify-center animate-pulse">
                        <ArrowRight size={14} className="rotate-90" />
                      </div>
                    )}
                    <div className="p-4 border border-slate-200 rounded-2xl bg-white shadow-xs max-w-sm w-full flex items-center gap-4 hover:shadow-md transition">
                      <span className="text-2xl p-2 bg-slate-50 rounded-xl">{node.avatar}</span>
                      <div>
                        <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-bold">
                          {node.dep}
                        </span>
                        <h5 className="font-extrabold text-sm text-slate-800 mt-1">{node.responsavel}</h5>
                        <p className="text-xs text-slate-500">{node.cargo}</p>
                      </div>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}

          {/* TAB: DOCUMENTOS & ASSINATURA */}
          {activeTab === "documentos" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-800">Gestão de Documentos Digitais</h4>
                  <p className="text-xs text-slate-400">Contratos, acordos coletivos e certidões ativas.</p>
                </div>
                <button
                  onClick={() => setShowDocModal(true)}
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3 py-2 rounded-xl inline-flex items-center gap-1 transition cursor-pointer"
                >
                  <Plus size={14} /> Subir Documento
                </button>
              </div>

              <div className="overflow-x-auto border border-slate-100 rounded-xl">
                <table className="w-full text-left text-sm text-slate-700">
                  <thead className="bg-slate-50 text-xs text-slate-500 uppercase border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-3">Nome do Arquivo</th>
                      <th className="px-6 py-3">Categoria</th>
                      <th className="px-6 py-3">Data de Upload</th>
                      <th className="px-6 py-3">Tamanho</th>
                      <th className="px-6 py-3">Assinatura ICP-BR</th>
                      <th className="px-6 py-3 text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {companyDocumentos.map((doc) => (
                      <tr key={doc.id} className="hover:bg-slate-50/50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="p-1.5 bg-rose-50 text-rose-600 rounded">
                              <FileText size={14} />
                            </span>
                            <span className="font-bold text-slate-800">{doc.titulo}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">{doc.categoria}</td>
                        <td className="px-6 py-4 font-mono">{doc.dataEnvio}</td>
                        <td className="px-6 py-4 font-mono">{doc.tamanho}</td>
                        <td className="px-6 py-4">
                          {doc.assinadoDigitalmente ? (
                            <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                              <CheckCircle2 size={12} /> Assinado Criptográfico
                            </span>
                          ) : (
                            <span className="text-slate-400 italic">Pendente</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {!doc.assinadoDigitalmente ? (
                            <button
                              onClick={() => onAssinarDocumento(doc.id)}
                              className="text-[10px] bg-slate-900 hover:bg-emerald-600 text-white font-bold py-1 px-2.5 rounded-lg transition"
                            >
                              Assinar ICP
                            </button>
                          ) : (
                            <span className="text-[10px] text-slate-500 font-mono font-bold bg-slate-100 p-1.5 rounded-sm">SHA-256 Validado</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: TAREFAS */}
          {activeTab === "tarefas" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-800">Quadro de Tarefas de Workflow</h4>
                  <p className="text-xs text-slate-400 font-mono">Workflow e monitoramento de cronogramas.</p>
                </div>
                <button
                  onClick={() => setShowTarefaModal(true)}
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3 py-2 rounded-xl inline-flex items-center gap-1 transition cursor-pointer"
                >
                  <Plus size={14} /> Planejar Atividade
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Column Pendente */}
                <div className="p-4 bg-slate-50 rounded-2xl space-y-3">
                  <div className="flex justify-between items-center px-1">
                    <span className="text-xs font-extrabold text-slate-600 uppercase flex items-center gap-1">
                      <Clock size={12} /> Pendente
                    </span>
                    <span className="bg-slate-200 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-full font-mono">
                      {companyTarefas.filter((t) => t.status === "Pendente").length}
                    </span>
                  </div>
                  {companyTarefas
                    .filter((t) => t.status === "Pendente")
                    .map((t) => (
                      <div key={t.id} className="p-4 bg-white border border-slate-100 rounded-xl space-y-2 hover:shadow-xs transition">
                        <div className="flex justify-between">
                          <span className={`px-2 py-0.5 rounded text-[8px] font-bold ${t.prioridade === "Alta" ? "bg-rose-50 text-rose-700" : "bg-blue-50 text-blue-700"}`}>
                            {t.prioridade}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">Limite: {t.dataLimite}</span>
                        </div>
                        <h5 className="font-bold text-slate-800 text-sm leading-tight">{t.titulo}</h5>
                        <p className="text-xs text-slate-500 leading-normal">{t.descricao}</p>
                        <div className="flex justify-between items-center pt-2 border-t border-slate-50 text-[10px]">
                          <span className="text-slate-400">Resp: <span className="font-bold text-slate-700">{t.responsavelNome}</span></span>
                          <button
                            onClick={() => onUpdateTarefaStatus(t.id, "Em Progresso")}
                            className="bg-slate-900 text-white font-bold px-2 py-1 rounded"
                          >
                            Iniciar
                          </button>
                        </div>
                      </div>
                    ))}
                </div>

                {/* Column Em Progresso */}
                <div className="p-4 bg-slate-50 rounded-2xl space-y-3">
                  <div className="flex justify-between items-center px-1">
                    <span className="text-xs font-extrabold text-slate-600 uppercase flex items-center gap-1">
                      <Clock size={12} /> Em Progresso
                    </span>
                    <span className="bg-slate-200 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-full font-mono">
                      {companyTarefas.filter((t) => t.status === "Em Progresso").length}
                    </span>
                  </div>
                  {companyTarefas
                    .filter((t) => t.status === "Em Progresso")
                    .map((t) => (
                      <div key={t.id} className="p-4 bg-white border border-slate-100 rounded-xl space-y-2 hover:shadow-xs transition">
                        <div className="flex justify-between">
                          <span className={`px-2 py-0.5 rounded text-[8px] font-bold ${t.prioridade === "Alta" ? "bg-rose-50 text-rose-700" : "bg-blue-50 text-blue-700"}`}>
                            {t.prioridade}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">Limite: {t.dataLimite}</span>
                        </div>
                        <h5 className="font-bold text-slate-800 text-sm leading-tight">{t.titulo}</h5>
                        <p className="text-xs text-slate-500 leading-normal">{t.descricao}</p>
                        <div className="flex justify-between items-center pt-2 border-t border-slate-50 text-[10px]">
                          <span className="text-slate-400">Resp: <span className="font-bold text-slate-700">{t.responsavelNome}</span></span>
                          <button
                            onClick={() => onUpdateTarefaStatus(t.id, "Concluido")}
                            className="bg-emerald-600 text-white font-bold px-2 py-1 rounded"
                          >
                            Finalizar
                          </button>
                        </div>
                      </div>
                    ))}
                </div>

                {/* Column Concluido */}
                <div className="p-4 bg-slate-50 rounded-2xl space-y-3">
                  <div className="flex justify-between items-center px-1">
                    <span className="text-xs font-extrabold text-slate-600 uppercase flex items-center gap-1">
                      <CheckCircle2 size={12} className="text-emerald-500" /> Concluído
                    </span>
                    <span className="bg-slate-200 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-full font-mono">
                      {companyTarefas.filter((t) => t.status === "Concluido").length}
                    </span>
                  </div>
                  {companyTarefas
                    .filter((t) => t.status === "Concluido")
                    .map((t) => (
                      <div key={t.id} className="p-4 bg-white border border-slate-100 rounded-xl space-y-2 hover:shadow-xs transition opacity-75">
                        <div className="flex justify-between">
                          <span className="px-2 py-0.5 rounded text-[8px] font-bold bg-slate-100 text-slate-500">
                            {t.prioridade}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">Finalizada</span>
                        </div>
                        <h5 className="font-bold text-slate-800 text-sm leading-tight line-through">{t.titulo}</h5>
                        <p className="text-xs text-slate-500 leading-normal">{t.descricao}</p>
                        <div className="flex justify-between items-center pt-2 border-t border-slate-50 text-[10px]">
                          <span className="text-slate-400">Resp: <span className="font-bold text-slate-700">{t.responsavelNome}</span></span>
                          <span className="text-emerald-600 font-bold">100% Sucesso</span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: PARCEIROS */}
          {activeTab === "parceiros" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-800">Parceiros de Negócio (CRM & Supply Chain)</h4>
                  <p className="text-xs text-slate-400">Listagem de clientes qualificados e fornecedores de insumos homologados.</p>
                </div>
                <button
                  onClick={() => setShowParceiroModal(true)}
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3 py-2 rounded-xl inline-flex items-center gap-1 transition cursor-pointer"
                >
                  <Plus size={14} /> Cadastrar Parceiro
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Clientes */}
                <div className="space-y-3 p-4 bg-slate-50/50 border border-slate-200 rounded-2xl">
                  <h5 className="font-bold text-sm text-slate-800 flex items-center gap-1 px-1">
                    <Users size={16} className="text-indigo-600" /> Clientes Compradores
                  </h5>
                  <div className="space-y-2 h-72 overflow-y-auto">
                    {companyClientes.map((cli) => (
                      <div key={cli.id} className="p-3 bg-white border border-slate-100 rounded-xl text-xs space-y-1">
                        <h6 className="font-bold text-slate-800 text-[13px]">{cli.nome}</h6>
                        <p className="text-slate-400">CNPJ/CPF: {cli.cpfCnpj}</p>
                        <div className="flex justify-between items-center text-slate-500 text-[11px] pt-1.5 border-t border-slate-50">
                          <span>E-mail: {cli.email}</span>
                          <span>Praça: {cli.cidade}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Fornecedores */}
                <div className="space-y-3 p-4 bg-slate-50/50 border border-slate-200 rounded-2xl">
                  <h5 className="font-bold text-sm text-slate-800 flex items-center gap-1 px-1">
                    <Building size={16} className="text-indigo-600" /> Contas de Fornecedores
                  </h5>
                  <div className="space-y-2 h-72 overflow-y-auto">
                    {companyFornecedores.map((forn) => (
                      <div key={forn.id} className="p-3 bg-white border border-slate-100 rounded-xl text-xs space-y-1">
                        <h6 className="font-bold text-slate-800 text-[13px]">{forn.nome}</h6>
                        <p className="text-slate-400">CNPJ: {forn.cnpj}</p>
                        <div className="flex justify-between items-center text-slate-500 text-[11px] pt-1.5 border-t border-slate-50">
                          <span>Segmento: {forn.segmento}</span>
                          <span>E-mail: {forn.email}</span>
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

      {/* MODAL NOVA FILIAL */}
      {showFilialModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full border border-slate-200 shadow-xl overflow-hidden animate-slide-up text-slate-700">
            <div className="p-5 bg-slate-900 text-white">
              <h5 className="text-sm font-bold">Cadastrar Filial Corporativa</h5>
              <p className="text-[10px] text-slate-400 mt-1">Apenas o administrador master ou diretores podem criar sedes fiscais.</p>
            </div>
            <form onSubmit={handleAddFilialSubmit} className="p-5 space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-500">Nome da Filial / Filial (*)</label>
                <input
                  type="text"
                  required
                  value={newFilialNome}
                  onChange={(e) => setNewFilialNome(e.target.value)}
                  placeholder="Ex: Filial Alfa - Londrina"
                  className="w-full p-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-500">CNPJ Fiscal (*)</label>
                <input
                  type="text"
                  required
                  value={newFilialCnpj}
                  onChange={(e) => setNewFilialCnpj(e.target.value)}
                  placeholder="Ex: 12.345.678/0004-90"
                  className="w-full p-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-bold text-slate-500">Cidade (*)</label>
                  <input
                    type="text"
                    required
                    value={newFilialCidade}
                    onChange={(e) => setNewFilialCidade(e.target.value)}
                    placeholder="Ex: Londrina"
                    className="w-full p-2 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-500">Estado (*)</label>
                  <input
                    type="text"
                    required
                    value={newFilialEstado}
                    onChange={(e) => setNewFilialEstado(e.target.value)}
                    placeholder="PR"
                    className="w-full p-2 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowFilialModal(false)}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg text-slate-500"
                >
                  Recusar
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-slate-900 text-white rounded-lg font-bold"
                >
                  Homologar Filial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL NOVO DOCUMENTO */}
      {showDocModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full border border-slate-200 shadow-xl overflow-hidden animate-slide-up text-slate-700">
            <div className="p-5 bg-slate-900 text-white">
              <h5 className="text-sm font-bold">Subir Documento Digital</h5>
              <p className="text-[10px] text-slate-400 mt-1">Armazenamento com hash criptográfico.</p>
            </div>
            <form onSubmit={handleAddDocSubmit} className="p-5 space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-500">Título / Nome do Contrato (*)</label>
                <input
                  type="text"
                  required
                  value={newDocTitulo}
                  onChange={(e) => setNewDocTitulo(e.target.value)}
                  placeholder="Nome sem extensão .pdf"
                  className="w-full p-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-500">Categoria (*)</label>
                <select
                  value={newDocCat}
                  onChange={(e) => setNewDocCat(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg text-sm"
                >
                  <option value="Contratos">Contratos de Prestação</option>
                  <option value="Suprimentos">Ata de Compra / Fornecimento</option>
                  <option value="Recursos Humanos">Aditivo Trabalhista / RH</option>
                  <option value="Regulatórios / Fiscais">Documentos Fiscais / SEFAZ</option>
                </select>
              </div>

              <div className="p-4 border-2 border-dashed border-slate-200 rounded-xl text-center space-y-1 bg-slate-50 cursor-pointer">
                <span className="text-indigo-600 font-bold block">Escolher de Arquivos</span>
                <span className="text-[9px] text-slate-400">Apenas PDF limitado a 10MB</span>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowDocModal(false)}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg text-slate-500"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-slate-900 text-white rounded-lg font-bold"
                >
                  Registrar PDF
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL NOVA TAREFA */}
      {showTarefaModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full border border-slate-200 shadow-xl overflow-hidden animate-slide-up text-slate-700">
            <div className="p-5 bg-slate-900 text-white">
              <h5 className="text-sm font-bold">Criar Atividade de Cronograma</h5>
            </div>
            <form onSubmit={handleAddTarefaSubmit} className="p-5 space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-500">Nome / Título (*)</label>
                <input
                  type="text"
                  required
                  value={newTarTitulo}
                  onChange={(e) => setNewTarTitulo(e.target.value)}
                  placeholder="Ex: Conciliação Tributária..."
                  className="w-full p-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-500">Descrição Detalhada</label>
                <textarea
                  value={newTarDesc}
                  onChange={(e) => setNewTarDesc(e.target.value)}
                  placeholder="Detalhamento operacional da atividade..."
                  className="w-full p-2 border border-slate-200 rounded-lg text-sm"
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-bold text-slate-500">Prazo / Prazo Limite</label>
                  <input
                    type="date"
                    value={newTarLimite}
                    onChange={(e) => setNewTarLimite(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg text-sm font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-500">Responsável Nome</label>
                  <input
                    type="text"
                    value={newTarResp}
                    onChange={(e) => setNewTarResp(e.target.value)}
                    placeholder="Ex: Bruno Silva"
                    className="w-full p-2 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-500">Prioridade</label>
                <select
                  value={newTarPrioridade}
                  onChange={(e) => setNewTarPrioridade(e.target.value as "Baixa" | "Media" | "Alta")}
                  className="w-full p-2 border border-slate-200 rounded-lg text-sm"
                >
                  <option value="Baixa">Comum / Baixa</option>
                  <option value="Media">Relevante / Média</option>
                  <option value="Alta">Urgente / Alta</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowTarefaModal(false)}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg text-slate-500"
                >
                  Descartar
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-slate-900 text-white rounded-lg font-bold"
                >
                  Publicar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL NOVO PARCEIRO */}
      {showParceiroModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full border border-slate-200 shadow-xl overflow-hidden animate-slide-up text-slate-700">
            <div className="p-5 bg-slate-900 text-white">
              <h5 className="text-sm font-bold">Cadastrar Parceiro de Negócio</h5>
              <div className="flex gap-2 mt-2 p-0.5 bg-slate-850 rounded-lg">
                <button
                  type="button"
                  onClick={() => setParceiroTipo("Cliente")}
                  className={`flex-1 text-[11px] font-bold py-1 px-2 rounded-md transition ${
                    parceiroTipo === "Cliente" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-400"
                  }`}
                >
                  Cliente
                </button>
                <button
                  type="button"
                  onClick={() => setParceiroTipo("Fornecedor")}
                  className={`flex-1 text-[11px] font-bold py-1 px-2 rounded-md transition ${
                    parceiroTipo === "Fornecedor" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-400"
                  }`}
                >
                  Fornecedor
                </button>
              </div>
            </div>
            <form onSubmit={handleAddParceiroSubmit} className="p-5 space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-500">Nome Oficial S.A / Razão Social (*)</label>
                <input
                  type="text"
                  required
                  value={newParcNome}
                  onChange={(e) => setNewParcNome(e.target.value)}
                  placeholder="Nome do Cliente ou Fornecedor"
                  className="w-full p-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-500">CNPJ ou CPF Fiscal (*)</label>
                <input
                  type="text"
                  required
                  value={newParcCnpj}
                  onChange={(e) => setNewParcCnpj(e.target.value)}
                  placeholder="00.000.000/0000-00"
                  className="w-full p-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-bold text-slate-500">E-mail de Cobrança / Contato</label>
                  <input
                    type="email"
                    value={newParcEmail}
                    onChange={(e) => setNewParcEmail(e.target.value)}
                    placeholder="compras@parceiro.com"
                    className="w-full p-2 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-500">
                    {parceiroTipo === "Cliente" ? "Cidade Sede (*)" : "Segmento de Insumo (*)"}
                  </label>
                  <input
                    type="text"
                    required
                    value={newParcExtra}
                    onChange={(e) => setNewParcExtra(e.target.value)}
                    placeholder={parceiroTipo === "Cliente" ? "Ex: Curitiba" : "Ex: Embalagens"}
                    className="w-full p-2 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowParceiroModal(false)}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg text-slate-500"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-slate-900 text-white rounded-lg font-bold"
                >
                  Homologar Parceiro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
