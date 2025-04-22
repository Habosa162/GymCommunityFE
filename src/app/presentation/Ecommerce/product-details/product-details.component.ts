import { AuthService } from './../../../services/auth.service';
import { WishlistService } from './../../../services/Ecommerce/wishlist.service';
import { CartService } from './../../../services/Ecommerce/cart.service';
import { ReviewService } from './../../../services/Ecommerce/review.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from './../../../services/Ecommerce/product.service';
import { Product } from '../../../domain/models/Ecommerce/product.model';
import { ProductComponent } from '../product/product.component';
import { CommonModule } from '@angular/common';
import { wishlistItem } from '../../../domain/models/Ecommerce/wishList.model';

@Component({
  selector: 'app-product-details',
  imports: [ProductComponent, CommonModule, RouterModule],
  standalone: true,
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  CategoryProducts: Product[] = [];
  Product: Product | null = null;
  reviews: any[] = [];
  WishList: wishlistItem[] = [];
  animatedHeart: { [productId: number]: boolean } = {};
  isHovering = false;
  


  constructor(
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private reviewService: ReviewService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    protected authService : AuthService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      const productId = params.get('id');
      if (productId) {
        this.loadProductDetails(+productId);
        this.loadReviews(+productId);
        this.loadWishlist();
      }
    });
  }
//cart Methods
  addToCart(product:Product): void {
    if (!this.cartService.isInCart(product.id)) {
      this.cartService.addToCart(product);
    } else {
      this.cartService.removeFromCart(product.id);
    }
  }
  isInCart(product: Product): boolean {
    return product ? this.cartService.isInCart(product.id) : false;
  }
//wishlist Methods
private loadWishlist(): void {
  this.wishlistService.getWishlist().subscribe({
    next: (res) => {
      this.WishList = res;
    },
    error: (err) => {
      console.error('Failed to fetch wishlist:', err);
    }
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
addToWishList(productId:number): void {
  this.animatedHeart[productId] = true;

  if (this.Product) {
    this.wishlistService.addToWishlist(productId).subscribe({
      next: () => {
        console.log('Product added to wishlist:', this.Product);
        this.loadWishlist();
        this.resetAnimation(productId);
      },
      error: (err) => {
        console.error('Error adding product to wishlist:', err);
      }
    });
  }
}

removeFromWishList(productId: number): void {
  const wishListItem = this.WishList.find(item => item.id === productId);
  if (!wishListItem) return;
  this.animatedHeart[productId] = true;

  this.wishlistService.removeFromWishlist(wishListItem.wishListId).subscribe((res) => {
    console.log('Removed from wishlist', res);
    this.loadWishlist();
  });
}

// reviews Methods
private loadReviews(productId: number): void {
  this.reviewService.getReviews(productId).subscribe({
    next: (reviews) => {
      this.reviews = reviews; // Store the reviews here
    },
    error: (err) => {
      console.error('Error loading reviews:', err);
    }
  });
}

//prouct Methods
  private loadProductDetails(productId: number): void {
    this.productService.getOneProduct(productId).subscribe({
      next: (product) => {
        this.Product = product;
        this.loadCategoryProducts(product.categoryID);
      },
      error: (err) => {
        console.error('Error loading product details:', err);
      }
    });
  }
  private loadCategoryProducts(categoryId: number): void {
    this.productService.getProductByCategory(categoryId).subscribe({
      next: (products) => {
        this.CategoryProducts = products;
      },
      error: (err) => {
        console.error('Error loading category products:', err);
      }
    });
  }





  getStars(rating: number): number[] {
    const fullStars = Math.floor(rating);
    const halfStars = (rating % 1) !== 0 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStars;

    return [
      ...new Array(fullStars).fill(1),  // Full stars
      ...new Array(halfStars).fill(0.5),  // Half star
      ...new Array(emptyStars).fill(0)  // Empty stars
    ];
  }
}
