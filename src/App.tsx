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
  Shield,
  Clock,
  Sparkles,
  Zap,
  Wrench,
  ChevronRight,
  LogOut,
  Sliders,
  CheckCircle,
  HelpCircle,
  Hash,
  Briefcase,
  AlertTriangle,
  FolderLock,
  Unlock,
  Lock
} from "lucide-react";

import {
  PLANOS_INICIAIS,
  EMPRESAS_INICIAIS,
  FILIAIS_INICIAIS,
  USUARIOS_INICIAIS,
  FUNCIONARIOS_INICIAIS,
  PONTO_INICIAL,
  HOLERITES_INICIAIS,
  FORNECEDORES_INICIAIS,
  CLIENTES_INICIAIS,
  DOCUMENTOS_INICIAIS,
  TAREFAS_INICIAIS,
  NOTAS_FATURAMENTO_INICIAIS,
  TRANSCOES_FINANCEIRAS_INICIAIS,
  ORDEM_PRODUCAO_INICIAL,
  MAQUINAS_INICIAIS,
  LEADS_CRM_INICIAIS,
  MENSAGENS_INICIAIS,
  TICKETS_INICIAIS,
  LOGS_INICIAIS,
  getLocalData,
  saveLocalData
} from "./data/mockData";

import {
  Empresa,
  Plano,
  Filial,
  Usuario,
  Funcionario,
  RegistroPonto,
  Holerite,
  Fornecedor,
  Cliente,
  Documento,
  Tarefa,
  NotaFiscal,
  MovimentacaoFinanceira,
  OrdemProducao,
  Maquina,
  LeadCRM,
  MensagemChat,
  TicketSuporte,
  LogAuditoria,
  NivelHierarquico,
  SolicitacaoAcesso
} from "./types";

// Import modules sections
import SuperAdminDashboard from "./components/sections/SuperAdminDashboard";
import AdministrativoSection from "./components/sections/AdministrativoSection";
import RHSection from "./components/sections/RHSection";
import FinanceiroSection from "./components/sections/FinanceiroSection";
import FaturamentoSection from "./components/sections/FaturamentoSection";
import IndustrialSection from "./components/sections/IndustrialSection";
import ComercialSection from "./components/sections/ComercialSection";
import ChatInternoSection from "./components/sections/ChatInternoSection";
import SuporteSection from "./components/sections/SuporteSection";
import SegurancaSection from "./components/sections/SegurancaSection";
import IASection from "./components/sections/IASection";
import DashboardExecutivoIA from "./components/sections/DashboardExecutivoIA";
import NexusAICopilot from "./components/NexusAICopilot";

