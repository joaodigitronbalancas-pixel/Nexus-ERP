/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Plano,
  PlanoTipo,
  Empresa,
  Filial,
  Usuario,
  NivelHierarquico,
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
  LogAuditoria
} from "../types";

export const PLANOS_INICIAIS: Plano[] = [
  {
    id: "plano_basico",
    nome: PlanoTipo.BASICO,
    preco: 299.90,
    maxUsuarios: 5,
    maxFiliais: 1,
    modules: ["Administrativo", "RH", "Financeiro", "Faturamento"],
    iaLiberada: false,
    apiLiberada: false,
    suportePremium: false
  },
  {
    id: "plano_profissional",
    nome: PlanoTipo.PROFISSIONAL,
    preco: 699.90,
    maxUsuarios: 20,
    maxFiliais: 3,
    modules: ["Administrativo", "RH", "Financeiro", "Faturamento", "Industrial", "Comercial", "Chat Interno"],
    iaLiberada: true,
    apiLiberada: false,
    suportePremium: true
  },
  {
    id: "plano_enterprise",
    nome: PlanoTipo.ENTERPRISE,
    preco: 1499.90,
    maxUsuarios: 999,
    maxFiliais: 99,
    modules: ["Administrativo", "RH", "Financeiro", "Faturamento", "Industrial", "Comercial", "Chat Interno", "API Integrada"],
    iaLiberada: true,
    apiLiberada: true,
    suportePremium: true
  }
];

export const EMPRESAS_INICIAIS: Empresa[] = [
  {
    id: "emp_alfa",
    nome: "Indústria Metalúrgica Alfa Ltda",
    cnpj: "12.345.678/0001-90",
    contato: "Antônio Ferreira",
    email: "contato@metalurgicaalfa.com",
    telefone: "(11) 98765-4321",
    status: "Ativo",
    planoId: "plano_profissional",
    dataCadastro: "2026-01-10",
    logoColor: "indigo",
    limiteUsuarios: 20,
    limiteFiliais: 3
  },
  {
    id: "emp_global",
    nome: "Global Alimentos S.A.",
    cnpj: "98.765.432/0001-55",
    contato: "Carlos Eduardo Santos",
    email: "diretoria@globalalimentos.com",
    telefone: "(21) 99999-8888",
    status: "Ativo",
    planoId: "plano_enterprise",
    dataCadastro: "2026-02-15",
    logoColor: "sky",
    limiteUsuarios: 999,
    limiteFiliais: 99
  },
  {
    id: "emp_beta",
    nome: "Comercial de Ferragens Beta",
    cnpj: "55.444.333/0001-12",
    contato: "Maria Antônia Souza",
    email: "financeiro@comercialbeta.com.br",
    telefone: "(31) 98877-6655",
    status: "Bloqueado",
    planoId: "plano_basico",
    dataCadastro: "2026-04-20",
    logoColor: "amber",
    limiteUsuarios: 5,
    limiteFiliais: 1
  }
];

export const FILIAIS_INICIAIS: Filial[] = [
  { id: "fil_alfa_sp", empresaId: "emp_alfa", nome: "Filial Alfa - São Paulo", cnpj: "12.345.678/0002-71", cidade: "São Paulo", estado: "SP" },
  { id: "fil_alfa_campinas", empresaId: "emp_alfa", nome: "Filial Alfa - Campinas", cnpj: "12.345.678/0003-52", cidade: "Campinas", estado: "SP" },
  { id: "fil_global_sp", empresaId: "emp_global", nome: "Global Matriz - Campinas", cnpj: "98.765.432/0001-55", cidade: "Campinas", estado: "SP" },
  { id: "fil_global_rj", empresaId: "emp_global", nome: "Global Alimentos - Rio", cnpj: "98.765.432/0002-36", cidade: "Duque de Caxias", estado: "RJ" }
];

