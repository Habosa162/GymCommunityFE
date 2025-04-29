import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from '../../../services/Ecommerce/payment.service';

@Component({
  selector: 'app-premium-payment-success',
  imports: [],
  templateUrl: './premium-payment-success.component.html',
  styleUrl: './premium-payment-success.component.css'
})
export class PremiumPaymentSuccessComponent {

paymentState: boolean = false;
paymentDetails: any = null;
errorMessage: string = 'Payment processing failed. Please try again.';

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
 
  ) {}

  ngOnInit() {
    this.activatedRoute.queryParamMap.subscribe(params => {
      this.paymentInfo.pending = params.get('pending') === 'true';
      this.paymentInfo.amount_cents = Number(params.get('amount_cents'));
      this.paymentInfo.success = params.get('success') === 'true';
      this.paymentInfo.created_at = params.get('created_at') ?? '';
      this.paymentInfo.currency = params.get('currency') || 'EGP';
      this.paymentInfo.paymentMethod = params.get('source_data.sub_type') || 'Credit Card';

      //create premium subscription
      this.createPremiumSubscription();

    });
  }

  createPremiumSubscription() {
    if(this.paymentInfo.success){
      console.log("create premium subscription done");
    }
    else{
      console.log("create premium subscription failed");
    }
  }

}
