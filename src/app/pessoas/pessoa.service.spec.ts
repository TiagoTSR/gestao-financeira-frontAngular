import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { PessoaService } from './pessoa.service';
import { PageResult, Pessoa } from '../models';

describe('PessoaService', () => {
  let service: PessoaService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PessoaService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(PessoaService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  it('deve listar pessoas com paginação e filtros (GET /pessoas)', () => {
    const mockResult: PageResult<Pessoa> = {
      conteudo: [
        { id: 1, nome: 'João Silva', ativo: true }
      ],
      pagina: 0,
      tamanho: 10,
      total_elementos: 1,
      total_paginas: 1
    };

    service.listar({ nome: 'Silva', ativo: true }, { pagina: 0, tamanho: 10 }).subscribe((result) => {
      expect(result.conteudo.length).toBe(1);
      expect(result.conteudo[0].nome).toBe('João Silva');
    });

    const req = httpTesting.expectOne((request) =>
      request.url === 'http://localhost:8080/pessoas' &&
      request.params.get('nome') === 'Silva' &&
      request.params.get('ativo') === 'true' &&
      request.params.get('pagina') === '0' &&
      request.params.get('tamanho') === '10'
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResult);
  });

  it('deve alternar status ativo (PUT /pessoas/1/ativo)', () => {
    service.atualizarAtivo(1, false).subscribe();

    const req = httpTesting.expectOne('http://localhost:8080/pessoas/1/ativo');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ ativo: false });
    req.flush(null);
  });

  it('deve remover pessoa (DELETE /pessoas/1)', () => {
    service.remover(1).subscribe();

    const req = httpTesting.expectOne('http://localhost:8080/pessoas/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