export const USUARIOS_INICIAIS: Usuario[] = [
  { id: "usr_super", empresaId: null, username: "admin", nome: "Super Admin", email: "admin@erp-saas.com", nivel: "SuperAdmin", departamento: "Tecnologia", status: "Ativo", avatar: "⚡", ultimoAcesso: "2026-05-27T11:45:00Z" },
  { id: "usr_alfa_admin", empresaId: "emp_alfa", username: "antonio.alfa", nome: "Antônio Ferreira", email: "antonio@metalurgicaalfa.com", nivel: NivelHierarquico.DONO_EMPRESA, departamento: "Diretoria", status: "Ativo", avatar: "💼", ultimoAcesso: "2026-05-27T11:50:00Z" },
  { id: "usr_alfa_rh", empresaId: "emp_alfa", username: "marcia.rh", nome: "Márcia Souza", email: "marcia@metalurgicaalfa.com", nivel: NivelHierarquico.GERENTE, departamento: "Recursos Humanos", status: "Ativo", avatar: "👩‍💼", ultimoAcesso: "2026-05-27T09:12:00Z" },
  { id: "usr_alfa_financeiro", empresaId: "emp_alfa", username: "bruno.fin", nome: "Bruno Silva", email: "bruno@metalurgicaalfa.com", nivel: NivelHierarquico.ANALISTA, departamento: "Financeiro", status: "Ativo", avatar: "💰", ultimoAcesso: "2026-05-27T11:51:00Z" },
  { id: "usr_alfa_industrial", empresaId: "emp_alfa", username: "carlos.prod", nome: "Carlos Ramos", email: "carlos@metalurgicaalfa.com", nivel: NivelHierarquico.SUPERVISOR, departamento: "Produção", status: "Ativo", avatar: "🏭", ultimoAcesso: "2026-05-27T08:00:00Z" },
  { id: "usr_alfa_operador", empresaId: "emp_alfa", username: "jose.operador", nome: "José Almeida", email: "jose@metalurgicaalfa.com", nivel: NivelHierarquico.OPERADOR, departamento: "Produção", status: "Ativo", avatar: "🔧", ultimoAcesso: "2026-05-27T08:05:00Z" },
  { id: "usr_alfa_vendas", empresaId: "emp_alfa", username: "larissa.vendas", nome: "Larissa Rezende", email: "larissa@metalurgicaalfa.com", nivel: NivelHierarquico.ASSISTENTE, departamento: "Vendas", status: "Ativo", avatar: "📈", ultimoAcesso: "2026-05-27T08:10:00Z" },
  { id: "usr_global_admin", empresaId: "emp_global", username: "carlos.global", nome: "Carlos Eduardo Santos", email: "carlos@globalalimentos.com", nivel: NivelHierarquico.DONO_EMPRESA, departamento: "Diretoria", status: "Ativo", avatar: "👔", ultimoAcesso: "2026-05-27T10:30:00Z" }
];

export const FUNCIONARIOS_INICIAIS: Funcionario[] = [
  { id: "func_alfa_1", empresaId: "emp_alfa", nome: "Antônio Ferreira", cpf: "123.456.789-01", cargo: "Diretor Comercial e Industrial", departamento: "Diretoria", salario: 15500.0, dataAdmissao: "2026-01-11", status: "Ativo", horasBanco: 12.5, epiEntregues: ["Óculos de Proteção"], avaliacoes: [{ data: "2026-04-12", nota: 9.5, feedback: "Excelente liderança no onboarding do ERP" }] },
  { id: "func_alfa_2", empresaId: "emp_alfa", nome: "Márcia Souza", cpf: "234.567.890-12", cargo: "Gerente de Recursos Humanos", departamento: "Recursos Humanos", salario: 7800.0, dataAdmissao: "2026-01-15", status: "Ativo", horasBanco: 4.0, epiEntregues: [], avaliacoes: [{ data: "2026-04-15", nota: 9.0, feedback: "Eficiência exemplar nos processos de admissão" }] },
  { id: "func_alfa_3", empresaId: "emp_alfa", nome: "Bruno Silva", cpf: "345.678.901-23", cargo: "Analista Financeiro Sênior", departamento: "Financeiro", salario: 5500.0, dataAdmissao: "2026-01-18", status: "Ativo", horasBanco: -2.0, epiEntregues: [], avaliacoes: [{ data: "2026-04-20", nota: 8.8, feedback: "Foco incrível na redução de inadimplência" }] },
  { id: "func_alfa_4", empresaId: "emp_alfa", nome: "Carlos Ramos", cpf: "456.789.012-34", cargo: "Supervisor de PCP", departamento: "Produção", salario: 6200.0, dataAdmissao: "2026-02-01", status: "Ativo", horasBanco: 18.0, epiEntregues: ["Capacete de Proteção", "Botina com Bico de Aço"], avaliacoes: [{ data: "2026-05-02", nota: 9.2, feedback: "Grande otimização nas paradas de manutenção" }] },
  { id: "func_alfa_5", empresaId: "emp_alfa", nome: "José Almeida", cpf: "567.890.123-45", cargo: "Operador de Torno Mecânico CNC", departamento: "Produção", salario: 2900.0, dataAdmissao: "2026-02-15", status: "Ativo", horasBanco: 8.5, epiEntregues: ["Óculos de Proteção", "Abafador de Ruídos", "Botina com Bico de Aço"], avaliacoes: [{ data: "2026-05-10", nota: 8.5, feedback: "Alta precisão e zelo pelo maquinário" }] },
  { id: "func_alfa_6", empresaId: "emp_alfa", nome: "Larissa Rezende", cpf: "678.901.234-56", cargo: "Assistente Comercial", departamento: "Vendas", salario: 2400.0, dataAdmissao: "2026-03-01", status: "Férias", horasBanco: 0, epiEntregues: [], avaliacoes: [] }
];

