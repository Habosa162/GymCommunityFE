import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { baseUrl } from '../enviroment';

@Injectable({
  providedIn: 'root',
})
export class CoachDashboardService {
  private baseUrl = `${baseUrl}/CoachDashboard`;

  constructor(private http: HttpClient) {}

  getCoachDashboard(): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/GetCoachDashboard?yr=2025&month=5&filter=${0}`
    );
  }
}
