import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ClientProfile } from '../../domain/models/Client/client-profile.model';

@Injectable({
  providedIn: 'root'
})
export class ClientProfileService {

  constructor(private http: HttpClient) { }

  private baseUrl = 'http://localhost:5299/api/ClientProfile';

  getMyPrfole() {
    return this.http.get(`${this.baseUrl}/me`);
  }

  updateClientProfile(clientProfile: ClientProfile) {
    return this.http.put(`${this.baseUrl}`, clientProfile);
  }
}
