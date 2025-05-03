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
  
  getAllUsers(
    pageNumber: number = 1,
    pageSize: number = 10,
    role: string = 'Client',
    query: string = '',
    isActive: boolean = true,
    isPremium: boolean = false,
    gender: string = 'all'
  ): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/usermanagement`, {
      params: {
        role: role,
        query: query,
        isActive: isActive.toString(),
        isPremium: isPremium.toString(),
        gender: gender,
        pageNumber: pageNumber.toString(),
        pageSize: pageSize.toString(),
      },
    });
  }
  
}
