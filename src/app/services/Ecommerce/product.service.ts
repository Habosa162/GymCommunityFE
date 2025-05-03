import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseUrl } from '../enviroment';
import { map, Observable } from 'rxjs';
import { Product } from '../../domain/models/Ecommerce/product.model';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = `${baseUrl}/Product`;

  constructor(private HttpClient: HttpClient,
    private toastr: ToastrService
  ) { }
  getProducts(
    query: string,
    page: number,
    eleNo: number,
    categoryId: number | null,
    brandId: number | null,
    sort: string,
    minPrice: number | null,
    maxPrice: number | null
  ): Observable<{data: Product[], totalCount: number, totalPages: number}> {
    let params = new HttpParams()
      .set('query', query)
      .set('page', page.toString())
      .set('eleNo', eleNo.toString())
      .set('sort', sort);
  
    if (categoryId !== null) params = params.set('categoryId', categoryId.toString());
    if (brandId !== null) params = params.set('brandId', brandId.toString());
    if (minPrice !== null) params = params.set('minPrice', minPrice.toString());
    if (maxPrice !== null) params = params.set('maxPrice', maxPrice.toString());
  
    return this.HttpClient.get<{data: any[], totalCount: number, totalPages: number}>(`${this.apiUrl}`, { params }).pipe(
      map(response => ({
        ...response,
        data: response.data.map(product => ({
          ...product,
          averageRating: product.averageRating || 0,
          reviewCount: product.reviewCount || 0,
          reviews: product.reviews || []
        }))
      }))
    );
  }
  
  getUserProducts(userid: any): Observable<any> {
    return this.HttpClient.get(`${this.apiUrl}/user`, {
      params: new HttpParams().set('userid', userid)
    });
  }

  createProduct(Product: FormData): Observable<any> {
    return this.HttpClient.post(`${this.apiUrl}`, Product);
  }
  getOneProduct(id: number): Observable<any> {
    return this.HttpClient.get(`${this.apiUrl}/${id}`);
  }
  //filter by category
  getProductsByCategory(categoryId: number): Observable<Product[]> {
    return this.HttpClient.get<Product[]>(`${this.apiUrl}/by-category/${categoryId}`);
  }
  updateProduct(productId:number,Product: FormData): Observable<any> {
    return this.HttpClient.put(`${this.apiUrl}/${productId}`, Product);
  }
  deleteProduct(id: number): Observable<any> {
    return this.HttpClient.delete(`${this.apiUrl}/${id}`);
  }
  // In product.service.ts
  searchProducts(searchTerm: string): Observable<Product[]> {
    return this.HttpClient.get<Product[]>(`${this.apiUrl}/search?name=${searchTerm}`);
  }
  getProductsByBrand(brandId: number): Observable<Product[]> {
    return this.HttpClient.get<Product[]>(`${this.apiUrl}/by-brand/${brandId}`);
  }

  // filter by price
  getProductsByPriceRange(minPrice: number, maxPrice: number, categoryId?: number): Observable<Product[]> {
    let url = `${this.apiUrl}/by-price?minPrice=${minPrice}&maxPrice=${maxPrice}`;
    if (categoryId !== undefined && categoryId !== null) {  // Ensure categoryId is valid
      url += `&categoryId=${categoryId}`;
    }
    return this.HttpClient.get<Product[]>(url);
  }

  toasterSuccess(message: string, product: any) {
    this.toastr.show(
      `<div class="row justify-content-center align-items-center toaster custom-toast custom-toast.toast-success" id="toaster">
        <div class="col-md-4">
          <img src="${product.imageUrl}"
               class="img-fluid rounded"
               style="width: 50px; height:50px; object-fit: cover;"
               />
        </div>

        <div class="col-md-8 d-flex flex-column justify-content-center align-items-start">
          <div class="fw-semibold text-light" style="font-size: 14px !important;"><small>${product.name.toUpperCase()}</small></div>
          <p class="fw-semibold fw-small text-light text-start" style="font-size: 10px !important;"><small>${message}</small></p>
        </div>
      </div>`,
      '',
      {
        enableHtml: true,
        toastClass: 'ngx-toastr',
        positionClass: 'toast-top-right',
        timeOut: 3000,
        closeButton: true,
        progressBar: true,
        progressAnimation: 'decreasing',
      }
    );
  }


}
