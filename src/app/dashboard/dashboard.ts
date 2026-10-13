import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

// PrimeNG Modules
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TableModule } from 'primeng/table';

import { DashboardService } from './dashboard.service';
import { DashboardResumo } from '../models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ButtonModule,
    TagModule,
    TableModule,
    CurrencyPipe,
    DatePipe
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  private readonly dashboardService = inject(DashboardService);

  dashboard = signal<DashboardResumo | null>(null);
  carregando = signal(true);
  erro = signal<string | null>(null);

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.carregando.set(true);
    this.erro.set(null);

    this.dashboardService.obterDashboard().subscribe({
      next: (dados) => {
        this.dashboard.set(dados);
        this.carregando.set(false);
      },
      error: (err) => {
        console.error('Erro ao carregar dashboard:', err);
        this.erro.set('Não foi possível carregar os dados financeiros no momento.');
        this.carregando.set(false);
      }
    });
  }
}
