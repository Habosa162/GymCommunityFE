import { Component, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { UserSubscriptionRead, PaymentStatus, UserSubscriptionCreate } from '../../../domain/models/Gym/user-subscription.model';
import { UserSubscriptionService } from '../../../services/Gym/user-subscription.service';
import { CommonModule } from '@angular/common';
import { PaymentDTO } from '../../../domain/models/Ecommerce/payment.mdoel';
import { PaymentService } from '../../../services/Ecommerce/payment.service';
import { switchMap, catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { GymPlanService } from '../../../services/Gym/gym-plan.service';

@Component({
  selector: 'app-sub-payment-success',
  imports: [CommonModule, MatProgressSpinnerModule, MatIconModule],
  templateUrl: './sub-payment-success.component.html',
  styleUrl: './sub-payment-success.component.css'
})
export class SubPaymentSuccessComponent implements OnInit {
  paymentDetails: any;
  subscriptionDetails: any;
  isLoading = true;
  isSuccess = false;
  errorMessage: string | null = null;
  subscriptionId!: number;
  isSubscriptionCreated = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private paymentService: PaymentService,
    private subscriptionService: UserSubscriptionService,
    private gymplanService: GymPlanService
  ) {}

  ngOnInit(): void {
    // Check if we already processed this subscription
    const storedSubscriptionId = localStorage.getItem('subscriptionId');
    if (storedSubscriptionId) {
      this.subscriptionId = +storedSubscriptionId;
      this.isSubscriptionCreated = true;
    }

    this.route.queryParams.subscribe(params => {
      if (params['success'] === 'true' && params['pending'] === 'false') {
        //this.processSuccessfulPayment(params);
        this.createSubscriptionAndPayment(params, PaymentStatus.Completed);

      } else {
        this.handlePaymentFailure(params);
      }
    });
  }

  private processSuccessfulPayment(params: any): void {
    if (this.isSubscriptionCreated) {
      // If subscription already exists, just update payment status
      this.updatePaymentStatus(PaymentStatus.Completed, params);
      return;
    }

    this.createSubscriptionAndPayment(params, PaymentStatus.Completed);
  }

  private handlePaymentFailure(params: any): void {
    if (this.isSubscriptionCreated) {
      // If subscription exists, update to failed status
      this.updatePaymentStatus(PaymentStatus.Failed, params);
      return;
    }

    // Create subscription with failed status
    this.createSubscriptionAndPayment(params, PaymentStatus.Failed);
  }

  private createSubscriptionAndPayment(params: any, status: PaymentStatus): void {
    const gymId = localStorage.getItem('gymId');
    const planId = localStorage.getItem('planId');
    const userId = localStorage.getItem('userId');
    const planPrice = localStorage.getItem('planprice');

    if (!gymId || !planId || !userId || !planPrice) {
      this.errorMessage = 'Missing required parameters';
      this.isLoading = false;
      return;
    }

    const startDate = new Date();
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 1);

    const subscriptionData: UserSubscriptionCreate = {
      userId: userId,
      gymId: +gymId,
      planId: +planId,
      startDate: startDate,
      expiresAt: expiresAt,
      paymentStatus: status
    };

    this.subscriptionService.create(subscriptionData).pipe(
      tap(subscription => {
        this.subscriptionId = subscription.id;
        localStorage.setItem('subscriptionId', subscription.id.toString());
        this.isSubscriptionCreated = true;
      }),
      switchMap(subscription => {
        const paymentData: PaymentDTO = {
          amount: +planPrice,
          currency: 'EGP',
          paymentMethod: 'Paymob',
          status: status,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        return this.paymentService.CreatePayment(paymentData);
      }),
      catchError(err => {
        console.error('Error in subscription/payment flow:', err);
        this.errorMessage = 'Failed to complete subscription process';
        this.isLoading = false;
        return of(null);
      })
    ).subscribe({
      next: (payment) => {
        if (payment) {
          console.log('Payment processed with status:', status);
          if (status === PaymentStatus.Completed) {
            this.loadSubscriptionDetails();
          } else {
            this.errorMessage = 'Payment failed';
            this.isLoading = false;
          }
        }
      }
    });
  }

  private updatePaymentStatus(status: PaymentStatus, params: any): void {
    if (!this.subscriptionId) return;

    this.subscriptionService.update(this.subscriptionId, { 
      paymentStatus: status, 
      startDate: new Date(), 
      expiresAt: new Date(new Date().setMonth(new Date().getMonth() + 1)), 
      isExpired: status === PaymentStatus.Failed 
    }).pipe(
      switchMap(() => {
        return this.paymentService.UpdatePayment(this.subscriptionId, { 
          amount: this.subscriptionDetails.plan.price,
          currency: 'EGP',
          paymentMethod: 'Paymob',
          status: status,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      })
    ).subscribe({
      next: () => {
        if (status === PaymentStatus.Completed) {
          this.loadSubscriptionDetails();
        } else {
          this.errorMessage = 'Payment failed';
          this.isLoading = false;
        }
      },
      error: (err) => {
        console.error('Failed to update payment status:', err);
        this.errorMessage = 'Failed to update payment status';
        this.isLoading = false;
      }
    });
  }

  private loadSubscriptionDetails(): void {
    this.subscriptionService.getById(this.subscriptionId).pipe(
      switchMap(subscription => {
        this.subscriptionDetails = subscription;
        return this.gymplanService.getById(subscription.planId);
      })
    ).subscribe({
      next: (plan) => {
        this.subscriptionDetails.plan = plan;
        this.preparePaymentDetails();
        this.isSuccess = true;
        this.isLoading = false;
        this.cleanupLocalStorage();
      },
      error: (err) => {
        console.error('Failed to load details:', err);
        this.errorMessage = 'Failed to load subscription details';
        this.isLoading = false;
      }
    });
  }

  private preparePaymentDetails(): void {
    this.paymentDetails = {
      amount: this.subscriptionDetails.plan.price,
      currency: 'EGP',
      status: 'Paid',
      paymentMethod: 'Paymob',
      createdAt: new Date().toISOString()
    };
  }

  private cleanupLocalStorage(): void {
    // Keep subscriptionId until the process is fully complete
    localStorage.removeItem('gymId');
    localStorage.removeItem('planId');
    localStorage.removeItem('userId');
    localStorage.removeItem('planprice');
    localStorage.removeItem('paymentId');
  }

  navigateToHome(): void {
    this.router.navigate(['/']);
  }
}