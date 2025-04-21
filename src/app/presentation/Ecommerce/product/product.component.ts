import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product } from './../../../domain/models/Ecommerce/product.model';
import { wishlistItem } from './../../../domain/models/Ecommerce/wishList.model';
import { WishlistService } from './../../../services/Ecommerce/wishlist.service';
import { AuthService } from '../../../services/auth.service';
import { CartService } from '../../../services/Ecommerce/cart.service';

@Component({
  selector: 'app-product',
  imports: [CommonModule, RouterLink],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent {
  @Input() product!: Product;
  @Output() removedFromWishlist = new EventEmitter<number>();

  WishList: wishlistItem[] = [];
  animatedHeart: { [productId: number]: boolean } = {};

  constructor(
    private wishlistService: WishlistService,
    protected authService: AuthService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.getWishlist();
  }

  getWishlist() {
    this.wishlistService.getWishlist().subscribe({
      next: (res) => {
        this.WishList = res;
      },
      error: (err) => console.error('Failed to fetch wishlist:', err)
    });
  }

  addToWishlist(productId: number) {
    this.animatedHeart[productId] = true;

    this.wishlistService.addToWishlist(productId).subscribe({
      next: (res) => {
        console.log('Added to wishlist', res);
        this.getWishlist();
        this.resetAnimation(productId);
      },
      error: (err) => {
        console.error('Failed to add to wishlist:', err);
        this.resetAnimation(productId);
      }
    });
  }

  removeFromWishlist(productId: number) {
    const wishListItem = this.WishList.find(item => item.id === productId);
    if (!wishListItem) return;

    this.animatedHeart[productId] = true;

    this.wishlistService.removeFromWishlist(wishListItem.wishListId).subscribe((res)=>{
      console.log('Removed from wishlist', res);
      this.getWishlist();
      this.resetAnimation(productId);
      this.removedFromWishlist.emit(wishListItem.wishListId); 
    });
  }

  isInWishlist(productId: number): boolean {
    return this.WishList.some(item => item.id === productId);
  }

  resetAnimation(productId: number) {
    setTimeout(() => {
      this.animatedHeart[productId] = false;
    }, 400);
  }

  addToCart(product: Product) {
    console.log('Product added to cart:', product);
  }

  getStars(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0).map((_, i) => i);
  }
}
