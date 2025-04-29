import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../services/Ecommerce/product.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductComponent } from '../../Ecommerce/product/product.component';

@Component({
  selector: 'app-product-management',
  imports: [CommonModule,RouterLink,ProductComponent],
  templateUrl: './product-management.component.html',
  styleUrl: './product-management.component.css'
})
export class ProductManagementComponent implements OnInit {
  isLoading:boolean = true;
  productsList:any[] = [] ;
  constructor(
    private productService:ProductService,
    private toastr: ToastrService,
  ){}

  ngOnInit():void{
    this.getAllProducts() ;
  }

  getAllProducts() {
    this.productService.getProducts().subscribe(
      (res) => {
        console.log(res);
        this.productsList = res;
        this.isLoading = false ;
      },
      (err) => {
        this.isLoading = true ;
        console.log(err);
        this.toastr.error('Network Connection', 'Error');
      }
    );
  }

}
