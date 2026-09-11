import { Routes } from '@angular/router';
import { LancamentosPesquisa } from './lancamentos/lancamentos-pesquisa/lancamentos-pesquisa';
import { LancamentoCadastro } from './lancamentos/lancamento-cadastro/lancamento-cadastro';
import { PessoasPesquisa } from './pessoas/pessoas-pesquisa/pessoas-pesquisa';
import { PessoaCadastro } from './pessoas/pessoa-cadastro/pessoa-cadastro';
import { LoginComponent } from './login/login';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'lancamentos', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'lancamentos', component: LancamentosPesquisa, canActivate: [authGuard] },
  { path: 'lancamentos/novo', component: LancamentoCadastro, canActivate: [authGuard] },
  { path: 'lancamentos/:id', component: LancamentoCadastro, canActivate: [authGuard] },
  { path: 'pessoas', component: PessoasPesquisa, canActivate: [authGuard] },
  { path: 'pessoas/novo', component: PessoaCadastro, canActivate: [authGuard] },
  { path: 'pessoas/:id', component: PessoaCadastro, canActivate: [authGuard] },
  { path: '**', redirectTo: 'lancamentos' }
];