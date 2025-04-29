import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ProfileData } from '../../domain/models/Client/client-profile.model';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private profileDataSource = new BehaviorSubject<any>(null);
  profileData$ = this.profileDataSource.asObservable();

  setProfileData(data: ProfileData) {
    this.profileDataSource.next(data);
  }
}
