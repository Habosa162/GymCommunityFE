import { Injectable } from '@angular/core';
import { baseUrl } from '../enviroment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  apiUrl= `${baseUrl}/Admin` ;
  constructor(private http:HttpClient) {}

  getDashBoardSummary():Observable<any>{
    return this.http.get(`${this.apiUrl}/summary`) ;
  }
  getUsersSummary(role: string, year: number): Observable<any> {
    const params = { role: role, year: year.toString() };
    return this.http.get(`${this.apiUrl}/users`, { params });
  }
}
