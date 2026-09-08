import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { LOCALE_ID } from '@angular/core';
import { of } from 'rxjs';

import { LancamentoCadastro } from './lancamento-cadastro';
import { LancamentoService } from '../lancamento.service';
import { CategoriaService } from '../../categorias/categoria.service';
import { PessoaService } from '../../pessoas/pessoa.service';

registerLocaleData(localePt);

describe('LancamentoCadastro', () => {
  let component: LancamentoCadastro;
  let fixture: ComponentFixture<LancamentoCadastro>;
  let mockLancamentoService: any;
  let mockCategoriaService: any;
  let mockPessoaService: any;

  beforeEach(async () => {
    mockLancamentoService = {
      buscarPorId: vi.fn().mockReturnValue(of({ id: 1, descricao: 'Aluguel', tipo: 'DESPESA', valor: 1500 })),
      criar: vi.fn().mockReturnValue(of({ id: 1 })),
      atualizar: vi.fn().mockReturnValue(of({ id: 1 }))
    };

    mockCategoriaService = {
      listar: vi.fn().mockReturnValue(of([{ id: 1, nome: 'Alimentação' }]))
    };

    mockPessoaService = {
      listarTodas: vi.fn().mockReturnValue(of({ conteudo: [{ id: 1, nome: 'João', ativo: true }] }))
    };

    await TestBed.configureTestingModule({
      imports: [LancamentoCadastro],
      providers: [
        provideRouter([]),
        { provide: LOCALE_ID, useValue: 'pt-BR' },
        { provide: LancamentoService, useValue: mockLancamentoService },
        { provide: CategoriaService, useValue: mockCategoriaService },
        { provide: PessoaService, useValue: mockPessoaService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LancamentoCadastro);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve carregar categorias e pessoas do backend na inicialização', () => {
    expect(mockCategoriaService.listar).toHaveBeenCalled();
    expect(mockPessoaService.listarTodas).toHaveBeenCalled();
    expect(component.categorias().length).toBe(1);
    expect(component.pessoas().length).toBe(1);
  });
});
