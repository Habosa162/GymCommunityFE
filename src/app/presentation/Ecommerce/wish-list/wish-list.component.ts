import { CommonModule } from '@angular/common';
import { Product } from '../../../domain/models/Ecommerce/product.model';
import { ProductComponent } from '../product/product.component';
import { WishlistService } from './../../../services/Ecommerce/wishlist.service';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../../services/Ecommerce/category.service';
import { BrandService } from '../../../services/Ecommerce/brand.service';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { Category } from '../../../domain/models/Ecommerce/category.model';
import { Brand } from '../../../domain/models/Ecommerce/brand.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-wish-list',
  imports: [ProductComponent, CommonModule, FormsModule,    RouterModule  ],
  templateUrl: './wish-list.component.html',
  styleUrl: './wish-list.component.css'
})
export class WishListComponent {
  isLoading = true;
  wishlistProducts: Product[] = [];
  filteredWishlist: Product[] = [];
  
  // Filter properties
  categories: Category[] = [];
  brands: Brand[] = [];
  filteredCategories: Category[] = [];
  filteredBrands: Brand[] = [];
  
  selectedCategoryId: number | null = null;
  selectedBrandId: number | null = null;
  selectedSortOption: string = 'asc';
  
  productSearchTerm: string = '';
  categorySearchTerm: string = '';
  brandSearchTerm: string = '';
  
  private searchSubject = new Subject<string>();

  priceRanges = [
    { label: 'Under 1000 EGP', min: 0, max: 1000, selected: false },
    { label: '1000 EGP - 2000 EGP', min: 1000, max: 2000, selected: false },
    { label: '2000 EGP - 3000 EGP', min: 2000, max: 3000, selected: false },
    { label: '3000 EGP - 5000 EGP', min: 3000, max: 5000, selected: false },
    { label: 'Over 5000 EGP', min: 5000, max: null, selected: false }
  ];

  constructor(
    private wishlistService: WishlistService,
    private categoryService: CategoryService,
    private brandService: BrandService
  ) {}

  ngOnInit() {
    this.getWishList();
    this.loadCategories();
    this.loadBrands();

    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => {
      this.applyFilters();
    });
  }

  getWishList() {
    this.isLoading = true;
    this.wishlistService.getWishlist().subscribe({
      next: (res) => {
        this.wishlistProducts = res;
        this.filteredWishlist = [...res];
        this.isLoading = false;
        this.applyFilters(); // Apply any existing filters to new data
      },
      error: (err) => {
        console.log(err);
        this.isLoading = false;
      }
    });
  }

  removeItemFromWishlist(wishListId: number) {
    this.getWishList();
  }

   // Filter methods
   applyFilters() {
    let filtered = [...this.wishlistProducts];

    // Helper function to calculate price after discount
    const getPrice = (product: Product) => {
      return product.discountAmount > 0 
        ? product.price * (1 - product.discountAmount / 100)
        : product.price;
    };

    // Category filter
    if (this.selectedCategoryId) {
      filtered = filtered.filter(p => p.categoryID === this.selectedCategoryId);
    }

    // Brand filter
    if (this.selectedBrandId) {
      filtered = filtered.filter(p => p.brandId === this.selectedBrandId);
    }

    // Price range filter
    const selectedPriceRange = this.priceRanges.find(r => r.selected);
    if (selectedPriceRange) {
      filtered = filtered.filter(p => {
        const price = getPrice(p);
        return (selectedPriceRange.min === null || price >= selectedPriceRange.min) && 
               (selectedPriceRange.max === null || price <= selectedPriceRange.max);
      });
    }

    // Search filter
    if (this.productSearchTerm) {
      const term = this.productSearchTerm.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(term) || 
        (p.description && p.description.toLowerCase().includes(term))
      );
    }

    // Sorting
    filtered.sort((a, b) => {
      const priceA = getPrice(a);
      const priceB = getPrice(b);
      return this.selectedSortOption === 'asc' ? priceA - priceB : priceB - priceA;
    });

    this.filteredWishlist = filtered;
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
    this.applyFilters();
  }

  clearCategoryFilter(): void {
    this.selectedCategoryId = null;
    this.applyFilters();
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
    return this.wishlistProducts.filter(p => p.categoryID === categoryId).length;
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
    this.applyFilters();
  }

  clearBrandFilter(): void {
    this.selectedBrandId = null;
    this.applyFilters();
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

  // Price Range selection
  onPriceRangeChange(range: any): void {
    this.priceRanges.forEach(r => r.selected = (r === range ? !r.selected : false));
    this.applyFilters();
  }

  clearPriceFilters(): void {
    this.priceRanges.forEach(r => r.selected = false);
    this.applyFilters();
  }

  // Search for products
  onSearchInput(): void {
    this.searchSubject.next(this.productSearchTerm);
  }

  onSortChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedSortOption = selectElement.value;
    this.applyFilters();
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
    this.applyFilters();
  }
}