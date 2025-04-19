import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ClientProfile } from '../../domain/models/Client/client-profile.model';
import { baseUrl } from '../enviroment';

@Injectable({
  providedIn: 'root'
})
export class ClientProfileService {

  constructor(private http: HttpClient) { }

  private baseUrl = `${baseUrl}/ClientProfile`;

  getMyPrfole() {
    return this.http.get(`${this.baseUrl}/me`);
  }

  updateClientProfile(clientProfile: ClientProfile) {
    return this.http.put(`${this.baseUrl}`, clientProfile);
  }

  getClientProfileById(id: string) {
    return this.http.get(`${this.baseUrl}?id=${id}`);
  }
}
