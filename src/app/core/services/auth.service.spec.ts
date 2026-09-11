import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let routerSpy: { navigate: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    routerSpy = { navigate: vi.fn() };
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Router, useValue: routerSpy }
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('deve inicializar desautenticado quando localStorage estiver vazio', () => {
    expect(service.estaAutenticado()).toBe(false);
    expect(service.usuario()).toBeNull();
  });

  it('deve autenticar com sucesso no login e salvar credenciais', () => {
    service.login('admin', 'admin').subscribe();

    const req = httpMock.expectOne(req => req.url.includes('/categorias'));
    expect(req.request.headers.get('Authorization')).toBe(`Basic ${btoa('admin:admin')}`);
    req.flush({ conteudo: [], total_elementos: 0 });

    expect(service.estaAutenticado()).toBe(true);
    expect(service.usuario()).toBe('admin');
    expect(localStorage.getItem('usuario_logado')).toBe('admin');
    expect(localStorage.getItem('basic_auth')).toBe(btoa('admin:admin'));
  });

  it('deve limpar as credenciais e redirecionar para /login no logout', () => {
    localStorage.setItem('usuario_logado', 'admin');
    localStorage.setItem('basic_auth', btoa('admin:admin'));
    service.carregarSessao();

    service.logout();

    expect(service.estaAutenticado()).toBe(false);
    expect(service.usuario()).toBeNull();
    expect(localStorage.getItem('usuario_logado')).toBeNull();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });
});