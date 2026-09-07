import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { Navbar } from './navbar';

describe('Navbar', () => {
  let component: Navbar;
  let fixture: ComponentFixture<Navbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Navbar]
    }).compileComponents();

    fixture = TestBed.createComponent(Navbar);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('deve criar o componente navbar', () => {
    expect(component).toBeTruthy();
  });

  it('deve inicializar com o menu fechado', () => {
    expect(component.exibindoMenu()).toBe(false);
  });

  it('deve inicializar com o usuário logado correto', () => {
    expect(component.usuarioLogado()).toBe('Tiago Silva');
  });

  it('deve alternar o estado do menu ao chamar alternarMenu()', () => {
    component.alternarMenu();
    expect(component.exibindoMenu()).toBe(true);

    component.alternarMenu();
    expect(component.exibindoMenu()).toBe(false);
  });

  it('deve fechar o menu ao chamar fecharMenu()', () => {
    component.exibindoMenu.set(true);
    component.fecharMenu();
    expect(component.exibindoMenu()).toBe(false);
  });

  it('deve renderizar a marca "Gestão Financeira" na barra', () => {
    const brand = fixture.debugElement.query(By.css('.navbar-brand span'));
    expect(brand.nativeElement.textContent.trim()).toBe('Gestão Financeira');
  });

  it('deve exibir e ocultar o backdrop de acordo com o estado do menu', () => {
    // Inicialmente fechado, sem backdrop
    let backdrop = fixture.debugElement.query(By.css('.navbar-backdrop'));
    expect(backdrop).toBeNull();

    // Abre o menu
    component.exibindoMenu.set(true);
    fixture.detectChanges();

    backdrop = fixture.debugElement.query(By.css('.navbar-backdrop'));
    expect(backdrop).toBeTruthy();

    // Clica no backdrop para fechar
    backdrop.nativeElement.click();
    fixture.detectChanges();

    expect(component.exibindoMenu()).toBe(false);
  });

  it('deve aplicar a classe navbar-menu-aberto quando o menu estiver visível', () => {
    const menuElement = fixture.debugElement.query(By.css('.navbar-menu'));
    expect(menuElement.nativeElement.classList).not.toContain('navbar-menu-aberto');

    component.exibindoMenu.set(true);
    fixture.detectChanges();

    expect(menuElement.nativeElement.classList).toContain('navbar-menu-aberto');
  });

  it('deve fechar o menu ao clicar no botão de fechar dentro do menu', () => {
    component.exibindoMenu.set(true);
    fixture.detectChanges();

    const btnFechar = fixture.debugElement.query(By.css('.btn-fechar'));
    expect(btnFechar).toBeTruthy();

    btnFechar.nativeElement.click();
    fixture.detectChanges();

    expect(component.exibindoMenu()).toBe(false);
  });
});
