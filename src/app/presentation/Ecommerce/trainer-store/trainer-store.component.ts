import { ProductService } from './../../../services/Ecommerce/product.service';
import { Component } from '@angular/core';
import { ProductComponent } from '../product/product.component';
import { Product } from '../../../domain/models/Ecommerce/product.model';

@Component({
  selector: 'app-trainer-store',
  imports: [ProductComponent],
  templateUrl: './trainer-store.component.html',
  styleUrl: './trainer-store.component.css'
})
export class TrainerStoreComponent {

  TrainerProducts : Product[]=[];
  constructor(private productService :ProductService) { }

  getTrainerProducts() {
      return this.productService.getUserProducts().subscribe((res=>{
        console.log(res);
        this.TrainerProducts = res;
      }));
  }
}
