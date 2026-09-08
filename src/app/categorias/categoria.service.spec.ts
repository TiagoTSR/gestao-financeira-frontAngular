import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { CategoriaService } from './categoria.service';
import { Categoria } from '../models';

describe('CategoriaService', () => {
  let service: CategoriaService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CategoriaService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(CategoriaService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  it('deve listar categorias (GET /categorias)', () => {
    const mockCategorias: Categoria[] = [
      { id: 1, nome: 'Alimentação' },
      { id: 2, nome: 'Transporte' }
    ];

    service.listar().subscribe((categorias) => {
      expect(categorias).toEqual(mockCategorias);
      expect(categorias.length).toBe(2);
    });

    const req = httpTesting.expectOne('http://localhost:8080/categorias');
    expect(req.request.method).toBe('GET');
    req.flush(mockCategorias);
  });

  it('deve buscar categoria por ID (GET /categorias/1)', () => {
    const mockCategoria: Categoria = { id: 1, nome: 'Alimentação' };

    service.buscarPorId(1).subscribe((categoria) => {
      expect(categoria).toEqual(mockCategoria);
    });

    const req = httpTesting.expectOne('http://localhost:8080/categorias/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockCategoria);
  });

  it('deve criar categoria (POST /categorias)', () => {
    const novaCategoria = { nome: 'Saúde' };
    const mockCriada: Categoria = { id: 3, nome: 'Saúde' };

    service.criar(novaCategoria).subscribe((categoria) => {
      expect(categoria).toEqual(mockCriada);
    });

    const req = httpTesting.expectOne('http://localhost:8080/categorias');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(novaCategoria);
    req.flush(mockCriada);
  });

  it('deve remover categoria (DELETE /categorias/1)', () => {
    service.remover(1).subscribe();

    const req = httpTesting.expectOne('http://localhost:8080/categorias/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
