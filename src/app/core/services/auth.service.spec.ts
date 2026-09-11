import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthService, LoginResponse } from './auth.service';

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

  it('deve autenticar com sucesso no login e salvar credenciais JWT', () => {
    const mockResponse: LoginResponse = {
      access_token: 'fake.jwt.token',
      token_type: 'Bearer',
      nome: 'Administrador',
      email: 'admin@example.com',
      permissoes: ['ROLE_CADASTRAR_CATEGORIA']
    };

    service.login('admin@example.com', 'admin').subscribe((res) => {
      expect(res.access_token).toBe('fake.jwt.token');
    });

    const req = httpMock.expectOne(req => req.url.includes('/login'));
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email: 'admin@example.com', senha: 'admin' });
    req.flush(mockResponse);

    expect(service.estaAutenticado()).toBe(true);
    expect(service.usuario()?.nome).toBe('Administrador');
    expect(service.usuario()?.email).toBe('admin@example.com');
    expect(service.token()).toBe('fake.jwt.token');
    expect(localStorage.getItem('access_token')).toBe('fake.jwt.token');
    expect(localStorage.getItem('usuario_logado')).toContain('Administrador');
  });

  it('deve limpar as credenciais e redirecionar para /login no logout', () => {
    localStorage.setItem(
      'usuario_logado',
      JSON.stringify({ nome: 'Administrador', email: 'admin@example.com', permissoes: [] })
    );
    localStorage.setItem('access_token', 'token_123');
    service.carregarSessao();

    service.logout();

    const req = httpMock.expectOne('http://localhost:8080/auth/logout');
    expect(req.request.method).toBe('POST');
    req.flush({});

    expect(service.estaAutenticado()).toBe(false);
    expect(service.usuario()).toBeNull();
    expect(service.token()).toBeNull();
    expect(localStorage.getItem('access_token')).toBeNull();
    expect(localStorage.getItem('usuario_logado')).toBeNull();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });
});