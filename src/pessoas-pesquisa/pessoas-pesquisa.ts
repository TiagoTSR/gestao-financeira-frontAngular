import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';

export interface Pessoa {
  nome: string;
  cidade: string;
  estado: string;
  ativo: boolean;
}

@Component({
  selector: 'app-pessoas-pesquisa',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    TableModule,
    TooltipModule
  ],
  templateUrl: './pessoas-pesquisa.html',
  styleUrl: './pessoas-pesquisa.scss',
})
export class PessoasPesquisa {
  nomeFiltro = signal('');

  pessoas = signal<Pessoa[]>([
    { nome: 'Manoel Pinheiro', cidade: 'Uberlândia', estado: 'MG', ativo: true },
    { nome: 'Sebastião da Silva', cidade: 'São Paulo', estado: 'SP', ativo: false },
    { nome: 'Carla Souza', cidade: 'Florianópolis', estado: 'SC', ativo: true },
    { nome: 'Luís Pereira', cidade: 'Curitiba', estado: 'PR', ativo: true },
    { nome: 'Vilmar Andrade', cidade: 'Rio de Janeiro', estado: 'RJ', ativo: false },
    { nome: 'Paula Maria', cidade: 'Uberlândia', estado: 'MG', ativo: true }
  ]);

  pesquisar(): void {
    console.log('Pesquisando pessoas por nome:', this.nomeFiltro());
  }

  alternarStatus(pessoa: Pessoa): void {
    this.pessoas.update(lista =>
      lista.map(p => (p === pessoa ? { ...p, ativo: !p.ativo } : p))
    );
  }
}