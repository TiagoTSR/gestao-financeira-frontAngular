import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors, HttpHeaders } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { basicAuthInterceptor } from './basic-auth.interceptor';

describe('basicAuthInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([basicAuthInterceptor])),
        provideHttpClientTesting()
      ]
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('deve usar as credenciais do localStorage quando disponivel', () => {
    const customAuth = btoa('usuario:senha123');
    localStorage.setItem('basic_auth', customAuth);

    http.get('/categorias').subscribe();

    const req = httpMock.expectOne('/categorias');
    expect(req.request.headers.get('Authorization')).toBe(`Basic ${customAuth}`);
    req.flush([]);
  });

  it('deve preservar Authorization existente passada na requisicao', () => {
    const customAuth = btoa('admin:admin');
    const headers = new HttpHeaders({ Authorization: `Basic ${customAuth}` });

    http.get('/categorias', { headers }).subscribe();

    const req = httpMock.expectOne('/categorias');
    expect(req.request.headers.get('Authorization')).toBe(`Basic ${customAuth}`);
    req.flush([]);
  });
});