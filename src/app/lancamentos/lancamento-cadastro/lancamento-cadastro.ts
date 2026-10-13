import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';

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

import { MessageService } from 'primeng/api';
import { MessageComponent } from '../../message/message';

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
  id?: string;
  tipo: TipoLancamento;
  dataVencimento: Date | null;
  dataPagamento: Date | null;
  descricao: string;
  valor: number | null;
  categoriaId: string | null;
  pessoaId: string | null;
  observacao: string;
  totalParcelas?: number;
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
    FluidModule,
    MessageComponent
  ],
  templateUrl: './lancamento-cadastro.html',
  styleUrl: './lancamento-cadastro.scss',
})
export class LancamentoCadastro implements OnInit {
  private readonly lancamentoService = inject(LancamentoService);
  private readonly categoriaService = inject(CategoriaService);
  private readonly pessoaService = inject(PessoaService);
  private readonly messageService = inject(MessageService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  tipos = [
    { label: 'Receita', value: 'RECEITA' },
    { label: 'Despesa', value: 'DESPESA' },
  ];

  categorias = signal<{ label: string; value: string }[]>([]);
  pessoas = signal<{ label: string; value: string }[]>([]);

  lancamento: LancamentoFormModel = {
    tipo: 'DESPESA',
    dataVencimento: null,
    dataPagamento: null,
    descricao: '',
    valor: null,
    categoriaId: null,
    pessoaId: null,
    observacao: '',
    totalParcelas: 1
  };

  editando = signal(false);

  ngOnInit(): void {
    this.carregarCategorias();
    this.carregarPessoas();

    const idParam = this.route.snapshot.params['id'];
    if (idParam) {
      this.editando.set(true);
      this.carregarLancamento(idParam);
    }
  }

  carregarCategorias(): void {
    this.categoriaService.listar().subscribe({
      next: (dados: any) => {
        const itens: any[] = Array.isArray(dados) ? dados : (dados?.conteudo || []);
        const formatadas = itens.map(c => ({
          label: c.nome,
          value: String(c.id)
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
          value: String(p.id)
        }));
        this.pessoas.set(formatadas);
      },
      error: (err) => console.error('Erro ao carregar pessoas:', err)
    });
  }

  carregarLancamento(id: string): void {
    this.lancamentoService.buscarPorId(id).subscribe({
      next: (lancamento: any) => {
        this.lancamento = {
          id: lancamento.id ? String(lancamento.id) : undefined,
          tipo: lancamento.tipo || 'DESPESA',
          dataVencimento: lancamento.data_vencimento ? new Date(lancamento.data_vencimento + 'T00:00:00') : null,
          dataPagamento: lancamento.data_pagamento ? new Date(lancamento.data_pagamento + 'T00:00:00') : null,
          descricao: lancamento.descricao || '',
          valor: typeof lancamento.valor === 'string' ? parseFloat(lancamento.valor) : lancamento.valor,
          categoriaId: (lancamento.categoria?.id !== undefined && lancamento.categoria?.id !== null)
            ? String(lancamento.categoria.id)
            : (lancamento.categoria_id ? String(lancamento.categoria_id) : null),
          pessoaId: (lancamento.pessoa?.id !== undefined && lancamento.pessoa?.id !== null)
            ? String(lancamento.pessoa.id)
            : (lancamento.pessoa_id ? String(lancamento.pessoa_id) : null),
          observacao: lancamento.observacao || '',
          totalParcelas: lancamento.total_parcelas || 1
        };
      },
      error: (err) => console.error('Erro ao carregar lançamento:', err)
    });
  }

  salvar(form?: NgForm): void {
    if (form && form.invalid) {
      Object.keys(form.controls).forEach(key => {
        form.controls[key].markAsTouched();
      });
      this.messageService.add({
        severity: 'warn',
        summary: 'Campos Obrigatórios',
        detail: 'Por favor, preencha todos os campos obrigatórios (*).'
      });
      return;
    }

    const dados = this.lancamento;

    if (!dados.descricao || !dados.dataVencimento || !dados.valor || !dados.categoriaId || !dados.pessoaId) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Campos Obrigatórios',
        detail: 'Por favor, preencha todos os campos com asterisco (*).'
      });
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
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Lançamento atualizado com sucesso!'
          });
          this.router.navigate(['/lancamentos']);
        },
        error: (err) => {
          console.error('Erro ao atualizar lançamento:', err);
          const mensagem = err.error?.mensagem || 'Erro ao atualizar o lançamento.';
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: mensagem
          });
        }
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
        pessoa_id: dados.pessoaId,
        ...(dados.totalParcelas && dados.totalParcelas > 1 ? { total_parcelas: dados.totalParcelas } : {})
      };

      this.lancamentoService.criar(req).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Lançamento cadastrado com sucesso!'
          });
          this.router.navigate(['/lancamentos']);
        },
        error: (err) => {
          console.error('Erro ao criar lançamento:', err);
          const mensagem = err.error?.mensagem || 'Erro ao salvar o lançamento.';
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: mensagem
          });
        }
      });
    }
  }

  novo(form?: NgForm): void {
    if (form) {
      form.resetForm();
    }
    this.editando.set(false);
    this.lancamento = {
      tipo: 'DESPESA',
      dataVencimento: null,
      dataPagamento: null,
      descricao: '',
      valor: null,
      categoriaId: null,
      pessoaId: null,
      observacao: '',
      totalParcelas: 1
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