export const PONTO_INICIAL: RegistroPonto[] = [
  { id: "pt_alfa_1", funcionarioId: "func_alfa_5", funcionarioNome: "José Almeida", data: "2026-05-26", entrada: "08:02:00", saidaAlmoco: "12:00:00", retornoAlmoco: "13:00:00", saida: "17:05:00", horasTrabalhadas: "08h 03m", status: "Normal" },
  { id: "pt_alfa_2", funcionarioId: "func_alfa_3", funcionarioNome: "Bruno Silva", data: "2026-05-26", entrada: "09:12:00", saidaAlmoco: "12:30:00", retornoAlmoco: "13:30:00", saida: "18:00:00", horasTrabalhadas: "07h 48m", status: "Normal" },
  { id: "pt_alfa_3", funcionarioId: "func_alfa_4", funcionarioNome: "Carlos Ramos", data: "2026-05-26", entrada: "07:54:00", saidaAlmoco: "12:00:00", retornoAlmoco: "13:10:00", saida: "18:15:00", horasTrabalhadas: "09h 11m", status: "Normal" },
  { id: "pt_alfa_4", funcionarioId: "func_alfa_5", funcionarioNome: "José Almeida", data: "2026-05-27", entrada: "08:15:00", saidaAlmoco: "12:00:00", retornoAlmoco: "13:00:00", saida: "17:35:00", horasTrabalhadas: "08h 20m", status: "Atraso" }
];

export const HOLERITES_INICIAIS: Holerite[] = [
  {
    id: "hol_1",
    funcionarioId: "func_alfa_3",
    funcionarioNome: "Bruno Silva",
    mesReferencia: "Abril/2026",
    salarioBase: 5500.0,
    proventos: [
      { descricao: "Salário Base", valor: 5500.0 },
      { descricao: "Prêmio de Desempenho", valor: 500.0 }
    ],
    descontos: [
      { descricao: "INSS", valor: 580.45 },
      { descricao: "IRRF", valor: 450.20 },
      { descricao: "Plano de Saúde Coparticipativo", valor: 120.0 }
    ],
    liquido: 4849.35
  },
  {
    id: "hol_2",
    funcionarioId: "func_alfa_5",
    funcionarioNome: "José Almeida",
    mesReferencia: "Abril/2026",
    salarioBase: 2900.0,
    proventos: [
      { descricao: "Salário Base", valor: 2900.0 },
      { descricao: "Insalubridade 20%", valor: 282.40 }
    ],
    descontos: [
      { descricao: "INSS", valor: 280.50 },
      { descricao: "Vale Transporte", valor: 174.0 }
    ],
    liquido: 2727.90
  }
];

