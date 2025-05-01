import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { GymPlanRead } from '../../../domain/models/Gym/gym-plan.model';
import { GymReadDTO } from '../../../domain/models/Gym/gym.model';
import { UserSubscriptionRead, UserSubscriptionUpdate, PaymentStatus } from '../../../domain/models/Gym/user-subscription.model';
import { GymPlanService } from '../../../services/Gym/gym-plan.service';
import { GymService } from '../../../services/Gym/gym.service';
import { UserSubscriptionService } from '../../../services/Gym/user-subscription.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-subscription-details',
  imports: [CommonModule,FormsModule,RouterModule],
  templateUrl: './subscription-details.component.html',
  styleUrl: './subscription-details.component.css'
})
export class SubscriptionDetailsComponent implements OnInit {
  subscription!: UserSubscriptionRead;
  plan!: GymPlanRead;
  gym!: GymReadDTO;
  subscriptionId!: number;
  editMode = false;
  updatedSubscription: UserSubscriptionUpdate = {
    paymentStatus: PaymentStatus.Unknown,
    startDate: new Date(),
    expiresAt: new Date(),
    isExpired: false
  };

  paymentStatuses = Object.values(PaymentStatus).filter(value => typeof value === 'number');
  statusText: Record<number, string> = {
    0: 'Unknown',
    1: 'Pending',
    2: 'Completed',
    3: 'Failed',
    4: 'Refunded'
  };

  isGymOwner: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userSubscriptionService: UserSubscriptionService,
    private gymPlanService: GymPlanService,
    private gymService: GymService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const userRole = this.authService.getUserRole(); 
    this.isGymOwner = userRole === 'GymOwner';
    this.subscriptionId = +this.route.snapshot.params['id'];
    this.loadSubscription();
  }

  loadSubscription(): void {
    this.userSubscriptionService.getById(this.subscriptionId).subscribe({
      next: (subscription) => {
        this.subscription = subscription;
        this.updatedSubscription = {
          paymentStatus: subscription.paymentStatus,
          startDate: subscription.startDate,
          expiresAt: subscription.expiresAt,
          isExpired: subscription.isExpired
        };
        this.loadPlan(subscription.planId);
        this.loadGym(subscription.gymId);
      },
      error: (err) => console.error('Failed to load subscription', err)
    });
  }

  loadPlan(planId: number): void {
    this.gymPlanService.getById(planId).subscribe({
      next: (plan) => this.plan = plan,
      error: (err) => console.error('Failed to load plan', err)
    });
  }

  loadGym(gymId: number): void {
    this.gymService.getGymById(gymId).subscribe({
      next: (gym) => this.gym = gym,
      error: (err) => console.error('Failed to load gym', err)
    });
  }

  updateSubscription(): void {
    this.userSubscriptionService.update(this.subscriptionId, this.updatedSubscription).subscribe({
      next: (updatedSub) => {
        this.subscription = updatedSub;
        this.editMode = false;
      },
      error: (err) => console.error('Failed to update subscription', err)
    });
  }

  deleteSubscription(): void {
    if (confirm('Are you sure you want to delete this subscription?')) {
      this.userSubscriptionService.delete(this.subscriptionId).subscribe({
        next: () => this.router.navigate(['/gym-owner/plan', this.subscription.planId]),
        error: (err) => console.error('Failed to delete subscription', err)
      });
    }
  }

  validateQrCode(): void {
    this.userSubscriptionService.validateQrCode(this.subscription.rawData).subscribe({
      next: (subscription) => {
        alert(`Valid QR Code!`);
      },
      error: (err) => alert('Invalid QR Code')
    });
  }

  getStatusName(status: number): string {
    return this.statusText[status] || 'Unknown';
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;
    if (this.editMode) {
      this.updatedSubscription = {
        paymentStatus: this.subscription.paymentStatus,
        startDate: this.subscription.startDate,
        expiresAt: this.subscription.expiresAt,
        isExpired: this.subscription.isExpired
      };
    }
  }

}
