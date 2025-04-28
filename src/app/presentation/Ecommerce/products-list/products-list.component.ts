import { ProductService } from './../../../services/Ecommerce/product.service';
import { Constructor } from './../../../../../node_modules/@angular/cdk/schematics/update-tool/migration.d';
import { Component } from '@angular/core';
import { ProductComponent } from '../product/product.component';
import { Product } from '../../../domain/models/Ecommerce/product.model';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../../services/Ecommerce/category.service'; // Import CategoryService
import { BrandService } from '../../../services/Ecommerce/brand.service'; // Import BrandService
import { Category } from '../../../domain/models/Ecommerce/category.model';
import { Brand } from '../../../domain/models/Ecommerce/brand.model';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-products-list',
  imports: [ProductComponent,CommonModule, FormsModule],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.css'
})
export class ProductsListComponent {
  isLoading = true;
  products: Product[]=[];
  filteredProducts: Product[] = [];
  categories: Category[] = [];
  minPrice: number = 0;
  maxPrice: number = 5000; // Example price range
  selectedCategoryId: number | null = null;
  selectedPrice: number = this.maxPrice;
  // for filter by Brand 
  brands: Brand[] = [];
  filteredBrands: Brand[] = [];
  selectedBrandId: number | null = null;
  searchTerm: string = '';
  categorySearchTerm: string = '';
  filteredCategories: Category[] = [];
  hasSelectedPriceRanges = false;
  productSearchTerm: string = '';


  priceRanges = [
    { label: 'Under $100', min: 0, max: 100, selected: false },
    { label: '$100 - $200', min: 100, max: 200, selected: false },
    { label: '$200 - $300', min: 200, max: 300, selected: false },
    { label: '$300 - $500', min: 300, max: 500, selected: false },
    { label: 'Over $500', min: 500, max: null, selected: false }
  ];

  
  // filter by price 
  onPriceRangeChange(range: any): void {
    // Deselect all other ranges
    this.priceRanges.forEach(r => r.selected = (r === range ? !r.selected : false));
    
    if (range.selected) {
      this.loadProductsByPrice(range.min, range.max);
    } else {
      this.loadProducts();
    }
  }

