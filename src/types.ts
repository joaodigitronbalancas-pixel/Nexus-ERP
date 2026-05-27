/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum PlanoTipo {
  BASICO = "Básico",
  PROFISSIONAL = "Profissional",
  ENTERPRISE = "Enterprise"
}

export interface Plano {
  id: string;
  nome: PlanoTipo;
  preco: number;
  maxUsuarios: number;
  maxFiliais: number;
  modules: string[];
  iaLiberada: boolean;
  apiLiberada: boolean;
  suportePremium: boolean;
}

export interface Empresa {
  id: string;
  nome: string;
  cnpj: string;
  contato: string;
  email: string;
  telefone: string;
  status: "Ativo" | "Bloqueado";
  planoId: string;
  dataCadastro: string;
  logoColor: string;
  limiteUsuarios: number;
  limiteFiliais: number;
}

export interface Filial {
  id: string;
  empresaId: string;
  nome: string;
  cnpj: string;
  cidade: string;
  estado: string;
}

export enum NivelHierarquico {
  DONO_EMPRESA = "DonoEmpresa",
  DIRETOR = "Diretor",
  GERENTE = "Gerente",
  SUPERVISOR = "Supervisor",
  COORDENADOR = "Coordenador",
  ANALISTA = "Analista",
  ASSISTENTE = "Assistente",
  OPERADOR = "Operador",
  RH = "RH",
  FINANCEIRO = "Financeiro",
  COMERCIAL = "Comercial",
  PRODUCAO = "Produção"
}

export interface SolicitacaoAcesso {
  id: string;
  empresaId: string;
  empresaNome: string;
  usuarioNome: string;
  departamentoSolicitado: string; // e.g. "Administrativo", "RH", "Financeiro", or crossed sector (like "Vendas acessa Financeiro")
  solicitanteNome: string;
  motivo: string;
  nivelRequerido: string;
  status: "Pendente" | "Aprovado" | "Reprovado";
  data: string;
}

export interface Usuario {
  id: string;
  empresaId: string | null; // null for Super Admin
  username: string;
  nome: string;
  email: string;
  nivel: NivelHierarquico | "SuperAdmin";
  departamento: string;
  status: "Ativo" | "Inativo";
  avatar: string;
  ultimoAcesso: string;
}

export interface Funcionario {
  id: string;
  empresaId: string;
  nome: string;
  cpf: string;
  cargo: string;
  departamento: string;
  salario: number;
  dataAdmissao: string;
  dataDemissao?: string;
  status: "Ativo" | "Férias" | "Inativo";
  horasBanco: number;
  epiEntregues: string[];
  avaliacoes: { data: string; nota: number; feedback: string }[];
}

export interface RegistroPonto {
  id: string;
  funcionarioId: string;
  funcionarioNome: string;
  data: string;
  entrada: string;
  saidaAlmoco: string;
  retornoAlmoco: string;
  saida: string;
  horasTrabalhadas: string;
  status: "Normal" | "Atraso" | "Incompleto";
}

export interface Holerite {
  id: string;
  funcionarioId: string;
  funcionarioNome: string;
  mesReferencia: string;
  salarioBase: number;
  proventos: { descricao: string; valor: number }[];
  descontos: { descricao: string; valor: number }[];
  liquido: number;
}

export interface Fornecedor {
  id: string;
  empresaId: string;
  nome: string;
  cnpj: string;
  segmento: string;
  email: string;
}

export interface Cliente {
  id: string;
  empresaId: string;
  nome: string;
  cpfCnpj: string;
  email: string;
  cidade: string;
}

export interface Documento {
  id: string;
  empresaId: string;
  titulo: string;
  categoria: string;
  dataEnvio: string;
  tamanho: string;
  tipo: string;
  assinadoDigitalmente: boolean;
}

export interface Tarefa {
  id: string;
  empresaId: string;
  titulo: string;
  descricao: string;
  responsavelNome: string;
  status: "Pendente" | "Em Progresso" | "Concluido";
  prioridade: "Baixa" | "Media" | "Alta";
  dataLimite: string;
}

export interface NotaFiscal {
  id: string;
  empresaId: string;
  numero: string;
  serie: string;
  tipo: "NF-e" | "NFS-e" | "NFC-e";
  clienteNome: string;
  valorTotal: number;
  status: "Emitida" | "Cancelada" | "Processando";
  xmlSimulado: string;
  dataEmissao: string;
}

export interface MovimentacaoFinanceira {
  id: string;
  empresaId: string;
  descricao: string;
  tipo: "Receita" | "Despesa";
  valor: number;
  centroCusto: string;
  data: string;
  categoria: string;
  status: "Pago" | "Pendente";
}

export interface OrdemProducao {
  id: string;
  empresaId: string;
  codigo: string;
  produtoNome: string;
  quantidadePlanejada: number;
  quantidadeProduzida: number;
  status: "Planejada" | "Em Producao" | "Pausada" | "Concluida";
  dataInicio: string;
  dataFimPrevia: string;
  perdaMaterialKg: number;
}

export interface Maquina {
  id: string;
  nome: string;
  status: "Operando" | "Manutencao" | "Ociosa";
  proximaManutencao: string;
  eficienciaOEE: number;
}

export interface LeadCRM {
  id: string;
  empresaId: string;
  clienteNome: string;
  email: string;
  telefone: string;
  valorEstimado: number;
  estagio: "Prospecção" | "Contato" | "Proposta" | "Negociação" | "Fechado";
  vendedorNome: string;
  dataAtualizacao: string;
  notas: string[];
}

export interface MensagemChat {
  id: string;
  empresaId: string | null;
  deUsuario: string;
  paraUsuario: string; // "all_rh", "all_marketing" etc. for departments, or private ID
  mensagem: string;
  data: string;
  lida: boolean;
  tipo: "texto" | "audio";
}

export interface TicketSuporte {
  id: string;
  empresaId: string;
  empresaNome: string;
  assunto: string;
  categoria: string;
  prioridade: "Baixa" | "Media" | "Alta";
  status: "Aberto" | "Em Atendimento" | "Resolvido";
  slaHoras: number;
  dataCriacao: string;
  mensagens: { deAdmin: boolean; mensagem: string; data: string }[];
}

export interface LogAuditoria {
  id: string;
  empresaId: string | null;
  usuarioNome: string;
  nivel: string;
  acao: string;
  ip: string;
  data: string;
}
