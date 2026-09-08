import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (temErro()) {
      <div class="app-message-error flex align-items-center gap-1 mt-1 text-xs">
        <i class="pi pi-times-circle"></i>
        <span>{{ text }}</span>
      </div>
    }
  `,
  styles: [`
    :host {
      display: block;
    }

    .app-message-error {
      color: #ef4444;
      font-weight: 500;
      animation: fadeIn 0.15s ease-in;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-2px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class MessageComponent {
  @Input() error = '';
  @Input() control: AbstractControl | null | undefined = null;
  @Input() text = '';

  temErro(): boolean {
    if (!this.control) {
      return false;
    }
    return this.control.hasError(this.error) && (this.control.dirty || this.control.touched);
  }
}

// Alias para compatibilidade com testes ou imports legados
export { MessageComponent as Message };