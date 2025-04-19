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

  getWishList(){
    this.WishlistService.getWishlist().subscribe((res)=>{
      console.log(res);
      this.wishlistProducts = res ;
    })
  }
}
