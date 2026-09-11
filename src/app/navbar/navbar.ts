import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  readonly authService = inject(AuthService);

  exibindoMenu = signal(false);

  alternarMenu(): void {
    this.exibindoMenu.update(valor => !valor);
  }

  fecharMenu(): void {
    this.exibindoMenu.set(false);
  }

  logout(): void {
    this.fecharMenu();
    this.authService.logout();
  }
}