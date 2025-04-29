import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product } from './../../../domain/models/Ecommerce/product.model';
import { wishlistItem } from './../../../domain/models/Ecommerce/wishList.model';
import { WishlistService } from './../../../services/Ecommerce/wishlist.service';
import { AuthService } from '../../../services/auth.service';
import { CartService } from '../../../services/Ecommerce/cart.service';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from '../../../services/Ecommerce/product.service';

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
    private cartService: CartService,
    private toastr: ToastrService,
    private productService:ProductService
  ) {}

  ngOnInit() {
    this.getWishlist();
  }



  // Cart Methods
  addToCart(product:Product): void {
    if (!this.cartService.isInCart(product.id)) {
      this.cartService.addToCart(product);
      this.productService.toasterSuccess('was added to cart', product);
    } else {
      this.cartService.removeFromCart(product.id);
      this.productService.toasterSuccess('was removed from cart', product);
    }
  }
  isInCart(product: Product): boolean {
    return product ? this.cartService.isInCart(product.id) : false;
  }
  //wishlist Methods
  getWishlist() {
    this.wishlistService.getWishlist().subscribe({
      next: (res) => {
        this.WishList = res;
      },
      error: (err) => this.toastr.error('Network Connection', 'Error')
    });
  }

  addToWishlist(productId: number) {
    this.animatedHeart[productId] = true;

    this.wishlistService.addToWishlist(productId).subscribe({
      next: (res) => {
        this.productService.toasterSuccess('was added to wishlist<i class="fa fa-cart"></i>', this.product);
        this.getWishlist();
        this.resetAnimation(productId);
      },
      error: (err) => {
        this.resetAnimation(productId);
        this.toastr.error('Network Connection', 'Error');
      }
    });
  }

  removeFromWishlist(productId: number) {
    const wishListItem = this.WishList.find(item => item.id === productId);
    if (!wishListItem) return;

    this.animatedHeart[productId] = true;

    this.wishlistService.removeFromWishlist(wishListItem.wishListId).subscribe((res)=>{
      this.productService.toasterSuccess('was removed from cart', this.product);
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

  getStars(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0).map((_, i) => i);
  }
}
