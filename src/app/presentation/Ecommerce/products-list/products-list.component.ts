import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

import { ProductService } from '../../../services/Ecommerce/product.service';
import { CategoryService } from '../../../services/Ecommerce/category.service';
import { BrandService } from '../../../services/Ecommerce/brand.service';

import { Product } from '../../../domain/models/Ecommerce/product.model';
import { Category } from '../../../domain/models/Ecommerce/category.model';
import { Brand } from '../../../domain/models/Ecommerce/brand.model';
import { ProductComponent } from '../product/product.component';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [ProductComponent, CommonModule, FormsModule],
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css']
})
export class ProductsListComponent {
  isLoading = true;
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: Category[] = [];
  brands: Brand[] = [];

  filteredCategories: Category[] = [];
  filteredBrands: Brand[] = [];

  minPrice: number | null = null;
  maxPrice: number | null = null;

  selectedCategoryId: number | null = null;
  selectedBrandId: number | null = null;
  selectedSortOption: string = 'asc';

  productSearchTerm: string = '';
  categorySearchTerm: string = '';
  brandSearchTerm: string = '';


  page: number = 1;
  eleNo: number = 8;
  totalCount: number = 0;
  totalPages: number = 0;


  private searchSubject = new Subject<string>();

  priceRanges = [
    { label: 'Under 1000 EGP', min: 0, max: 1000, selected: false },
    { label: '1000 EGP - 2000 EGP', min: 1000, max: 2000, selected: false },
    { label: '2000 EGP - 3000 EGP', min: 2000, max: 3000, selected: false },
    { label: '3000 EGP - 5000 EGP', min: 3000, max: 5000, selected: false },
    { label: 'Over 5000 EGP', min: 5000, max: null, selected: false }
  ];

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private brandService: BrandService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
    this.loadBrands();

    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => {
      this.loadProducts();
    });
  }

  loadProducts(): void {
    this.isLoading = true;

    const selectedPriceRange = this.priceRanges.find(r => r.selected);

    this.productService.getProducts(
      this.productSearchTerm.trim(),
      this.page,
      this.eleNo,
      this.selectedCategoryId,
      this.selectedBrandId,
      this.selectedSortOption,
      selectedPriceRange ? selectedPriceRange.min : null,
      selectedPriceRange ? selectedPriceRange.max : null
    ).subscribe({
      next: (response) => {
        // Ensure each product has default rating data if missing
        this.products = response.data.map(product => ({
          ...product,
          averageRating: product.averageRating || 0, // Fallback to 0 if missing
          reviewCount: product.reviewCount || 0,     // Fallback to 0 if missing
        }));

        this.filteredProducts = [...this.products];
        this.totalCount = response.totalCount;
        this.totalPages = response.totalPages;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.isLoading = true;
      }
    });
  }

  onItemsPerPageChange(){
    this.page = 1;
    this.loadProducts() ;
  }
  // Price Range selection
  onPriceRangeChange(range: any): void {
    this.priceRanges.forEach(r => r.selected = (r === range ? !r.selected : false));
    this.loadProducts();
  }

  clearPriceFilters(): void {
    this.priceRanges.forEach(r => r.selected = false);
    this.loadProducts();
  }

  // Category operations
  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe(categories => {
      this.categories = categories;
      this.filteredCategories = categories;
    });
  }

  onCategorySelect(categoryId: number): void {
    this.selectedCategoryId = categoryId;
    this.loadProducts();
  }

  clearCategoryFilter(): void {
    this.selectedCategoryId = null;
    this.loadProducts();
  }

  onCategorySearch(): void {
    if (this.categorySearchTerm) {
      this.filteredCategories = this.categories.filter(c =>
        c.name.toLowerCase().includes(this.categorySearchTerm.toLowerCase())
      );
    } else {
      this.filteredCategories = [...this.categories];
    }
  }

  getCategoryCount(categoryId: number): number {
    return this.products.filter(p => p.categoryID === categoryId).length;
  }

  // Brand operations
  loadBrands(): void {
    this.brandService.getAllBrands().subscribe(brands => {
      this.brands = brands;
      this.filteredBrands = brands;
    });
  }

  onBrandSelect(brandId: number): void {
    this.selectedBrandId = brandId;
    this.loadProducts();
  }

  clearBrandFilter(): void {
    this.selectedBrandId = null;
    this.loadProducts();
  }

  onBrandSearch(): void {
    if (this.brandSearchTerm) {
      this.filteredBrands = this.brands.filter(b =>
        b.name.toLowerCase().includes(this.brandSearchTerm.toLowerCase())
      );
    } else {
      this.filteredBrands = [...this.brands];
    }
  }

  // Search for products
  onSearchInput(): void {
    this.searchSubject.next(this.productSearchTerm);
  }

  onSortChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedSortOption = selectElement.value;
    this.loadProducts();
  }

  // Clear All Filters
  clearAllFilters(): void {
    this.selectedCategoryId = null;
    this.selectedBrandId = null;
    this.selectedSortOption = 'asc';
    this.productSearchTerm = '';
    this.categorySearchTerm = '';
    this.brandSearchTerm = '';
    this.priceRanges.forEach(range => range.selected = false);
    this.filteredCategories = [...this.categories];
    this.filteredBrands = [...this.brands];
    this.loadProducts();
  }
  // Navigate to the specific page
  goToPage(pageNumber: number): void {
    if (pageNumber >= 1 && pageNumber <= this.totalPages) {
      this.page = pageNumber;
      this.loadProducts();
    }
  }


  // pagination

  getRange(start: number, end: number): number[] {
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  getPagesToShow(): number[] {
    const pages = [];
    const maxVisiblePages = 3; // Number of pages to show around current page

    if (this.totalPages <= 5) {
      return this.getRange(2, this.totalPages - 1);
    }

    // Show pages around current page
    let start = Math.max(2, this.page - 1);
    let end = Math.min(this.totalPages - 1, this.page + 1);

    // Adjust if we're at the beginning
    if (this.page <= 3) {
      end = 4;
    }

    // Adjust if we're at the end
    if (this.page >= this.totalPages - 2) {
      start = this.totalPages - 3;
    }

    return this.getRange(start, end);
  }

}
