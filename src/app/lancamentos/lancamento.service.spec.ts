import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { LancamentoService } from './lancamento.service';
import { Lancamento, PageResult } from '../models';

describe('LancamentoService', () => {
  let service: LancamentoService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LancamentoService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(LancamentoService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  it('deve listar lançamentos com filtros e paginação (GET /lancamentos)', () => {
    const mockResult: PageResult<Lancamento> = {
      conteudo: [
        {
          id: 1,
          descricao: 'Supermercado',
          data_vencimento: '2026-09-20',
          valor: 350.75,
          tipo: 'DESPESA',
          categoria: { id: 1, nome: 'Alimentação' },
          pessoa: { id: 1, nome: 'João Silva', ativo: true }
        }
      ],
      pagina: 0,
      tamanho: 5,
      total_elementos: 1,
      total_paginas: 1
    };

    service.listar({ descricao: 'Supermercado' }, { pagina: 0, tamanho: 5 }).subscribe((result) => {
      expect(result.conteudo.length).toBe(1);
      expect(result.conteudo[0].descricao).toBe('Supermercado');
      expect(result.conteudo[0].valor).toBe(350.75);
    });

    const req = httpTesting.expectOne((request) =>
      request.url === 'http://localhost:8080/lancamentos' &&
      request.params.get('descricao') === 'Supermercado' &&
      request.params.get('pagina') === '0' &&
      request.params.get('tamanho') === '5'
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResult);
  });

  it('deve buscar lançamento por ID (GET /lancamentos/1)', () => {
    const mockLancamento: Lancamento = {
      id: 1,
      descricao: 'Supermercado',
      data_vencimento: '2026-09-20',
      valor: 350.75,
      tipo: 'DESPESA',
      categoria: { id: 1, nome: 'Alimentação' },
      pessoa: { id: 1, nome: 'João Silva', ativo: true }
    };

    service.buscarPorId(1).subscribe((lancamento) => {
      expect(lancamento).toEqual(mockLancamento);
    });

    const req = httpTesting.expectOne('http://localhost:8080/lancamentos/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockLancamento);
  });

  it('deve remover lançamento (DELETE /lancamentos/1)', () => {
    service.remover(1).subscribe();

    const req = httpTesting.expectOne('http://localhost:8080/lancamentos/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
