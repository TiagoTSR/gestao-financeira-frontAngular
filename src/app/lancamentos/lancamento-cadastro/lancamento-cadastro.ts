import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

// PrimeNG Modules
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { TooltipModule } from 'primeng/tooltip';
import { FluidModule } from 'primeng/fluid';

import { LancamentoService } from '../lancamento.service';
import { CategoriaService } from '../../categorias/categoria.service';
import { PessoaService } from '../../pessoas/pessoa.service';
import {
  Categoria,
  Pessoa,
  CriarLancamentoRequest,
  AtualizarLancamentoRequest,
  TipoLancamento
} from '../../models';

export interface LancamentoFormModel {
  id?: number;
  tipo: TipoLancamento;
  dataVencimento: Date | null;
  dataPagamento: Date | null;
  descricao: string;
  valor: number | null;
  categoriaId: number | null;
  pessoaId: number | null;
  observacao: string;
}

@Component({
  selector: 'app-lancamento-cadastro',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    SelectButtonModule,
    DatePickerModule,
    SelectModule,
    TextareaModule,
    TooltipModule,
    FluidModule
  ],
  templateUrl: './lancamento-cadastro.html',
  styleUrl: './lancamento-cadastro.scss',
})
export class LancamentoCadastro implements OnInit {
  private readonly lancamentoService = inject(LancamentoService);
  private readonly categoriaService = inject(CategoriaService);
  private readonly pessoaService = inject(PessoaService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  tipos = [
    { label: 'Receita', value: 'RECEITA' },
    { label: 'Despesa', value: 'DESPESA' },
  ];

  categorias = signal<{ label: string; value: number }[]>([]);
  pessoas = signal<{ label: string; value: number }[]>([]);

  lancamento = signal<LancamentoFormModel>({
    tipo: 'DESPESA',
    dataVencimento: null,
    dataPagamento: null,
    descricao: '',
    valor: null,
    categoriaId: null,
    pessoaId: null,
    observacao: ''
  });

  editando = signal(false);

  ngOnInit(): void {
    this.carregarCategorias();
    this.carregarPessoas();

    const id = this.route.snapshot.params['id'];
    if (id) {
      this.editando.set(true);
      this.carregarLancamento(+id);
    }
  }

  carregarCategorias(): void {
    this.categoriaService.listar().subscribe({
      next: (dados) => {
        const formatadas = dados.map(c => ({ label: c.nome, value: c.id! }));
        this.categorias.set(formatadas);
      },
      error: (err) => console.error('Erro ao carregar categorias:', err)
    });
  }

  carregarPessoas(): void {
    this.pessoaService.listarTodas().subscribe({
      next: (resultado) => {
        const formatadas = resultado.conteudo
          .filter(p => p.ativo)
          .map(p => ({ label: p.nome, value: p.id! }));
        this.pessoas.set(formatadas);
      },
      error: (err) => console.error('Erro ao carregar pessoas:', err)
    });
  }

  carregarLancamento(id: number): void {
    this.lancamentoService.buscarPorId(id).subscribe({
      next: (l) => {
        this.lancamento.set({
          id: l.id,
          tipo: l.tipo,
          dataVencimento: l.data_vencimento ? new Date(l.data_vencimento + 'T00:00:00') : null,
          dataPagamento: l.data_pagamento ? new Date(l.data_pagamento + 'T00:00:00') : null,
          descricao: l.descricao,
          valor: l.valor,
          categoriaId: l.categoria?.id || null,
          pessoaId: l.pessoa?.id || null,
          observacao: l.observacao || ''
        });
      },
      error: (err) => console.error('Erro ao carregar lançamento:', err)
    });
  }

  salvar(): void {
    const dados = this.lancamento();

    if (!dados.descricao || !dados.dataVencimento || !dados.valor || !dados.categoriaId || !dados.pessoaId) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const dataVencimentoStr = this.formatarDataIso(dados.dataVencimento);
    const dataPagamentoStr = dados.dataPagamento ? this.formatarDataIso(dados.dataPagamento) : null;

    if (this.editando() && dados.id) {
      const req: AtualizarLancamentoRequest = {
        descricao: dados.descricao,
        data_vencimento: dataVencimentoStr,
        data_pagamento: dataPagamentoStr,
        valor: dados.valor,
        observacao: dados.observacao || null,
        tipo: dados.tipo,
        categoria_id: dados.categoriaId,
        pessoa_id: dados.pessoaId
      };

      this.lancamentoService.atualizar(dados.id, req).subscribe({
        next: () => {
          this.router.navigate(['/lancamentos']);
        },
        error: (err) => console.error('Erro ao atualizar lançamento:', err)
      });
    } else {
      const req: CriarLancamentoRequest = {
        descricao: dados.descricao,
        data_vencimento: dataVencimentoStr,
        data_pagamento: dataPagamentoStr,
        valor: dados.valor,
        observacao: dados.observacao || null,
        tipo: dados.tipo,
        categoria_id: dados.categoriaId,
        pessoa_id: dados.pessoaId
      };

      this.lancamentoService.criar(req).subscribe({
        next: () => {
          this.router.navigate(['/lancamentos']);
        },
        error: (err) => console.error('Erro ao criar lançamento:', err)
      });
    }
  }

  novo(): void {
    this.editando.set(false);
    this.lancamento.set({
      tipo: 'DESPESA',
      dataVencimento: null,
      dataPagamento: null,
      descricao: '',
      valor: null,
      categoriaId: null,
      pessoaId: null,
      observacao: ''
    });
    this.router.navigate(['/lancamentos/novo']);
  }

  private formatarDataIso(data: Date): string {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  }
}
