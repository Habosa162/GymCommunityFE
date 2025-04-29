import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseUrl } from '../enviroment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeneralUsersService {

  constructor(private http: HttpClient) { }
   



    givePremium(): Observable<any> {
    return this.http.post(`${baseUrl}/GeneralUser/give-premium`,{});
  }
}
