import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

export interface LancamentoForm {
  tipo: 'RECEITA' | 'DESPESA';
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
export class LancamentoCadastro {
  tipos = [
    { label: 'Receita', value: 'RECEITA' },
    { label: 'Despesa', value: 'DESPESA' },
  ];

  categorias = [
    { label: 'Alimentação', value: 1 },
    { label: 'Transporte', value: 2 },
    { label: 'Saúde', value: 3 },
    { label: 'Educação', value: 4 }
  ];

  pessoas = [
    { label: 'João da Silva', value: 4 },
    { label: 'Sebastião Souza', value: 9 },
    { label: 'Maria Abadia', value: 3 }
  ];

  // Estado do formulário com Signal
  lancamento = signal<LancamentoForm>({
    tipo: 'DESPESA',
    dataVencimento: null,
    dataPagamento: null,
    descricao: '',
    valor: null,
    categoriaId: null,
    pessoaId: null,
    observacao: ''
  });

  salvar(): void {
    console.log('Salvando lançamento:', this.lancamento());
  }

  novo(): void {
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
  }

  voltar(): void {
    console.log('Voltando para listagem...');
  }
}
