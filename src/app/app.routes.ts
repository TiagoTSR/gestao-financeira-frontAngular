import { Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { LancamentosPesquisa } from './lancamentos/lancamentos-pesquisa/lancamentos-pesquisa';
import { LancamentoCadastro } from './lancamentos/lancamento-cadastro/lancamento-cadastro';
import { PessoasPesquisa } from './pessoas/pessoas-pesquisa/pessoas-pesquisa';
import { PessoaCadastro } from './pessoas/pessoa-cadastro/pessoa-cadastro';
import { RelatoriosLancamentos } from './relatorios/relatorios-lancamentos/relatorios-lancamentos';
import { LoginComponent } from './login/login';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'lancamentos', component: LancamentosPesquisa, canActivate: [authGuard] },
  { path: 'lancamentos/novo', component: LancamentoCadastro, canActivate: [authGuard] },
  { path: 'lancamentos/:id', component: LancamentoCadastro, canActivate: [authGuard] },
  { path: 'pessoas', component: PessoasPesquisa, canActivate: [authGuard] },
  { path: 'pessoas/novo', component: PessoaCadastro, canActivate: [authGuard] },
  { path: 'pessoas/:id', component: PessoaCadastro, canActivate: [authGuard] },
  { path: 'relatorios', redirectTo: 'relatorios/lancamentos', pathMatch: 'full' },
  { path: 'relatorios/lancamentos', component: RelatoriosLancamentos, canActivate: [authGuard] },
  { path: '**', redirectTo: 'dashboard' }
];