import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ClientProfileService } from '../../../../services/Client/client-profile.service';
import { ClientProfile } from '../../../../domain/models/Client/client-profile.model';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ClientInfoService } from '../../../../services/Client/client-info.service';
import { ChangeProfileImgComponent } from '../../../../core/shared/components/changeProfileImg/change-profile-img/change-profile-img.component';
import { ProfileService } from '../../../../services/Client/profile-shared.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-client-profile',
  templateUrl: './client-profile.component.html',
  styleUrls: ['./client-profile.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, ChangeProfileImgComponent],
})
export class ClientProfileComponent implements OnInit {
  // parent data
  clientProfile!: ClientProfile;
  profileImg!: string;
  coverImg!: string;
  isOwner!: boolean;

  //change profile img code
  showModal = false;
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;

  //change cover img code
  showCoverModal = false;
  selectedCoverFile: File | null = null;
  coverPreviewUrl: string | ArrayBuffer | null = null;

  constructor(
    private clientProfileService: ClientProfileService,
    private clientInfoService: ClientInfoService,
    private route: ActivatedRoute,
    private ProfileService: ProfileService,
    private toaster: ToastrService
  ) {}

  openModal(): void {
    this.showModal = true;
  }
  closeModal(): void {
    this.showModal = false;
    this.selectedFile = null;
    this.previewUrl = null;
  }

  //cover
  openCoverModal(): void {
    this.showCoverModal = true;
  }

  closeCoverModal(): void {
    this.showCoverModal = false;
    this.selectedCoverFile = null;
    this.coverPreviewUrl = null;
  }

  ngOnInit(): void {
    this.loadProfileData();
  }

  loadProfileData(): void {
    const param = this.route.snapshot.paramMap.get('userId');
    if (param) {
      this.clientProfileService.getClientProfileById(param).subscribe({
        next: (res: any) => {
          this.isOwner = res.isOwner;

          res.data.birthDate = new Date(res.data.birthDate);
          res.data.createdAt = new Date(res.data.createdAt);
          this.clientProfile = res.data;
          //send data to shared service
          this.ProfileService.setProfileData({
            clientProfile: this.clientProfile,
            isOwner: this.isOwner,
          });

          this.profileImg = res.data.profileImg;
          this.coverImg = res.data.coverImg;
          console.log('Profile data loaded:', this.clientProfile);
        },
        error: (error) => {
          console.error('Error loading profile:', error);
        },
      });
    } else {
      this.clientProfileService.getMyPrfole().subscribe({
        next: (res: any) => {
          this.isOwner = res.isOwner;

          // Convert string dates to Date objects
          res.data.birthDate = new Date(res.data.birthDate);
          res.data.createdAt = new Date(res.data.createdAt);

          this.clientProfile = res.data;
          //send data to shared service
          this.ProfileService.setProfileData({
            clientProfile: this.clientProfile,
            isOwner: this.isOwner,
          });
          this.profileImg = res.data.profileImg;
          this.coverImg = res.data.coverImg;
          console.log('Profile data loaded:', this.clientProfile);
        },
        error: (error) => {
          console.error('Error loading profile:', error);
        },
      });
    }
  }

  // Calculate progress percentage
  calculateProgress(current: number, target: number): number {
    if (target === 0) return 0;
    return Math.min(Math.round((current / target) * 100), 100);
  }

  //change cover img
  // private changeCoverImg(file: File) {
  //   this.clientInfoService.changeClientCoverImg(file).subscribe({
  //     next: (response: any) => {
  //       console.log('Cover img updated successfully');
  //     },
  //     error: (error) => {
  //       console.error('Error updating cover img:', error);
  //     },
  //   });
  // }

  onCoverFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedCoverFile = file;

      const reader = new FileReader();
      reader.onload = () => (this.coverPreviewUrl = reader.result);
      reader.readAsDataURL(file);
    }
  }

  triggerCoverFileInput(fileInput: HTMLInputElement): void {
    fileInput.click();
  }

  onCoverSubmit(): void {
    if (this.selectedCoverFile) {
      this.clientInfoService
        .changeCoverImage(this.selectedCoverFile)
        .subscribe({
          next: (res) => {
            this.clientProfile.coverImg = res.imgUrl;
            this.closeCoverModal();
            this.toaster.success('Cover Image Changed', 'Success');
          },
          error: () => alert('Failed to update cover image'),
        });
    } else {
      alert('Please select an image');
    }
  }

  ///////////////

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = (e) => (this.previewUrl = reader.result);
      reader.readAsDataURL(file);
    }
  }

  triggerFileInput(fileInput: HTMLInputElement): void {
    fileInput.click();
  }

  onSubmit(): void {
    if (this.selectedFile) {
      this.clientProfileService.changeProfilePic(this.selectedFile).subscribe({
        next: (res) => {
          this.clientProfile.profileImg = res.imgUrl;
          this.closeModal();
          this.toaster.success('Profile Image Changed', 'Success');
        },
        error: () => alert('Failed to update profile picture'),
      });
    } else {
      alert('Please select an image');
    }
  }
}
