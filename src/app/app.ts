import { Component, signal } from '@angular/core';
import { TableModule } from 'primeng/table';
import { LancamentosPesquisa } from '../lancamentos-pesquisa/lancamentos-pesquisa';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    LancamentosPesquisa,
    TableModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
}