export const FORNECEDORES_INICIAIS: Fornecedor[] = [
  { id: "for_alfa_1", empresaId: "emp_alfa", nome: "Siderúrgica Gerdau Nacional", cnpj: "44.555.666/0001-22", segmento: "Matéria-prima Metálica", email: "vendas@gerdauloja.com" },
  { id: "for_alfa_2", empresaId: "emp_alfa", nome: "Ferramentas Bosch Brasil", cnpj: "22.333.111/0001-90", segmento: "Maquinários e Equipamentos", email: "parceiros@bosch.com.br" },
  { id: "for_global_1", empresaId: "emp_global", nome: "Moinho Trigo de Ouro", cnpj: "88.777.666/0001-54", segmento: "Farofas e Trigos", email: "atendimento@trigodeouro.com" }
];

export const CLIENTES_INICIAIS: Cliente[] = [
  { id: "cli_alfa_1", empresaId: "emp_alfa", nome: "Transportadora Rápido S.A.", cpfCnpj: "44.332.221/0001-01", email: "contato@rapidosa.com", cidade: "Campinas" },
  { id: "cli_alfa_2", empresaId: "emp_alfa", nome: "Auto Peças Bandeirantes", cpfCnpj: "11.222.333/0001-44", email: "suporte@bandeirantespecas.com.br", cidade: "Sorocaba" },
  { id: "cli_global_1", empresaId: "emp_global", nome: "Supermercados Pão de Mel", cpfCnpj: "77.888.999/0002-33", email: "compras@paodemel.com", cidade: "Rio de Janeiro" }
];

export const DOCUMENTOS_INICIAIS: Documento[] = [
  { id: "doc_1", empresaId: "emp_alfa", titulo: "Contrato Fornecimento Gerdau.pdf", categoria: "Contratos de Compra", dataEnvio: "2026-03-12", tamanho: "2.4 MB", tipo: "PDF", assinadoDigitalmente: true },
  { id: "doc_2", empresaId: "emp_alfa", titulo: "Laudo Ergonomico Postos Producao.docx", categoria: "Segurança e Medicina", dataEnvio: "2026-04-10", tamanho: "680 KB", tipo: "DOCX", assinadoDigitalmente: false },
  { id: "doc_3", empresaId: "emp_alfa", titulo: "Acordo Coletivo Trabalho Sindicato 2026.pdf", categoria: "Jurídico / RH", dataEnvio: "2026-05-02", tamanho: "1.8 MB", tipo: "PDF", assinadoDigitalmente: true }
];

export const TAREFAS_INICIAIS: Tarefa[] = [
  { id: "tar_1", empresaId: "emp_alfa", titulo: "Auditoria Balanceamento FIFO Almoxarifado", descricao: "Ajustar o controle de estoque de bobinas metálicas no ERP e treinar equipe do pátio.", responsavelNome: "Carlos Ramos", status: "Em Progresso", prioridade: "Alta", dataLimite: "2026-05-30" },
  { id: "tar_2", empresaId: "emp_alfa", titulo: "Conciliação Tributária ICMS-ST Abril", descricao: "Executar o fechamento de faturamento fiscal do mês de abril e conferir as GNRE recolhidas.", responsavelNome: "Bruno Silva", status: "Pendente", prioridade: "Alta", dataLimite: "2026-05-29" },
  { id: "tar_3", empresaId: "emp_alfa", titulo: "Atualizar Documentação PCMSO e PPRA", descricao: "Reunir com a clínica de medicina do trabalho para renovação dos programas obrigatórios.", responsavelNome: "Márcia Souza", status: "Concluido", prioridade: "Media", dataLimite: "2026-05-20" }
];

