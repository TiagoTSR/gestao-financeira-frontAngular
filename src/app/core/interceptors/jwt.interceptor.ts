import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  // Se a requisição já possui Authorization explicitamente configurada (ex: login/testes), preserva
  if (req.headers.has('Authorization')) {
    return next(req);
  }

  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  const authReq = token
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      })
    : req;

  return next(authReq).pipe(
    catchError((error) => {
      if (error.status === 401) {
        if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
          localStorage.removeItem('access_token');
          localStorage.removeItem('usuario_logado');
          localStorage.removeItem('basic_auth');
          router.navigate(['/login']);
        }
      }
      return throwError(() => error);
    })
  );
};

// Exporta também com o alias basicAuthInterceptor para compatibilidade
export const basicAuthInterceptor = jwtInterceptor;
