import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { CoachFullProfile } from '../../../domain/models/CoachModels/coach-full-profile.model';
import { CoachService } from '../../../services/Coachservice/coach.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppUser, CoachClientsDTO } from '../../../domain/models/CoachModels/coachclient.model';
import { CoachCleintsService } from '../../../services/Coachservice/coacclients.service';
import { Coachworksample } from '../../../domain/models/CoachModels/coachworksample.model';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CoachportfolioService } from '../../../services/Coachservice/coachportfolio.service';

@Component({
  selector: 'app-coach-view-profile',
  templateUrl: './coachviewprofile.component.html',
  styleUrls: ['./coachviewprofile.component.css'],
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FormsModule, NgbModule],
})
export class CoachViewProfileComponent implements OnInit {
  @ViewChild('workSampleModal') workSampleModal!: TemplateRef<any>;
  @ViewChild('createPortfolioModal') createPortfolioModal!: TemplateRef<any>;
  appUser!: AppUser;
  coach!: CoachFullProfile;
  clients: CoachClientsDTO[] = [];
  coachId!: string;
  activeTab: string = 'certificates';
  username: string = '';
  selectedWorkSample: Coachworksample | null = null;
  isLoading: boolean = false;
  hasPortfolio: boolean = false;
  // Pagination properties
  currentPage: number = 1;
  pageSize: number = 9;
  totalPages: number = 0;
  totalCount: number = 0;
  showCreatePortfolioModal: boolean = false;
  errorMessage: string = '';

  constructor(
    private coachService: CoachService,
    private authservice: AuthService,
    private route: ActivatedRoute,
    private coachclientservice: CoachCleintsService,
    private modalService: NgbModal,
    private portfolioService: CoachportfolioService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadCoachData();
  }

  loadCoachData(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.coachId = this.authservice.getUserId() || this.route.snapshot.paramMap.get('coachId') || '';
    const userName = this.authservice.getUserName();
    this.username = userName || '';

    if (!this.coachId) {
      this.errorMessage = 'Unable to load coach profile. Please try again later.';
      this.isLoading = false;
      return;
    }

    // Load coach profile data first
    this.coachService.getCoachFullProfile(this.coachId).subscribe({
      next: (response) => {
        this.coach = response;
        this.hasPortfolio = !!this.coach?.portfolio;

        // If this is the coach's own profile and they don't have a portfolio, show the create modal
        if (!this.hasPortfolio && this.authservice.getUserId() === this.coachId) {
          this.showCreatePortfolioModal = true;
          setTimeout(() => {
            this.modalService.open(this.createPortfolioModal, {
              size: 'lg',
              centered: true,
              backdrop: 'static'
            });
          }, 100);
        }

        this.parseJsonFields();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading coach profile data', error);
        this.errorMessage = 'Unable to load coach profile. Please try again later.';
        this.isLoading = false;

        // If this is the coach's own profile and there's an error, still show the create modal
        if (this.authservice.getUserId() === this.coachId) {
          this.showCreatePortfolioModal = true;
          setTimeout(() => {
            this.modalService.open(this.createPortfolioModal, {
              size: 'lg',
              centered: true,
              backdrop: 'static'
            });
          }, 100);
        }
      }
    });

    // Load clients data
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

  private parseJsonFields(): void {
    try {
      if (this.coach?.portfolio?.skillsJson && typeof this.coach.portfolio.skillsJson === 'string') {
        this.coach.portfolio.skillsJson = JSON.parse(this.coach.portfolio.skillsJson);
      }

      if (this.coach?.portfolio?.socialMediaLinksJson && typeof this.coach.portfolio.socialMediaLinksJson === 'string') {
        this.coach.portfolio.socialMediaLinksJson = JSON.parse(this.coach.portfolio.socialMediaLinksJson);
      }
    } catch (error) {
      console.error('Error parsing JSON fields:', error);
    }
  }

  navigateToPortfolioCreation(): void {
    this.modalService.dismissAll();
    // Navigate to the portfolio creation page using Angular Router
    this.router.navigate(['/coach/dashboard/portfolio']);
  }

  setActiveTab(tabName: string): void {
    this.activeTab = tabName;
  }

  viewWorkSample(workSample: Coachworksample): void {
    this.selectedWorkSample = workSample;
    this.modalService.open(this.workSampleModal, {
      size: 'lg',
      centered: true
    });
  }

  get averageRating(): number {
    if (!this.coach?.ratings || this.coach.ratings.length === 0) {
      return 0;
    }
    const sum = this.coach.ratings.reduce((acc, rating) => acc + rating.rate, 0);
    return sum / this.coach.ratings.length;
  }
}