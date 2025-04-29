import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseUrl } from '../enviroment';
import { Observable } from 'rxjs';
import { Product } from '../../domain/models/Ecommerce/product.model';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = `${baseUrl}/Product`;

  constructor(private HttpClient:HttpClient,
              private toastr: ToastrService
            ) { }

  getProducts() : Observable<any> {
    return this.HttpClient.get(`${this.apiUrl}`);
  }
  getUserProducts() : Observable<any>{
    return this.HttpClient.get(`${this.apiUrl}/user`);
  }
  createProduct(Product:FormData) : Observable<any> {
    return this.HttpClient.post(`${this.apiUrl}`, Product);
  }
  getOneProduct(id:number) : Observable<any> {
    return this.HttpClient.get(`${this.apiUrl}/${id}`);
  }
  //filter by category
  getProductsByCategory(categoryId: number): Observable<Product[]> {
    return this.HttpClient.get<Product[]>(`${this.apiUrl}/by-category/${categoryId}`);
  }
  updateProduct(Product:Product) : Observable<any> {
    return this.HttpClient.put(`${this.apiUrl}`, Product);
  }
  deleteProduct(id:number) : Observable<any> {
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
