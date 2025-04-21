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

@Component({
  selector: 'app-gym-details.component',
  imports: [CommonModule,FormsModule],
  templateUrl: './gym-details.component.component.html',
  styleUrl: './gym-details.component.component.css'
})
export class GymDetailsComponent implements OnInit {
  gym: GymReadDTO | null = null;
  gymId!: number;
  
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
    
    this.newImage.gymId = this.gymId;
    this.newCoach.gymId = this.gymId;
    this.newPlan.gymId = this.gymId;
  }

  loadGym(): void {
    this.gymService.getGymById(this.gymId).subscribe({
      next: (gym) => {
        this.gym = gym;
        this.updatedGym = { ...gym };
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
    this.router.navigate(['/coaches', coachId]);
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

  updatePlan(plan: GymPlanRead): void {
    this.gymPlanService.update(plan.id, plan).subscribe({
      next: (updatedPlan) => {
        const index = this.plans.findIndex(p => p.id === updatedPlan.id);
        if (index !== -1) {
          this.plans[index] = updatedPlan;
        }
      },
      error: (err) => console.error('Failed to update plan', err)
    });
  }

  deletePlan(planId: number): void {
    if (confirm('Are you sure you want to delete this plan?')) {
      this.gymPlanService.delete(planId).subscribe({
        next: () => this.plans = this.plans.filter(p => p.id !== planId),
        error: (err) => console.error('Failed to delete plan', err)
      });
    }
  }

  // Subscription Methods
  loadSubscriptions(planId: number): void {
    this.selectedPlanId = planId;
    this.userSubscriptionService.getByPlanId(planId).subscribe({
      next: (subscriptions) => this.subscriptions = subscriptions,
      error: (err) => console.error('Failed to load subscriptions', err)
    });
  }

  viewSubscriptionDetails(subscriptionId: number): void {
    this.router.navigate(['/gym-owner/subscription', subscriptionId]);
  }

  deleteSubscription(subscriptionId: number): void {
    if (confirm('Are you sure you want to delete this subscription?')) {
      this.userSubscriptionService.delete(subscriptionId).subscribe({
        next: () => {
          this.subscriptions = this.subscriptions.filter(s => s.id !== subscriptionId);
          if (this.selectedPlanId) {
            this.loadSubscriptions(this.selectedPlanId);
          }
        },
        error: (err) => console.error('Failed to delete subscription', err)
      });
    }
  }

  validateQrCode(qrCodeData: string): void {
    this.userSubscriptionService.validateQrCode(qrCodeData).subscribe({
      next: (subscription) => {
        alert(`Subscription validated for user: ${subscription.userId}`);
      },
      error: (err) => alert('Invalid QR Code')
    });
  }

}
