import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

// PrimeNG Modules
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { FluidModule } from 'primeng/fluid';
import { TooltipModule } from 'primeng/tooltip';

// Shared Components & Directives
import { MessageComponent } from '../../message/message';
import {
  OnlyLettersName,
  AddressDirective,
  ComplementDirective,
  StateDirective
} from '../../shared';

import { PessoaService } from '../pessoa.service';
import {
  Pessoa,
  CriarPessoaRequest,
  AtualizarPessoaRequest,
  Endereco
} from '../../models';

export interface PessoaFormModel {
  id?: number;
  nome: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cep: string;
  cidade: string;
  estado: string;
  ativo: boolean;
}

@Component({
  selector: 'app-pessoa-cadastro',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    ButtonModule,
    InputTextModule,
    InputMaskModule,
    FluidModule,
    TooltipModule,
    MessageComponent,
    OnlyLettersName,
    AddressDirective,
    ComplementDirective,
    StateDirective
  ],
  templateUrl: './pessoa-cadastro.html',
  styleUrl: './pessoa-cadastro.scss',
})
export class PessoaCadastro implements OnInit {
  private readonly pessoaService = inject(PessoaService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  editando = signal(false);

  pessoa = signal<PessoaFormModel>({
    nome: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cep: '',
    cidade: '',
    estado: '',
    ativo: true
  });

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.editando.set(true);
      this.carregarPessoa(+id);
    }
  }

  carregarPessoa(id: number): void {
    this.pessoaService.buscarPorId(id).subscribe({
      next: (p) => {
        this.pessoa.set({
          id: p.id,
          nome: p.nome,
          logradouro: p.endereco?.logradouro || '',
          numero: p.endereco?.numero || '',
          complemento: p.endereco?.complemento || '',
          bairro: p.endereco?.bairro || '',
          cep: p.endereco?.cep || '',
          cidade: p.endereco?.cidade || '',
          estado: p.endereco?.estado || '',
          ativo: p.ativo
        });
      },
      error: (err) => console.error('Erro ao carregar pessoa:', err)
    });
  }

  salvar(form?: NgForm): void {
    if (form && form.invalid) {
      Object.keys(form.controls).forEach(key => {
        form.controls[key].markAsTouched();
      });
      return;
    }

    const dados = this.pessoa();
    const endereco: Endereco = {
      logradouro: dados.logradouro,
      numero: dados.numero || null,
      complemento: dados.complemento || null,
      bairro: dados.bairro,
      cep: dados.cep,
      cidade: dados.cidade,
      estado: dados.estado
    };

    if (this.editando() && dados.id) {
      const req: AtualizarPessoaRequest = {
        nome: dados.nome,
        ativo: dados.ativo,
        endereco
      };

      this.pessoaService.atualizar(dados.id, req).subscribe({
        next: () => {
          this.router.navigate(['/pessoas']);
        },
        error: (err) => console.error('Erro ao atualizar pessoa:', err)
      });
    } else {
      const req: CriarPessoaRequest = {
        nome: dados.nome,
        ativo: dados.ativo,
        endereco
      };

      this.pessoaService.criar(req).subscribe({
        next: () => {
          this.router.navigate(['/pessoas']);
        },
        error: (err) => console.error('Erro ao criar pessoa:', err)
      });
    }
  }

  novo(form?: NgForm): void {
    if (form) {
      form.resetForm();
    }
    this.editando.set(false);
    this.pessoa.set({
      nome: '',
      logradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cep: '',
      cidade: '',
      estado: '',
      ativo: true
    });
    this.router.navigate(['/pessoas/novo']);
  }

  voltar(): void {
    this.router.navigate(['/pessoas']);
  }
}
