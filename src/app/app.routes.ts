import { Routes } from '@angular/router';
import { LancamentosPesquisa } from './lancamentos/lancamentos-pesquisa/lancamentos-pesquisa';
import { LancamentoCadastro } from './lancamentos/lancamento-cadastro/lancamento-cadastro';
import { PessoasPesquisa } from './pessoas/pessoas-pesquisa/pessoas-pesquisa';
import { PessoaCadastro } from './pessoas/pessoa-cadastro/pessoa-cadastro';

export const routes: Routes = [
  { path: '', redirectTo: 'lancamentos', pathMatch: 'full' },
  { path: 'lancamentos', component: LancamentosPesquisa },
  { path: 'lancamentos/novo', component: LancamentoCadastro },
  { path: 'lancamentos/:id', component: LancamentoCadastro },
  { path: 'pessoas', component: PessoasPesquisa },
  { path: 'pessoas/novo', component: PessoaCadastro },
  { path: 'pessoas/:id', component: PessoaCadastro },
  { path: '**', redirectTo: 'lancamentos' }
];
