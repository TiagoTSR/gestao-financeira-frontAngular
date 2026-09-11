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

  usuario = '';
  senha = '';
  submetido = signal(false);
  carregando = signal(false);
  erro = signal<string | null>(null);

  entrar(form: NgForm): void {
    this.submetido.set(true);
    this.erro.set(null);

    if (form.invalid || !this.usuario.trim() || !this.senha.trim()) {
      return;
    }

    this.carregando.set(true);
    this.authService.login(this.usuario.trim(), this.senha.trim()).subscribe({
      next: () => {
        this.carregando.set(false);
        this.router.navigate(['/lancamentos']);
      },
      error: () => {
        this.carregando.set(false);
        this.erro.set('Usuário ou senha inválidos. Verifique suas credenciais.');
      }
    });
  }
}