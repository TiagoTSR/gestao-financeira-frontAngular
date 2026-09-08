import { Directive, ElementRef, HostListener, Input, Optional } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appState]',
  standalone: true
})
export class StateDirective {
  @Input() maxLength = 2;

  constructor(
    private el: ElementRef<HTMLInputElement>,
    @Optional() private control: NgControl
  ) {}

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    const input = this.el.nativeElement;
    const key = event.key;

    if (
      key === 'Backspace' || key === 'Tab' || key === 'Enter' ||
      key === 'Delete' || key.includes('Arrow') ||
      event.ctrlKey || event.metaKey
    ) {
      return;
    }

    if (input.value.length >= this.maxLength && input.selectionStart === input.selectionEnd) {
      event.preventDefault();
      return;
    }

    const allowedRegex = /^[a-zA-Z]$/;
    if (!allowedRegex.test(key)) {
      event.preventDefault();
    }
  }

  @HostListener('input')
  onInput(): void {
    this.formatValue();
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const pastedData = event.clipboardData?.getData('text') || '';
    const cleanData = pastedData.replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, this.maxLength);
    
    const input = this.el.nativeElement;
    input.value = cleanData;
    this.updateControlValue(cleanData);
  }

  private formatValue(): void {
    const input = this.el.nativeElement;
    const upperValue = input.value.replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, this.maxLength);

    if (input.value !== upperValue) {
      input.value = upperValue;
    }
    this.updateControlValue(upperValue);
  }

  private updateControlValue(val: string): void {
    if (this.control?.control && this.control.control.value !== val) {
      this.control.control.setValue(val);
    }
  }
}
