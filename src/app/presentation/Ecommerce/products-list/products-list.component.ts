import { ProductService } from './../../../services/Ecommerce/product.service';
import { Constructor } from './../../../../../node_modules/@angular/cdk/schematics/update-tool/migration.d';
import { Component } from '@angular/core';
import { ProductComponent } from '../product/product.component';
import { Product } from '../../../domain/models/Ecommerce/product.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-products-list',
  imports: [ProductComponent,CommonModule],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.css'
})
export class ProductsListComponent {

  products: Product[]=[];
  constructor(private productService : ProductService){}
  getProducts(){
    this.productService.getProducts().subscribe((res)=>{
      console.log(res);
      this.products = res ;
    })
  }
}
