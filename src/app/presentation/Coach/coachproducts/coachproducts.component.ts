import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../../services/Ecommerce/product.service';
import { CategoryService } from '../../../services/Ecommerce/category.service';
import { BrandService } from '../../../services/Ecommerce/brand.service';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Product } from '../../../domain/models/Ecommerce/product.model';
import { Category } from '../../../domain/models/Ecommerce/category.model';
import { Brand } from '../../../domain/models/Ecommerce/brand.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-coachproducts',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './coachproducts.component.html',
  styleUrls: ['./coachproducts.component.css']
})
export class CoachproductsComponent implements OnInit {
  productForm: FormGroup;
  selectedImage?: File;
  previewUrl: string = '';
  products: (Product & { showFullDescription?: boolean })[] = [];
  categories: Category[] = [];
  brands: Brand[] = [];
  coachId: string | null = null;
  editingProductId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private brandService: BrandService,
    private authService: AuthService,
    private toastr: ToastrService
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      price: [null, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      categoryID: [null, Validators.required],
      brandId: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.coachId = this.authService.getUserId();
    if (this.coachId) {
      this.loadProducts();
      this.loadCategories();
      this.loadBrands();
    }
  }

  loadProducts(): void {
    if (!this.coachId) return;
    this.productService.getUserProducts(this.coachId).subscribe({
      next: (products: Product[]) => {
        this.products = (products || []).map((product: Product) => ({
          ...product,
          showFullDescription: false
        }));
      },
      error: (err) => {
        this.products = [];
        console.error(err);
        this.toastr.error('Failed to load products', 'Error');
      }
    });
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => this.categories = categories || [],
      error: (err) => {
        console.error(err);
        this.toastr.error('Failed to load categories', 'Error');
      }
    });
  }

  loadBrands(): void {
    this.brandService.getAllBrands().subscribe({
      next: (brands) => this.brands = brands || [],
      error: (err) => {
        console.error(err);
        this.toastr.error('Failed to load brands', 'Error');
      }
    });
  }

  deleteProduct(productId: number): void {
    if (!confirm('Are you sure you want to delete this product?')) return;
    this.productService.deleteProduct(productId).subscribe({
      next: () => {
        this.products = this.products.filter(p => p.id !== productId);
        this.toastr.success('Product deleted successfully');
      },
      error: (err) => {
        console.error(err);
        this.toastr.error('Failed to delete product', 'Error');
      }
    });
  }

  startEditProduct(product: Product): void {
    this.editingProductId = product.id || null;
    this.productForm.patchValue({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      categoryID: product.categoryID,
      brandId: product.brandId
    });
    this.previewUrl = product.imageUrl || '';
    this.selectedImage = undefined;
  }

  cancelEdit(): void {
    this.editingProductId = null;
    this.productForm.reset();
    this.previewUrl = '';
    this.selectedImage = undefined;
  }

  onImageChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;
      const reader = new FileReader();
      reader.onload = () => this.previewUrl = reader.result as string;
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.toastr.error('Please fill in all required fields correctly', 'Validation Error');
      return;
    }

    const formValue = this.productForm.value;
    const productDTO = {
      id: this.editingProductId || 0,
      name: formValue.name?.toString().trim() || '',
      description: formValue.description?.toString().trim() || '',
      price: formValue.price?.toString() || '0',
      stock: formValue.stock?.toString() || '0',
      averageRating: '3',
      categoryID: formValue.categoryID?.toString() || '',
      brandId: formValue.brandId?.toString() || '',
      coachId: this.coachId || '',
      imageUrl: this.previewUrl || ''
    };

    if (this.editingProductId) {
      // For update, we need to handle the productDTO and image separately
      const updateData = new FormData();
      updateData.append('productDTO', JSON.stringify(productDTO));

      // Always append productImg - either the new image or the existing image URL
      if (this.selectedImage) {
        updateData.append('productImg', this.selectedImage);
      } else {
        // Find the existing product to get its image URL
        const existingProduct = this.products.find(p => p.id === this.editingProductId);
        if (existingProduct?.imageUrl) {
          // Create a dummy file with the image URL
          const dummyFile = new File([existingProduct.imageUrl], 'existing-image.txt', { type: 'text/plain' });
          updateData.append('productImg', dummyFile);
        } else {
          this.toastr.error('Existing image not found', 'Error');
          return;
        }
      }

      this.performUpdate(updateData);
    } else {
      // Create new product
      const createData = new FormData();
      createData.append('id', '0');
      createData.append('name', productDTO.name);
      createData.append('description', productDTO.description);
      createData.append('price', productDTO.price);
      createData.append('stock', productDTO.stock);
      createData.append('averageRating', productDTO.averageRating);
      createData.append('categoryID', productDTO.categoryID);
      createData.append('brandId', productDTO.brandId);
      createData.append('coachId', productDTO.coachId);

      // Create new product - require an image
      if (!this.selectedImage) {
        this.toastr.error('Product image is required', 'Validation Error');
        return;
      }
      createData.append('productImg', this.selectedImage);

      this.productService.createProduct(createData).subscribe({
        next: () => {
          this.toastr.success('Product added successfully');
          this.productForm.reset();
          this.previewUrl = '';
          this.selectedImage = undefined;
          this.loadProducts();
        },
        error: (err) => {
          console.error('Create error:', err);
          if (err.error?.errors) {
            // Handle validation errors
            const errorMessages = Object.values(err.error.errors).flat().join('\n');
            this.toastr.error(errorMessages, 'Validation Error');
          } else {
            this.toastr.error('Failed to add product', 'Error');
          }
        }
      });
    }
  }

  private performUpdate(updateData: FormData): void {
    this.productService.updateProduct(this.editingProductId!, updateData).subscribe({
      next: () => {
        this.toastr.success('Product updated successfully');
        this.editingProductId = null;
        this.productForm.reset();
        this.previewUrl = '';
        this.selectedImage = undefined;
        this.loadProducts();
      },
      error: (err) => {
        console.error('Update error:', err);
        if (err.error?.errors) {
          // Handle validation errors
          const errorMessages = Object.values(err.error.errors).flat().join('\n');
          this.toastr.error(errorMessages, 'Validation Error');
        } else {
          this.toastr.error('Failed to update product', 'Error');
        }
      }
    });
  }
}
