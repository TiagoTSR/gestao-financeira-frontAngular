import { ComponentFixture, TestBed } from '@angular/core/testing';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { LOCALE_ID } from '@angular/core';

import { LancamentoCadastro } from './lancamento-cadastro';

registerLocaleData(localePt);

describe('LancamentoCadastro', () => {
  let component: LancamentoCadastro;
  let fixture: ComponentFixture<LancamentoCadastro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LancamentoCadastro],
      providers: [{ provide: LOCALE_ID, useValue: 'pt-BR' }]
    }).compileComponents();

    fixture = TestBed.createComponent(LancamentoCadastro);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve inicializar com o tipo padrão DESPESA', () => {
    expect(component.lancamento().tipo).toBe('DESPESA');
  });

  it('deve carregar as listas de categorias e pessoas', () => {
    expect(component.categorias.length).toBeGreaterThan(0);
    expect(component.pessoas.length).toBeGreaterThan(0);
  });

  it('deve chamar o método salvar sem erros', () => {
    const consoleSpy = vi.spyOn(console, 'log');
    component.salvar();
    expect(consoleSpy).toHaveBeenCalledWith('Salvando lançamento:', component.lancamento());
    consoleSpy.mockRestore();
  });

  it('deve resetar o formulário ao chamar novo()', () => {
    component.lancamento.set({
      tipo: 'RECEITA',
      dataVencimento: new Date(),
      dataPagamento: new Date(),
      descricao: 'Venda de carro',
      valor: 50000,
      categoriaId: 1,
      pessoaId: 4,
      observacao: 'À vista'
    });

    component.novo();

    expect(component.lancamento().tipo).toBe('DESPESA');
    expect(component.lancamento().descricao).toBe('');
    expect(component.lancamento().valor).toBeNull();
  });

  it('deve chamar o método voltar sem erros', () => {
    const consoleSpy = vi.spyOn(console, 'log');
    component.voltar();
    expect(consoleSpy).toHaveBeenCalledWith('Voltando para listagem...');
    consoleSpy.mockRestore();
  });

  it('deve renderizar o título da página no template', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const titleElement = compiled.querySelector('h1');
    expect(titleElement?.textContent?.trim()).toBe('Novo Lançamento');
  });

  it('deve renderizar os botões Salvar, Novo e Voltar', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const buttons = compiled.querySelectorAll('button');
    const buttonTexts = Array.from(buttons).map((btn) => btn.textContent?.trim());

    expect(buttonTexts.some((text) => text.includes('Salvar'))).toBe(true);
    expect(buttonTexts.some((text) => text.includes('Novo'))).toBe(true);
    expect(buttonTexts.some((text) => text.includes('Voltar'))).toBe(true);
  });
});
