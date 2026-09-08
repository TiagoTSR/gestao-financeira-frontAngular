import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { LOCALE_ID } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { of } from 'rxjs';

import { LancamentosPesquisa } from './lancamentos-pesquisa';
import { LancamentoService } from '../lancamento.service';
import { PageResult, Lancamento } from '../../models';

registerLocaleData(localePt);

describe('LancamentosPesquisa', () => {
  let component: LancamentosPesquisa;
  let fixture: ComponentFixture<LancamentosPesquisa>;
  let mockLancamentoService: any;

  const mockLancamentos: PageResult<Lancamento> = {
    conteudo: [
      {
        id: 1,
        descricao: 'Compra de pão',
        data_vencimento: '2026-06-30',
        data_pagamento: null,
        valor: 4.55,
        tipo: 'DESPESA',
        categoria: { id: 1, nome: 'Alimentação' },
        pessoa: { id: 1, nome: 'Padaria do José', ativo: true }
      },
      {
        id: 2,
        descricao: 'Venda de software',
        data_vencimento: '2026-06-10',
        data_pagamento: '2026-06-09',
        valor: 80000,
        tipo: 'RECEITA',
        categoria: { id: 2, nome: 'Outros' },
        pessoa: { id: 2, nome: 'Atacado Brasil', ativo: true }
      }
    ],
    pagina: 0,
    tamanho: 5,
    total_elementos: 2,
    total_paginas: 1
  };

  beforeEach(async () => {
    mockLancamentoService = {
      listar: vi.fn().mockReturnValue(of(mockLancamentos)),
      remover: vi.fn().mockReturnValue(of(undefined))
    };

    await TestBed.configureTestingModule({
      imports: [LancamentosPesquisa],
      providers: [
        provideRouter([]),
        MessageService,
        ConfirmationService,
        { provide: LOCALE_ID, useValue: 'pt-BR' },
        { provide: LancamentoService, useValue: mockLancamentoService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LancamentosPesquisa);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve carregar os lançamentos do backend na inicialização', () => {
    expect(mockLancamentoService.listar).toHaveBeenCalled();
    expect(component.lancamentos().length).toBe(2);
    expect(component.totalRegistros()).toBe(2);
  });

  it('deve chamar pesquisar com os filtros corretos', () => {
    component.descricaoFiltro.set('Pão');
    component.pesquisar(0);

    expect(mockLancamentoService.listar).toHaveBeenCalledWith(
      expect.objectContaining({ descricao: 'Pão' }),
      expect.objectContaining({ pagina: 0, tamanho: 5 })
    );
  });
});
