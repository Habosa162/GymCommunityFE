import { Component } from '@angular/core';
import { CartService } from '../../../services/Ecommerce/cart.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart',
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  cartItems: any[] = [];
  totalPrice: number = 0;
  constructor(private cartService:CartService){}
  ngOnInit(): void {
    this.loadCart();
  }
  loadCart() {
    this.cartItems = this.cartService.getCart() ; 
    this.calculateTotal();
  }
  increaseQuantity(productId: number) {
    this.cartService.updateQuantity(productId, 1);
    this.loadCart();
  }
  decreaseQuantity(productId: number) {
    this.cartService.updateQuantity(productId,-1);
    this.loadCart();
  }
  removeItem(productId: number) {
    this.cartService.removeFromCart(productId);
    this.loadCart();
  }
  calculateTotal() {
    this.totalPrice = this.cartService.getTotalPrice();
  }

  clearCart() {
    this.cartService.clearCart();
    this.loadCart();
  }
}
