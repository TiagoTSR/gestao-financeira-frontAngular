import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Não intercepta rotas de autenticação
  if (req.url.includes('/login') || req.url.includes('/auth/refresh')) {
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
        return authService.renovarToken().pipe(
          switchMap((res) => {
            if (res && res.access_token) {
              const retryReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${res.access_token}`
                }
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
