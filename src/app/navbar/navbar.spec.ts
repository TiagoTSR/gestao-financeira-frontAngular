import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { Navbar } from './navbar';
import { AuthService } from '../core/services/auth.service';

describe('Navbar', () => {
  let component: Navbar;
  let fixture: ComponentFixture<Navbar>;
  let authServiceMock: {
    usuario: ReturnType<typeof signal<string | null>>;
    estaAutenticado: ReturnType<typeof signal<boolean>>;
    logout: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    authServiceMock = {
      usuario: signal('admin'),
      estaAutenticado: signal(true),
      logout: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [Navbar],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Navbar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente navbar', () => {
    expect(component).toBeTruthy();
  });

  it('deve inicializar com o menu fechado', () => {
    expect(component.exibindoMenu()).toBe(false);
  });

  it('deve inicializar com o usuário logado correto', () => {
    expect(component.authService.usuario()).toBe('admin');
  });

  it('deve alternar o estado do menu ao chamar alternarMenu()', () => {
    component.alternarMenu();
    expect(component.exibindoMenu()).toBe(true);

    component.alternarMenu();
    expect(component.exibindoMenu()).toBe(false);
  });

  it('deve fechar o menu ao chamar fecharMenu()', () => {
    component.exibindoMenu.set(true);
    component.fecharMenu();
    expect(component.exibindoMenu()).toBe(false);
  });

  it('deve chamar AuthService.logout() ao acionar logout()', () => {
    component.logout();
    expect(authServiceMock.logout).toHaveBeenCalled();
  });
});