import { OrderRequestDTO } from './../../../domain/models/Ecommerce/order.model';
import { PaymentDTO } from './../../../domain/models/Ecommerce/payment.mdoel';
import { ShippingDTO } from './../../../domain/models/Ecommerce/shipping.model';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from '../../../services/Ecommerce/payment.service';
import { CartService } from '../../../services/Ecommerce/cart.service';
import { OrderService } from '../../../services/Ecommerce/order.service';
import { ShippingService } from '../../../services/Ecommerce/shipping.service';

@Component({
  selector: 'app-payment-sucess',
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.css']
})
export class PaymentSuccessComponent {

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
  test() {
    console.log(this.cartService.getCart());
    console.log(this.shippingService.getShipping());

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
              console.log("Order Created Successfully", orderRes);
              this.cartService.clearCart();
              this.shippingService.clearShipping();
              this.router.navigate(['/']);
            },
            error: (err) => {
              console.error("Order creation failed", err);
              if(err.error){
                console.error("Error body:", err.error);
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
}
