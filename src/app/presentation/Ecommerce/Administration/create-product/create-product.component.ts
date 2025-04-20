import { Component, OnInit } from '@angular/core';
import { Brand } from '../../../../domain/models/Ecommerce/brand.model';
import { Category } from '../../../../domain/models/Ecommerce/category.model';
import { Product } from '../../../../domain/models/Ecommerce/product.model';
import { BrandService } from './../../../../services/Ecommerce/brand.service';
import { CategoryService } from './../../../../services/Ecommerce/category.service';
import { ProductService } from './../../../../services/Ecommerce/product.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-create-product',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.css']
})
export class CreateProductComponent implements OnInit {

  categories: Category[] = [];
  brands: Brand[] = [];
  selectedFile!: File;
  productForm!: FormGroup;

  newProduct: Product = {
    id: 0,
    name: '',
    description: '',
    price: 0,
    stock: 0,
    imageUrl: '',
    createdAt: new Date(),
    rating: 0,
    categoryId: 0,
    category: '',
    brandId: 0,
    brandName: '',
    discountAmount: 0,
  };

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private brandService: BrandService
  ) {}

  ngOnInit(): void {
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

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  onCreateProduct(): void {
    const formData = new FormData();
    formData.append('Name', this.newProduct.name.toUpperCase() || '');
    formData.append('Description', this.newProduct.description.toLowerCase() || '');
    formData.append('Price', this.newProduct.price.toString());
    formData.append('CategoryID', this.newProduct.categoryId.toString());
    formData.append('Stock', this.newProduct.stock.toString());
    formData.append('AverageRating', this.newProduct.rating.toString());
    formData.append('BrandId', this.newProduct.brandId.toString());
    // formData.append('DiscountAmount', this.newProduct.discountAmount.toString());
    if (this.selectedFile) {
      formData.append('productImg', this.selectedFile);
    }

    this.productService.createProduct(formData).subscribe({
      next: (response) => {
        console.log('Product created successfully:', response);
      },
      error: (error) => {
        console.error('Error creating product:', error);
      }
    });
  }
}
