import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Não intercepta Authorization nas rotas de autenticação, mas inclui credenciais e token CSRF se presente
  if (req.url.includes('/login') || req.url.includes('/auth/refresh')) {
    const authHeaders: Record<string, string> = {};
    const authXsrf = authService.obterTokenCsrf();
    if (authXsrf) {
      authHeaders['X-XSRF-TOKEN'] = authXsrf;
    }
    return next(req.clone({ withCredentials: true, setHeaders: authHeaders }));
  }

  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  const headers: Record<string, string> = {};

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Anexa o token CSRF em requisições mutativas
  const xsrfToken = authService.obterTokenCsrf();
  if (xsrfToken && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method.toUpperCase())) {
    headers['X-XSRF-TOKEN'] = xsrfToken;
  }

  const authReq = req.clone({
    withCredentials: true,
    setHeaders: headers
  });

  return next(authReq).pipe(
    catchError((error) => {
      if (error.status === 401) {
        return authService.renovarToken().pipe(
          switchMap((res) => {
            if (res && res.access_token) {
              const retryHeaders: Record<string, string> = {
                Authorization: `Bearer ${res.access_token}`
              };
              const retryXsrf = authService.obterTokenCsrf();
              if (retryXsrf && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method.toUpperCase())) {
                retryHeaders['X-XSRF-TOKEN'] = retryXsrf;
              }

              const retryReq = req.clone({
                withCredentials: true,
                setHeaders: retryHeaders
              });
              return next(retryReq);
            }
            if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
              router.navigate(['/login']);
            }
            return throwError(() => error);
          })
        );
      }
      return throwError(() => error);
    })
  );
};

export const basicAuthInterceptor = jwtInterceptor;
