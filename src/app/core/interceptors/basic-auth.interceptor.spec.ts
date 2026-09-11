import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors, HttpHeaders } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { jwtInterceptor } from './jwt.interceptor';

describe('jwtInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(withInterceptors([jwtInterceptor])),
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

  it('deve usar o token Bearer do localStorage quando disponivel', () => {
    const customToken = 'meu.token.jwt';
    localStorage.setItem('access_token', customToken);

    http.get('/categorias').subscribe();

    const req = httpMock.expectOne('/categorias');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${customToken}`);
    req.flush([]);
  });

  it('deve preservar Authorization existente passada na requisicao', () => {
    const customAuth = 'Basic dXN1YXJpbzpzZW5oYQ==';
    const headers = new HttpHeaders({ Authorization: customAuth });

    http.get('/categorias', { headers }).subscribe();

    const req = httpMock.expectOne('/categorias');
    expect(req.request.headers.get('Authorization')).toBe(customAuth);
    req.flush([]);
  });
});