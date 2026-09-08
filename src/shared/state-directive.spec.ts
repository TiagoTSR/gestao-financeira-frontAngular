import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { StateDirective } from './state-directive';

@Component({
  standalone: true,
  imports: [FormsModule, StateDirective],
  template: `<input type="text" appState [(ngModel)]="uf">`
})
class TestHostComponent {
  uf = '';
}

describe('StateDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let inputEl: HTMLInputElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    inputEl = fixture.debugElement.query(By.css('input')).nativeElement;
  });

  it('deve converter letras minúsculas para maiúsculas', () => {
    inputEl.value = 'sp';
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(inputEl.value).toBe('SP');
  });

  it('deve limitar a 2 caracteres', () => {
    inputEl.value = 'mgs';
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(inputEl.value).toBe('MG');
  });

  it('deve remover números e caracteres especiais', () => {
    inputEl.value = 'r1j#';
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(inputEl.value).toBe('RJ');
  });
});
