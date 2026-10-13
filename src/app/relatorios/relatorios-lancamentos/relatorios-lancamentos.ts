import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { MessageService } from 'primeng/api';
import { RelatorioService } from '../relatorio.service';

@Component({
  selector: 'app-relatorios-lancamentos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    CardModule
  ],
  templateUrl: './relatorios-lancamentos.html',
  styleUrl: './relatorios-lancamentos.scss'
})
export class RelatoriosLancamentos {
  private readonly relatorioService = inject(RelatorioService);
  private readonly messageService = inject(MessageService);

  private readonly hoje = new Date();
  private readonly primeiroDia = new Date(this.hoje.getFullYear(), this.hoje.getMonth(), 1)
    .toISOString()
    .split('T')[0];
  private readonly ultimoDia = new Date(this.hoje.getFullYear(), this.hoje.getMonth() + 1, 0)
    .toISOString()
    .split('T')[0];

  dataInicio = signal(this.primeiroDia);
  dataFim = signal(this.ultimoDia);
  carregando = signal(false);
  carregandoExcel = signal(false);

  private validarPeriodo(): boolean {
    if (!this.dataInicio() || !this.dataFim()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Por favor, selecione as datas de início e fim do período.'
      });
      return false;
    }

    if (this.dataInicio() > this.dataFim()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Período Inválido',
        detail: 'A data inicial não pode ser maior que a data final.'
      });
      return false;
    }

    return true;
  }

  gerarRelatorio(): void {
    if (!this.validarPeriodo()) return;

    this.carregando.set(true);

    this.relatorioService.gerarLancamentosPorPessoa(this.dataInicio(), this.dataFim()).subscribe({
      next: (blob) => {
        this.carregando.set(false);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `relatorio-lancamentos_${this.dataInicio()}_${this.dataFim()}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        this.messageService.add({
          severity: 'success',
          summary: 'Relatório PDF Gerado',
          detail: 'Download do PDF iniciado com sucesso.'
        });
      },
      error: (err) => {
        console.error('Erro ao gerar relatório PDF:', err);
        this.carregando.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível gerar o relatório em PDF.'
        });
      }
    });
  }

  gerarRelatorioExcel(): void {
    if (!this.validarPeriodo()) return;

    this.carregandoExcel.set(true);

    this.relatorioService.gerarLancamentosPorPessoaExcel(this.dataInicio(), this.dataFim()).subscribe({
      next: (blob) => {
        this.carregandoExcel.set(false);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `relatorio-lancamentos_${this.dataInicio()}_${this.dataFim()}.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        this.messageService.add({
          severity: 'success',
          summary: 'Planilha Excel Gerada',
          detail: 'Download da planilha .xlsx iniciado com sucesso.'
        });
      },
      error: (err) => {
        console.error('Erro ao exportar planilha Excel:', err);
        this.carregandoExcel.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível exportar o relatório em formato Excel.'
        });
      }
    });
  }
}