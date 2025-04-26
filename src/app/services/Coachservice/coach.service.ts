import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CoachFullProfile } from '../../domain/models/CoachModels/coach-full-profile.model';
import { baseUrl } from '../enviroment';

@Injectable({
  providedIn: 'root'
})
export class CoachService {
  private baseUrl = `${baseUrl}/CoachProfile`;

  constructor(private http: HttpClient) { }

  getCoachFullProfile(coachId: string): Observable<CoachFullProfile> {
    return this.http.get<CoachFullProfile>(`${this.baseUrl}/fullProfile/${coachId}`);
  }

}
