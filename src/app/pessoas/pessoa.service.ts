import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Pessoa,
  CriarPessoaRequest,
  AtualizarPessoaRequest,
  PessoaFilter,
  PageRequest,
  PageResult
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class PessoaService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/pessoas';

  listar(filtro?: PessoaFilter, paginacao?: PageRequest): Observable<PageResult<Pessoa>> {
    let params = new HttpParams();

    if (filtro?.nome) {
      params = params.set('nome', filtro.nome);
    }
    if (filtro?.ativo !== undefined && filtro.ativo !== null) {
      params = params.set('ativo', filtro.ativo.toString());
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

    return this.http.get<PageResult<Pessoa>>(this.apiUrl, { params });
  }

  listarTodas(): Observable<PageResult<Pessoa>> {
    const params = new HttpParams().set('pagina', '0').set('tamanho', '100');
    return this.http.get<PageResult<Pessoa>>(this.apiUrl, { params });
  }

  buscarPorId(id: number): Observable<Pessoa> {
    return this.http.get<Pessoa>(`${this.apiUrl}/${id}`);
  }

  criar(pessoa: CriarPessoaRequest): Observable<Pessoa> {
    return this.http.post<Pessoa>(this.apiUrl, pessoa);
  }

  atualizar(id: number, pessoa: AtualizarPessoaRequest): Observable<Pessoa> {
    return this.http.put<Pessoa>(`${this.apiUrl}/${id}`, pessoa);
  }

  atualizarAtivo(id: number, ativo: boolean): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/ativo`, { ativo });
  }

  remover(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
