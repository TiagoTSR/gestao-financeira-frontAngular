import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

// PrimeNG Modules
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';

import { PessoaService } from '../pessoa.service';
import { Pessoa, PessoaFilter, PageRequest } from '../../models';

@Component({
  selector: 'app-pessoas-pesquisa',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    ButtonModule,
    InputTextModule,
    TableModule,
    TooltipModule
  ],
  templateUrl: './pessoas-pesquisa.html',
  styleUrl: './pessoas-pesquisa.scss',
})
export class PessoasPesquisa implements OnInit {
  private readonly pessoaService = inject(PessoaService);

  nomeFiltro = signal('');
  pessoas = signal<Pessoa[]>([]);
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

    const filtro: PessoaFilter = {};
    if (this.nomeFiltro()) {
      filtro.nome = this.nomeFiltro();
    }

    const paginacao: PageRequest = {
      pagina: this.paginaAtual(),
      tamanho: this.itensPorPagina()
    };

    this.pessoaService.listar(filtro, paginacao).subscribe({
      next: (resultado) => {
        this.pessoas.set(resultado.conteudo);
        this.totalRegistros.set(resultado.total_elementos);
        this.carregando.set(false);
      },
      error: (err) => {
        console.error('Erro ao listar pessoas:', err);
        this.carregando.set(false);
      }
    });
  }

  aoMudarPagina(event: any): void {
    const pagina = event.first / event.rows;
    this.itensPorPagina.set(event.rows);
    this.pesquisar(pagina);
  }

  alternarStatus(pessoa: Pessoa): void {
    if (!pessoa.id) return;

    const novoStatus = !pessoa.ativo;
    this.pessoaService.atualizarAtivo(pessoa.id, novoStatus).subscribe({
      next: () => {
        this.pessoas.update(lista =>
          lista.map(p => (p.id === pessoa.id ? { ...p, ativo: novoStatus } : p))
        );
      },
      error: (err) => console.error('Erro ao alterar status:', err)
    });
  }

  remover(pessoa: Pessoa): void {
    if (!pessoa.id) return;
    if (confirm(`Deseja realmente excluir a pessoa "${pessoa.nome}"?`)) {
      this.pessoaService.remover(pessoa.id).subscribe({
        next: () => {
          this.pesquisar(this.paginaAtual());
        },
        error: (err) => console.error('Erro ao excluir pessoa:', err)
      });
    }
  }
}