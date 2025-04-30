import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Brand } from '../../../../domain/models/Ecommerce/brand.model';
import { Category } from '../../../../domain/models/Ecommerce/category.model';
import { Product } from '../../../../domain/models/Ecommerce/product.model';
import { BrandService } from '../../../../services/Ecommerce/brand.service';
import { CategoryService } from '../../../../services/Ecommerce/category.service';
import { ProductService } from '../../../../services/Ecommerce/product.service';
import { ActivatedRoute } from '@angular/router';
import { Toast, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-update-product',
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './update-product.component.html',
  styleUrl: './update-product.component.css'
})
export class UpdateProductComponent {
  isLoading = true ; 
  categories: Category[] = [];
  brands: Brand[] = [];
  selectedfile!: File;
  productForm!: FormGroup;

  updatedProduct: Product = {
    id: 0,
    name: '',
    description: '',
    price: 0,
    stock: 0,
    imageUrl: '',
    createdAt: new Date(),
    rating: 0,
    categoryID: 0,
    categoryName: '',
    brandId: 0,
    brandName: '',
    discountAmount: 0,
  };
  imagePreview: string | ArrayBuffer | null = null;

constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private brandService: BrandService,
    private activeRoute:ActivatedRoute,
    private toastrService : ToastrService
  ) {}

  getSelectedProduct(){
    const productId = Number(this.activeRoute.snapshot.paramMap.get('id'));
this.productService.getOneProduct(productId).subscribe((res) => {
  this.updatedProduct = res;
  console.log(res);
  this.isLoading = false;
}, (err) => {
  this.toastrService.error("Network Connection Failed!", "Error");
});
  }
  ngOnInit(): void {
    this.getSelectedProduct() ; 
    this.getCategories();
    this.getBrands();
  }

  getCategories(): void {
    this.categoryService.getAllCategories().subscribe((categories: Category[]) => {
      this.categories = categories;
    });
  }

  getBrands(): void {
    this.brandService.getAllBrands().subscribe((brands: Brand[]) => {
      this.brands = brands;
    });
  }

  // onFileSelected(event: any): void {
  //   this.selectedfile = event.target.files[0];
  // }
  onFileSelected(event: any): void {
    this.selectedfile = event.target.files[0];
    if (this.selectedfile) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(this.selectedfile);
    }
  }

  onUpdateProduct(): void {
    const formData = new FormData();
    formData.append('id', this.updatedProduct.id.toString());
    formData.append('Name', this.updatedProduct.name || '');
    formData.append('Description', this.updatedProduct.description || '');
    formData.append('Price', this.updatedProduct.price.toString());
    formData.append('Stock', this.updatedProduct.stock.toString());
    formData.append('AverageRating', (this.updatedProduct.averageRating ?? 3).toString());
    if (this.updatedProduct.categoryID)
      formData.append('categoryID', this.updatedProduct.categoryID.toString());
    if (this.updatedProduct.brandId)
      formData.append('brandId', this.updatedProduct.brandId.toString());
    if (this.selectedfile) {
      formData.append('productImg', this.selectedfile);
    }

    console.log(formData);
    
    this.productService.updateProduct(this.updatedProduct.id,formData).subscribe({
      next: (response) => {
        console.log(response);
        this.toastrService.success('Product updated successfully!', 'Success');
      },
      error: (error) => {
        this.toastrService.error('Failed to update product.', 'Error');
      }
    });
  }
}
