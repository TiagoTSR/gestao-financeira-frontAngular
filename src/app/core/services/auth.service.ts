import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

export interface UsuarioLogado {
  nome: string;
  email: string;
  permissoes: string[];
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  nome: string;
  email: string;
  permissoes: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly apiUrl = 'http://localhost:8080';

  readonly usuario = signal<UsuarioLogado | null>(null);
  readonly token = signal<string | null>(null);
  readonly estaAutenticado = computed(() => !!this.token() && !!this.usuario());
  readonly nomeUsuario = computed(() => this.usuario()?.nome || this.usuario()?.email || 'Usuário');

  constructor() {
    this.carregarSessao();
  }

  carregarSessao(): void {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('access_token');
      const storedUser = localStorage.getItem('usuario_logado');
      if (storedToken && storedUser) {
        try {
          const userObj: UsuarioLogado = JSON.parse(storedUser);
          this.token.set(storedToken);
          this.usuario.set(userObj);
        } catch {
          localStorage.removeItem('access_token');
          localStorage.removeItem('usuario_logado');
        }
      }
    }
  }

  login(email: string, pass: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, {
      email: email.trim(),
      senha: pass.trim()
    }).pipe(
      tap((res) => {
        const userObj: UsuarioLogado = {
          nome: res.nome,
          email: res.email,
          permissoes: res.permissoes || []
        };

        if (typeof window !== 'undefined') {
          localStorage.setItem('access_token', res.access_token);
          localStorage.setItem('usuario_logado', JSON.stringify(userObj));
        }

        this.token.set(res.access_token);
        this.usuario.set(userObj);
      })
    );
  }

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('usuario_logado');
      localStorage.removeItem('basic_auth');
    }
    this.token.set(null);
    this.usuario.set(null);
    this.router.navigate(['/login']);
  }

  temPermissao(role: string): boolean {
    return this.usuario()?.permissoes?.includes(role) ?? false;
  }
}