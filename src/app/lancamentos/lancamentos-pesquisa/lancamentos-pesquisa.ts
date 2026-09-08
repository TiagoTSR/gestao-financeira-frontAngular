import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

// PrimeNG Modules
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';

import { LancamentoService } from '../lancamento.service';
import { Lancamento, LancamentoFilter, PageRequest } from '../../models';

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
    CurrencyPipe,
    DatePipe
  ],
  templateUrl: './lancamentos-pesquisa.html',
  styleUrl: './lancamentos-pesquisa.scss',
})
export class LancamentosPesquisa implements OnInit {
  private readonly lancamentoService = inject(LancamentoService);

  descricaoFiltro = signal('');
  dataVencimentoDe = signal('');
  dataVencimentoAte = signal('');

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
      }
    });
  }

  aoMudarPagina(event: any): void {
    const pagina = event.first / event.rows;
    this.itensPorPagina.set(event.rows);
    this.pesquisar(pagina);
  }

  remover(lancamento: Lancamento): void {
    if (!lancamento.id) return;
    if (confirm(`Deseja realmente excluir o lançamento "${lancamento.descricao}"?`)) {
      this.lancamentoService.remover(lancamento.id).subscribe({
        next: () => {
          this.pesquisar(this.paginaAtual());
        },
        error: (err) => {
          console.error('Erro ao excluir lançamento:', err);
        }
      });
    }
  }
}