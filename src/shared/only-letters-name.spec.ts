import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { OnlyLettersName } from './only-letters-name';

@Component({
  standalone: true,
  imports: [FormsModule, OnlyLettersName],
  template: `<input type="text" appOnlyLettersName [(ngModel)]="nome">`
})
class TestHostComponent {
  nome = '';
}

describe('OnlyLettersName', () => {
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

  it('deve remover números e capitalizar as palavras', () => {
    inputEl.value = 'joão123 silva';
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(inputEl.value).toBe('João Silva');
  });

  it('deve remover espaços duplicados', () => {
    inputEl.value = 'maria   clara';
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(inputEl.value).toBe('Maria Clara');
  });
});
