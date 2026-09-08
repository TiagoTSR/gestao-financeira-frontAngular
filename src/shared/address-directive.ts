import { Directive, ElementRef, HostListener, Input, Optional } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appAddress]',
  standalone: true
})
export class AddressDirective {
  @Input() maxLength = 150;

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

    const allowedRegex = /^[\p{L}\d\s\-'.]$/u;
    if (!allowedRegex.test(key)) {
      event.preventDefault();
    }
  }

  @HostListener('input')
  onInput(): void {
    this.sanitizeAndFormat();
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const pastedData = event.clipboardData?.getData('text') || '';
    const input = this.el.nativeElement;
    input.value = pastedData;
    this.sanitizeAndFormat();
  }

  private sanitizeAndFormat(): void {
    const input = this.el.nativeElement;
    let value = input.value;

    let newValue = value
      .replace(/[^\p{L}\d\s\-'.]/gu, '')
      .replace(/^\s+/, '')
      .replace(/\s{2,}/g, ' ')
      .slice(0, this.maxLength);

    newValue = newValue.replace(
      /(^|[\s\-'.])(\p{L})/gu,
      (match, sep, char) => sep + char.toUpperCase()
    );

    if (value !== newValue) {
      input.value = newValue;
    }

    if (this.control?.control && this.control.control.value !== newValue) {
      this.control.control.setValue(newValue);
    }
  }
}