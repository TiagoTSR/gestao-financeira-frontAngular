import { Categoria } from './categoria.model';
import { Pessoa } from './pessoa.model';

export type TipoLancamento = 'RECEITA' | 'DESPESA';
export type StatusLancamento = 'PENDENTE' | 'PAGO' | 'RECEBIDO' | 'CANCELADO';

export interface Lancamento {
  id?: string | number;
  descricao: string;
  data_vencimento: string;
  data_pagamento?: string | null;
  valor: number;
  observacao?: string | null;
  tipo: TipoLancamento;
  categoria: Categoria;
  pessoa: Pessoa;
  status?: StatusLancamento;
  valor_pago?: number | null;
  numero_parcela?: number;
  total_parcelas?: number;
}

export interface CriarLancamentoRequest {
  descricao: string;
  data_vencimento: string;
  data_pagamento?: string | null;
  valor: number;
  observacao?: string | null;
  tipo: TipoLancamento;
  categoria_id: string | number;
  pessoa_id: string | number;
  total_parcelas?: number;
}

export interface AtualizarLancamentoRequest {
  descricao: string;
  data_vencimento: string;
  data_pagamento?: string | null;
  valor: number;
  observacao?: string | null;
  tipo: TipoLancamento;
  categoria_id: string | number;
  pessoa_id: string | number;
}

export interface LancamentoBaixaRequest {
  data_pagamento?: string;
  valor_pago?: number;
}

export interface LancamentoFilter {
  descricao?: string;
  data_vencimento_de?: string;
  data_vencimento_ate?: string;
  status?: StatusLancamento;
  categoria_id?: string | number;
  pessoa_id?: string | number;
}