import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

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

export interface PessoaForm {
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
export class PessoaCadastro {
  pessoa = signal<PessoaForm>({
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

  salvar(form?: NgForm): void {
    if (form && form.invalid) {
      Object.keys(form.controls).forEach(key => {
        form.controls[key].markAsTouched();
      });
      return;
    }
    console.log('Salvando pessoa:', this.pessoa());
  }

  novo(form?: NgForm): void {
    if (form) {
      form.resetForm();
    }
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
  }

  voltar(): void {
    console.log('Voltando para listagem de pessoas...');
  }
}
