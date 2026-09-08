import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Lancamento,
  CriarLancamentoRequest,
  AtualizarLancamentoRequest,
  LancamentoFilter,
  PageRequest,
  PageResult
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class LancamentoService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/lancamentos';

  listar(filtro?: LancamentoFilter, paginacao?: PageRequest): Observable<PageResult<Lancamento>> {
    let params = new HttpParams();

    if (filtro?.descricao) {
      params = params.set('descricao', filtro.descricao);
    }
    if (filtro?.data_vencimento_de) {
      params = params.set('data_vencimento_de', filtro.data_vencimento_de);
    }
    if (filtro?.data_vencimento_ate) {
      params = params.set('data_vencimento_ate', filtro.data_vencimento_ate);
    }
    if (filtro?.categoria_id) {
      params = params.set('categoria_id', filtro.categoria_id.toString());
    }
    if (filtro?.pessoa_id) {
      params = params.set('pessoa_id', filtro.pessoa_id.toString());
    }
    if (paginacao?.pagina !== undefined) {
      params = params.set('pagina', paginacao.pagina.toString());
    }
    if (paginacao?.tamanho !== undefined) {
      params = params.set('tamanho', paginacao.tamanho.toString());
    }
    if (paginacao?.ordenar_por) {
      params = params.set('ordenar_por', paginacao.ordenar_por);
    }
    if (paginacao?.direcao) {
      params = params.set('direcao', paginacao.direcao);
    }

    return this.http.get<PageResult<Lancamento>>(this.apiUrl, { params });
  }

  buscarPorId(id: number): Observable<Lancamento> {
    return this.http.get<Lancamento>(`${this.apiUrl}/${id}`);
  }

  criar(lancamento: CriarLancamentoRequest): Observable<Lancamento> {
    return this.http.post<Lancamento>(this.apiUrl, lancamento);
  }

  atualizar(id: number, lancamento: AtualizarLancamentoRequest): Observable<Lancamento> {
    return this.http.put<Lancamento>(`${this.apiUrl}/${id}`, lancamento);
  }

  remover(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
