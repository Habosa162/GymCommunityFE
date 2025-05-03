import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../../../../services/Client/profile-shared.service';
import { ClientProfile } from '../../../../../domain/models/Client/client-profile.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ClientProfileService } from '../../../../../services/Client/client-profile.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-client-presonal-info',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './client-presonal-info.component.html',
  styleUrl: './client-presonal-info.component.css',
})
export class ClientPresonalInfoComponent implements OnInit {
  //data
  clientProfile!: ClientProfile;
  isOwner!: boolean;
  //edit states
  isBioEditing: boolean = false;
  isPersonalInfoEditing: boolean = false;
  isFitnessStatsEditing: boolean = false;
  isGoalsEditing: boolean = false;
  constructor(
    private profileService: ProfileService,
    private clientProfileService: ClientProfileService,
    private toaster: ToastrService
  ) {}

  ngOnInit(): void {
    this.profileService.profileData$.subscribe((data) => {
      console.log('from info', data);
      this.clientProfile = data.clientProfile;
      this.isOwner = data.isOwner;
    });
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

  // Save methods
  private saveBioChanges(): void {
    const updatedProfile = { ...this.clientProfile };
    this.clientProfileService.updateClientProfile(updatedProfile).subscribe({
      next: (response: any) => {
        console.log('Bio updated successfully');
        this.toaster.success('Bio updated successfully', 'Success');
      },
      error: (error) => {
        console.error('Error updating bio:', error);
        this.toaster.error(error.message, 'Error');
      },
    });
  }

  private savePersonalInfoChanges(): void {
    const updatedProfile = { ...this.clientProfile };
    this.clientProfileService.updateClientProfile(updatedProfile).subscribe({
      next: (response: any) => {
        console.log('Personal info updated successfully');
        this.toaster.success('Personal info updated successfully', 'Success');
      },
      error: (error) => {
        console.error('Error updating personal info:', error);
        this.toaster.error('Error updating personal info', 'Error');
      },
    });
  }

  private saveFitnessStatsChanges(): void {
    const updatedProfile = { ...this.clientProfile };
    this.clientProfileService.updateClientProfile(updatedProfile).subscribe({
      next: (response: any) => {
        console.log('Fitness stats updated successfully');
        this.toaster.success('Fitness stats updated successfully', 'Success');
      },
      error: (error) => {
        console.error('Error updating fitness stats:', error);
        this.toaster.error('Error updating fitness stats', 'Error');
      },
    });
  }

  private saveGoalsChanges(): void {
    const updatedProfile = { ...this.clientProfile };
    this.clientProfileService.updateClientProfile(updatedProfile).subscribe({
      next: (response: any) => {
        console.log('Goals updated successfully');
      },
      error: (error) => {
        console.error('Error updating goals:', error);
      },
    });
  }
}
