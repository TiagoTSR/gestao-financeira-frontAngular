import { environment } from '../../environments/environment';
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RelatorioService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/relatorios`;

  gerarLancamentosPorPessoa(inicio: string, fim: string): Observable<Blob> {
    const params = new HttpParams()
      .set('inicio', inicio)
      .set('fim', fim);

    return this.http.get(`${this.apiUrl}/lancamentos-por-pessoa`, {
      params,
      responseType: 'blob'
    });
  }

  gerarLancamentosPorPessoaExcel(inicio: string, fim: string): Observable<Blob> {
    const params = new HttpParams()
      .set('inicio', inicio)
      .set('fim', fim);

    return this.http.get(`${this.apiUrl}/lancamentos-por-pessoa/excel`, {
      params,
      responseType: 'blob'
    });
  }
}