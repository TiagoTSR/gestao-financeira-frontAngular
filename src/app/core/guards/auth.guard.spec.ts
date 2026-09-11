import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

describe('authGuard', () => {
  let authServiceMock: { estaAutenticado: ReturnType<typeof vi.fn> };
  let routerMock: { createUrlTree: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    authServiceMock = { estaAutenticado: vi.fn() };
    routerMock = { createUrlTree: vi.fn().mockReturnValue({} as UrlTree) };

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    });
  });

  it('deve permitir navegacao se o usuario estiver autenticado', () => {
    authServiceMock.estaAutenticado.mockReturnValue(true);

    const result = TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));
    expect(result).toBe(true);
  });

  it('deve redirecionar para /login se nao estiver autenticado', () => {
    authServiceMock.estaAutenticado.mockReturnValue(false);

    TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));
    expect(routerMock.createUrlTree).toHaveBeenCalledWith(['/login']);
  });
});