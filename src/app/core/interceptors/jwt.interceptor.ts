import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

function getXsrfToken(): string | null {
  if (typeof document === 'undefined') {
    return null;
  }
  const match = document.cookie.match(/(^|;\s*)XSRF-TOKEN=([^;]+)/);
  return match ? decodeURIComponent(match[2]) : null;
}

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Não intercepta Authorization nas rotas de autenticação, mas inclui credenciais para cookies HttpOnly e CSRF
  if (req.url.includes('/login') || req.url.includes('/auth/refresh')) {
    return next(req.clone({ withCredentials: true }));
  }

  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  const headers: Record<string, string> = {};

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Anexa o token CSRF em requisições mutativas
  const xsrfToken = getXsrfToken();
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
              const retryXsrf = getXsrfToken();
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
