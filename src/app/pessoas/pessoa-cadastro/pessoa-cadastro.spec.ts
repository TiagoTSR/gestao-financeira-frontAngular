import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { PessoaCadastro } from './pessoa-cadastro';
import { PessoaService } from '../pessoa.service';

describe('PessoaCadastro', () => {
  let component: PessoaCadastro;
  let fixture: ComponentFixture<PessoaCadastro>;
  let mockPessoaService: any;

  beforeEach(async () => {
    mockPessoaService = {
      buscarPorId: vi.fn().mockReturnValue(of({ id: 1, nome: 'João', ativo: true })),
      criar: vi.fn().mockReturnValue(of({ id: 1 })),
      atualizar: vi.fn().mockReturnValue(of({ id: 1 }))
    };

    await TestBed.configureTestingModule({
      imports: [PessoaCadastro],
      providers: [
        provideRouter([]),
        { provide: PessoaService, useValue: mockPessoaService }
      ]
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
    expect(component.pessoa.nome).toBe('');
    expect(component.pessoa.ativo).toBe(true);
  });
});
