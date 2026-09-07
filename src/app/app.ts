import { Component } from '@angular/core';
import { Navbar } from '../navbar/navbar';
import { LancamentoCadastro } from '../lancamento-cadastro/lancamento-cadastro';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    Navbar,
    LancamentoCadastro
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
}
