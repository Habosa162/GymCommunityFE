import { Category } from './../../../domain/models/Ecommerce/category.model';
import { CategoryService } from './../../../services/Ecommerce/category.service';
import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../services/Ecommerce/product.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductComponent } from '../../Ecommerce/product/product.component';
import { FormsModule } from '@angular/forms';
import { BrandService } from '../../../services/Ecommerce/brand.service';

@Component({
  selector: 'app-product-management',
  imports: [CommonModule, RouterModule, ProductComponent,FormsModule],
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.css']
})
export class ProductManagementComponent implements OnInit {
  isLoading: boolean = true;
  query: string = '';
  page: number = 1;
  eleNo: number = 8;
  productsList: any[] = [];
  categories:any[] =[] ;
  brands:any[] = [] ;
  totalCount: number = 0;
  totalPages: number = 0;
  categoryId: number | null = null;
  brandId: number | null = null;
  sort: string = 'asc';
  minPrice: number | null = null;
  maxPrice: number | null = null;
  constructor(
    private productService: ProductService,
    private toastr: ToastrService,
    private categoryService:CategoryService,
    private brandService:BrandService,

  ) {}

  ngOnInit(): void {
    this.getAllProducts();
    this.getAllCategories() ;
    this.getAllBrand() ;
  }
  getAllCategories(){
    this.categoryService.getAllCategories().subscribe((res)=>{

      this.categories = res ;
    },(err)=>{
      this.toastr.error("Error Load Categories","Error");
    })
  }
  getAllBrand(){
    this.brandService.getAllBrands().subscribe((res)=>{
      console.log(res);

      this.brands = res
    },(err)=>{
      this.toastr.error("Error Load Categories","Error");
    })
  }
  // Function to fetch products
  getAllProducts(){
    this.isLoading = true;


    this.productService.getProducts(
      this.query,
      this.page,
      this.eleNo,
      this.categoryId,
      this.brandId,
      this.sort,
      this.minPrice,
      this.maxPrice
    ).subscribe(
      (res: any) => {
        this.productsList = res.data;
        this.totalCount = res.totalCount;
        this.totalPages = res.totalPages;
        this.isLoading = false;
      },
      (err) => {
        this.isLoading = false;
        console.error(err);
        this.toastr.error('Network Connection', 'Error');
      }
    );
  }

  // Triggered when search query changes
  onSearchChange(): void {
    this.page = 1; // Reset to page 1 on new search
    this.getAllProducts();
  }

  // Triggered when items per page changes
  onItemsPerPageChange(): void {
    this.page = 1;
    this.getAllProducts();
  }

  // Navigate to the specific page
  goToPage(pageNumber: number): void {
    if (pageNumber >= 1 && pageNumber <= this.totalPages) {
      this.page = pageNumber;
      this.getAllProducts();
    }
  }
  // Category selection handler
onCategoryChange(): void {
  this.getAllProducts();
}

// Brand selection handler
onBrandChange(): void {
  this.getAllProducts();
}

// Price range handler
onPriceRangeChange(): void {
  this.page = 1; // Reset to page 1 on price range change
  this.getAllProducts();
}

// Sorting handler
onSortChange(): void {
  this.page = 1; // Reset to page 1 on sorting change
  this.getAllProducts();
}
 // Clear All Filters
 clearAllFilters(): void {
  this.categoryId = null;
  this.brandId = null;
  this.sort = 'asc';
  this.query = '';
  this.minPrice = null ;
  this.maxPrice = null ;
  this.getAllProducts();
}
onRemoveProduct(id:number){
  console.log(id);
  this.productService.deleteProduct(id).subscribe((res)=>{
    console.log(res);
    this.toastr.success("Product Removed Successfully !"); 
    this.getAllProducts() ; 
  },(err)=>{
    console.log(err) ; 
    this.toastr.error("Network Faild !","Error") ; 
  })
}
}
