import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  exibindoMenu = signal(false);
  usuarioLogado = signal('Tiago Silva');

  alternarMenu(): void {
    this.exibindoMenu.update(valor => !valor);
  }

  fecharMenu(): void {
    this.exibindoMenu.set(false);
  }
}
