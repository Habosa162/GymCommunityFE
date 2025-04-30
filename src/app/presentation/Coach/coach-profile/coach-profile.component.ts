import { Component, NgModule, NgModuleRef, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CoachService } from '../../../services/Coachservice/coach.service';
import { CoachFullProfile } from '../../../domain/models/CoachModels/coach-full-profile.model';
import { Coachportfolio } from '../../../domain/models/CoachModels/coachportfolio.model';
import { Coachcertficate } from '../../../domain/models/CoachModels/coachcertficate.model';
import { Coachworksample } from '../../../domain/models/CoachModels/coachworksample.model';
import { Coachrating } from '../../../domain/models/CoachModels/coachrating.model';
import { CommonModule } from '@angular/common';
import { FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { CoachCleintsService } from '../../../services/Coachservice/coacclients.service';
import { CoachClientsDTO } from '../../../domain/models/CoachModels/coachclient.model';
import { ProductService } from '../../../services/Ecommerce/product.service';
import { Product } from '../../../domain/models/Ecommerce/product.model';

@Component({
  selector: 'app-coach-profile',
  templateUrl: './coach-profile.component.html',
  styleUrls: ['./coach-profile.component.css'],
  imports: [CommonModule, FormsModule, RouterModule, ReactiveFormsModule ]
})
export class CoachProfileComponent implements OnInit {
  coachId: string = '';
  clients: CoachClientsDTO[] = [];
  portfolio: Coachportfolio | null = null;
  certificates: Coachcertficate[] = [];
  workSamples: Coachworksample[] = [];
  ratings: Coachrating[] = [];
  averageRating: number = 0;
  isLoading: boolean = true;
  currentYear: number = new Date().getFullYear();
  coach: CoachFullProfile | null = null;
  imgurl!: string;
  // Pagination properties
  currentPage: number = 1;
  pageSize: number = 9;
  totalPages: number = 0;
  totalCount: number = 0;
  coachproducts: Product[] = [];

  constructor(
    private route: ActivatedRoute,
    private coachService: CoachService,
    private authservice: AuthService,
    private coachclientservice: CoachCleintsService,
    private productservice: ProductService
  ) { }

  ngOnInit(): void {
    this.coachId = this.route.snapshot.paramMap.get('coachId') || this.authservice.getUserId()!;

    if (this.coachId) {
      this.loadCoachProfile();
      this.loadcoachclient();
      this.loadcoachproducts();
    }
  }

  loadcoachproducts(): void {
    this.productservice.getUserProducts(this.coachId).subscribe({
      next: (response: any) => {
        this.coachproducts = response.data || [];
        console.log(this.coachproducts)
      },
    })
  }

  loadcoachclient(): void {
    this.coachclientservice.getClientsByCoachId(this.currentPage, this.pageSize).subscribe({
      next: (response: any) => {
        this.clients = response.data || [];
        this.currentPage = response.currentPage;
        this.totalPages = response.totalPages;
        this.totalCount = response.totalCount;
      },
      error: (error: any) => {
        console.error('Error loading clients:', error);
        this.clients = [];
      }
    });
  }
  loadCoachProfile(): void {
    this.isLoading = true;
    this.coachService.getCoachFullProfile(this.coachId).subscribe({
      next: (data) => {
        this.coach = data;
        this.portfolio = data.portfolio;
        this.imgurl = this.portfolio.aboutMeImageUrl;
        this.certificates = data.certificates;
        this.workSamples = data.workSamples;
        this.ratings = data.ratings;
        if (typeof this.portfolio?.skillsJson === 'string') {
          this.portfolio.skillsJson = JSON.parse(this.portfolio.skillsJson);
        }
        if (typeof this.portfolio?.socialMediaLinksJson === 'string') {
          this.portfolio.socialMediaLinksJson = JSON.parse(this.portfolio.socialMediaLinksJson);
        }
        this.calculateAverageRating();
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error fetching coach profile:', error);
        this.isLoading = false;
      }
    });

  }

  calculateAverageRating(): void {
    if (this.ratings.length > 0) {
      const sum = this.ratings.reduce((total, rating) => total + rating.rate, 0);
      this.averageRating = sum / this.ratings.length;
    }
  }

  getSkills(): string[] {
    return this.portfolio?.skillsJson || [];
  }

  getSocialMediaLinks(): string[] {
    return this.portfolio?.socialMediaLinksJson || [];
  }
}
