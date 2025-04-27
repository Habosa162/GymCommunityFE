import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../../services/auth.service';
import { CoachFullProfile } from '../../../domain/models/CoachModels/coach-full-profile.model';
import { CoachService } from '../../../services/Coachservice/coach.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppUser, CoachClientsDTO } from '../../../domain/models/CoachModels/coachclient.model';
import { CoachCleintsService } from '../../../services/Coachservice/coacclients.service';

@Component({
  selector: 'app-coach-view-profile',
  templateUrl: './coachviewprofile.component.html',
  styleUrls: ['./coachviewprofile.component.css'],
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FormsModule]
})
export class CoachViewProfileComponent implements OnInit {
  appUser!: AppUser;
  coach!: CoachFullProfile;
  clients: CoachClientsDTO[] = [];
  coachId!: string;
  activeTab: string = 'certificates';
  username!: any;

  constructor(private coachService: CoachService, private authservice: AuthService, private route: ActivatedRoute, private coachclientservice: CoachCleintsService) { }

  ngOnInit(): void {
    this.loadCoachData();

  }

  loadCoachData(): void {
    // Assuming your service returns all the needed data
    this.coachId = this.authservice.getUserId() || this.route.snapshot.paramMap.get('coachId')!;
    this.coachclientservice.getClientsByCoachId().subscribe({
      next: (res: any) => {
        this.clients = res;
      },
      error: (error) => {
        console.error('Error loading coach clients data', error);
      }
    })

    this.username = this.authservice.getUserName()

    this.coachService.getCoachFullProfile(this.coachId).subscribe({
      next: (response) => {
        this.coach = response;
        if (this.coach?.portfolio?.skillsJson && typeof this.coach.portfolio.skillsJson === 'string') {
          this.coach.portfolio.skillsJson = JSON.parse(this.coach.portfolio.skillsJson);
        }

        if (this.coach?.portfolio?.socialMediaLinksJson && typeof this.coach.portfolio.socialMediaLinksJson === 'string') {
          this.coach.portfolio.socialMediaLinksJson = JSON.parse(this.coach.portfolio.socialMediaLinksJson);
        }

      },
      error: (error) => {
        console.error('Error loading coach profile data', error);
      }
    });
  }

  setActiveTab(tabName: string): void {
    this.activeTab = tabName;
  }

  get averageRating(): number {
    if (!this.coach.ratings || this.coach.ratings.length === 0) {
      return 0;
    }
    const sum = this.coach.ratings.reduce((acc, rating) => acc + rating.rate, 0);
    return sum / this.coach.ratings.length;
  }



}