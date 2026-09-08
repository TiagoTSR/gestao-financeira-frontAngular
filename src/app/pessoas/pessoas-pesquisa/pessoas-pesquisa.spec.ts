import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { PessoasPesquisa } from './pessoas-pesquisa';
import { PessoaService } from '../pessoa.service';
import { PageResult, Pessoa } from '../../models';

describe('PessoasPesquisa', () => {
  let component: PessoasPesquisa;
  let fixture: ComponentFixture<PessoasPesquisa>;
  let mockPessoaService: any;

  const mockPessoas: PageResult<Pessoa> = {
    conteudo: [
      { id: 1, nome: 'Manoel Pinheiro', ativo: true, endereco: { logradouro: 'Rua A', bairro: 'Centro', cep: '12345-678', cidade: 'Uberlândia', estado: 'MG' } },
      { id: 2, nome: 'Sebastião da Silva', ativo: false, endereco: { logradouro: 'Rua B', bairro: 'Centro', cep: '12345-678', cidade: 'São Paulo', estado: 'SP' } }
    ],
    pagina: 0,
    tamanho: 5,
    total_elementos: 2,
    total_paginas: 1
  };

  beforeEach(async () => {
    mockPessoaService = {
      listar: vi.fn().mockReturnValue(of(mockPessoas)),
      atualizarAtivo: vi.fn().mockReturnValue(of(undefined)),
      remover: vi.fn().mockReturnValue(of(undefined))
    };

    await TestBed.configureTestingModule({
      imports: [PessoasPesquisa],
      providers: [
        provideRouter([]),
        { provide: PessoaService, useValue: mockPessoaService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PessoasPesquisa);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve carregar pessoas do backend na inicialização', () => {
    expect(mockPessoaService.listar).toHaveBeenCalled();
    expect(component.pessoas().length).toBe(2);
    expect(component.totalRegistros()).toBe(2);
  });

  it('deve chamar atualizarAtivo ao alternar status', () => {
    const pessoa = component.pessoas()[0];
    component.alternarStatus(pessoa);

    expect(mockPessoaService.atualizarAtivo).toHaveBeenCalledWith(1, false);
  });
});
