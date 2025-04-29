import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from '../../../services/Ecommerce/payment.service';
import { GeneralUsersService } from '../../../services/GeneralUsers/general-users.service';
import { LoaderComponent } from '../../../core/shared/components/Loader/loader/loader.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-premium-payment-success',
  imports: [LoaderComponent , CommonModule],
  templateUrl: './premium-payment-success.component.html',
  styleUrl: './premium-payment-success.component.css'
})
export class PremiumPaymentSuccessComponent {

paymentState: boolean = false;
paymentDetails: any = null;
errorMessage: string = 'Payment processing failed. Please try again.';
success: boolean = false;
userName: string = '';
message: string = '';
  paymentInfo = {
    pending: false,
    amount_cents: 0,
    success: false,
    created_at: '',
    currency: '',
    paymentMethod: ''
  };


  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private paymentService: PaymentService,
    private generalUsersService: GeneralUsersService

  ) {}

  ngOnInit() {
    this.activatedRoute.queryParamMap.subscribe(params => {
      this.paymentInfo.pending = params.get('pending') === 'true';
      this.paymentInfo.amount_cents = Number(params.get('amount_cents'));
      this.paymentInfo.success = params.get('success') === 'true';
      this.paymentInfo.created_at = params.get('created_at') ?? '';
      this.paymentInfo.currency = params.get('currency') || 'EGP';
      this.paymentInfo.paymentMethod = params.get('source_data.sub_type') || 'Credit Card';
      this.userName = params.get('first_name') || '';
      //create premium subscription
      this.createPremiumSubscription();

    });
  }

  createPremiumSubscription() {
    if(this.paymentInfo.success){
      this.generalUsersService.givePremium().subscribe({
        next: (response: any) => {
          console.log(response);
          this.success = response.success;
          this.message = response.message +"🎉";
          localStorage.setItem('token', response.token.result);

          setTimeout(() => {
            this.router.navigate(['/buy-premium']);
          }, 5000);
        },
        error: (error) => {
          console.log(error);
        }
      });
    }
    else{
      console.log("create premium subscription failed");
      this.message = "Payment failed. Please try again.";
      this.router.navigate(['/']);
    }
  }

}
