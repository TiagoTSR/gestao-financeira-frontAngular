import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';
import { RelatoriosLancamentos } from './relatorios-lancamentos';
import { RelatorioService } from '../relatorio.service';

describe('RelatoriosLancamentos', () => {
  let component: RelatoriosLancamentos;
  let fixture: ComponentFixture<RelatoriosLancamentos>;
  let mockRelatorioService: any;
  let messageService: MessageService;

  beforeEach(async () => {
    mockRelatorioService = {
      gerarLancamentosPorPessoa: vi.fn().mockReturnValue(of(new Blob(['test-pdf'], { type: 'application/pdf' }))),
      gerarLancamentosPorPessoaExcel: vi.fn().mockReturnValue(of(new Blob(['test-excel'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })))
    };

    await TestBed.configureTestingModule({
      imports: [RelatoriosLancamentos],
      providers: [
        provideRouter([]),
        MessageService,
        { provide: RelatorioService, useValue: mockRelatorioService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RelatoriosLancamentos);
    component = fixture.componentInstance;
    messageService = TestBed.inject(MessageService);
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve inicializar com datas de início e fim preenchidas para o mês atual', () => {
    expect(component.dataInicio()).toBeTruthy();
    expect(component.dataFim()).toBeTruthy();
    expect(component.dataInicio() <= component.dataFim()).toBe(true);
  });

  it('deve chamar relatorioService ao gerar relatório PDF com datas válidas', () => {
    component.dataInicio.set('2026-06-01');
    component.dataFim.set('2026-06-30');

    const originalCreate = window.URL.createObjectURL;
    const originalRevoke = window.URL.revokeObjectURL;
    window.URL.createObjectURL = vi.fn().mockReturnValue('blob:http://localhost/dummy');
    window.URL.revokeObjectURL = vi.fn();

    component.gerarRelatorio();

    expect(mockRelatorioService.gerarLancamentosPorPessoa).toHaveBeenCalledWith('2026-06-01', '2026-06-30');

    window.URL.createObjectURL = originalCreate;
    window.URL.revokeObjectURL = originalRevoke;
  });

  it('deve chamar relatorioService ao exportar relatório Excel com datas válidas', () => {
    component.dataInicio.set('2026-06-01');
    component.dataFim.set('2026-06-30');

    const originalCreate = window.URL.createObjectURL;
    const originalRevoke = window.URL.revokeObjectURL;
    window.URL.createObjectURL = vi.fn().mockReturnValue('blob:http://localhost/dummy');
    window.URL.revokeObjectURL = vi.fn();

    component.gerarRelatorioExcel();

    expect(mockRelatorioService.gerarLancamentosPorPessoaExcel).toHaveBeenCalledWith('2026-06-01', '2026-06-30');

    window.URL.createObjectURL = originalCreate;
    window.URL.revokeObjectURL = originalRevoke;
  });

  it('não deve emitir relatório se data de início for maior que data de fim', () => {
    const spyMsg = vi.spyOn(messageService, 'add');
    component.dataInicio.set('2026-06-30');
    component.dataFim.set('2026-06-01');

    component.gerarRelatorio();

    expect(mockRelatorioService.gerarLancamentosPorPessoa).not.toHaveBeenCalled();
    expect(spyMsg).toHaveBeenCalledWith(expect.objectContaining({ severity: 'error' }));
  });
});