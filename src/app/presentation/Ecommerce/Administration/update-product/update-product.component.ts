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
    // 1. Create FormData
    const formData = new FormData();
  
    // 2. Append product data as a JSON string
    const productData = {
      Id: this.updatedProduct.id,
      Name: this.updatedProduct.name,
      Description: this.updatedProduct.description,
      Price: this.updatedProduct.price,
      Stock: this.updatedProduct.stock,
      CategoryID: this.updatedProduct.categoryID,
      BrandId: this.updatedProduct.brandId,
      ImageUrl: this.updatedProduct.imageUrl || '',
      AverageRating: this.updatedProduct.averageRating || 0,
      ReviewCount: this.updatedProduct.reviewCount || 0
    };
    
    formData.append('productDTO', JSON.stringify(productData));
  
    // 3. Handle image file
    if (this.selectedfile) {
      formData.append('productImg', this.selectedfile, this.selectedfile.name);
    } else {
      // If no new image is selected, we still need to send the existing image URL
      // Add this line to explicitly indicate no file is being uploaded
      formData.append('productImg', new File([], 'empty'));
    }
  
    // 4. Debug: Log FormData contents
    console.log('FormData Contents:');
    formData.forEach((value, key) => {
      console.log(key, value);
    });
  
    // 5. Make the request
    this.productService.updateProduct(this.updatedProduct.id, formData).subscribe({
      next: (response) => {
        this.toastrService.success('Product updated successfully!');
      },
      error: (error) => {
        console.error('Full error:', error);
        this.toastrService.error(`Update failed: ${this.getErrorDetails(error)}`);
      }
    });
  }
  private getErrorDetails(error: any): string {
    if (error.error) {
        // Handle validation errors
        if (error.error.errors) {
            return Object.entries(error.error.errors)
                .map(([field, errors]) => `${field}: ${(errors as string[]).join(', ')}`)
                .join('; ');
        }
        // Handle other structured errors
        if (error.error.message) return error.error.message;
        if (typeof error.error === 'string') return error.error;
        return JSON.stringify(error.error);
    }
    return error.message || 'Unknown error occurred';
}
}