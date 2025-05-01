import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { GymPlanRead, GymPlanCreate } from '../../../domain/models/Gym/gym-plan.model';
import { UserSubscriptionRead, PaymentStatus } from '../../../domain/models/Gym/user-subscription.model';
import { GymPlanService } from '../../../services/Gym/gym-plan.service';
import { UserSubscriptionService } from '../../../services/Gym/user-subscription.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-plan-details',
  imports: [CommonModule ,FormsModule,RouterModule],
  templateUrl: './plan-details.component.html',
  styleUrl: './plan-details.component.css'
})
export class PlanDetailsComponent implements OnInit {
[x: string]: any;
  plan!: GymPlanRead;
  planId!: number;
  editMode = false;
  updatedPlan: GymPlanCreate = {
    gymId: 0,
    title: '',
    description: '',
    price: 0,
    durationMonths: 1,
    hasPrivateCoach: false,
    hasNutritionPlan: false,
    hasAccessToAllAreas: false
  };

  viewSubList = false;
  subscriptions: UserSubscriptionRead[] = [];
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
    private gymPlanService: GymPlanService,
    private userSubscriptionService: UserSubscriptionService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const userRole = this.authService.getUserRole(); 
    this.isGymOwner = userRole === 'GymOwner';
    this.planId = +this.route.snapshot.params['id'];
    this.loadPlan();
    this.loadSubscriptions();
  }

  loadPlan(): void {
    this.gymPlanService.getById(this.planId).subscribe({
      next: (plan) => {
        this.plan = plan;
        this.updatedPlan = { ...plan };
      },
      error: (err) => console.error('Failed to load plan', err)
    });
  }

  loadSubscriptions(): void {
    this.userSubscriptionService.getByPlanId(this.planId).subscribe({
      next: (subscriptions) => this.subscriptions = subscriptions,
      error: (err) => console.error('Failed to load subscriptions', err)
    });
  }

  updatePlan(): void {
    this.gymPlanService.update(this.plan.id, this.updatedPlan).subscribe({
      next: (updatedPlan) => {
        this.plan = updatedPlan;
        this.editMode = false;
      },
      error: (err) => console.error('Failed to update plan', err)
    });
  }

  deletePlan(): void {
    if (confirm('Are you sure you want to delete this plan?')) {
      this.gymPlanService.delete(this.planId).subscribe({
        next: () => this.router.navigate(['/gym-owner/gym', this.plan.gymId]),
        error: (err) => console.error('Failed to delete plan', err)
      });
    }
  }

  updateSubscriptionStatus(subscription: UserSubscriptionRead): void {
    this.userSubscriptionService.update(subscription.id, {
      paymentStatus: subscription.paymentStatus,
      startDate: subscription.startDate,
      expiresAt: subscription.expiresAt,
      isExpired: subscription.isExpired
    }).subscribe({
      next: (updatedSub) => {
        const index = this.subscriptions.findIndex(s => s.id === updatedSub.id);
        if (index !== -1) {
          this.subscriptions[index] = updatedSub;
        }
      },
      error: (err) => console.error('Failed to update subscription', err)
    });
  }

  deleteSubscription(subscriptionId: number): void {
    if (confirm('Are you sure you want to delete this subscription?')) {
      this.userSubscriptionService.delete(subscriptionId).subscribe({
        next: () => {
          this.subscriptions = this.subscriptions.filter(s => s.id !== subscriptionId);
        },
        error: (err) => console.error('Failed to delete subscription', err)
      });
    }
  }

  validateQrCode(qrCodeData: string): void {
    this.userSubscriptionService.validateQrCode(qrCodeData).subscribe({
      next: (subscription) => {
        alert(`Valid QR Code!`);
      },
      error: (err) => alert('Invalid QR Code')
    });
  }

  getStatusName(status: number): string {
    return this.statusText[status] || 'Unknown';
  }
  toggleSubscriptionList(): void {
    this.viewSubList = !this.viewSubList;
  }

}
