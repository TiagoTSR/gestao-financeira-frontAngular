import { Component } from '@angular/core';
import { Navbar } from '../navbar/navbar';
import { PessoaCadastro } from '../pessoa-cadastro/pessoa-cadastro';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    Navbar,
    PessoaCadastro
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
}
