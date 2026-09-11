import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login';
import { AuthService } from '../core/services/auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceMock: { login: ReturnType<typeof vi.fn> };
  let routerSpy: { navigate: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    authServiceMock = {
      login: vi.fn().mockReturnValue(of({}))
    };
    routerSpy = { navigate: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [LoginComponent, FormsModule],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente de login', () => {
    expect(component).toBeTruthy();
  });

  it('deve chamar AuthService.login e redirecionar para /lancamentos no sucesso', async () => {
    component.usuario = 'admin';
    component.senha = 'admin';

    const formMock = { invalid: false } as any;
    component.entrar(formMock);

    expect(authServiceMock.login).toHaveBeenCalledWith('admin', 'admin');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/lancamentos']);
  });

  it('deve exibir mensagem de erro quando AuthService.login falhar', () => {
    authServiceMock.login.mockReturnValue(throwError(() => new Error('401 Unauthorized')));

    component.usuario = 'admin';
    component.senha = 'senha_errada';

    const formMock = { invalid: false } as any;
    component.entrar(formMock);

    expect(component.erro()).toBe('Usuário ou senha inválidos. Verifique suas credenciais.');
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });
});