import { environment } from '../../environments/environment';
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DashboardResumo } from '../models';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/dashboard`;

  obterDashboard(mes?: string): Observable<DashboardResumo> {
    let params = new HttpParams();
    if (mes) {
      params = params.set('mes', mes);
    }
    return this.http.get<DashboardResumo>(this.apiUrl, { params });
  }
}
