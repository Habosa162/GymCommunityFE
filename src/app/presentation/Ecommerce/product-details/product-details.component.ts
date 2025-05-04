import { Subscription } from 'rxjs';
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
import { Review } from '../../../domain/models/Ecommerce/Review.model'; // Add this import

import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-product-details',
  imports: [ProductComponent, CommonModule, RouterModule ,FormsModule  ],
  standalone: true,
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  isLoading = true ; 
  CategoryProducts: Product[] = [];
  Product: Product | null = null;
  reviews: any[] = [];
  WishList: wishlistItem[] = [];
  animatedHeart: { [productId: number]: boolean } = {};
  isHovering = false;
  newReview: Review = {
    rating: 0,
    comment: '',
    productId: 0
  };
  showReviewForm: boolean = false;
  authorReviews: Review[] = [];
  isSubmitting = false;
  averageRating: number = 0;
  colors = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6', 
            '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D'];
  
  canReview!:boolean ; 
  constructor(
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private reviewService: ReviewService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    protected authService : AuthService,
    private toaster : ToastrService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      const productId = params.get('id');
      if (productId) {
        this.loadProductDetails(+productId);
        this.loadReviews(+productId);
        this.newReview.productId = +productId; 
        this.loadWishlist();
        this.getCanUserReview(Number(productId)) ;
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
private getCanUserReview(productId:number){
  this.reviewService.getCanUserReview(productId).subscribe((res)=>{
    this.canReview = res
    console.log(`______________________UserCanReview__________________${res}`);
    
  })
}
private loadReviews(productId: number): void {
  this.reviewService.getReviews(productId).subscribe({
    next: (reviews) => {
      this.reviews = reviews.filter(r => 
        !this.authService.isLoggedIn() || 
        r.userId !== this.authService.getUserId()
      );
      
      if (this.authService.isLoggedIn()) {
        this.authorReviews = reviews.filter(r => 
          r.userId === this.authService.getUserId()
        );
      }
      
      this.calculateAverageRating();
      this.updatePaginatedReviews(); // Add this line
    },
    error: (err) => {
      console.error('Error loading reviews:', err);
    }
  });
}

calculateAverageRating(): void {
  console.log('Calculating average rating...'); // Debug log
  
  if (!this.reviews || this.reviews.length === 0) {
    this.averageRating = 0;
    return;
  }

  // Filter out invalid ratings
  const validReviews = this.reviews.filter(review => 
    review.rating && !isNaN(review.rating) && review.rating >= 1 && review.rating <= 5
  );

  if (validReviews.length === 0) {
    this.averageRating = 0;
    return;
  }

  const sum = validReviews.reduce((acc, review) => acc + review.rating, 0);
  this.averageRating = sum / validReviews.length;
  
  // Round to 1 decimal place
  this.averageRating = Math.round(this.averageRating * 10) / 10;
  
  console.log('Average rating calculated:', this.averageRating); // Debug log
}
//prouct Methods
  private loadProductDetails(productId: number): void {
    this.productService.getOneProduct(productId).subscribe({
      next: (product) => {
        this.Product = product;
        this.loadCategoryProducts(product.categoryID);
        this.newReview.productId = product.id; // Set product ID for new review
        this.isLoading = true ;
      },
      error: (err) => {
        console.error('Error loading product details:', err);
      }
    });
  }
  private loadCategoryProducts(categoryId: number): void {
    this.productService.getProductsByCategory(categoryId).subscribe({
      next: (products) => {
        this.CategoryProducts = products;
        this.updatePaginatedRelatedProducts(); // Add this line
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

    // Submit Review
    submitReview(): void {
      if (this.newReview.rating === 0 && this.newReview.comment.trim() !== '') {
        this.toaster.success("Please select at least one star") ;
        return;
      }
      
      if (this.newReview.rating === 0 && this.newReview.comment.trim() === '') {
        this.toaster.success("Please select at least one star") ;
        // alert('You must provide a rating or a comment with at least one star.');
        return;
      }
      
      this.isSubmitting = true;
    
      // Add user info to the review
      const reviewToSubmit: Review = {
        ...this.newReview,
        userId: this.authService.getUserId() ?? undefined,
        userName: this.authService.getUserName() ?? undefined,
        userAvatar: this.authService.getProfileImg() ?? undefined
      };
    
      this.reviewService.createReview(reviewToSubmit).subscribe({
        next: (review) => {
          if(review) {
            // Add to both lists if it's the current user's review
            if (review.userId === this.authService.getUserId()) {
              this.authorReviews.push(review);
            }
            this.reviews.push(review);
            this.calculateAverageRating();
            
            // Reload product details to update the average rating
            this.loadProductDetails(this.Product!.id);
          }
          this.toaster.success("Review submitted successfully","Success") ; 
          this.newReview.comment = '';
          this.newReview.rating = 0;
          this.showReviewForm = false;
        },
        error: (err) => {
          console.error('Error submitting review:', err);
        },
        complete: () => {
          this.isSubmitting = false;
        }
      });
    }

    toggleReviewForm(): void {
      this.showReviewForm = !this.showReviewForm;
      if (this.showReviewForm) {
        this.newReview = {
          rating: 0,
          comment: '',
          productId: this.Product?.id || 0
        };
      }
    }

    editReview(review: Review): void {
      this.showReviewForm = true;
      this.newReview = {
        rating: review.rating,
        comment: review.comment,
        productId: review.productId,
        id: review.id
      };
    }

    deleteReview(reviewId: number): void {
      if (!confirm('Are you sure you want to delete this review?')) return;
    
      this.reviewService.deleteReview(reviewId).subscribe({
        next: () => {
          // Remove from both lists
          this.reviews = this.reviews.filter(r => r.id !== reviewId);
          this.authorReviews = this.authorReviews.filter(r => r.id !== reviewId);
          this.calculateAverageRating();
        },
        error: (err) => console.error('Error deleting review:', err)
      });
    }
    
    getRandomColor(): string {
      return this.colors[Math.floor(Math.random() * this.colors.length)];
    }
    // getStars(rating: number): number[] {
    //   return Array(Math.floor(rating)).fill(0).map((_, i) => i);
    // }
    getStarClass(star: number, rating: number): string {
      return (rating >= star) ? 'fa-solid text-warning' : 'fa-regular text-muted';
    }
    

    
    // pagnation 

    
// pagination 

currentReviewPage: number = 1;
reviewsPerPage: number = 4;  // Show 4 reviews per page
paginatedReviews: Review[] = [];
totalReviewPages: number = 0;
// Add these new methods
updatePaginatedReviews(): void {
  const startIndex = (this.currentReviewPage - 1) * this.reviewsPerPage;
  const endIndex = startIndex + this.reviewsPerPage;
  this.paginatedReviews = this.reviews.slice(startIndex, endIndex);
  this.totalReviewPages = Math.ceil(this.reviews.length / this.reviewsPerPage);
}

changeReviewPage(page: number): void {
  if (page >= 1 && page <= this.totalReviewPages) {
    this.currentReviewPage = page;
    this.updatePaginatedReviews();
  }
}

getReviewPagesToShow(): number[] {
  if (this.totalReviewPages <= 5) {
    return Array.from({length: this.totalReviewPages}, (_, i) => i + 1);
  }
  
  let start = Math.max(2, this.currentReviewPage - 1);
  let end = Math.min(this.totalReviewPages - 1, this.currentReviewPage + 1);
  
  if (this.currentReviewPage <= 3) {
    end = 4;
  }
  
  if (this.currentReviewPage >= this.totalReviewPages - 2) {
    start = this.totalReviewPages - 3;
  }
  
  const pages = [1];
  if (start > 2) pages.push(-1); // -1 represents ellipsis
  
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  
  if (end < this.totalReviewPages - 1) pages.push(-1);
  if (this.totalReviewPages > 1) pages.push(this.totalReviewPages);
  
  return pages;
}


// pagnation for related product 
// Related Products Pagination
currentProductsPage: number = 1;
itemsPerPage: number = 6; // Show 6 products (2 rows of 3)
paginatedRelatedProducts: Product[] = [];
totalProductsPages: number = 0;

// Related Products Pagination Methods
private updatePaginatedRelatedProducts(): void {
  const startIndex = (this.currentProductsPage - 1) * this.itemsPerPage;
  const endIndex = startIndex + this.itemsPerPage;
  this.paginatedRelatedProducts = this.CategoryProducts.slice(startIndex, endIndex);
  this.totalProductsPages = Math.ceil(this.CategoryProducts.length / this.itemsPerPage);
}

changeProductsPage(page: number): void {
  if (page >= 1 && page <= this.totalProductsPages) {
    this.currentProductsPage = page;
    this.updatePaginatedRelatedProducts();
  }
}

getProductsPagesToShow(): number[] {
  if (this.totalProductsPages <= 5) {
    return Array.from({length: this.totalProductsPages}, (_, i) => i + 1);
  }
  
  let start = Math.max(2, this.currentProductsPage - 1);
  let end = Math.min(this.totalProductsPages - 1, this.currentProductsPage + 1);
  
  if (this.currentProductsPage <= 3) {
    end = 4;
  }
  
  if (this.currentProductsPage >= this.totalProductsPages - 2) {
    start = this.totalProductsPages - 3;
  }
  
  const pages = [1];
  if (start > 2) pages.push(-1); // -1 represents ellipsis
  
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  
  if (end < this.totalProductsPages - 1) pages.push(-1);
  if (this.totalProductsPages > 1) pages.push(this.totalProductsPages);
  
  return pages;
}
    
  }    
