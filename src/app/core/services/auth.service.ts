import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly apiUrl = 'http://localhost:8080';

  readonly usuario = signal<string | null>(null);
  readonly estaAutenticado = computed(() => !!this.usuario());

  constructor() {
    this.carregarSessao();
  }

  carregarSessao(): void {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('usuario_logado');
      const storedAuth = localStorage.getItem('basic_auth');
      if (storedUser && storedAuth) {
        this.usuario.set(storedUser);
      }
    }
  }

  login(user: string, pass: string): Observable<unknown> {
    const credentials = btoa(`${user}:${pass}`);
    const headers = new HttpHeaders({
      Authorization: `Basic ${credentials}`
    });

    return this.http.get(`${this.apiUrl}/categorias`, {
      headers,
      params: { pagina: 0, tamanho: 1 }
    }).pipe(
      tap(() => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('basic_auth', credentials);
          localStorage.setItem('usuario_logado', user);
        }
        this.usuario.set(user);
      })
    );
  }

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('basic_auth');
      localStorage.removeItem('usuario_logado');
    }
    this.usuario.set(null);
    this.router.navigate(['/login']);
  }
}