import { Lancamento } from './lancamento.model';

export interface CategoriaEstatistica {
  categoria: string;
  total: number;
  percentual: number;
}

export interface MesFluxo {
  mesAno: string;
  mesNome: string;
  receitas: number;
  despesas: number;
  saldo: number;
}

export interface DashboardResumo {
  totalReceitas: number;
  totalDespesas: number;
  saldoMes: number;
  saldoConsolidado: number;
  totalPendente: number;
  totalVencido: number;
  quantidadeVencidos: number;
  despesasPorCategoria: CategoriaEstatistica[];
  fluxoMensal: MesFluxo[];
  ultimosLancamentos: Lancamento[];
}