export const NOTAS_FATURAMENTO_INICIAIS: NotaFiscal[] = [
  { id: "nf_101", empresaId: "emp_alfa", numero: "000000101", serie: "001", tipo: "NF-e", clienteNome: "Auto Peças Bandeirantes", valorTotal: 18500.0, status: "Emitida", xmlSimulado: `<NFe xmlns="http://www.portalfiscal.inf.br/nfe"><infNFe Id="NFe35260512345678000190550010000001011116543210" versao="4.00"><ide><cUF>35</cUF><cNF>11654321</cNF><natOp>Venda de Producao do Estabelecimento</natOp><mod>55</mod><serie>1</serie><nNF>101</nNF><dhEmi>2026-05-26T14:35:10-03:00</dhEmi><tpNF>1</tpNF><idDest>1</idDest><cMunFG>3509502</cMunFG><tpImp>1</tpImp><tpEmis>1</tpEmis></ide><emit><CNPJ>12345678000190</CNPJ><xNome>Industria Metalurgica Alfa Ltda</xNome><xFant>Alfa Metalurgica</xFant><IE>111222333444</IE></emit><dest><CNPJ>11222333000144</CNPJ><xNome>Auto Pecas Bandeirantes</xNome></dest><det nItem="1"><prod><cProd>MET-4432</cProd><xProd>Eixos de Transmissao Aco Ligado</xProd><NCM>73269090</NCM><CFOP>5101</CFOP><uCom>UN</uCom><qCom>50.0000</qCom><vUnCom>370.00</vUnCom><vProd>18500.00</vProd></prod></det></infNFe></NFe>`, dataEmissao: "2026-05-26" },
  { id: "nf_102", empresaId: "emp_alfa", numero: "000000102", serie: "001", tipo: "NF-e", clienteNome: "Transportadora Rápido S.A.", valorTotal: 9600.0, status: "Emitida", xmlSimulado: `<NFe xmlns="http://www.portalfiscal.inf.br/nfe"><infNFe Id="NFe35260512345678000190550010000001021116543211" versao="4.00"><ide><nNF>102</nNF><dhEmi>2026-05-27T09:15:00-03:00</dhEmi></ide><emit><xNome>Industria Metalurgica Alfa Ltda</xNome></emit></infNFe></NFe>`, dataEmissao: "2026-05-27" },
  { id: "nf_205", empresaId: "emp_alfa", numero: "000002052", serie: "003", tipo: "NFS-e", clienteNome: "Auto Peças Bandeirantes", valorTotal: 1500.0, status: "Processando", xmlSimulado: `<NFSe><InfPedido><Prestador><CNPJ>12345678000190</CNPJ></Prestador><Servico><CodigoAtividade>1401</CodigoAtividade><Discriminacao>Servico de Usinagem e Fresamento de Placas Industriais</Discriminacao></Servico></InfPedido></NFSe>`, dataEmissao: "2026-05-27" }
];

export const TRANSCOES_FINANCEIRAS_INICIAIS: MovimentacaoFinanceira[] = [
  { id: "tr_1", empresaId: "emp_alfa", descricao: "NF 101 Venda Eixos Transmissão", tipo: "Receita", valor: 18500.0, centroCusto: "Industrial Vendas", data: "2026-05-26", categoria: "Faturamento Comercial", status: "Pago" },
  { id: "tr_2", empresaId: "emp_alfa", descricao: "Pagamento Fornecedor Gerdau Insumos", tipo: "Despesa", valor: 12400.0, centroCusto: "Produção Metalúrgica", data: "2026-05-25", categoria: "Matéria-prima", status: "Pago" },
  { id: "tr_3", empresaId: "emp_alfa", descricao: "Energia Elétrica Industrial Enel", tipo: "Despesa", valor: 3800.0, centroCusto: "Infraestrutura Fábrica", data: "2026-05-26", categoria: "Serviços Públicos", status: "Pendente" },
  { id: "tr_4", empresaId: "emp_alfa", descricao: "Consultoria Jurídica e Contrato Social", tipo: "Despesa", valor: 1500.0, centroCusto: "Jurídico", data: "2026-05-27", categoria: "Honorários", status: "Pago" },
  { id: "tr_5", empresaId: "emp_alfa", descricao: "Recebimento Licença Serviço Bandeirantes", tipo: "Receita", valor: 1500.0, centroCusto: "Oficina Tecnica", data: "2026-05-27", categoria: "Serviços Efetuados", status: "Pendente" },
  { id: "tr_6", empresaId: "emp_alfa", descricao: "Prospecção Proposta Comercial Rápido", tipo: "Receita", valor: 9600.0, centroCusto: "Industrial Vendas", data: "2026-05-27", categoria: "Faturamento Comercial", status: "Pendente" }
];

