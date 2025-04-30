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
  selectedFile!: File;
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
  //   this.selectedFile = event.target.files[0];
  // }
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onUpdateProduct(): void {
    const formData = new FormData();
    formData.append('Name', this.updatedProduct.name.toUpperCase() || '');
    formData.append('Description', this.updatedProduct.description.toLowerCase() || '');
    formData.append('Price', this.updatedProduct.price.toString());
    formData.append('CategoryID', this.updatedProduct.categoryID.toString());
    formData.append('Stock', this.updatedProduct.stock.toString());
    formData.append('AverageRating', this.updatedProduct.rating.toString());
    formData.append('BrandId', this.updatedProduct.brandId.toString());
    // formData.append('DiscountAmount', this.newProduct.discountAmount.toString());
    if (this.selectedFile) {
      formData.append('productImg', this.selectedFile);
    }

    this.productService.updateProduct(this.updatedProduct.id,formData).subscribe({
      next: (response) => {
        this.toastrService.success('Product updated successfully!', 'Success');
      },
      error: (error) => {
        this.toastrService.error('Failed to update product.', 'Error');
      }
    });
  }
}
