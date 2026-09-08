import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { LOCALE_ID } from '@angular/core';

import { LancamentosPesquisa } from './lancamentos-pesquisa';

registerLocaleData(localePt);

describe('LancamentosPesquisa', () => {
  let component: LancamentosPesquisa;
  let fixture: ComponentFixture<LancamentosPesquisa>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LancamentosPesquisa],
      providers: [{ provide: LOCALE_ID, useValue: 'pt-BR' }]
    }).compileComponents();

    fixture = TestBed.createComponent(LancamentosPesquisa);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve inicializar com 7 lançamentos na lista', () => {
    expect(component.lancamentos().length).toBe(7);
  });

  it('deve inicializar o filtro de descrição vazio', () => {
    expect(component.descricaoFiltro()).toBe('');
  });

  it('deve atualizar o filtro de descrição', () => {
    component.descricaoFiltro.set('Salário');
    expect(component.descricaoFiltro()).toBe('Salário');
  });

  it('deve chamar o método pesquisar sem erros', () => {
    const consoleSpy = vi.spyOn(console, 'log');
    component.descricaoFiltro.set('Pão');
    component.pesquisar();

    expect(consoleSpy).toHaveBeenCalledWith('Pesquisando por:', 'Pão');
    consoleSpy.mockRestore();
  });

  it('deve renderizar o título da página no template', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const titleElement = compiled.querySelector('h1');
    expect(titleElement?.textContent?.trim()).toBe('Lançamentos');
  });

  it('deve renderizar os cabeçalhos da tabela corretamente', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const headers = compiled.querySelectorAll('th');
    const headerTexts = Array.from(headers).map((th) => th.textContent?.trim());

    expect(headerTexts).toEqual([
      'Pessoa',
      'Descrição',
      'Vencimento',
      'Pagamento',
      'Valor',
      'Ações'
    ]);
  });

  it('deve renderizar 5 linhas na tabela respeitando a paginação inicial', () => {
    const rows = fixture.debugElement.queryAll(By.css('.p-datatable-tbody > tr'));
    expect(rows.length).toBe(5);
  });

  it('deve aplicar classe text-danger para despesa e text-success para receita', () => {
    // Primeiro lançamento da lista é uma DESPESA ('Compra de pão')
    const firstRowValueCell = fixture.debugElement.query(
      By.css('.p-datatable-tbody > tr:first-child td.text-right')
    );
    expect(firstRowValueCell.nativeElement.classList).toContain('text-danger');

    // Segundo lançamento é uma RECEITA ('Venda de software')
    const secondRowValueCell = fixture.debugElement.query(
      By.css('.p-datatable-tbody > tr:nth-child(2) td.text-right')
    );
    expect(secondRowValueCell.nativeElement.classList).toContain('text-success');
  });

  it('deve renderizar os botões de ação (editar e excluir) nas linhas', () => {
    const editButtons = fixture.debugElement.queryAll(By.css('button[icon="pi pi-pencil"]'));
    const deleteButtons = fixture.debugElement.queryAll(By.css('button[icon="pi pi-trash"]'));

    expect(editButtons.length).toBeGreaterThan(0);
    expect(deleteButtons.length).toBeGreaterThan(0);
  });
});
