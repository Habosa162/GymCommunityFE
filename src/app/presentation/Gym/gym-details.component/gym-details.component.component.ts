import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GymCoachDTO, GymCoachCreateDTO } from '../../../domain/models/Gym/gym-coach.model';
import { GymImgReadDTO, GymImgCreateDTO } from '../../../domain/models/Gym/gym-img.model';
import { GymPlanRead, GymPlanCreate } from '../../../domain/models/Gym/gym-plan.model';
import { GymReadDTO, GymCreateDTO } from '../../../domain/models/Gym/gym.model';
import { UserSubscriptionRead } from '../../../domain/models/Gym/user-subscription.model';
import { GymCoachService } from '../../../services/Gym/gym-coach.service';
import { GymImgService } from '../../../services/Gym/gym-img.service';
import { GymPlanService } from '../../../services/Gym/gym-plan.service';
import { GymService } from '../../../services/Gym/gym.service';
import { UserSubscriptionService } from '../../../services/Gym/user-subscription.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
declare var google: any; 
@Component({
  selector: 'app-gym-details.component',
  imports: [CommonModule,FormsModule,GoogleMapsModule,
    MatMenuModule,
    MatIconModule
  ],
  templateUrl: './gym-details.component.component.html',
  styleUrl: './gym-details.component.component.css'
})
export class GymDetailsComponent implements OnInit {
  gym: GymReadDTO | null = null;
  gymId!: number;

  // Forms
  showAddPlanForm = false;
  showAddImageForm = false;
  showAddCoachForm = false;
  // Map properties
  mapOptions: google.maps.MapOptions = {
    zoom: 18  
  };
  markerPosition: google.maps.LatLngLiteral | null = null;
  mapInitialized = false;
  
  // Tabs
  activeTab: 'info' | 'images' | 'coaches' | 'plans' = 'info';
  
  // Gym Update
  editMode = false;
  updatedGym: GymCreateDTO = {
    ownerId: '',
    name: '',
    location: '',
    description: '',
    latitude: 0,
    longitude: 0
  };
  
  // Images
  images: GymImgReadDTO[] = [];
  newImage: GymImgCreateDTO = { gymId: 0 };
  selectedImageFile: File | null = null;
  
  // Coaches
  coaches: GymCoachDTO[] = [];
  newCoach: GymCoachCreateDTO = { gymId: 0, coachID: '' };
  
  // Plans
  plans: GymPlanRead[] = [];
  newPlan: GymPlanCreate = {
    gymId: 0,
    title: '',
    description: '',
    price: 0,
    durationMonths: 1,
    hasPrivateCoach: false,
    hasNutritionPlan: false,
    hasAccessToAllAreas: false
  };
  
  // Subscriptions (for selected plan)
  selectedPlanId: number | null = null;
  subscriptions: UserSubscriptionRead[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private gymService: GymService,
    private gymImgService: GymImgService,
    private gymCoachService: GymCoachService,
    private gymPlanService: GymPlanService,
    private userSubscriptionService: UserSubscriptionService
  ) {}

  ngOnInit(): void {
    this.gymId = +this.route.snapshot.params['id'];
    this.loadGym();
    this.loadImages();
    this.loadCoaches();
    this.loadPlans();
    this.initGoogleMaps();    
    this.newImage.gymId = this.gymId;
    this.newCoach.gymId = this.gymId;
    this.newPlan.gymId = this.gymId;
  }

  loadGym(): void {
    this.gymService.getGymById(this.gymId).subscribe({
      next: (gym) => {
        this.gym = gym;
        this.updatedGym = { ...gym };
        console.log(gym.latitude , gym.longitude);
        if (gym.latitude && gym.longitude) {
          this.updateMapPosition(gym.latitude, gym.longitude);
        }
      },
      error: (err) => console.error('Failed to load gym', err)
    });
  }

  updateGym(): void {
    if (!this.gym) return;
    
    this.gymService.updateGym(this.gym.id, this.updatedGym).subscribe({
      next: (updatedGym) => {
        this.gym = updatedGym;
        this.editMode = false;
      },
      error: (err) => console.error('Failed to update gym', err)
    });
  }

  deleteGym(): void {
    if (!this.gym) return;
    
    if (confirm('Are you sure you want to delete this gym?')) {
      this.gymService.deleteGym(this.gym.id).subscribe({
        next: () => this.router.navigate(['/gym-owner']),
        error: (err) => console.error('Failed to delete gym', err)
      });
    }
  }

