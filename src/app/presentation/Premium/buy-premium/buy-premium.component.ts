import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { PaymentService } from '../../../services/Ecommerce/payment.service';
import { FrontbaseUrl } from '../../../services/enviroment';

@Component({
  selector: 'app-buy-premium',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './buy-premium.component.html',
  styleUrl: './buy-premium.component.css'
})
export class BuyPremiumComponent {

  constructor(private router: Router, private authService: AuthService, private route: ActivatedRoute,private paymentService: PaymentService,
) {}

  paymentMethod: string = 'Paymob';
  totalPrice: number = 500;


    processPayment() {
    if (this.paymentMethod === 'Paymob') {
      this.PaymobRequest();
    } else {
      alert("Please select Paymob to proceed with payment.");
    }
  }

    PaymobRequest() {


    const orderData = {
      amount: this.totalPrice * 100,
      currency: "EGP",
      payment_methods: [4419883, 4437311, 4437297],
      orderItems: "Premium 500EGP",
      billing_data: {
        "apartment": "dumy",
        "first_name": "mostafa" ,  // First Name, Last Name, Phone number, & Email are mandatory fields within sending the intention request
        "last_name": "samir",
        "street": "dumy",
        "building": "dumy",
        "phone_number": "01228987781",
        "city": "dumy",
        "country": "dumy",
        "email": this.authService.getUserEmail,
        "floor": "dumy",
        "state": "dumy"
      },
      extras: { id: this.authService.getUserId },
      redirection_url: `${FrontbaseUrl}/premium-payment-success`,
    };

    this.paymentService.PaymobRequest(orderData).subscribe({
      next: (response: any) => {
        const clientSecret = response.client_secret;
        if (clientSecret) {
          const paymentUrl = `https://accept.paymob.com/unifiedcheckout/?publicKey=egy_pk_test_jrlnWL5oJX8IRTp9xpeHq5mmQhAMfXES&clientSecret=${clientSecret}`;
          window.location.href = paymentUrl;
        } else {
          console.error("Client secret not found in the response.");
          alert("Failed to retrieve payment details.");
        }
      },
      error: (error) => {
        console.log(error);
        console.error("Error in Paymob API request:", error);
        alert("Failed to process payment. Please try again.");
      }
    });
  }

  upgradeToPremium(): void {
    this.processPayment();
    // Here you would typically:
    // 1. Call your payment service
    // 2. Handle the payment process
    // 3. Update the user's premium status
    // 4. Redirect to success page or show confirmation
    
    // For now, we'll just log and redirect
   
  }
}