export const ORDEM_PRODUCAO_INICIAL: OrdemProducao[] = [
  { id: "op_2210", empresaId: "emp_alfa", codigo: "OP-2026-2210", produtoNome: "Eixos Estriados Aço Carbono 1/2 Pol.", quantidadePlanejada: 500, quantidadeProduzida: 350, status: "Em Producao", dataInicio: "2026-05-25", dataFimPrevia: "2026-05-28", perdaMaterialKg: 4.8 },
  { id: "op_2211", empresaId: "emp_alfa", codigo: "OP-2026-2211", produtoNome: "Mancais Helicoidais Retificados H4", quantidadePlanejada: 100, quantidadeProduzida: 100, status: "Concluida", dataInicio: "2026-05-20", dataFimPrevia: "2026-05-24", perdaMaterialKg: 1.5 },
  { id: "op_2212", empresaId: "emp_alfa", codigo: "OP-2026-2212", produtoNome: "Buchas Bronze Fosforoso 15mm-B", quantidadePlanejada: 1000, quantidadeProduzida: 0, status: "Planejada", dataInicio: "2026-05-29", dataFimPrevia: "2026-06-03", perdaMaterialKg: 0 }
];

export const MAQUINAS_INICIAIS: Maquina[] = [
  { id: "maq_1", nome: "Torno CNC Mazak Integrex", status: "Operando", proximaManutencao: "2026-06-15", eficienciaOEE: 89.2 },
  { id: "maq_2", nome: "Centro de Usinagem Romi D800", status: "Operando", proximaManutencao: "2026-06-10", eficienciaOEE: 85.0 },
  { id: "maq_3", nome: "Prensa Hidráulica Newton 150T", status: "Manutencao", proximaManutencao: "2026-05-27", eficienciaOEE: 62.4 },
  { id: "maq_4", nome: "Retificadora Cilíndrica Danobat", status: "Ociosa", proximaManutencao: "2026-06-20", eficienciaOEE: 74.8 }
];

export const LEADS_CRM_INICIAIS: LeadCRM[] = [
  { id: "lead_1", empresaId: "emp_alfa", clienteNome: "Metalúrgica Joinville", email: "compras@joinvillemetal.com", telefone: "(47) 98711-2233", valorEstimado: 45000.0, estagio: "Prospecção", vendedorNome: "Ana Oliveira", dataAtualizacao: "2026-05-24", notas: ["Lead captado na feira Fispal Mecânica.", "Demonstrou interesse em mancais customizados."] },
  { id: "lead_2", empresaId: "emp_alfa", clienteNome: "Tratores Case Sul S.A.", email: "joao.melo@casesul.com.br", telefone: "(51) 98111-5544", valorEstimado: 120000.0, estagio: "Proposta", vendedorNome: "Ana Oliveira", dataAtualizacao: "2026-05-26", notas: ["Proposta comercial enviada.", "Aguardando aprovação do comitê financeiro."] },
  { id: "lead_3", empresaId: "emp_alfa", clienteNome: "Fábrica Válvulas Elite", email: "atendimento@valvulaselite.com", telefone: "(19) 3511-9988", valorEstimado: 32000.0, estagio: "Negociação", vendedorNome: "Antônio Ferreira", dataAtualizacao: "2026-05-27", notas: ["Solicitou desconto de 5% sobre frete CIF.", "Negociação de prazo: 30/60 dd."] },
  { id: "lead_4", empresaId: "emp_alfa", clienteNome: "Caterpillar Filial Brasil", email: "suprimentos.cat@cat.com", telefone: "(19) 3450-0000", valorEstimado: 95000.0, estagio: "Fechado", vendedorNome: "Antônio Ferreira", dataAtualizacao: "2026-05-20", notas: ["Contrato assinado!", "OP-2211 gerada a partir desta conta."] }
];