  // Image Methods
  loadImages(): void {
    this.gymImgService.getByGymId(this.gymId).subscribe({
      next: (images) => this.images = images,
      error: (err) => console.error('Failed to load images', err)
    });
  }

  onImageSelected(event: any): void {
    this.selectedImageFile = event.target.files[0];
  }

  addImage(): void {
    if (!this.selectedImageFile) return;
    
    this.gymImgService.create(this.newImage, this.selectedImageFile).subscribe({
      next: (image) => {
        this.images.push(image);
        this.selectedImageFile = null;
      },
      error: (err) => console.error('Failed to add image', err)
    });
  }

  deleteImage(imageId: number): void {
    if (confirm('Are you sure you want to delete this image?')) {
      this.gymImgService.delete(imageId).subscribe({
        next: () => this.images = this.images.filter(img => img.id !== imageId),
        error: (err) => console.error('Failed to delete image', err)
      });
    }
  }

  // Coach Methods
  loadCoaches(): void {
    this.gymCoachService.getGymCoachesByGymId(this.gymId).subscribe({
      next: (coaches) => this.coaches = coaches,
      error: (err) => console.error('Failed to load coaches', err)
    });
  }

  addCoach(): void {
    this.gymCoachService.createGymCoach(this.newCoach).subscribe({
      next: (coach) => {
        this.coaches.push(coach);
        this.newCoach.coachID = '';
      },
      error: (err) => console.error('Failed to add coach', err)
    });
  }

  deleteCoach(coachId: number): void {
    if (confirm('Are you sure you want to remove this coach?')) {
      this.gymCoachService.deleteGymCoach(coachId).subscribe({
        next: () => this.coaches = this.coaches.filter(c => c.id !== coachId),
        error: (err) => console.error('Failed to delete coach', err)
      });
    }
  }

  viewCoachPortfolio(coachId: string): void {
    this.router.navigate(['/coach/profile/', coachId]);
  }

  // Plan Methods
  loadPlans(): void {
    this.gymPlanService.getByGymId(this.gymId).subscribe({
      next: (plans) => this.plans = plans,
      error: (err) => console.error('Failed to load plans', err)
    });
  }

  addPlan(): void {
    this.gymPlanService.create(this.newPlan).subscribe({
      next: (plan) => {
        this.plans.push(plan);
        this.showAddPlanForm = false;
        this.resetNewPlanForm();
      },
      error: (err) => console.error('Failed to add plan', err)
    });
  }

  resetNewPlanForm(): void {
    this.newPlan = {
      gymId: this.gymId,
      title: '',
      description: '',
      price: 0,
      durationMonths: 1,
      hasPrivateCoach: false,
      hasNutritionPlan: false,
      hasAccessToAllAreas: false
    };
  }

  viewPlanDetails(planId: number): void {
    this.router.navigate(['/gym-owner/plan', planId]);
  }

  // Google Maps Methods
  initGoogleMaps(): void {
    if (typeof google === 'undefined' || !google.maps || !google.maps.places) {
      this.loadGoogleMapsScript();
    } else {
      this.mapInitialized = true;
      if (this.gym?.latitude && this.gym?.longitude) {
        this.updateMapPosition(this.gym.latitude, this.gym.longitude);
      }
    }
  }
  
  loadGoogleMapsScript(): void {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAFEYZKTxhZz5eY9c760Gyz7kJ3mNbXb34&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => this.mapInitialized = true;
      document.head.appendChild(script);
  }
  handleMapClick(event: google.maps.MapMouseEvent): void {
    if (event.latLng) {
      this.markerPosition = event.latLng.toJSON();
      this.updatedGym.latitude = this.markerPosition.lat;
      this.updatedGym.longitude = this.markerPosition.lng;
    }
  }
  private updateMapPosition(lat: number, lng: number): void {
    this.mapOptions = {
      ...this.mapOptions,
      center: { lat, lng }
    };
    
    this.markerPosition = { lat, lng };
  }

  toggleAddPlanForm(): void {
    this.showAddPlanForm = !this.showAddPlanForm;
  }

  toggleAddImageForm(): void {
    this.showAddImageForm = !this.showAddImageForm;
  }

  toggleAddCoachForm(): void {
    this.showAddCoachForm = !this.showAddCoachForm;
  }

}
