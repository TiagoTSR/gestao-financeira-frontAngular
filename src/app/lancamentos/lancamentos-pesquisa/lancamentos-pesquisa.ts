import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

// PrimeNG Modules
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { TagModule } from 'primeng/tag';
import { SelectModule } from 'primeng/select';

import { ConfirmationService, MessageService } from 'primeng/api';

import { LancamentoService } from '../lancamento.service';
import { Lancamento, LancamentoFilter, PageRequest, StatusLancamento } from '../../models';

@Component({
  selector: 'app-lancamentos-pesquisa',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    ButtonModule,
    InputTextModule,
    TableModule,
    TooltipModule,
    TagModule,
    SelectModule,
    CurrencyPipe,
    DatePipe
  ],
  templateUrl: './lancamentos-pesquisa.html',
  styleUrl: './lancamentos-pesquisa.scss',
})
export class LancamentosPesquisa implements OnInit {
  private readonly lancamentoService = inject(LancamentoService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);

  descricaoFiltro = signal('');
  dataVencimentoDe = signal('');
  dataVencimentoAte = signal('');
  statusFiltro = signal<string>('');

  readonly statusOpcoes = [
    { label: 'Todos os Status', value: '' },
    { label: 'Pendente', value: 'PENDENTE' },
    { label: 'Pago', value: 'PAGO' },
    { label: 'Recebido', value: 'RECEBIDO' },
    { label: 'Cancelado', value: 'CANCELADO' }
  ];

  lancamentos = signal<Lancamento[]>([]);
  totalRegistros = signal(0);
  itensPorPagina = signal(5);
  paginaAtual = signal(0);
  carregando = signal(false);

  ngOnInit(): void {
    this.pesquisar();
  }

  pesquisar(pagina = 0): void {
    this.paginaAtual.set(pagina);
    this.carregando.set(true);

    const filtro: LancamentoFilter = {};
    if (this.descricaoFiltro()) {
      filtro.descricao = this.descricaoFiltro();
    }
    if (this.dataVencimentoDe()) {
      filtro.data_vencimento_de = this.dataVencimentoDe();
    }
    if (this.dataVencimentoAte()) {
      filtro.data_vencimento_ate = this.dataVencimentoAte();
    }
    if (this.statusFiltro()) {
      filtro.status = this.statusFiltro() as StatusLancamento;
    }

    const paginacao: PageRequest = {
      pagina: this.paginaAtual(),
      tamanho: this.itensPorPagina()
    };

    this.lancamentoService.listar(filtro, paginacao).subscribe({
      next: (resultado) => {
        this.lancamentos.set(resultado.conteudo);
        this.totalRegistros.set(resultado.total_elementos);
        this.carregando.set(false);
      },
      error: (err) => {
        console.error('Erro ao listar lançamentos:', err);
        this.carregando.set(false);
        const mensagem = err.error?.mensagem || 'Não foi possível carregar os lançamentos.';
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: mensagem
        });
      }
    });
  }

  aoMudarPagina(event: any): void {
    const pagina = event.first / event.rows;
    this.itensPorPagina.set(event.rows);
    this.pesquisar(pagina);
  }

  obterStatusSeverity(lancamento: Lancamento): 'warn' | 'success' | 'danger' | 'info' {
    const status = lancamento.status || (lancamento.data_pagamento ? (lancamento.tipo === 'RECEITA' ? 'RECEBIDO' : 'PAGO') : 'PENDENTE');
    if (status === 'PAGO' || status === 'RECEBIDO') return 'success';
    if (status === 'CANCELADO') return 'danger';
    return 'warn';
  }

  obterStatusLabel(lancamento: Lancamento): string {
    const status = lancamento.status || (lancamento.data_pagamento ? (lancamento.tipo === 'RECEITA' ? 'RECEBIDO' : 'PAGO') : 'PENDENTE');
    if (status === 'PAGO') return 'Pago';
    if (status === 'RECEBIDO') return 'Recebido';
    if (status === 'CANCELADO') return 'Cancelado';
    return 'Pendente';
  }

  quitar(lancamento: Lancamento): void {
    if (!lancamento.id) return;
    this.lancamentoService.quitar(lancamento.id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: `Lançamento "${lancamento.descricao}" baixado com sucesso!`
        });
        this.pesquisar(this.paginaAtual());
      },
      error: (err) => {
        console.error('Erro ao dar baixa:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível dar baixa no lançamento.'
        });
      }
    });
  }

  reabrir(lancamento: Lancamento): void {
    if (!lancamento.id) return;
    this.lancamentoService.reabrir(lancamento.id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Reaberto',
          detail: `Lançamento "${lancamento.descricao}" reaberto como pendente.`
        });
        this.pesquisar(this.paginaAtual());
      },
      error: (err) => {
        console.error('Erro ao reabrir lançamento:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível reabrir o lançamento.'
        });
      }
    });
  }

  cancelar(lancamento: Lancamento): void {
    if (!lancamento.id) return;
    this.confirmationService.confirm({
      message: `Deseja realmente cancelar o lançamento "${lancamento.descricao}"?`,
      header: 'Confirmação de Cancelamento',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.lancamentoService.cancelar(lancamento.id!).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'warn',
              summary: 'Cancelado',
              detail: `Lançamento "${lancamento.descricao}" cancelado com sucesso.`
            });
            this.pesquisar(this.paginaAtual());
          },
          error: (err) => {
            console.error('Erro ao cancelar:', err);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Não foi possível cancelar o lançamento.'
            });
          }
        });
      }
    });
  }

  remover(lancamento: Lancamento): void {
    if (!lancamento.id) return;

    this.confirmationService.confirm({
      message: `Deseja realmente excluir o lançamento "${lancamento.descricao}"?`,
      header: 'Confirmação de Exclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.lancamentoService.remover(lancamento.id!).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Excluído',
              detail: 'Lançamento excluído com sucesso!'
            });
            this.pesquisar(this.paginaAtual());
          },
          error: (err) => {
            console.error('Erro ao excluir lançamento:', err);
            const mensagem = err.error?.mensagem || 'Não foi possível excluir o lançamento.';
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: mensagem
            });
          }
        });
      }
    });
  }
}