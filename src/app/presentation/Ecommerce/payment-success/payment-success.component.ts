import { OrderRequestDTO } from './../../../domain/models/Ecommerce/order.model';
import { PaymentDTO } from './../../../domain/models/Ecommerce/payment.mdoel';
import { ShippingDTO } from './../../../domain/models/Ecommerce/shipping.model';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PaymentService } from '../../../services/Ecommerce/payment.service';
import { CartService } from '../../../services/Ecommerce/cart.service';
import { OrderService } from '../../../services/Ecommerce/order.service';
import { ShippingService } from '../../../services/Ecommerce/shipping.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payment-sucess',
  imports: [CommonModule,RouterModule],
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.css']
})
export class PaymentSuccessComponent {
  order: any = null;
// Payment state
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
    private cartService: CartService,
    private orderService: OrderService,
    private shippingService: ShippingService
  ) {}

  ngOnInit() {
    this.activatedRoute.queryParamMap.subscribe(params => {
      this.paymentInfo.pending = params.get('pending') === 'true';
      this.paymentInfo.amount_cents = Number(params.get('amount_cents'));
      this.paymentInfo.success = params.get('success') === 'true';
      this.paymentInfo.created_at = params.get('created_at') ?? '';
      this.paymentInfo.currency = params.get('currency') || 'EGP';
      this.paymentInfo.paymentMethod = params.get('source_data.sub_type') || 'Credit Card';

      this.createOrder();
    });
  }

  createOrder() {
    const cartTotal = this.cartService.getTotalPrice();
    const expectedAmount = this.paymentInfo.amount_cents / 100;

    if (cartTotal === expectedAmount && this.paymentInfo.success){
      const paymentObj: PaymentDTO = {
        amount: expectedAmount,
        currency: this.paymentInfo.currency,
        paymentMethod: this.paymentInfo.paymentMethod,
        status: this.paymentInfo.success==true ? 2 : 3,
        createdAt: this.paymentInfo.created_at,
        updatedAt: this.paymentInfo.created_at
      };

      this.paymentService.CreatePayment(paymentObj).subscribe({
        next: (paymentRes) => {
          if (!paymentRes.id) {
            this.paymentState = false;
            console.error('Payment ID is missing!');
            return;
          }

            const shippingInfo = this.shippingService.getShipping();
            if (!shippingInfo) {
              console.error('Shipping info not found!');
              return;
            }

          const orderRequest: OrderRequestDTO = {
            PaymentId: paymentRes.id,
            Shipping: shippingInfo,
            OrderItems: this.cartService.getCart().map((item)=>{
              return{
                productId: item.id,
                quantity: item.quantity,
                price: item.price
              }
            })
          };

          this.orderService.createOrder(orderRequest).subscribe({
            next: (orderRes) => {
              this.order = orderRes;
              if (this.order.paymentId) {

                this.paymentState = true ;

                this.router.navigate(['/order-summary', this.order.id]);
              } else {
                this.paymentState = false;
              }
              this.cartService.clearCart();
              this.shippingService.clearShipping();
            },
            error: (err) => {
              this.paymentState = false;
              if(err.error){
                this.errorMessage = err.error.message;
              }
            }
          });
        },
        error: (err) => {
          console.error("Payment creation failed", err);
        }
      });
    } else {
      console.warn("Payment validation failed.");
    }
  }
  goBack() {
     this.router.navigate(['/shop']);
  }
}
