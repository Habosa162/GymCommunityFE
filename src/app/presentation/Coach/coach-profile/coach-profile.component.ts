import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CoachportfolioService } from '../../../services/Coachservice/coachportfolio.service';
import { CoachcertficateService } from '../../../services/Coachservice/coachcertficate.service';
import { Coachrating } from '../../../domain/models/CoachModels/coachrating.model';
import { CoachworksampleService } from '../../../services/Coachservice/coachworksample.service';
import { Coachportfolio } from '../../../domain/models/CoachModels/coachportfolio.model';
import { Coachcertficate } from '../../../domain/models/CoachModels/coachcertficate.model';
import { Coachworksample } from '../../../domain/models/CoachModels/coachworksample.model';
import { CoachratingService } from '../../../services/Coachservice/coachrating.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-coach-profile',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './coach-profile.component.html',
  styleUrl: './coach-profile.component.css'
})
export class CoachProfileComponent implements OnInit {
  coachId!: string;
  portfolio!: Coachportfolio;
  certificates: Coachcertficate[] = [];
  workSamples: Coachworksample[] = [];
  ratings: Coachrating[] = [];
  averageRating: number = 0;

  constructor(
    private route: ActivatedRoute,
    private portfolioService: CoachportfolioService,
    private certificateService: CoachcertficateService,
    private ratingService: CoachratingService,
    private sampleService: CoachworksampleService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.coachId = this.authService.getUserId() || this.route.snapshot.paramMap.get('coachId')!;
    console.log(this.coachId)
    if (this.coachId) {
      this.loadCoachData();
    } else {
      console.error('Coach ID not found in token');
    }


  }

  loadCoachData(): void {

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.portfolioService.getByCoachId(id).subscribe((res) => {
        this.portfolio = res;
      })
    }
    // Load portfolio
    this.portfolioService.getByCoachId(this.coachId).subscribe((res) => {
      this.portfolio = res;


      // Load certificates and worksamples using portfolioId
      this.loadCertificates(this.portfolio.id!);
      console.log(this.portfolio)
      this.loadWorkSamples(this.portfolio.id!);
    });

    // Load ratings
    // this.ratingService.getByCoachId(this.coachId).subscribe((res) => {
    //   this.ratings = res;
    //   this.calculateAverageRating();
    // });
  }

  loadCertificates(portfolioId: number): void {
    this.certificateService.getByPortfolioId(portfolioId).subscribe((res) => {
      this.certificates = res;
    });
  }

  loadWorkSamples(portfolioId: number): void {
    this.sampleService.getByPortfolioId(portfolioId).subscribe((res) => {
      this.workSamples = res;
    });
  }

  // calculateAverageRating(): void {
  //   if (this.ratings.length > 0) {
  //     const total = this.ratings.reduce((sum, r) => sum + r.rate, 0);
  //     this.averageRating = total / this.ratings.length;
  //   }
  // }

}
