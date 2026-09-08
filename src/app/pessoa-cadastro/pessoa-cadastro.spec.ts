import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PessoaCadastro } from './pessoa-cadastro';

describe('PessoaCadastro', () => {
  let component: PessoaCadastro;
  let fixture: ComponentFixture<PessoaCadastro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PessoaCadastro]
    }).compileComponents();

    fixture = TestBed.createComponent(PessoaCadastro);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve inicializar com o formulário padrão limpo', () => {
    expect(component.pessoa().nome).toBe('');
    expect(component.pessoa().ativo).toBe(true);
  });

  it('deve resetar o formulário ao chamar novo()', () => {
    component.pessoa.set({
      nome: 'Carlos Silva',
      logradouro: 'Rua A',
      numero: '10',
      complemento: '',
      bairro: 'Centro',
      cep: '12345-678',
      cidade: 'São Paulo',
      estado: 'SP',
      ativo: true
    });

    component.novo();

    expect(component.pessoa().nome).toBe('');
    expect(component.pessoa().logradouro).toBe('');
  });

  it('deve chamar o método salvar sem erros', () => {
    const consoleSpy = vi.spyOn(console, 'log');
    component.salvar();
    expect(consoleSpy).toHaveBeenCalledWith('Salvando pessoa:', component.pessoa());
    consoleSpy.mockRestore();
  });

  it('deve chamar o método voltar sem erros', () => {
    const consoleSpy = vi.spyOn(console, 'log');
    component.voltar();
    expect(consoleSpy).toHaveBeenCalledWith('Voltando para listagem de pessoas...');
    consoleSpy.mockRestore();
  });

  it('deve renderizar o título da página no template', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const titleElement = compiled.querySelector('h1');
    expect(titleElement?.textContent?.trim()).toBe('Nova Pessoa');
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
