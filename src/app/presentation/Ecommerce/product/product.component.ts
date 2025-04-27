import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product } from './../../../domain/models/Ecommerce/product.model';
import { wishlistItem } from './../../../domain/models/Ecommerce/wishList.model';
import { WishlistService } from './../../../services/Ecommerce/wishlist.service';
import { AuthService } from '../../../services/auth.service';
import { CartService } from '../../../services/Ecommerce/cart.service';
import { ToastrService } from 'ngx-toastr';

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
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.getWishlist();
  }
  toasterSuccess(message: string, product: any) {
    this.toastr.show(
      `<div class="row justify-content-center align-items-center toaster custom-toast custom-toast.toast-success" id="toaster">
        <div class="col-md-4">
          <img src="${product.imageUrl}" 
               class="img-fluid rounded" 
               style="width: 50px; height:50px; object-fit: cover;" 
               />
        </div>

        <div class="col-md-8 d-flex flex-column justify-content-center align-items-start">
          <div class="fw-semibold text-light" style="font-size: 14px !important;"><small>${product.name.toUpperCase()}</small></div>
          <p class="fw-semibold fw-small text-light text-start" style="font-size: 10px !important;"><small>${message}</small></p>
        </div>
      </div>`,
      '',
      {
        enableHtml: true,
        toastClass: 'ngx-toastr',
        positionClass: 'toast-top-right',
        timeOut: 3000,
        closeButton: true,
        progressBar: true,
        progressAnimation: 'decreasing',
      }
    );
  }

  
  
  // Cart Methods
  addToCart(product:Product): void {    
    if (!this.cartService.isInCart(product.id)) {
      this.cartService.addToCart(product); 
      this.toasterSuccess('was added to cart', product);
    } else {
      this.cartService.removeFromCart(product.id);
      this.toasterSuccess('was removed from cart', product);
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
      error: (err) => this.toastr.error('Failed to load wishlist', 'Error')
    });
  }

  addToWishlist(productId: number) {
    this.animatedHeart[productId] = true;

    this.wishlistService.addToWishlist(productId).subscribe({
      next: (res) => {
        this.toasterSuccess('was added to wishlist<i class="fa fa-cart"></i>', this.product);
        this.getWishlist();
        this.resetAnimation(productId);
      },
      error: (err) => {
        this.resetAnimation(productId);
        this.toastr.error('Failed to add to wishlist', 'Error');
      }
    });
  }

  removeFromWishlist(productId: number) {
    const wishListItem = this.WishList.find(item => item.id === productId);
    if (!wishListItem) return;

    this.animatedHeart[productId] = true;

    this.wishlistService.removeFromWishlist(wishListItem.wishListId).subscribe((res)=>{
      this.toasterSuccess('was removed from cart', this.product);
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
