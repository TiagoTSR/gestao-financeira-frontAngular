import { Component } from '@angular/core';
import { Navbar } from './navbar/navbar';
import { PessoaCadastro } from './pessoas/pessoa-cadastro/pessoa-cadastro';
import { PessoasPesquisa } from './pessoas/pessoas-pesquisa/pessoas-pesquisa';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    Navbar,
    PessoasPesquisa
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
}
