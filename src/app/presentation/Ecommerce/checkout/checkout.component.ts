import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CartService } from '../../../services/Ecommerce/cart.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-checkout',
  imports: [CommonModule,FormsModule ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {
  cartItems: any[] = []; 
  totalPrice: number = 0;
  shipping = {
    name: '',
    address: '',
    phone: ''
  };

  constructor(private cartService:CartService){}

  ngOnInit(): void {
    this.cartItems = this.cartService.getCart();
    this.totalPrice = this.cartService.getTotalPrice();
  }
  submitOrder() {
    const order = {
      items: this.cartItems,
      total: this.totalPrice,
      shipping: this.shipping,
      date: new Date()
    };
    console.log('Order Submitted:', order);
    // TODO: send to backend API
    alert('Order submitted successfully ✅');
    this.cartService.clearCart();
  }
}
