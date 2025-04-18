import { Product } from './../../../domain/models/Ecommerce/product.model';
import { WishlistService } from './../../../services/Ecommerce/wishlist.service';
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-product',
  imports: [CommonModule,RouterLink],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent {
  @Input() product !: Product;
  WishList : Product[] = [] ;
  constructor(private wishlistService : WishlistService){}


  ngOnInit() {
    this.getWishlist();
  }

  //wishList

  getWishlist(){
    this.wishlistService.getWishlist().subscribe((res) => {
      console.log(res);
      this.WishList = res;
    });
  }

  addToWishlist(product: Product) {
    console.log('Product added to wishlist:', product);
    this.wishlistService.addToWishlist(product).subscribe((res) => {
        console.log(res);
    });

  }

  removeFromWishlist(Product: Product) {
    this.wishlistService.removeFromWishlist(Product.id).subscribe((res) => {
      console.log(res);
    });
  }

isInWishlist(product: Product): boolean {
   return !! this.WishList.find((item) => item.id ===product.id);
  }

  addToCart(product: Product) {
    console.log('Product added to cart:', product);
  }

  getStars(rating: number): number[] {
    const stars: number[] = [];
    for (let i = 0; i < Math.floor(rating); i++) {
      stars.push(i);
    }
    return stars;
  }

}