export const MENSAGENS_INICIAIS: MensagemChat[] = [
  { id: "msg_1", empresaId: "emp_alfa", deUsuario: "marcia.rh", paraUsuario: "all_producao", mensagem: "Pessoal, atenção! Amanhã realizaremos o treinamento de EPI obrigatório às 09h00 no refeitório.", data: "2026-05-27T10:00:00Z", lida: true, tipo: "texto" },
  { id: "msg_2", empresaId: "emp_alfa", deUsuario: "carlos.prod", paraUsuario: "marcia.rh", mensagem: "Marcia, os operadores do turno B podem participar às 14h?", data: "2026-05-27T10:15:00Z", lida: true, tipo: "texto" },
  { id: "msg_3", empresaId: "emp_alfa", deUsuario: "marcia.rh", paraUsuario: "carlos.prod", mensagem: "Sim, faremos uma sessão extra às 14h30 para cobrir o turno B.", data: "2026-05-27T10:20:00Z", lida: true, tipo: "texto" },
  { id: "msg_4", empresaId: "emp_alfa", deUsuario: "bruno.fin", paraUsuario: "antonio.alfa", mensagem: "Antônio, o DRE consolidado de abril de 2026 ficou disponível. Faturamento excelente.", data: "2026-05-27T11:42:00Z", lida: false, tipo: "texto" }
];

export const TICKETS_INICIAIS: TicketSuporte[] = [
  {
    id: "tkt_1",
    empresaId: "emp_alfa",
    empresaNome: "Indústria Metalúrgica Alfa Ltda",
    assunto: "Dificuldade na integração com XML SEFAZ",
    categoria: "Faturamento",
    prioridade: "Alta",
    status: "Em Atendimento",
    slaHoras: 4,
    dataCriacao: "2026-05-27T08:30:00Z",
    mensagens: [
      { deAdmin: false, mensagem: "Ao tentar importar o XML de contingência da SEFAZ, o sistema acusa erro de namespace. Nosso CNPJ está habilitado no ambiente de testes.", data: "2026-05-27T08:30:00Z" },
      { deAdmin: true, mensagem: "Olá, equipe Alfa! Analisamos o arquivo enviado e notamos que a versão de tag utilizada no cabeçalho era correspondente à v3.10. Atualizamos seu faturamento para aceitar automaticamente as variações de namespace. Podem tentar re-enviar agora.", data: "2026-05-27T09:45:00Z" },
      { deAdmin: false, mensagem: "Perfeito, realizamos o envio e deu 100% de sucesso! Obrigado pelo retorno rápido.", data: "2026-05-27T10:01:00Z" }
    ]
  },
  {
    id: "tkt_2",
    empresaId: "emp_global",
    empresaNome: "Global Alimentos S.A.",
    assunto: "Liberação de acesso a novos operadores no PCP",
    categoria: "Limites de Plano",
    prioridade: "Media",
    status: "Aberto",
    slaHoras: 12,
    dataCriacao: "2026-05-27T11:00:00Z",
    mensagens: [
      { deAdmin: false, mensagem: "Ativamos 15 novas credenciais de login para operadores do Moinho, mas vimos no plano Enterprise que o cadastro é liberado. Existe algum limite de API que precisamos expandir?", data: "2026-05-27T11:00:00Z" }
    ]
  }
];

export const LOGS_INICIAIS: LogAuditoria[] = [
  { id: "log_1", empresaId: "emp_alfa", usuarioNome: "bruno.fin", nivel: "INFO", acao: "Emissão de Nota Fiscal Eletrônica #102", ip: "192.168.1.45", data: "2026-05-27T09:15:00Z" },
  { id: "log_2", empresaId: "emp_alfa", usuarioNome: "marcia.rh", nivel: "SECURITY", acao: "Alteração de registro de ponto de José Almeida", ip: "192.168.1.13", data: "2026-05-27T09:44:00Z" },
  { id: "log_3", empresaId: "emp_alfa", usuarioNome: "antonio.alfa", nivel: "INFO", acao: "Acesso aos termos de consentimento LGPD da plataforma", ip: "200.145.22.8", data: "2026-05-27T11:51:00Z" },
  { id: "log_4", empresaId: null, usuarioNome: "admin", nivel: "SYSTEM", acao: "Backup global de dados consolidado com sucesso", ip: "10.0.0.1", data: "2026-05-27T11:55:00Z" }
];

export function getLocalData<T>(key: string, initialData: T): T {
  const store = localStorage.getItem(key);
  if (store) {
    try {
      return JSON.parse(store) as T;
    } catch {
      return initialData;
    }
  }
  localStorage.setItem(key, JSON.stringify(initialData));
  return initialData;
}

export function saveLocalData<T>(key: string, data: T): void {
  localStorage.setItem(key, JSON.stringify(data));
}
