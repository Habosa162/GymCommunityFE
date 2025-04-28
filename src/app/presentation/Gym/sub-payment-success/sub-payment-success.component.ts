import { Component, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { UserSubscriptionRead, PaymentStatus } from '../../../domain/models/Gym/user-subscription.model';
import { UserSubscriptionService } from '../../../services/Gym/user-subscription.service';
import { CommonModule } from '@angular/common';
import { PaymentDTO } from '../../../domain/models/Ecommerce/payment.mdoel';
import { PaymentService } from '../../../services/Ecommerce/payment.service';
import { switchMap } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { GymPlanService } from '../../../services/Gym/gym-plan.service';

@Component({
  selector: 'app-sub-payment-success',
  imports: [CommonModule,MatProgressSpinnerModule,MatIconModule],
  templateUrl: './sub-payment-success.component.html',
  styleUrl: './sub-payment-success.component.css'
})
export class SubPaymentSuccessComponent implements OnInit {
  paymentDetails: any;
  subscriptionDetails: any;
  isLoading = true;
  isSuccess = false;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private paymentService: PaymentService,
    private subscriptionService: UserSubscriptionService,
    private gymplanService: GymPlanService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['success'] === 'true' && params['pending'] === 'false') {
        this.processSuccessfulPayment(params);
      } else {
        this.handlePaymentFailure(params);
      }
    });
  }

  private processSuccessfulPayment(params: any): void {
    this.paymentDetails = {
      id: localStorage.getItem("paymentId") || '',
      amount: +params['amount_cents'] / 100, 
      currency: params['currency'],
      transactionId: params['order'],
      status: params['success'] === 'true' ? PaymentStatus.Completed : PaymentStatus.Failed,
      createdAt: params['created_at'],
      paymentMethod: params['source_data']?.sub_type || 'card'
    };

    const subscriptionId = localStorage.getItem("subscriptionId"); 
    console.log('Payment details:', this.paymentDetails);
    console.log('Subscription ID:', subscriptionId);
    if (subscriptionId) {
      this.subscriptionService.getById(+subscriptionId).subscribe({
        next: (subscription) => {
          this.subscriptionDetails = subscription;
          console.log('Subscription details:', this.subscriptionDetails);
          this.gymplanService.getById(this.subscriptionDetails.planId).subscribe({
            next: (plan) => {
              this.subscriptionDetails.plan = plan;
              console.log('Plan details:', this.subscriptionDetails.plan);
            },
            error: (err) => {
              console.error('Failed to load plan details', err);
              this.isLoading = false;
            }
          });
          this.isSuccess = true;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Failed to load subscription details', err);
          this.isLoading = false;
          this.isSuccess = false;
        }
      });
    } else {
      this.isLoading = false;
      this.isSuccess = true;
    }
  }


  private handlePaymentFailure(params: any): void {
    this.errorMessage = params['data.message'] || 'Payment processing failed';
    this.isLoading = false;
    console.error('Payment failed:', params);
  }

  navigateToHome(): void {
    this.router.navigate(['/']);
  }
}