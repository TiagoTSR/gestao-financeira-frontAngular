import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { PessoasPesquisa } from './pessoas-pesquisa';

describe('PessoasPesquisa', () => {
  let component: PessoasPesquisa;
  let fixture: ComponentFixture<PessoasPesquisa>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PessoasPesquisa]
    }).compileComponents();

    fixture = TestBed.createComponent(PessoasPesquisa);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve inicializar com 6 pessoas na lista', () => {
    expect(component.pessoas().length).toBe(6);
  });

  it('deve inicializar o filtro de nome vazio', () => {
    expect(component.nomeFiltro()).toBe('');
  });

  it('deve atualizar o filtro de nome', () => {
    component.nomeFiltro.set('Manoel');
    expect(component.nomeFiltro()).toBe('Manoel');
  });

  it('deve chamar o método pesquisar sem erros', () => {
    const consoleSpy = vi.spyOn(console, 'log');
    component.nomeFiltro.set('Carla');
    component.pesquisar();

    expect(consoleSpy).toHaveBeenCalledWith('Pesquisando pessoas por nome:', 'Carla');
    consoleSpy.mockRestore();
  });

  it('deve alternar o status da pessoa entre Ativo e Inativo', () => {
    const primeiraPessoa = component.pessoas()[0];
    expect(primeiraPessoa.ativo).toBe(true);

    component.alternarStatus(primeiraPessoa);
    expect(component.pessoas()[0].ativo).toBe(false);

    component.alternarStatus(component.pessoas()[0]);
    expect(component.pessoas()[0].ativo).toBe(true);
  });

  it('deve renderizar o título da página no template', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const titleElement = compiled.querySelector('h1');
    expect(titleElement?.textContent?.trim()).toBe('Pessoas');
  });

  it('deve renderizar os cabeçalhos da tabela corretamente', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const headers = compiled.querySelectorAll('th');
    const headerTexts = Array.from(headers).map((th) => th.textContent?.trim());

    expect(headerTexts).toEqual([
      'Nome',
      'Cidade',
      'Estado',
      'Status',
      'Ações'
    ]);
  });

  it('deve renderizar 5 linhas na tabela respeitando a paginação inicial', () => {
    const rows = fixture.debugElement.queryAll(By.css('.p-datatable-tbody > tr'));
    expect(rows.length).toBe(5);
  });

  it('deve aplicar classe status-ativo para pessoas ativas e status-inativo para inativas', () => {
    // Primeira pessoa é Ativo ('Manoel Pinheiro')
    const firstRowStatus = fixture.debugElement.query(
      By.css('.p-datatable-tbody > tr:first-child td a')
    );
    expect(firstRowStatus.nativeElement.classList).toContain('status-ativo');
    expect(firstRowStatus.nativeElement.textContent.trim()).toBe('Ativo');

    // Segunda pessoa é Inativo ('Sebastião da Silva')
    const secondRowStatus = fixture.debugElement.query(
      By.css('.p-datatable-tbody > tr:nth-child(2) td a')
    );
    expect(secondRowStatus.nativeElement.classList).toContain('status-inativo');
    expect(secondRowStatus.nativeElement.textContent.trim()).toBe('Inativo');
  });

  it('deve alternar status ao clicar no link de status da tabela', () => {
    const firstRowStatusLink = fixture.debugElement.query(
      By.css('.p-datatable-tbody > tr:first-child td a')
    );
    expect(firstRowStatusLink.nativeElement.textContent.trim()).toBe('Ativo');

    firstRowStatusLink.nativeElement.click();
    fixture.detectChanges();

    const updatedFirstRowStatusLink = fixture.debugElement.query(
      By.css('.p-datatable-tbody > tr:first-child td a')
    );
    expect(updatedFirstRowStatusLink.nativeElement.textContent.trim()).toBe('Inativo');
    expect(updatedFirstRowStatusLink.nativeElement.classList).toContain('status-inativo');
  });

  it('deve renderizar os botões de ação (editar e excluir) nas linhas', () => {
    const editButtons = fixture.debugElement.queryAll(By.css('button[icon="pi pi-pencil"]'));
    const deleteButtons = fixture.debugElement.queryAll(By.css('button[icon="pi pi-trash"]'));

    expect(editButtons.length).toBeGreaterThan(0);
    expect(deleteButtons.length).toBeGreaterThan(0);
  });
});
