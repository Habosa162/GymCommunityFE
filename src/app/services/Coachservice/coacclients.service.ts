import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Coachworksample } from '../../domain/models/CoachModels/coachworksample.model';
import { baseUrl } from '../enviroment';

@Injectable({
  providedIn: 'root'
})
export class CoachCleintsService {
  private baseUrl = `${baseUrl}/CoachClients`;

  constructor(private http: HttpClient) { }

  getClientsByCoachId(pageNumber: number = 1, pageSize: number = 9): Observable<any> {
    return this.http.get(`${this.baseUrl}/GetAll?pageNumber=${pageNumber}&pageSize=${pageSize}`);
  }
}
