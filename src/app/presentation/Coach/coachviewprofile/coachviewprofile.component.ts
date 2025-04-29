import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { CoachFullProfile } from '../../../domain/models/CoachModels/coach-full-profile.model';
import { CoachService } from '../../../services/Coachservice/coach.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppUser, CoachClientsDTO } from '../../../domain/models/CoachModels/coachclient.model';
import { CoachCleintsService } from '../../../services/Coachservice/coacclients.service';
import { Coachworksample } from '../../../domain/models/CoachModels/coachworksample.model';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-coach-view-profile',
  templateUrl: './coachviewprofile.component.html',
  styleUrls: ['./coachviewprofile.component.css'],
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FormsModule, NgbModule],

})
export class CoachViewProfileComponent implements OnInit {
  @ViewChild('workSampleModal') workSampleModal!: TemplateRef<any>;
  appUser!: AppUser;
  coach!: CoachFullProfile;
  clients: CoachClientsDTO[] = [];
  coachId!: string;
  activeTab: string = 'certificates';
  username: string = '';
  selectedWorkSample: Coachworksample | null = null;
  isLoading: boolean = false;

  constructor(
    private coachService: CoachService,
    private authservice: AuthService,
    private route: ActivatedRoute,
    private coachclientservice: CoachCleintsService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.loadCoachData();
  }

  loadCoachData(): void {
    this.isLoading = true;
    this.coachId = this.authservice.getUserId() || this.route.snapshot.paramMap.get('coachId') || '';
    const userName = this.authservice.getUserName();
    this.username = userName || '';

    // Load clients data
    this.coachclientservice.getClientsByCoachId().subscribe({
      next: (res: CoachClientsDTO[]) => {
        this.clients = res.map(client => ({
          ...client,
          joinDate: new Date() // Set current date as join date
        }));
      },
      error: (error) => {
        console.error('Error loading coach clients data', error);
      }
    });

    // Load coach profile data
    this.coachService.getCoachFullProfile(this.coachId).subscribe({
      next: (response) => {
        this.coach = response;
        this.parseJsonFields();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading coach profile data', error);
        this.isLoading = false;
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