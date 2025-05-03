import { Component } from '@angular/core';
import { CartService } from '../../../services/Ecommerce/cart.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  cartItems: any[] = [];
  paginatedCartItems: any[] = [];
  totalPrice: number = 0;
  currentPage: number = 1;
  itemsPerPage: number = 4; // Show 4 items per page
  totalPages: number = 0;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart() {
    this.cartItems = this.cartService.getCart();
    this.calculateTotal();
    this.updatePaginatedCartItems();
  }

  increaseQuantity(productId: number) {
    this.cartService.updateQuantity(productId, 1);
    this.loadCart();
  }

  decreaseQuantity(productId: number) {
    this.cartService.updateQuantity(productId, -1);
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

  // Pagination methods
  updatePaginatedCartItems(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedCartItems = this.cartItems.slice(startIndex, endIndex);
    this.totalPages = Math.ceil(this.cartItems.length / this.itemsPerPage);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedCartItems();
    }
  }

  getPagesToShow(): number[] {
    if (this.totalPages <= 5) {
      return Array.from({length: this.totalPages}, (_, i) => i + 1);
    }
    
    let start = Math.max(2, this.currentPage - 1);
    let end = Math.min(this.totalPages - 1, this.currentPage + 1);
    
    if (this.currentPage <= 3) {
      end = 4;
    }
    
    if (this.currentPage >= this.totalPages - 2) {
      start = this.totalPages - 3;
    }
    
    const pages = [1];
    if (start > 2) pages.push(-1); // -1 represents ellipsis
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    if (end < this.totalPages - 1) pages.push(-1);
    if (this.totalPages > 1) pages.push(this.totalPages);
    
    return pages;
  }
}