export default function App() {
  // Database States loaded reactively from client LocalStorage
  const [empresas, setEmpresas] = useState<Empresa[]>(() => getLocalData("companies", EMPRESAS_INICIAIS));
  const [planos, setPlanos] = useState<Plano[]>(() => getLocalData("plans", PLANOS_INICIAIS));
  const [filiais, setFiliais] = useState<Filial[]>(() => getLocalData("branches", FILIAIS_INICIAIS));
  const [usuarios, setUsuarios] = useState<Usuario[]>(() => getLocalData("users", USUARIOS_INICIAIS));
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>(() => getLocalData("employees", FUNCIONARIOS_INICIAIS));
  const [pontos, setPontos] = useState<RegistroPonto[]>(() => getLocalData("clocks", PONTO_INICIAL));
  const [holerites, setHolerites] = useState<Holerite[]>(() => getLocalData("payrolls", HOLERITES_INICIAIS));
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>(() => getLocalData("suppliers", FORNECEDORES_INICIAIS));
  const [clientes, setClientes] = useState<Cliente[]>(() => getLocalData("partners", CLIENTES_INICIAIS));
  const [documentos, setDocumentos] = useState<Documento[]>(() => getLocalData("documents", DOCUMENTOS_INICIAIS));
  const [tarefas, setTarefas] = useState<Tarefa[]>(() => getLocalData("tasks", TAREFAS_INICIAIS));
  const [notas, setNotas] = useState<NotaFiscal[]>(() => getLocalData("invoices", NOTAS_FATURAMENTO_INICIAIS));
  const [transacoes, setTransacoes] = useState<MovimentacaoFinanceira[]>(() => getLocalData("transactions", TRANSCOES_FINANCEIRAS_INICIAIS));
  const [ordensProducao, setOrdensProducao] = useState<OrdemProducao[]>(() => getLocalData("production_ops", ORDEM_PRODUCAO_INICIAL));
  const [maquinas, setMaquinas] = useState<Maquina[]>(() => getLocalData("machines", MAQUINAS_INICIAIS));
  const [leads, setLeads] = useState<LeadCRM[]>(() => getLocalData("crm_leads", LEADS_CRM_INICIAIS));
  const [mensagens, setMensagens] = useState<MensagemChat[]>(() => getLocalData("chat_msgs", MENSAGENS_INICIAIS));
  const [tickets, setTickets] = useState<TicketSuporte[]>(() => getLocalData("tickets", TICKETS_INICIAIS));
  const [auditLogs, setAuditLogs] = useState<LogAuditoria[]>(() => getLocalData("system_logs", LOGS_INICIAIS));

  // --- SaaS Double-Approval & Security Levels States ---
  const [liberacoesModulos, setLiberacoesModulos] = useState<Record<string, Record<string, boolean>>>(() => {
    return getLocalData("liberacoes_modulos", {
      "emp_alfa": { "Administrativo": false, "RH": false, "Financeiro": false },
      "emp_global": { "Administrativo": true, "RH": true, "Financeiro": true }
    });
  });

  const [solicitacoes, setSolicitacoes] = useState<SolicitacaoAcesso[]>(() => {
    return getLocalData("solicitacoes_acesso", [
      {
        id: "req_1",
        empresaId: "emp_alfa",
        empresaNome: "Indústria Metalúrgica Alfa Ltda",
        usuarioNome: "Antônio Ferreira",
        departamentoSolicitado: "RH",
        solicitanteNome: "Antônio Ferreira",
        motivo: "Libera o DP para operar no modo normal de visualização de salários e holerites pelo time analista.",
        nivelRequerido: "GERENTE",
        status: "Pendente",
        data: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: "req_2",
        empresaId: "emp_alfa",
        empresaNome: "Indústria Metalúrgica Alfa Ltda",
        usuarioNome: "Antônio Ferreira",
        departamentoSolicitado: "Financeiro",
        solicitanteNome: "Antônio Ferreira",
        motivo: "Auditoria preventiva das ordens de faturamento e caixa por gerentes operacionais de contas.",
        nivelRequerido: "ANALISTA",
        status: "Pendente",
        data: new Date(Date.now() - 1800000).toISOString()
      },
      {
        id: "req_3",
        empresaId: "emp_global",
        empresaNome: "Global Alimentos S.A.",
        usuarioNome: "Carlos Eduardo Santos",
        departamentoSolicitado: "Administrativo",
        solicitanteNome: "Carlos Eduardo Santos",
        motivo: "Liberar diretoria de filial para assinaturas contratuais integradas.",
        nivelRequerido: "DIRETOR",
        status: "Aprovado",
        data: new Date(Date.now() - 86400000).toISOString()
      }
    ]);
  });

  const [simulandoEmpresaId, setSimulandoEmpresaId] = useState<string | null>(null);
  const [simulatedTestLevel, setSimulatedTestLevel] = useState<string>("Bypass"); // "Bypass" (Super), "DonoEmpresa", "Gerente", "Analista", "Operador"
  const [activeModeView, setActiveModeView] = useState<"SA_CONSOLE" | "CLIENT_SIMULATION">("SA_CONSOLE");

  // Current session auth states
  const [loggedInUser, setLoggedInUser] = useState<Usuario | null>(() => {
    const cached = localStorage.getItem("active_session");
    return cached ? JSON.parse(cached) : null;
  });

  // Multi-Company isolated scopes info (incorporating impersonation simulation logic)
  const activeCompany = empresas.find(
    (e) => e.id === (loggedInUser?.nivel === "SuperAdmin" && simulandoEmpresaId ? simulandoEmpresaId : loggedInUser?.empresaId)
  );
  const activePlan = planos.find((p) => p.id === activeCompany?.planoId);

  // Authentication Fields UI
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [authError, setAuthError] = useState("");

  // Target Module Menu Selected
  const [activeClientTab, setActiveClientTab] = useState<string>("Dashboard Executivo");

  // Helper State saving generic action
  const pushAuditLog = (acaoStr: string, specifiedEmpresaId: string | null = null) => {
    const newLog: LogAuditoria = {
      id: `log_${Date.now()}`,
      empresaId: specifiedEmpresaId || activeCompany?.id || loggedInUser?.empresaId || null,
      usuarioNome: loggedInUser?.username || "sistema",
      nivel: "INFO",
      acao: acaoStr,
      ip: "189.102.30.221",
      data: new Date().toISOString()
    };
    const updated = [newLog, ...auditLogs];
    setAuditLogs(updated);
    saveLocalData("system_logs", updated);
  };

  // --- ACTIONS HANDLERS SPECIFIED IN ERP SCHEMAS ---

  // 1. Super Admin: toggle block tenant company
  const handleToggleEmpresaStatus = (empId: string) => {
    const updated = empresas.map((e) => {
      if (e.id === empId) {
        const nextStatus: "Ativo" | "Bloqueado" = e.status === "Ativo" ? "Bloqueado" : "Ativo";
        pushAuditLog(`Status da Empresa ${e.nome} alterado para ${nextStatus}`, empId);
        return { ...e, status: nextStatus };
      }
      return e;
    });
    setEmpresas(updated);
    saveLocalData("companies", updated);
  };

  // 2. Super Admin: upgrade tenant subscription
  const handleUpdateEmpresaPlano = (empId: string, planoId: string) => {
    const targetPlano = planos.find(p => p.id === planoId);
    if (!targetPlano) return;
    const updated = empresas.map((e) => {
      if (e.id === empId) {
        pushAuditLog(`Plano da Empresa ${e.nome} alterado para ${targetPlano.nome}`, empId);
        return {
          ...e,
          planoId,
          limiteUsuarios: targetPlano.maxUsuarios,
          limiteFiliais: targetPlano.maxFiliais
        };
      }
      return e;
    });
    setEmpresas(updated);
    saveLocalData("companies", updated);
  };

  // 3. Super Admin: create new enterprise
  const handleCreateEmpresa = (nova: Omit<Empresa, "id" | "dataCadastro" | "logoColor">) => {
    const nextId = `emp_${Date.now()}`;
    const nextColor = ["indigo", "sky", "emerald", "amber"][Math.floor(Math.random() * 4)];
    const finalNew: Empresa = {
      ...nova,
      id: nextId,
      logoColor: nextColor,
      dataCadastro: new Date().toISOString().split("T")[0]
    };
    const updated = [...empresas, finalNew];
    setEmpresas(updated);
    saveLocalData("companies", updated);
    pushAuditLog(`SaaS provisionou credenciais de tenant: ${nova.nome}`, nextId);
  };

  // 4. Super Admin: reply support tickets
  const handleResponderTicket = (ticketId: string, resposta: string) => {
    const updated = tickets.map((t) => {
      if (t.id === ticketId) {
        return {
          ...t,
          status: "Respondido" as any,
          mensagens: [
            ...t.mensagens,
            { deAdmin: true, mensagem: resposta, data: new Date().toISOString() }
          ]
        };
      }
      return t;
    });
    setTickets(updated);
    saveLocalData("tickets", updated);
    pushAuditLog(`Super Admin respondeu ao chamado de suporte #${ticketId}`);
  };

  // 5. Client: add branch
  const handleAddFilial = (nova: Omit<Filial, "id" | "empresaId">) => {
    const finalNew: Filial = {
      ...nova,
      id: `fil_${Date.now()}`,
      empresaId: loggedInUser?.empresaId || ""
    };
    const updated = [...filiais, finalNew];
    setFiliais(updated);
    saveLocalData("branches", updated);
    pushAuditLog(`Filial cadastrada: ${nova.nome}`);
    alert("Pronto! Nova filial integrada.");
  };

  const handleAddCliente = (novo: Omit<Cliente, "id" | "empresaId">) => {
    const finalNew: Cliente = {
      ...novo,
      id: `cli_${Date.now()}`,
      empresaId: loggedInUser?.empresaId || ""
    };
    const updated = [...clientes, finalNew];
    setClientes(updated);
    saveLocalData("partners", updated);
    pushAuditLog(`Parceiro Cliente adicionado: ${novo.nome}`);
  };

  const handleAddFornecedor = (novo: Omit<Fornecedor, "id" | "empresaId">) => {
    const finalNew: Fornecedor = {
      ...novo,
      id: `for_${Date.now()}`,
      empresaId: loggedInUser?.empresaId || ""
    };
    const updated = [...fornecedores, finalNew];
    setFornecedores(updated);
    saveLocalData("suppliers", updated);
    pushAuditLog(`Parceiro Fornecedor adicionado: ${novo.nome}`);
  };

  // 6. Client: upload & sign documents
  const handleAddDocumento = (novo: Omit<Documento, "id" | "empresaId">) => {
    const finalNew: Documento = {
      ...novo,
      id: `doc_${Date.now()}`,
      empresaId: loggedInUser?.empresaId || "",
      dataEnvio: new Date().toISOString().split("T")[0],
      assinadoDigitalmente: false
    };
    const updated = [finalNew, ...documentos];
    setDocumentos(updated);
    saveLocalData("documents", updated);
    pushAuditLog(`Documento corporativo adicionado: ${novo.titulo}`);
  };

  const handleAssinarDocumento = (docId: string) => {
    const updated = documentos.map((d) => {
      if (d.id === docId) {
        pushAuditLog(`Assinatura ICP-Brasil registrada para: ${d.titulo}`);
        return { ...d, assinadoDigitalmente: true };
      }
      return d;
    });
    setDocumentos(updated);
    saveLocalData("documents", updated);
    alert("Sucesso! O documento foi criptografado com chave ICP-Brasil.");
  };

  // 7. Client: add tasks
  const handleAddTarefa = (nova: Omit<Tarefa, "id" | "empresaId">) => {
    const finalNew: Tarefa = {
      ...nova,
      id: `tar_${Date.now()}`,
      empresaId: loggedInUser?.empresaId || ""
    };
    const updated = [finalNew, ...tarefas];
    setTarefas(updated);
    saveLocalData("tasks", updated);
    pushAuditLog(`Nova tarefa atribuída a ${nova.responsavelNome}: ${nova.titulo}`);
  };

  const handleUpdateTarefaStatus = (taskId: string, novoStatus: "Pendente" | "Em Progresso" | "Concluido") => {
    const updated = tarefas.map((t) => {
      if (t.id === taskId) {
        pushAuditLog(`Tarefa alterada para ${novoStatus}: ${t.titulo}`);
        return { ...t, status: novoStatus };
      }
      return t;
    });
    setTarefas(updated);
    saveLocalData("tasks", updated);
  };

  // 8. Client: add employee
  const handleAddFuncionario = (novo: Omit<Funcionario, "id" | "empresaId">) => {
    const finalNew: Funcionario = {
      ...novo,
      id: `func_${Date.now()}`,
      empresaId: loggedInUser?.empresaId || "",
      status: "Ativo",
      horasBanco: 0,
      epiEntregues: [],
      avaliacoes: []
    };
    const updated = [...funcionarios, finalNew];
    setFuncionarios(updated);
    saveLocalData("employees", updated);
    pushAuditLog(`Funcionário contratado e integrado em folha DP: ${novo.nome}`);
    alert("Colaborador integrado!");
  };

  // 9. Client: clock entry point
  const handleRegistrarPonto = (funcionarioId: string, tipo: "entrada" | "saidaAlmoco" | "retornoAlmoco" | "saida") => {
    const worker = funcionarios.find((f) => f.id === funcionarioId);
    if (!worker) return;
    const newP: RegistroPonto = {
      id: `pt_${Date.now()}`,
      funcionarioId,
      funcionarioNome: worker.nome,
      data: new Date().toISOString().split("T")[0],
      entrada: tipo === "entrada" ? new Date().toLocaleTimeString("pt-BR") : "08:00:00",
      saidaAlmoco: tipo === "saidaAlmoco" ? new Date().toLocaleTimeString("pt-BR") : "12:00:00",
      retornoAlmoco: tipo === "retornoAlmoco" ? new Date().toLocaleTimeString("pt-BR") : "13:00:00",
      saida: tipo === "saida" ? new Date().toLocaleTimeString("pt-BR") : "18:00:00",
      horasTrabalhadas: "08h 00m",
      status: "Normal"
    };
    const updated = [newP, ...pontos];
    setPontos(updated);
    saveLocalData("clocks", updated);
    pushAuditLog(`Bater ponto biométrico registrado para: ${worker.nome}`);
    alert("Pronto! Batida de ponto registrada no ERP.");
  };

  const handleUpdateFuncioarioStatus = (funcId: string, novoStatus: "Ativo" | "Férias" | "Inativo") => {
    const updated = funcionarios.map((f) => {
      if (f.id === funcId) {
        pushAuditLog(`Alteração de status de colaborador para ${novoStatus}: ${f.nome}`);
        return { ...f, status: novoStatus };
      }
      return f;
    });
    setFuncionarios(updated);
    saveLocalData("employees", updated);
  };

  const handleAddAvaliacao = (funcId: string, nota: number, feedback: string) => {
    const updated = funcionarios.map((f) => {
      if (f.id === funcId) {
        return {
          ...f,
          avaliacoes: [...(f.avaliacoes || []), { data: new Date().toISOString().split("T")[0], nota, feedback }]
        };
      }
      return f;
    });
    setFuncionarios(updated);
    saveLocalData("employees", updated);
    pushAuditLog(`Avaliação de desempenho anotada no histórico de colaborador`);
  };

  // 10. Client: supply EPI
  const handleEntregarEpi = (funcId: string, epiNome: string) => {
    const updated = funcionarios.map((f) => {
      if (f.id === funcId) {
        const updatedEpis = f.epiEntregues.includes(epiNome) ? f.epiEntregues : [...f.epiEntregues, epiNome];
        pushAuditLog(`EPI ${epiNome} registrado no CNPJ do colaborador ${f.nome}`);
        return { ...f, epiEntregues: updatedEpis };
      }
      return f;
    });
    setFuncionarios(updated);
    saveLocalData("employees", updated);
    alert(`EPI ${epiNome} vinculado!`);
  };

  // 11. Client: transactions & invoices ledger
  const handleAddTransacao = (nova: Omit<MovimentacaoFinanceira, "id" | "empresaId">) => {
    const finalNew: MovimentacaoFinanceira = {
      ...nova,
      id: `tr_${Date.now()}`,
      empresaId: loggedInUser?.empresaId || ""
    };
    const updated = [finalNew, ...transacoes];
    setTransacoes(updated);
    saveLocalData("transactions", updated);
    pushAuditLog(`Lançamento financeiro registrado: ${nova.descricao}`);
  };

  const handleLiquidarTransacao = (transId: string) => {
    const updated = transacoes.map((t) => {
      if (t.id === transId) {
        pushAuditLog(`Compensação bancária liquidou lançamento: ${t.descricao}`);
        return { ...t, status: "Pago" as any };
      }
      return t;
    });
    setTransacoes(updated);
    saveLocalData("transactions", updated);
  };

  const handleEmitirNota = (nova: Omit<NotaFiscal, "id" | "empresaId" | "status" | "xmlSimulado" | "dataEmissao">) => {
    const newN: NotaFiscal = {
      ...nova,
      id: `nf_${Date.now()}`,
      empresaId: loggedInUser?.empresaId || "",
      status: "Emitida",
      dataEmissao: new Date().toISOString().split("T")[0],
      xmlSimulado: `<NFe xmlns="http://www.portalfiscal.inf.br/nfe"><infNFe Id="NFe352605" versao="4.00"><emit><xNome>${activeCompany?.nome}</xNome></emit><dest><xNome>${nova.clienteNome}</xNome></dest><total><vNF>${nova.valorTotal.toFixed(2)}</vNF></total></infNFe></NFe>`
    };
    // Save note
    const updated = [newN, ...notas];
    setNotas(updated);
    saveLocalData("invoices", updated);

    // Automatically trigger receipt in finance matrix
    handleAddTransacao({
      descricao: `NFe #${nova.numero} faturada para ${nova.clienteNome}`,
      tipo: "Receita",
      valor: nova.valorTotal,
      centroCusto: "Industrial Vendas",
      data: new Date().toISOString().split("T")[0],
      categoria: "Faturamento Comercial",
      status: "Pendente"
    });
    pushAuditLog(`SEFAZ autorizou lote de faturamento: NFe #${nova.numero}`);
  };

  // 12. Client: industrial OPs
  const handleAddOrdemProducao = (nova: Omit<OrdemProducao, "id" | "empresaId">) => {
    const finalNew: OrdemProducao = {
      ...nova,
      id: `op_${Date.now()}`,
      empresaId: loggedInUser?.empresaId || ""
    };
    const updated = [...ordensProducao, finalNew];
    setOrdensProducao(updated);
    saveLocalData("production_ops", updated);
    pushAuditLog(`PCP inseriu nova ordem de serviço: ${nova.codigo}`);
  };

  const handleUpdateOrdemStatus = (opId: string, novoStatus: any) => {
    const updated = ordensProducao.map((op) => {
      if (op.id === opId) {
        const updatedQtd = novoStatus === "Concluida" ? op.quantidadePlanejada : op.quantidadeProduzida;
        pushAuditLog(`Ordem de serviço PCP ${op.codigo} atualizada para ${novoStatus}`);
        return { ...op, status: novoStatus, quantidadeProduzida: updatedQtd };
      }
      return op;
    });
    setOrdensProducao(updated);
    saveLocalData("production_ops", updated);
  };

  const handleUpdateMaquinaStatus = (maqId: string, novoStatus: any) => {
    const updated = maquasMap(maquinas, maqId, novoStatus);
    setMaquinas(updated);
    saveLocalData("machines", updated);
    pushAuditLog(`Célula de usinagem alterou sensor de barreira para: ${novoStatus}`);
  };

  const maquasMap = (arr: Maquina[], rawId: string, value: string): Maquina[] => {
    return arr.map((m) => (m.id === rawId ? { ...m, status: value as any } : m));
  };

  // 13. Client: CRM leads
  const handleAddLead = (novo: Omit<LeadCRM, "id" | "empresaId" | "dataAtualizacao" | "notas">) => {
    const finalNew: LeadCRM = {
      ...novo,
      id: `lead_${Date.now()}`,
      empresaId: loggedInUser?.empresaId || "",
      dataAtualizacao: new Date().toISOString().split("T")[0],
      notas: ["Iniciado no CRM Nexus."]
    };
    const updated = [...leads, finalNew];
    setLeads(updated);
    saveLocalData("crm_leads", updated);
    pushAuditLog(`Opção comercial de novo lead captada: ${novo.clienteNome}`);
  };

  const handleUpdateLeadEstagio = (leadId: string, novoEstagio: any) => {
    const updated = leads.map((l) => {
      if (l.id === leadId) {
        pushAuditLog(`Lead ${l.clienteNome} avançou no pipeline CRM para: ${novoEstagio}`);
        return { ...l, estagio: novoEstagio, dataAtualizacao: new Date().toISOString().split("T")[0] };
      }
      return l;
    });
    setLeads(updated);
    saveLocalData("crm_leads", updated);
  };

  const handleAddLeadNota = (leadId: string, nota: string) => {
    const updated = leads.map((l) => {
      if (l.id === leadId) {
        return { ...l, notas: [...(l.notas || []), nota] };
      }
      return l;
    });
    setLeads(updated);
    saveLocalData("crm_leads", updated);
  };

  // 14. Client: Internal Chat messenger
  const handleAddMensagem = (msgStr: string, destinoPara: string, tipo: "texto" | "audio" = "texto") => {
    const newMsg: MensagemChat = {
      id: `msg_${Date.now()}`,
      empresaId: loggedInUser?.empresaId || "",
      deUsuario: loggedInUser?.username || "sistema",
      paraUsuario: destinoPara,
      mensagem: msgStr,
      data: new Date().toISOString(),
      lida: false,
      tipo
    };
    const updated = [...mensagens, newMsg];
    setMensagens(updated);
    saveLocalData("chat_msgs", updated);
  };

  // 15. Client: Open ticket to Super Admin
  const handleAddTicket = (assunto: string, categoria: string, prioridade: "Baixa" | "Media" | "Alta") => {
    const newT: TicketSuporte = {
      id: `tkt_${Date.now()}`,
      empresaId: loggedInUser?.empresaId || "",
      empresaNome: activeCompany?.nome || "Empresa Contratante",
      assunto,
      categoria,
      prioridade,
      status: "Aberto",
      slaHoras: prioridade === "Alta" ? 4 : prioridade === "Media" ? 12 : 24,
      dataCriacao: new Date().toISOString(),
      mensagens: [
        { deAdmin: false, mensagem: `Ticket de SLA habilitado: ${assunto}`, data: new Date().toISOString() }
      ]
    };
    const updated = [...tickets, newT];
    setTickets(updated);
    saveLocalData("tickets", updated);
    pushAuditLog(`Ticket de atendimento SLA emitido para equipe global SaaS`);
  };

  const handleAdicionarMensagemCliente = (ticketId: string, mensagem: string) => {
    const updated = tickets.map((t) => {
      if (t.id === ticketId) {
        return {
          ...t,
          status: "Em Atendimento" as any,
          mensagens: [
            ...t.mensagens,
            { deAdmin: false, mensagem, data: new Date().toISOString() }
          ]
        };
      }
      return t;
    });
    setTickets(updated);
    saveLocalData("tickets", updated);
  };

  // --- SaaS Double-Approval Operations Handlers ---
  const handleAprovarSolicitacao = (id: string) => {
    const updatedReqs = solicitacoes.map((s) => {
      if (s.id === id) {
        // Unlock module
        const nextLib = { ...liberacoesModulos };
        if (!nextLib[s.empresaId]) nextLib[s.empresaId] = {};
        nextLib[s.empresaId][s.departamentoSolicitado] = true;
        setLiberacoesModulos(nextLib);
        saveLocalData("liberacoes_modulos", nextLib);

        pushAuditLog(`Módulo [${s.departamentoSolicitado}] desbloqueado / liberado via dupla autorização SaaS`, s.empresaId);

        return { ...s, status: "Aprovado" as const };
      }
      return s;
    });
    setSolicitacoes(updatedReqs);
    saveLocalData("solicitacoes_acesso", updatedReqs);
  };

  const handleRejeitarSolicitacao = (id: string) => {
    const updatedReqs = solicitacoes.map((s) => {
      if (s.id === id) {
        pushAuditLog(`Bloqueio mantido: Solicitação de liberação do módulo ${s.departamentoSolicitado} foi recusada`, s.empresaId);
        return { ...s, status: "Reprovado" as const };
      }
      return s;
    });
    setSolicitacoes(updatedReqs);
    saveLocalData("solicitacoes_acesso", updatedReqs);
  };

  const handleSolicitarLiberacaoModulo = (deptSolicitado: string, motivo: string) => {
    if (!loggedInUser || !activeCompany) return;
    const newReq: SolicitacaoAcesso = {
      id: `req_${Date.now()}`,
      empresaId: activeCompany.id,
      empresaNome: activeCompany.nome,
      usuarioNome: loggedInUser.nome,
      departamentoSolicitado: deptSolicitado,
      solicitanteNome: loggedInUser.nome,
      motivo,
      nivelRequerido: loggedInUser.nivel,
      status: "Pendente",
      data: new Date().toISOString()
    };
    const updated = [newReq, ...solicitacoes];
    setSolicitacoes(updated);
    saveLocalData("solicitacoes_acesso", updated);
    pushAuditLog(`Dono solicitou liberação do módulo [${deptSolicitado}] pendente de dupla autorização`, activeCompany.id);
  };

  // --- AUTH ROUTER CONTROL ---
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");

    if (loginUsername === "admin" && loginPassword === "admin123") {
      const superUsr = usuarios.find((u) => u.username === "admin") || {
        id: "usr_super",
        empresaId: null,
        username: "admin",
        nome: "Super Admin",
        nivel: "SuperAdmin"
      };
      setLoggedInUser(superUsr as any);
      localStorage.setItem("active_session", JSON.stringify(superUsr));
      return;
    }

    const matched = usuarios.find((u) => u.username === loginUsername && loginPassword === "admin123");
    if (matched) {
      // Check if tenant is blocked
      const comp = empresas.find(e => e.id === matched.empresaId);
      if (comp && comp.status === "Bloqueado") {
        setAuthError("🔒 Tenant empresarial suspenso ou bloqueado pelo Super Admin por motivos de inadimplência faturas.");
        return;
      }
      setLoggedInUser(matched);
      localStorage.setItem("active_session", JSON.stringify(matched));
      pushAuditLog(`Sessão aberta via IP 189.102.30.221`, matched.empresaId);
    } else {
      setAuthError("Credenciais inválidas. Para testar use 'antonio.alfa' (ou outros listados) com a senha 'admin123'.");
    }
  };

  const handleLogout = () => {
    pushAuditLog(`Sessão encerrada de forma segura pelo usuário`);
    setLoggedInUser(null);
    localStorage.removeItem("active_session");
  };

  // Switch tabs list based on SaaS module plan
  const allowedTabs = activePlan ? activePlan.modules : [];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-indigo-100 antialiased relative">
      {/* Visual background gradient accent */}
      <div className="absolute top-0 inset-x-0 h-48 bg-linear-to-b from-indigo-50/50 to-transparent pointer-events-none" />

      {/* LOGIN VIEW PANEL */}
      {!loggedInUser ? (
        <div className="min-h-screen flex items-center justify-center p-4 relative z-10 animate-fade-in font-sans">
          <div className="max-w-md w-full bg-white border border-slate-150 rounded-3xl overflow-hidden shadow-xl p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md">
                <Sliders size={24} />
              </div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900 font-sans">Nexus ERP Multitenante</h1>
              <p className="text-xs text-slate-400">Ambiente integrado comercial, contábil e industrial SaaS.</p>
            </div>

            {authError && (
              <div className="p-3 bg-rose-50 border border-rose-100 text-rose-800 text-xs rounded-xl flex items-start gap-2 animate-pulse-slow">
                <AlertTriangle size={16} className="shrink-0 text-rose-600 mt-0.5" />
                <p className="leading-normal">{authError}</p>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs font-semibold">
              <div className="space-y-1">
                <label className="text-slate-500 font-bold">Identificação Usuário / Log (*)</label>
                <input
                  type="text"
                  required
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  placeholder="Ex: admin ou antonio.alfa..."
                  className="w-full p-3 border border-slate-200 bg-slate-50 focus:bg-white rounded-xl text-sm focus:outline-hidden text-slate-800"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center text-slate-400">
                  <label className="text-slate-500 font-bold">Senha de Controle (*)</label>
                  <span>MFA Ativado</span>
                </div>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Senha mestre padrão: admin123"
                  className="w-full p-3 border border-slate-200 bg-slate-50 focus:bg-white rounded-xl text-sm focus:outline-hidden text-slate-800"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 font-sans text-white font-bold rounded-xl text-sm shadow-md cursor-pointer transition relative"
              >
                Autenticar Tenant Nexus
              </button>
            </form>

            <div className="border-t pt-5 space-y-3">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block text-center">Contas de Demonstração de Teste:</span>
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <button
                  onClick={() => {
                    setLoginUsername("admin");
                    setLoginPassword("admin123");
                  }}
                  className="p-2.5 border rounded-xl hover:bg-slate-50 text-left cursor-pointer transition"
                >
                  <p className="font-extrabold text-slate-900">⚡ SUPER ADMIN</p>
                  <p className="text-slate-400 font-mono">admin / admin123</p>
                </button>
                <button
                  onClick={() => {
                    setLoginUsername("antonio.alfa");
                    setLoginPassword("admin123");
                  }}
                  className="p-2.5 border rounded-xl hover:bg-slate-50 text-left cursor-pointer transition"
                >
                  <p className="font-extrabold text-slate-950">⚙️ Metalúrgica Alfa (Ativa)</p>
                  <p className="text-slate-450 font-mono">antonio.alfa / admin123</p>
                </button>
                <button
                  onClick={() => {
                    setLoginUsername("carlos.global");
                    setLoginPassword("admin123");
                  }}
                  className="p-2.5 border rounded-xl hover:bg-slate-50 text-left cursor-pointer transition"
                >
                  <p className="font-extrabold text-slate-900">🍏 Global Alimentos (Ativa)</p>
                  <p className="text-slate-400 font-mono">carlos.global / admin123</p>
                </button>
                <button
                  onClick={() => {
                    setLoginUsername("bruno.fin");
                    setLoginPassword("admin123");
                  }}
                  className="p-2.5 border rounded-xl hover:bg-slate-50 text-left cursor-pointer transition"
                >
                  <p className="font-extrabold text-slate-900">💰 Cel. Financeira Alfa</p>
                  <p className="text-slate-400 font-mono">bruno.fin / admin123</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // DASHBOARD WORKSPACE VIEW
        <div className="relative z-10 font-sans">
          
          {/* SUPER ADMIN MASTER BAR - LIVE SIMULATOR CONTROLS */}
          {loggedInUser.nivel === "SuperAdmin" && (
            <div id="super-admin-bypass-bar" className="bg-slate-950 p-4 border-b border-indigo-500/20 flex flex-col md:flex-row items-center justify-between gap-4 select-none relative z-50">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-ping shrink-0" />
                <div className="text-xs">
                  <p className="font-extrabold text-white text-[11px] uppercase tracking-wider flex items-center gap-1">
                    👑 MODO MASTER BYPASS ATIVO: {simulandoEmpresaId ? `Simulando em tempo real` : "Aguardando simulação"}
                  </p>
                  <p className="text-slate-400 text-[10px]">Livre interatividade sobre todos os tenants, módulos e permissões ignoradas.</p>
                </div>
              </div>

              {simulandoEmpresaId ? (
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
                  <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs font-bold font-mono">
                    <button
                      onClick={() => setActiveModeView("SA_CONSOLE")}
                      className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                        activeModeView === "SA_CONSOLE" ? "bg-indigo-600 text-white shadow-md font-bold" : "text-slate-400 hover:text-white"
                      }`}
                    >
                      Console Master
                    </button>
                    <button
                      onClick={() => {
                        setActiveModeView("SA_CONSOLE"); // Reset first to avoid state glitches
                        setTimeout(() => {
                          setActiveModeView("CLIENT_SIMULATION");
                          setActiveClientTab("Administrativo");
                        }, 50);
                      }}
                      className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                        activeModeView === "CLIENT_SIMULATION" ? "bg-indigo-600 text-white shadow-md font-bold" : "text-slate-400 hover:text-white"
                      }`}
                    >
                      Simular ERP Cliente
                    </button>
                  </div>

                  {activeModeView === "CLIENT_SIMULATION" && (
                    <div className="bg-slate-900 border border-slate-800 p-1.5 px-3 rounded-xl text-xs flex items-center gap-2 font-sans">
                      <span className="text-indigo-400 font-extrabold text-[10px] uppercase">Testar Nível de Acesso (RBAC):</span>
                      <select
                        value={simulatedTestLevel}
                        onChange={(e) => setSimulatedTestLevel(e.target.value)}
                        className="bg-transparent font-black text-rose-300 focus:outline-hidden cursor-pointer"
                      >
                        <option value="Bypass" className="bg-slate-950 text-white">Super Admin Bypass (Ativo)</option>
                        <option value="DonoEmpresa" className="bg-slate-950 text-white">DONO EMPRESA (Antônio)</option>
                        <option value="Gerente" className="bg-slate-950 text-white">GERENTE (Márcia - RH)</option>
                        <option value="Analista" className="bg-slate-950 text-white">ANALISTA (Bruno - Financeiro)</option>
                        <option value="Operador" className="bg-slate-950 text-white">OPERADOR (José - Produção)</option>
                      </select>
                    </div>
                  )}

                  <button
                    onClick={() => {
                      setSimulandoEmpresaId(null);
                      setSimulatedTestLevel("Bypass");
                      setActiveModeView("SA_CONSOLE");
                    }}
                    className="p-1.5 px-3.5 bg-rose-600/15 text-rose-400 border border-rose-500/20 rounded-xl hover:bg-rose-600 hover:text-white transition cursor-pointer text-[10px] font-black uppercase tracking-wider"
                  >
                    Sair da Simulação
                  </button>
                </div>
              ) : (
                <span className="text-slate-500 font-mono text-[10px] bg-slate-900 border border-slate-850 p-1.5 rounded-xl">Selecione uma empresa na tabela abaixo para iniciar simulação de tenant</span>
              )}
            </div>
          )}

          {/* Active Workspaces User Resolution & Security Matrix mapping */}
          {(() => {
            // Determine active virtual identity
            const getActiveVirtualUser = () => {
              if (!loggedInUser) return null;
              if (loggedInUser.nivel !== "SuperAdmin") return loggedInUser;
              if (simulatedTestLevel === "Bypass") return loggedInUser;
              
              if (simulatedTestLevel === "DonoEmpresa") {
                return {
                  id: "usr_sim_dono",
                  empresaId: simulandoEmpresaId,
                  username: "antonio.alfa",
                  nome: "Antônio Ferreira (Dono Simulador)",
                  nivel: NivelHierarquico.DONO_EMPRESA,
                  departamento: "Diretoria",
                  status: "Ativo"
                };
              } else if (simulatedTestLevel === "Gerente") {
                return {
                  id: "usr_sim_gerente",
                  empresaId: simulandoEmpresaId,
                  username: "marcia.rh",
                  nome: "Márcia Souza (Gerente Simulador)",
                  nivel: NivelHierarquico.GERENTE,
                  departamento: "Recursos Humanos",
                  status: "Ativo"
                };
              } else if (simulatedTestLevel === "Analista") {
                return {
                  id: "usr_sim_analista",
                  empresaId: simulandoEmpresaId,
                  username: "bruno.fin",
                  nome: "Bruno Silva (Analista Simulador)",
                  nivel: NivelHierarquico.ANALISTA,
                  departamento: "Financeiro",
                  status: "Ativo"
                };
              } else {
                return {
                  id: "usr_sim_operador",
                  empresaId: simulandoEmpresaId,
                  username: "jose.operador",
                  nome: "José Almeida (Operador Simulador)",
                  nivel: NivelHierarquico.OPERADOR,
                  departamento: "Produção",
                  status: "Ativo"
                };
              }
            };

            const virtualUser = getActiveVirtualUser();
            if (!virtualUser) return null;

            // Strict Role Access Validation Matrix helper
            const getTabAccessStatus = (tabName: string) => {
              if (virtualUser.nivel === "SuperAdmin") {
                return { allowed: true };
              }

              // Owners and directors bypass sector locking
              if (
                virtualUser.nivel === NivelHierarquico.DONO_EMPRESA ||
                virtualUser.nivel === NivelHierarquico.DIRETOR
              ) {
                return { allowed: true };
              }

              const dept = (virtualUser.departamento || "").toLowerCase();

              if (tabName === "RH") {
                if (dept !== "recursos humanos" && dept !== "rh") {
                  return { allowed: false, restrictedBy: "setor", reason: "Política de Isolamento de Setor Ativa. Este módulo é reservado em caráter privado ao departamento de Recursos Humanos (DP)." };
                }
                const approved = liberacoesModulos[activeCompany?.id || ""]?.["RH"];
                if (!approved) {
                  return {
                    allowed: false,
                    restrictedBy: "double-approval",
                    reason: "Módulo Temporariamente Bloqueado por Regra SaaS Multitenant. Por segurança, os módulos de RH operam bloqueados para funcionários até passarem pela dupla liberação: O Dono da Empresa deve solicitar na plataforma e o Super Admin aprovar o desbloqueio."
                  };
                }
              }

              if (tabName === "Financeiro") {
                if (dept !== "financeiro") {
                  return { allowed: false, restrictedBy: "setor", reason: "Política de Isolamento de Setor Ativa. Este módulo é reservado de forma restrita ao departamento Financeiro." };
                }
                const approved = liberacoesModulos[activeCompany?.id || ""]?.["Financeiro"];
                if (!approved) {
                  return {
                    allowed: false,
                    restrictedBy: "double-approval",
                    reason: "Módulo Temporariamente Bloqueado por Regra SaaS Multitenant. Por segurança, os módulos de Financeiro operam bloqueados para funcionários até passarem pela dupla liberação: O Dono da Empresa deve solicitar na plataforma e o Super Admin aprovar o desbloqueio."
                  };
                }
              }

              if (tabName === "Administrativo") {
                if (dept !== "diretoria" && dept !== "gerência" && dept !== "gerencia") {
                  return { allowed: false, restrictedBy: "setor", reason: "Módulo Administrativo é de uso exclusivo da Diretoria Geral da empresa contratante." };
                }
                const approved = liberacoesModulos[activeCompany?.id || ""]?.["Administrativo"];
                if (!approved) {
                  return {
                    allowed: false,
                    restrictedBy: "double-approval",
                    reason: "Módulo Temporariamente Bloqueado por Regra SaaS Multitenant. Por segurança, os módulos Administrativos operam bloqueados para funcionários secundários até passarem pela dupla liberação: O Dono da Empresa deve solicitar na plataforma e o Super Admin aprovar o desbloqueio."
                  };
                }
              }

              if (tabName === "Faturamento") {
                if (dept !== "financeiro" && dept !== "diretoria") {
                  return { allowed: false, restrictedBy: "setor", reason: "Módulo Fiscal e Faturamento reservado exclusivamente ao departamento Financeiro / Diretores." };
                }
              }

              if (tabName === "Industrial") {
                if (dept !== "produção" && dept !== "producao" && dept !== "diretoria") {
                  return { allowed: false, restrictedBy: "setor", reason: "Módulo PCP e Industrial reservado exclusivamente aos gestores e operários de Produção." };
                }
              }

              if (tabName === "Comercial") {
                if (dept !== "vendas" && dept !== "comercial" && dept !== "diretoria") {
                  return { allowed: false, restrictedBy: "setor", reason: "Módulo de CRM e Leads reservado aos assessores e supervisores de Comercial / Vendas." };
                }
              }

              if (tabName === "Seguranca") {
                if (dept !== "diretoria" && dept !== "tecnologia") {
                  return { allowed: false, restrictedBy: "setor", reason: "Acesso reservado ao Diretor e Tecnologia para controle de logs de Auditoria e LGPD." };
                }
              }

              return { allowed: true };
            };

            const renderAccessDeniedPanel = (tab: string, restType: string, rReason: string) => {
              const isOwnerActive = virtualUser.nivel === NivelHierarquico.DONO_EMPRESA || virtualUser.nivel === NivelHierarquico.DIRETOR;
              const hasPendingReq = solicitacoes.find(
                (s) => s.empresaId === activeCompany?.id && s.departamentoSolicitado === tab && s.status === "Pendente"
              );

              return (
                <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl text-left space-y-6 shadow-2xl relative overflow-hidden animate-fade-in text-white">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/5 blur-3xl rounded-full" />
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/5 blur-2xl rounded-full" />

                  <div className="flex items-center gap-4 border-b border-slate-800 pb-5">
                    <div className="p-3.5 bg-rose-500/10 text-rose-400 border border-rose-500/25 rounded-2xl shadow-[0_0_15px_rgba(244,63,94,0.15)]">
                      <FolderLock size={28} />
                    </div>
                    <div>
                      <span className="text-[10px] bg-rose-500/15 text-rose-400 p-1 px-2.5 rounded-full font-black tracking-widest uppercase border border-rose-500/20">
                        {restType === "double-approval" ? "SaaS Double-Approval Requerido" : "Acesso Restrito ao Setor"}
                      </span>
                      <h4 className="text-lg font-black mt-1 font-sans">Módulo {tab} Protegido</h4>
                      <p className="text-[10px] text-zinc-500 font-mono">Dispositivo de Isolamento de Perfil Conforme LGPD</p>
                    </div>
                  </div>

                  <div className="space-y-4 text-xs">
                    <p className="text-slate-350 leading-relaxed text-sm">
                      {rReason}
                    </p>

                    <div className="p-4 bg-slate-950 border border-slate-850 rounded-2xl space-y-2 font-mono">
                      <p className="font-extrabold text-slate-300 font-sans">ℹ️ Identidade de Operação Ativa:</p>
                      <ul className="space-y-1 text-slate-400 text-[11px]">
                        <li>• Operador: <span className="text-white font-sans font-bold">{virtualUser.nome}</span></li>
                        <li>• Departamento: <span className="text-white font-bold">{virtualUser.departamento || "Sem setor específico"}</span></li>
                        <li>• Nível Hierárquico: <span className="text-indigo-400 font-bold uppercase">{virtualUser.nivel}</span></li>
                      </ul>
                    </div>

                    {restType === "double-approval" && (
                      <div className="border border-slate-850 p-4 rounded-2xl bg-slate-950/40 space-y-3 font-sans">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block font-mono">Roteiro de Consentimento Multitenant</span>
                        <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-bold">
                          <div className="p-2 border border-emerald-500/25 bg-emerald-500/5 text-emerald-400 rounded-xl">
                            <p>1. Dono Autoriza</p>
                            <p className="text-[8px] font-mono mt-0.5">OK</p>
                          </div>
                          <div className={`p-2 border rounded-xl ${hasPendingReq ? "border-amber-500/25 bg-amber-500/5 text-amber-400 animate-pulse" : "border-slate-800 bg-slate-900 text-slate-500"}`}>
                            <p>2. Fila SaaS</p>
                            <p className="text-[8px] font-mono mt-0.5">{hasPendingReq ? "AUDITORIA MASTER" : "NÃO INICIADO"}</p>
                          </div>
                          <div className="p-2 border border-slate-800 bg-slate-900 text-slate-500 rounded-xl">
                            <p>3. Super Admin</p>
                            <p className="text-[8px] font-mono mt-0.5">LIBERADO</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {restType === "double-approval" && isOwnerActive && (
                      <div className="bg-indigo-950/10 border border-indigo-500/20 p-4 rounded-xl space-y-3 font-sans">
                        <div>
                          <p className="font-extrabold text-indigo-300 text-xs">Petição de Desbloqueio de Módulo para Funcionários:</p>
                          <p className="text-slate-400 text-[11px] leading-relaxed mt-0.5">Como Diretor Contratante você tem competência para submeter um pedido de termo de responsabilidade para habilitar este módulo para funcionários.</p>
                        </div>

                        {hasPendingReq ? (
                          <div className="p-2.5 bg-amber-500/10 border border-amber-500/25 text-amber-400 rounded-xl text-[11px] font-bold text-center">
                            ⏳ Já existe uma solicitação pendente encaminhada ao Super Admin. Aguarde a aprovação no painel Master.
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              const mStr = prompt(
                                `Justifique o pedido de liberação do módulo ${tab} para seus colaboradores:`,
                                `Habilitar permissões operacionais para gestores e assistentes atuando em DP/Financeiro.`
                              );
                              if (mStr) {
                                handleSolicitarLiberacaoModulo(tab, mStr);
                              }
                            }}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer"
                          >
                            <Unlock size={14} /> Encaminhar Pedido de Desbloqueio Duplo
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            };

            const isSimulationActive = loggedInUser.nivel === "SuperAdmin" && activeModeView === "CLIENT_SIMULATION";

            return (
              <div id="nexus-workspace-grid">
                
                {/* Header Nav bar */}
                <header className="bg-slate-900 text-white shadow-md">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 bg-linear-to-tr from-indigo-500 to-purple-600 text-white rounded-xl flex items-center justify-center font-black animate-pulse-slow">
                        N
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h1 className="text-base font-black tracking-tight font-sans leading-none">Nexus ERP</h1>
                          {isSimulationActive && (
                            <span className="px-2 py-0.5 rounded-full text-[8px] font-extrabold bg-rose-600 text-white uppercase tracking-widest leading-none">
                              Simulador
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 font-mono">
                          Plano: {isSimulationActive ? `Simulado (${activePlan?.nome || "Professional"})` : loggedInUser.nivel === "SuperAdmin" ? "SaaS Master Proprietário" : activePlan?.nome || "Básico"}
                        </p>
                      </div>
                    </div>

                    {/* Company active tenant name */}
                    {activeCompany && (
                      <div className="hidden md:flex items-center gap-1.5 bg-indigo-950/60 border border-indigo-800/40 p-2 py-1 rounded-full text-xs text-indigo-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                        <strong>Tenant: {activeCompany.nome}</strong>
                      </div>
                    )}

                    <div className="flex items-center gap-4">
                      <div className="text-right hidden sm:block leading-tight text-xs font-sans">
                        <p className="font-extrabold text-white flex items-center gap-1.5 justify-end">
                          {isSimulationActive ? virtualUser.nome : loggedInUser.nome}
                        </p>
                        <p className="text-[10px] text-zinc-400">
                          {isSimulationActive ? `${virtualUser.departamento} | Simulado` : loggedInUser.departamento || "SaaS Operator"}
                        </p>
                      </div>

                      <button
                        onClick={handleLogout}
                        className="p-1 px-3 bg-white/5 border border-white/10 rounded-lg hover:bg-rose-600 hover:text-white transition cursor-pointer text-xs flex items-center gap-1.5 font-bold"
                      >
                        <LogOut size={13} /> Sair
                      </button>
                    </div>
                  </div>
                </header>

                <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in">
                  {loggedInUser.nivel === "SuperAdmin" && activeModeView === "SA_CONSOLE" ? (
                    <SuperAdminDashboard
                      empresas={empresas}
                      planos={planos}
                      tickets={tickets}
                      logs={auditLogs}
                      solicitacoes={solicitacoes}
                      onToggleEmpresaStatus={handleToggleEmpresaStatus}
                      onUpdateEmpresaPlano={handleUpdateEmpresaPlano}
                      onCreateEmpresa={handleCreateEmpresa}
                      onResponderTicket={handleResponderTicket}
                      onAprovarSolicitacao={handleAprovarSolicitacao}
                      onRejeitarSolicitacao={handleRejeitarSolicitacao}
                      onSimulaEmpresa={(id) => {
                        setSimulandoEmpresaId(id);
                        if (id) {
                          setActiveModeView("CLIENT_SIMULATION");
                          setSimulatedTestLevel("Bypass");
                          setActiveClientTab("Dashboard Executivo");
                        } else {
                          setActiveModeView("SA_CONSOLE");
                        }
                      }}
                      simulandoEmpresaId={simulandoEmpresaId}
                    />
                  ) : (
                    // INTEGRATED CLIENT TENANT MODE
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
                      
                      {/* Left Sidebar Menu */}
                      <div className="lg:col-span-1 bg-white border border-slate-150 rounded-3xl p-4 space-y-3 shadow-sm">
                        <div className="pb-2 border-b flex items-center justify-between">
                          <span className="text-[11px] font-extrabold text-slate-800 tracking-wider uppercase block">Navegação Permitida</span>
                          <span className="text-[9px] bg-slate-100 p-0.5 px-2 rounded-full font-mono font-bold">{virtualUser.nivel}</span>
                        </div>
                        
                        <div className="space-y-1 text-xs">
                          {/* Tab: Dashboard Executivo */}
                          <button
                            onClick={() => setActiveClientTab("Dashboard Executivo")}
                            className={`w-full p-2.5 rounded-xl flex items-center justify-between font-extrabold transition cursor-pointer text-left ${
                              activeClientTab === "Dashboard Executivo"
                                ? "bg-slate-900 text-white shadow-md"
                                : "text-indigo-800 bg-indigo-50/40 hover:bg-indigo-50"
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              <span>👑 Dashboard Executivo IA</span>
                              <span className="text-[7px] bg-indigo-600 text-white font-mono px-1 rounded animate-pulse">Enterprise</span>
                            </span>
                            <ChevronRight size={13} className="opacity-40" />
                          </button>

                          {/* Tab: Administrativo */}
                          {(() => {
                            const acc = getTabAccessStatus("Administrativo");
                            return (
                              <button
                                onClick={() => setActiveClientTab("Administrativo")}
                                className={`w-full p-2.5 rounded-xl flex items-center justify-between font-extrabold transition cursor-pointer text-left ${
                                  activeClientTab === "Administrativo"
                                    ? "bg-slate-900 text-white shadow-md"
                                    : "text-slate-650 hover:bg-slate-50"
                                }`}
                              >
                                <span className="flex items-center gap-2">
                                  <span>💼 Administrativo</span>
                                  {!acc.allowed && <span className="text-[8px] bg-rose-50 border border-rose-100 text-rose-600 rounded px-1 flex items-center gap-0.5"><Lock size={8} /> Bloqueado</span>}
                                </span>
                                <ChevronRight size={13} className="opacity-40" />
                              </button>
                            );
                          })()}

                          {/* Tab: RH */}
                          {(() => {
                            const acc = getTabAccessStatus("RH");
                            return (
                              <button
                                onClick={() => setActiveClientTab("RH")}
                                className={`w-full p-2.5 rounded-xl flex items-center justify-between font-extrabold transition cursor-pointer text-left ${
                                  activeClientTab === "RH"
                                    ? "bg-slate-900 text-white shadow-md"
                                    : "text-slate-650 hover:bg-slate-50"
                                }`}
                              >
                                <span className="flex items-center gap-2">
                                  <span>👥 Recursos Humanos</span>
                                  {!acc.allowed && <span className="text-[8px] bg-rose-550/10 text-rose-500 rounded px-1 flex items-center gap-0.5"><Lock size={8} /> Bloqueado</span>}
                                </span>
                                <ChevronRight size={13} className="opacity-40" />
                              </button>
                            );
                          })()}

                          {/* Tab: Financeiro */}
                          {(() => {
                            const acc = getTabAccessStatus("Financeiro");
                            return (
                              <button
                                onClick={() => setActiveClientTab("Financeiro")}
                                className={`w-full p-2.5 rounded-xl flex items-center justify-between font-extrabold transition cursor-pointer text-left ${
                                  activeClientTab === "Financeiro"
                                    ? "bg-slate-900 text-white shadow-md"
                                    : "text-slate-650 hover:bg-slate-50"
                                }`}
                              >
                                <span className="flex items-center gap-2">
                                  <span>💵 Financeiro & Caixa</span>
                                  {!acc.allowed && <span className="text-[8px] bg-rose-550/10 text-rose-500 rounded px-1 flex items-center gap-0.5"><Lock size={8} /> Bloqueado</span>}
                                </span>
                                <ChevronRight size={13} className="opacity-40" />
                              </button>
                            );
                          })()}

                          {/* Tab: Faturamento */}
                          {(() => {
                            const acc = getTabAccessStatus("Faturamento");
                            return (
                              <button
                                onClick={() => setActiveClientTab("Faturamento")}
                                className={`w-full p-2.5 rounded-xl flex items-center justify-between font-extrabold transition cursor-pointer text-left ${
                                  activeClientTab === "Faturamento"
                                    ? "bg-slate-900 text-white shadow-md"
                                    : "text-slate-650 hover:bg-slate-50"
                                }`}
                              >
                                <span className="flex items-center gap-2">
                                  <span>🧾 Faturamento Fiscal</span>
                                  {!acc.allowed && <span className="text-[8px] bg-rose-550/10 text-rose-500 rounded px-1 flex items-center gap-0.5"><Lock size={8} /> Bloqueado</span>}
                                </span>
                                <ChevronRight size={13} className="opacity-40" />
                              </button>
                            );
                          })()}

                          {/* Tab: Industrial */}
                          {allowedTabs.includes("Industrial") && (() => {
                            const acc = getTabAccessStatus("Industrial");
                            return (
                              <button
                                onClick={() => setActiveClientTab("Industrial")}
                                className={`w-full p-2.5 rounded-xl flex items-center justify-between font-extrabold transition cursor-pointer text-left ${
                                  activeClientTab === "Industrial"
                                    ? "bg-slate-900 text-white shadow-md"
                                    : "text-slate-650 hover:bg-slate-50"
                                }`}
                              >
                                <span className="flex items-center gap-2">
                                  <span>🏭 PCP & Industrial</span>
                                  {!acc.allowed && <span className="text-[8px] bg-rose-50 border border-rose-100 text-rose-600 rounded px-1 flex items-center gap-0.5"><Lock size={8} /> Bloqueado</span>}
                                </span>
                                <ChevronRight size={13} className="opacity-40" />
                              </button>
                            );
                          })()}

                          {/* Tab: Comercial */}
                          {allowedTabs.includes("Comercial") && (() => {
                            const acc = getTabAccessStatus("Comercial");
                            return (
                              <button
                                onClick={() => setActiveClientTab("Comercial")}
                                className={`w-full p-2.5 rounded-xl flex items-center justify-between font-extrabold transition cursor-pointer text-left ${
                                  activeClientTab === "Comercial"
                                    ? "bg-slate-900 text-white shadow-md"
                                    : "text-slate-650 hover:bg-slate-50"
                                }`}
                              >
                                <span className="flex items-center gap-2">
                                  <span>📈 Comercial CRM</span>
                                  {!acc.allowed && <span className="text-[8px] bg-rose-50 border border-rose-100 text-rose-600 rounded px-1 flex items-center gap-0.5"><Lock size={8} /> Bloqueado</span>}
                                </span>
                                <ChevronRight size={13} className="opacity-40" />
                              </button>
                            );
                          })()}

                          {/* Tab: Chat Interno */}
                          {allowedTabs.includes("Chat Interno") && (() => {
                            return (
                              <button
                                onClick={() => setActiveClientTab("Chat")}
                                className={`w-full p-2.5 rounded-xl flex items-center justify-between font-extrabold transition cursor-pointer text-left ${
                                  activeClientTab === "Chat"
                                    ? "bg-slate-900 text-white shadow-md"
                                    : "text-slate-650 hover:bg-slate-50"
                                }`}
                              >
                                <span>💬 Chat Interno</span>
                                <ChevronRight size={13} className="opacity-40" />
                              </button>
                            );
                          })()}

                          {/* Tab: Seguranca */}
                          {(() => {
                            const acc = getTabAccessStatus("Seguranca");
                            return (
                              <button
                                onClick={() => setActiveClientTab("Seguranca")}
                                className={`w-full p-2.5 rounded-xl flex items-center justify-between font-extrabold transition cursor-pointer text-left ${
                                  activeClientTab === "Seguranca"
                                    ? "bg-slate-900 text-white shadow-md"
                                    : "text-slate-650 hover:bg-slate-50"
                                }`}
                              >
                                <span className="flex items-center gap-2">
                                  <span>🛡️ Segurança & Auditoria</span>
                                  {!acc.allowed && <span className="text-[8px] bg-rose-50 border border-rose-100 text-rose-600 rounded px-1 flex items-center gap-0.5"><Lock size={8} /> Bloqueado</span>}
                                </span>
                                <ChevronRight size={13} className="opacity-40" />
                              </button>
                            );
                          })()}

                          {/* Tab: AI Copilot */}
                          {activePlan?.iaLiberada && (
                            <button
                              onClick={() => setActiveClientTab("IA")}
                              className={`w-full p-2.5 rounded-xl flex items-center justify-between font-extrabold transition cursor-pointer text-left ${
                                activeClientTab === "IA"
                                  ? "bg-slate-900 text-white shadow-md"
                                  : "text-indigo-850 hover:bg-indigo-50/40"
                              }`}
                            >
                              <span className="flex items-center gap-1">✨ Nexus AI Copilot</span>
                              <ChevronRight size={13} className="opacity-40" />
                            </button>
                          )}

                          {/* Tab: Suporte */}
                          <button
                            onClick={() => setActiveClientTab("Suporte")}
                            className={`w-full p-2.5 rounded-xl flex items-center justify-between font-extrabold transition cursor-pointer text-left ${
                              activeClientTab === "Suporte" ? "bg-slate-900 text-white shadow-md" : "text-slate-650 hover:bg-slate-50"
                            }`}
                          >
                            <span>🛠️ Suporte Técnico</span>
                            <ChevronRight size={13} className="opacity-40" />
                          </button>
                        </div>
                      </div>

                      {/* Sub-Components Content Area */}
                      <div className="lg:col-span-3">
                        {activeClientTab === "Dashboard Executivo" && (
                          <DashboardExecutivoIA
                            onAddAuditLog={(msg) => pushAuditLog(msg)}
                            empresaId={activeCompany?.id || ""}
                            activeCompany={activeCompany}
                            virtualUser={virtualUser}
                          />
                        )}

                        {activeClientTab === "Administrativo" && (() => {
                          const acc = getTabAccessStatus("Administrativo");
                          return acc.allowed ? (
                            <AdministrativoSection
                              empresaId={activeCompany?.id || ""}
                              filiais={filiais}
                              clientes={clientes}
                              fornecedores={fornecedores}
                              documentos={documentos}
                              tarefas={tarefas}
                              onAddFilial={handleAddFilial}
                              onAddCliente={handleAddCliente}
                              onAddFornecedor={handleAddFornecedor}
                              onAddTarefa={handleAddTarefa}
                              onUpdateTarefaStatus={handleUpdateTarefaStatus}
                              onAddDocumento={handleAddDocumento}
                              onAssinarDocumento={handleAssinarDocumento}
                            />
                          ) : (
                            renderAccessDeniedPanel("Administrativo", acc.restrictedBy || "setor", acc.reason || "")
                          );
                        })()}

                        {activeClientTab === "RH" && (() => {
                          const acc = getTabAccessStatus("RH");
                          return acc.allowed ? (
                            <RHSection
                              empresaId={activeCompany?.id || ""}
                              funcionarios={funcionarios}
                              ponto={pontos}
                              holerites={holerites}
                              onAddFuncionario={handleAddFuncionario}
                              onUpdateFuncioarioStatus={handleUpdateFuncioarioStatus}
                              onRegistrarPonto={handleRegistrarPonto}
                              onAddAvaliacao={handleAddAvaliacao}
                              onAddEpi={handleEntregarEpi}
                            />
                          ) : (
                            renderAccessDeniedPanel("RH", acc.restrictedBy || "setor", acc.reason || "")
                          );
                        })()}

                        {activeClientTab === "Financeiro" && (() => {
                          const acc = getTabAccessStatus("Financeiro");
                          return acc.allowed ? (
                            <FinanceiroSection
                              empresaId={activeCompany?.id || ""}
                              transacoes={transacoes}
                              onAddTransacao={handleAddTransacao}
                              onLiquidarTransacao={handleLiquidarTransacao}
                            />
                          ) : (
                            renderAccessDeniedPanel("Financeiro", acc.restrictedBy || "setor", acc.reason || "")
                          );
                        })()}

                        {activeClientTab === "Faturamento" && (() => {
                          const acc = getTabAccessStatus("Faturamento");
                          return acc.allowed ? (
                            <FaturamentoSection
                              empresaId={activeCompany?.id || ""}
                              notas={notas}
                              onEmitirNota={handleEmitirNota}
                              onCancelarNota={(id) => alert("Solicitação de cancelamento enviada.")}
                            />
                          ) : (
                            renderAccessDeniedPanel("Faturamento", acc.restrictedBy || "setor", acc.reason || "")
                          );
                        })()}

                        {activeClientTab === "Industrial" && (() => {
                          const acc = getTabAccessStatus("Industrial");
                          return acc.allowed ? (
                            <IndustrialSection
                              empresaId={activeCompany?.id || ""}
                              ordensProducao={ordensProducao}
                              maquinas={maquinas}
                              onAddOrdemProducao={handleAddOrdemProducao}
                              onUpdateOrdemStatus={handleUpdateOrdemStatus}
                              onUpdateMaquinaStatus={handleUpdateMaquinaStatus}
                            />
                          ) : (
                            renderAccessDeniedPanel("Industrial", acc.restrictedBy || "setor", acc.reason || "")
                          );
                        })()}

                        {activeClientTab === "Comercial" && (() => {
                          const acc = getTabAccessStatus("Comercial");
                          return acc.allowed ? (
                            <ComercialSection
                              empresaId={activeCompany?.id || ""}
                              leads={leads}
                              onAddLead={handleAddLead}
                              onUpdateLeadEstagio={handleUpdateLeadEstagio}
                              onAddLeadNota={handleAddLeadNota}
                            />
                          ) : (
                            renderAccessDeniedPanel("Comercial", acc.restrictedBy || "setor", acc.reason || "")
                          );
                        })()}

                        {activeClientTab === "Chat" && (() => {
                          return (
                            <ChatInternoSection
                              empresaId={activeCompany?.id || ""}
                              usuarioNome={virtualUser.nome}
                              mensagens={mensagens}
                              onAddMensagem={handleAddMensagem}
                            />
                          );
                        })()}

                        {activeClientTab === "Seguranca" && (() => {
                          const acc = getTabAccessStatus("Seguranca");
                          return acc.allowed ? (
                            <SegurancaSection
                              empresaId={activeCompany?.id || ""}
                              auditLogs={auditLogs.filter(log => log.empresaId === activeCompany?.id).map(l => ({
                                id: l.id,
                                acao: l.acao,
                                usuario: l.usuarioNome,
                                data: l.data
                              }))}
                              onAddAuditLog={(msg) => pushAuditLog(msg)}
                            />
                          ) : (
                            renderAccessDeniedPanel("Seguranca", acc.restrictedBy || "setor", acc.reason || "")
                          );
                        })()}

                        {activeClientTab === "IA" && <IASection />}

                        {activeClientTab === "Suporte" && (
                          <SuporteSection
                            empresaId={activeCompany?.id || ""}
                            tickets={tickets}
                            onAddTicket={handleAddTicket}
                            onAdicionarMensagemCliente={handleAdicionarMensagemCliente}
                          />
                        )}
                      </div>

                    </div>
                  )}
                </main>

                {loggedInUser && (
                  <NexusAICopilot
                    onExecuteCommand={(tab) => {
                      setActiveClientTab(tab);
                      pushAuditLog(`Comando executado via Nexus AI Copilot: Abrir módulo [${tab}]`);
                    }}
                    activeCompany={activeCompany}
                    virtualUser={virtualUser}
                  />
                )}

              </div>
            );
          })()}

        </div>
      )}
    </div>
  );
}
