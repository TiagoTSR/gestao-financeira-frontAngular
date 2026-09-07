import { Component, signal } from '@angular/core';
import { TableModule } from 'primeng/table';
import { LancamentosPesquisa } from '../lancamentos-pesquisa/lancamentos-pesquisa';
import { Navbar } from '../navbar/navbar';
import { PessoasPesquisa } from '../pessoas-pesquisa/pessoas-pesquisa';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    LancamentosPesquisa,
    TableModule,
    Navbar,
    PessoasPesquisa
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
}
