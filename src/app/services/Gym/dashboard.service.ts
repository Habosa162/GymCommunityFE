import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { DashboardSummary, TopPlan, RecentMember } from '../../domain/models/Gym/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private baseUrl = 'https://localhost:7130/api/GymOwnerDashboard'; 

  constructor(private http: HttpClient) { }

  getSummary(gymOwnerId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/GetSummary/${gymOwnerId}`);
  }
  

  getTopPlans(gymOwner: string): Observable<TopPlan[]> {
    return this.http.get<TopPlan[]>(`${this.baseUrl}/GetTopPlans/${gymOwner}`);
  }

  getRecentMembers(gymOwner: string): Observable<RecentMember[]> {
    return this.http.get<RecentMember[]>(`${this.baseUrl}/GetRecentMembers/${gymOwner}`);
  }
}
