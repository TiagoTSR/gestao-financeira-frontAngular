import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';

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

  lancamento: LancamentoFormModel = {
    tipo: 'DESPESA',
    dataVencimento: null,
    dataPagamento: null,
    descricao: '',
    valor: null,
    categoriaId: null,
    pessoaId: null,
    observacao: ''
  };

  editando = signal(false);

  ngOnInit(): void {
    this.carregarCategorias();
    this.carregarPessoas();

    const idParam = this.route.snapshot.params['id'];
    if (idParam) {
      this.editando.set(true);
      this.carregarLancamento(Number(idParam));
    }
  }

  carregarCategorias(): void {
    this.categoriaService.listar().subscribe({
      next: (dados: any) => {
        const itens: any[] = Array.isArray(dados) ? dados : (dados?.conteudo || []);
        const formatadas = itens.map(c => ({
          label: c.nome,
          value: Number(c.id)
        }));
        this.categorias.set(formatadas);
      },
      error: (err) => console.error('Erro ao carregar categorias:', err)
    });
  }

  carregarPessoas(): void {
    this.pessoaService.listarTodas().subscribe({
      next: (resultado: any) => {
        const itens: any[] = resultado?.conteudo || (Array.isArray(resultado) ? resultado : []);
        const formatadas = itens.map(p => ({
          label: p.nome,
          value: Number(p.id)
        }));
        this.pessoas.set(formatadas);
      },
      error: (err) => console.error('Erro ao carregar pessoas:', err)
    });
  }

  carregarLancamento(id: number): void {
    this.lancamentoService.buscarPorId(id).subscribe({
      next: (lancamento: any) => {
        this.lancamento = {
          id: lancamento.id ? Number(lancamento.id) : undefined,
          tipo: lancamento.tipo || 'DESPESA',
          dataVencimento: lancamento.data_vencimento ? new Date(lancamento.data_vencimento + 'T00:00:00') : null,
          dataPagamento: lancamento.data_pagamento ? new Date(lancamento.data_pagamento + 'T00:00:00') : null,
          descricao: lancamento.descricao || '',
          valor: typeof lancamento.valor === 'string' ? parseFloat(lancamento.valor) : lancamento.valor,
          categoriaId: (lancamento.categoria?.id !== undefined && lancamento.categoria?.id !== null)
            ? Number(lancamento.categoria.id)
            : (lancamento.categoria_id ? Number(lancamento.categoria_id) : null),
          pessoaId: (lancamento.pessoa?.id !== undefined && lancamento.pessoa?.id !== null)
            ? Number(lancamento.pessoa.id)
            : (lancamento.pessoa_id ? Number(lancamento.pessoa_id) : null),
          observacao: lancamento.observacao || ''
        };
      },
      error: (err) => console.error('Erro ao carregar lançamento:', err)
    });
  }

  salvar(): void {
    const dados = this.lancamento;

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
    this.lancamento = {
      tipo: 'DESPESA',
      dataVencimento: null,
      dataPagamento: null,
      descricao: '',
      valor: null,
      categoriaId: null,
      pessoaId: null,
      observacao: ''
    };
    this.router.navigate(['/lancamentos/novo']);
  }

  private formatarDataIso(data: Date): string {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  }
}
