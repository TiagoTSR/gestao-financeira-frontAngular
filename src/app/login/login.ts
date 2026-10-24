import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FluidModule } from 'primeng/fluid';

import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    FluidModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  email = '';
  senha = '';

  modoCadastro = signal(false);
  novoUsername = '';
  novoEmail = '';
  novaSenha = '';

  submetido = signal(false);
  carregando = signal(false);
  erro = signal<string | null>(null);
  sucesso = signal<string | null>(null);
  mostrarSenha = signal(false);
  mostrarNovaSenha = signal(false);

  alternarMostrarSenha(): void {
    this.mostrarSenha.update(v => !v);
  }

  alternarMostrarNovaSenha(): void {
    this.mostrarNovaSenha.update(v => !v);
  }

  alternarModo(): void {
    this.modoCadastro.set(!this.modoCadastro());
    this.erro.set(null);
    this.sucesso.set(null);
    this.submetido.set(false);
    this.mostrarSenha.set(false);
    this.mostrarNovaSenha.set(false);
  }

  entrar(form: NgForm): void {
    this.submetido.set(true);
    this.erro.set(null);
    this.sucesso.set(null);

    if (form.invalid || !this.email.trim() || !this.senha.trim()) {
      return;
    }

    this.carregando.set(true);
    this.authService.login(this.email.trim(), this.senha.trim()).subscribe({
      next: () => {
        this.carregando.set(false);
        this.router.navigate(['/lancamentos']);
      },
      error: () => {
        this.carregando.set(false);
        this.erro.set('E-mail ou senha inv\u00e1lidos. Verifique suas credenciais.');
      }
    });
  }

  cadastrar(form: NgForm): void {
    this.submetido.set(true);
    this.erro.set(null);
    this.sucesso.set(null);

    if (form.invalid || !this.novoUsername.trim() || !this.novoEmail.trim() || !this.novaSenha.trim()) {
      return;
    }

    this.carregando.set(true);
    this.authService.cadastrar(this.novoUsername.trim(), this.novoEmail.trim(), this.novaSenha.trim()).subscribe({
      next: () => {
        this.carregando.set(false);
        this.sucesso.set('Usu\u00e1rio cadastrado com sucesso! Fa\u00e7a seu login abaixo.');
        this.email = this.novoEmail.trim();
        this.senha = '';
        this.modoCadastro.set(false);
        this.submetido.set(false);
      },
      error: (err: any) => {
        this.carregando.set(false);
        const msg = err.error?.message || 'Erro ao cadastrar usu\u00e1rio. Verifique se o e-mail ou username j\u00e1 existem.';
        this.erro.set(msg);
      }
    });
  }
}
