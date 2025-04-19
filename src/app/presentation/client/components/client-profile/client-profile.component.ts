import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ClientProfileService } from '../../../../services/Client/client-profile.service';
import { ClientProfile } from '../../../../domain/models/Client/client-profile.model';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ClientInfoService } from '../../../../services/Client/client-info.service';

@Component({
  selector: 'app-client-profile',
  templateUrl: './client-profile.component.html',
  styleUrls: ['./client-profile.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule,RouterModule]
})
export class ClientProfileComponent implements OnInit {
  // Edit states
  isBioEditing: boolean = false;
  isPersonalInfoEditing: boolean = false;
  isFitnessStatsEditing: boolean = false;
  isGoalsEditing: boolean = false;
  isOwner: boolean = false;
  
  // API Data
  clientProfile: ClientProfile = {
    address: '',
    birthDate: new Date(),
    clientGoal: '',
    clientId: 0,
    createdAt: new Date(),
    firstName: '',
    lastName: '',
    otherGoal: '',
    profileImg: '',
    weight: 0,
    workoutAvailability: 0,
    isPremium: false,
    isActive: false,
    gender: '',
    height: 0,
    bodyFat: 0,
    bio: '',
    coverImg: '',
  };
  
  // Static Data
  staticData = {
    gender: 'Male',
    phone: '+20 123 456 7890',
    nationality: 'egp',
    height: 180,
    bodyFat: 15,
    muscleMass: 75,
    goals: {
      weight: 80,
      muscleMass: 80,
      bodyFat: 12
    }
  };

  constructor(private clientProfileService: ClientProfileService,private clientInfoService: ClientInfoService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.loadProfileData();
  }

  loadProfileData(): void {
     const param = this.route.snapshot.paramMap.get('userId');
     if(param){
     this.clientProfileService.getClientProfileById(param).subscribe({
      next: (res: any) => {
        this.isOwner = res.isOwner;
        res.data.birthDate = new Date(res.data.birthDate);
        res.data.createdAt = new Date(res.data.createdAt);
    
       
        this.clientProfile = res.data;
        console.log('Profile data loaded:', this.clientProfile);
      },
      error: (error) => {
        console.error('Error loading profile:', error);
      }
    });
     }
     else{
      this.clientProfileService.getMyPrfole().subscribe({
        next: (res: any) => {
                  this.isOwner = res.isOwner;

          // Convert string dates to Date objects
        res.data.birthDate = new Date(res.data.birthDate);
        res.data.createdAt = new Date(res.data.createdAt);
  
        this.clientProfile = res.data;
        console.log('Profile data loaded:', this.clientProfile);
      },
      error: (error) => {
        console.error('Error loading profile:', error);
      }
    });
  }
}


  // Toggle edit modes
  toggleBioEdit(): void {
    this.isBioEditing = !this.isBioEditing;
    if (!this.isBioEditing) {
      this.saveBioChanges();
    }
  }

  togglePersonalInfoEdit(): void {
    this.isPersonalInfoEditing = !this.isPersonalInfoEditing;
    if (!this.isPersonalInfoEditing) {
      this.savePersonalInfoChanges();
    }
  }

  toggleFitnessStatsEdit(): void {
    this.isFitnessStatsEditing = !this.isFitnessStatsEditing;
    if (!this.isFitnessStatsEditing) {
      this.saveFitnessStatsChanges();
    }
  }

  toggleGoalsEdit(): void {
    this.isGoalsEditing = !this.isGoalsEditing;
    if (!this.isGoalsEditing) {
      this.saveGoalsChanges();
    }
  }

  // Calculate progress percentage
  calculateProgress(current: number, target: number): number {
    if (target === 0) return 0;
    return Math.min(Math.round((current / target) * 100), 100);
  }

  // Save methods
  private saveBioChanges(): void {
    const updatedProfile = { ...this.clientProfile };
    this.clientProfileService.updateClientProfile(updatedProfile).subscribe({
      next: (response: any) => {
        this.clientProfile = response.data;
        console.log('Bio updated successfully');
      },
      error: (error) => {
        console.error('Error updating bio:', error);
      }
    });
  }

  private savePersonalInfoChanges(): void {
    const updatedProfile = { ...this.clientProfile };
    this.clientProfileService.updateClientProfile(updatedProfile).subscribe({
      next: (response: any) => {
        this.clientProfile = response.data;
        console.log('Personal info updated successfully');
      },
      error: (error) => {
        console.error('Error updating personal info:', error);
      }
    });
  }

  private saveFitnessStatsChanges(): void {
    const updatedProfile = { ...this.clientProfile };
    this.clientProfileService.updateClientProfile(updatedProfile).subscribe({
      next: (response: any) => {
        this.clientProfile = response.data;
        console.log('Fitness stats updated successfully');
      },
      error: (error) => {
        console.error('Error updating fitness stats:', error);
      }
    });
  }

  private saveGoalsChanges(): void {
    const updatedProfile = { ...this.clientProfile };
    this.clientProfileService.updateClientProfile(updatedProfile).subscribe({
      next: (response: any) => {
        this.clientProfile = response.data;
        console.log('Goals updated successfully');
      },
      error: (error) => {
        console.error('Error updating goals:', error);
      }
    });
  }
  //change cover img
private changeCoverImg(file: File){
  this.clientInfoService.changeClientCoverImg(file).subscribe({
    next: (response: any) => {
      console.log('Cover img updated successfully');
    },
    error: (error) => {
      console.error('Error updating cover img:', error);
    }

  });
}
}