  loadProductsByPrice(minPrice: number, maxPrice: number | null): void {
    this.isLoading = true;
  
    // If maxPrice is null, set it to a valid number, e.g., 5000 or any default value
    const maxPriceParam = maxPrice === null ? 5000 : maxPrice;
  
    this.productService.getProductsByPriceRange(
      minPrice, 
      maxPriceParam,  // Ensure it's a valid number here
      this.selectedCategoryId || undefined
    ).subscribe({
      next: (products) => {
        this.products = products;
        this.filteredProducts = [...products];
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }
  
  

  constructor(private productService : ProductService , 
    private categoryService: CategoryService,
    private brandService: BrandService
  ){}
  getProducts() {
    this.productService.getProducts().subscribe((res) => {
      this.products = res;
      this.filteredProducts = [...this.products]; // Initialize with all products
      this.isLoading = false;
    }, (error) => {
      console.log(error);
      this.isLoading = false;
    });
  }
  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
    this.loadBrands();
    // Add debounced search
  this.searchSubject.pipe(
    debounceTime(300),
    distinctUntilChanged()
  ).subscribe(searchTerm => {
    this.onProductSearch();
  });
  }
  // search product 
  private searchSubject = new Subject<string>();

onSearchInput(): void {
  this.searchSubject.next(this.productSearchTerm.trim());
}

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe(categories => {
      this.categories = categories;
      this.filteredCategories = categories;
    });
  }

  // Filter by price range
  onPriceChange(event: any) {
    this.selectedPrice = event.target.value;
    this.applyFilters();
  }

  // Apply selected filters
 
  applyFilters() {
    this.filteredProducts = this.products.filter((product) => {
      const matchesCategory = this.selectedCategoryId ? product.categoryID === this.selectedCategoryId : true;
      const matchesBrand = this.selectedBrandId ? product.brandId === this.selectedBrandId : true;
      
      const matchesPriceRange = this.priceRanges.some(range => 
        range.selected && 
        product.price >= range.min && 
        (range.max === null ? true : product.price <= range.max)
      );
      
      const noPriceFiltersSelected = !this.priceRanges.some(range => range.selected);
      
      return matchesCategory && matchesBrand && (matchesPriceRange || noPriceFiltersSelected);
    });
  }

// Add this method to clear all price filters
clearPriceFilters(): void {
  this.priceRanges.forEach(range => range.selected = false);
  this.hasSelectedPriceRanges = false;
  this.applyFilters();
}

 // filter by brand and category 

 loadProducts(): void {
  this.isLoading = true;
  
  let observable: Observable<Product[]>;
  
  if (this.selectedBrandId) {
    observable = this.productService.getProductsByBrand(this.selectedBrandId);
  } else if (this.selectedCategoryId) {
    observable = this.productService.getProductsByCategory(this.selectedCategoryId);
  } else {
    observable = this.productService.getProducts();
  }

  observable.subscribe({
    next: (products) => {
      this.products = products;
      this.filteredProducts = [...products];
      this.isLoading = false;
    },
    error: (err) => {
      console.error(err);
      this.isLoading = false;
    }
  });
}

onCategorySelect(categoryId: number): void {
  this.selectedCategoryId = categoryId;
  this.loadProducts(); // <<< Only call loadProducts()
}

clearCategoryFilter(): void {
  this.selectedCategoryId = null;
  this.loadProducts();
}


onCategorySearch(): void {
  this.categoryService.getAllCategories().subscribe(categories => {
    if (this.categorySearchTerm) {
      this.filteredCategories = categories.filter((c: { name: string; }) => 
        c.name.toLowerCase().includes(this.categorySearchTerm.toLowerCase())
      );
    } else {
      this.filteredCategories = categories;
    }
  });
}

getCategoryCount(categoryId: number): number {
  return this.products.filter(p => p.categoryID === categoryId).length;
}
  loadProductsByBrand(brandId?: number) {
    if (brandId) {
      this.productService.getProductsByBrand(brandId).subscribe(products => {
        this.products = products;
      });
    } else {
      this.productService.getProducts().subscribe(products => {
        this.products = products;
      });
    }
  }
// filter by Brand 

loadBrands(): void {
  this.brandService.getAllBrands().subscribe(brands => {
    this.brands = brands;
    this.filteredBrands = brands;
  });
}

  clearBrandFilter(): void {
    this.selectedBrandId = null;
    this.searchTerm = '';
    this.loadProducts();
    this.loadBrands();
  }
  
  onBrandSearch(): void {
    this.brandService.getAllBrands(this.searchTerm).subscribe(brands => {
      this.filteredBrands = brands;
    });
  }

  onBrandSelect(brandId: number): void {
    this.selectedBrandId = brandId;
    this.loadProducts();
  }
  clearAllFilters(): void {
    this.selectedCategoryId = null;
    this.selectedBrandId = null;
    this.searchTerm = '';
    this.categorySearchTerm = '';
    this.priceRanges.forEach(range => range.selected = false);
    this.hasSelectedPriceRanges = false;
    this.filteredCategories = [...this.categories];
    this.filteredBrands = [...this.brands];
    this.loadProducts(); // Reload all products without any filters
  }

  ///// search by product 

  // In products-list.component.ts
onProductSearch(): void {
  const searchTerm = this.productSearchTerm.trim();
  
  if (searchTerm.length === 0) {
    this.loadProducts();
    return;
  }

  this.isLoading = true;
  
  this.productService.searchProducts(searchTerm).subscribe({
    next: (products) => {
      this.products = products; // Update main products array
      this.filteredProducts = [...products]; // Update filtered products
      this.isLoading = false;
    },
    error: (error) => {
      console.error('Search error:', error);
      this.isLoading = false;
      // Optionally show error message to user
    }
  });
}
  
  
}