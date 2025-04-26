import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../../services/auth.service';
import { CoachFullProfile } from '../../../domain/models/CoachModels/coach-full-profile.model';
import { CoachService } from '../../../services/Coachservice/coach.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-coach-view-profile',
  templateUrl: './coachviewprofile.component.html',
  styleUrls: ['./coachviewprofile.component.css'],
  imports: [CommonModule, ReactiveFormsModule, RouterModule]
})
export class CoachViewProfileComponent implements OnInit {
  coach!: CoachFullProfile;

  coachId!: string;
  userName = '';

  constructor(
    private coachservice: CoachService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.loadCoachProfile();

  }

  loadCoachProfile(): void {
    this.coachId = this.authService.getUserId() || this.route.snapshot.paramMap.get('coachId')!;
    this.userName = this.authService.getUserName() || 'Coach';
    this.coachservice.getCoachFullProfile(this.coachId).subscribe({
      next: (profile: any) => {
        this.coach = profile;
        console.log(this.coach.ratings)
      },
      error: (error: any) => {
        console.error('Error loading coach profile:', error);
      }
    });

  }

  get averageRating(): number {
    if (!this.coach.ratings || this.coach.ratings.length === 0) {
      return 0;
    }
    const sum = this.coach.ratings.reduce((acc, rating) => acc + rating.rate, 0);
    return sum / this.coach.ratings.length;
  }



}