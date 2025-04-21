import { CommonModule } from '@angular/common';
import { Product } from '../../../domain/models/Ecommerce/product.model';
import { ProductComponent } from '../product/product.component';
import { WishlistService } from './../../../services/Ecommerce/wishlist.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-wish-list',
  imports: [ProductComponent,CommonModule],
  templateUrl: './wish-list.component.html',
  styleUrl: './wish-list.component.css'
})
export class WishListComponent {

  
  wishlistProducts: Product[] = [];
  constructor(private WishlistService: WishlistService) {}

  removeItemFromWishlist(wishListId: number) {
    console.log("im here") ;  
    this.getWishList() ; 
  }
  getWishList(){
    this.WishlistService.getWishlist().subscribe((res)=>{
      this.wishlistProducts = res ;
    })
  }
  ngOnInit(){
    this.getWishList();
  }
}
