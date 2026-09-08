import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { MessageComponent } from './message';

describe('MessageComponent', () => {
  let component: MessageComponent;
  let fixture: ComponentFixture<MessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(MessageComponent);
    component = fixture.componentInstance;
  });

  it('deve criar o componente', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('não deve exibir mensagem quando o controle não tiver erros', () => {
    const control = new FormControl('valor válido', Validators.required);
    component.control = control;
    component.error = 'required';
    component.text = 'Campo obrigatório';
    fixture.detectChanges();

    const msgElement = fixture.debugElement.query(By.css('.app-message-error'));
    expect(msgElement).toBeNull();
  });

  it('não deve exibir mensagem se o controle tiver erro mas for pristine e untouched', () => {
    const control = new FormControl('', Validators.required);
    component.control = control;
    component.error = 'required';
    component.text = 'Campo obrigatório';
    fixture.detectChanges();

    const msgElement = fixture.debugElement.query(By.css('.app-message-error'));
    expect(msgElement).toBeNull();
  });

  it('deve exibir mensagem quando o controle for touched ou dirty e tiver erro', () => {
    const control = new FormControl('', Validators.required);
    control.markAsTouched();
    component.control = control;
    component.error = 'required';
    component.text = 'Nome é obrigatório';
    fixture.detectChanges();

    const msgElement = fixture.debugElement.query(By.css('.app-message-error'));
    expect(msgElement).toBeTruthy();
    expect(msgElement.nativeElement.textContent.trim()).toBe('Nome é obrigatório');
  });
});
