import { HttpInterceptorFn } from '@angular/common/http';

export const basicAuthInterceptor: HttpInterceptorFn = (req, next) => {
  // Se a requisicao ja possui Authorization explicitamente configurada (ex: chamada de login), preserva
  if (req.headers.has('Authorization')) {
    return next(req);
  }

  const storedAuth = typeof window !== 'undefined' ? localStorage.getItem('basic_auth') : null;
  if (storedAuth) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Basic ${storedAuth}`
      }
    });
    return next(authReq);
  }

  return next(req);
};