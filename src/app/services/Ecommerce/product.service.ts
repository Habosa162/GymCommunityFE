import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseUrl } from '../enviroment';
import { Observable } from 'rxjs';
import { Product } from '../../domain/models/Ecommerce/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = `${baseUrl}/Product`;

  constructor(private HttpClient:HttpClient) { }

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
  searchProducts(searchTerm: string): Observable<Product[]> {
    return this.HttpClient.get<Product[]>(`${this.apiUrl}/search?term=${searchTerm}`);
  }
  getProductsByBrand(brandId: number): Observable<Product[]> {
    return this.HttpClient.get<Product[]>(`${this.apiUrl}/by-brand/${brandId}`);
  }
}
