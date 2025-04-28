import { Brand } from '../../domain/models/Ecommerce/brand.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseUrl } from '../enviroment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BrandService {

  private apiUrl: string = `${baseUrl}/Brand`;
  constructor(private http: HttpClient) { }

  // Combined method with optional filter parameter
  // Get all brands with optional name filter
  getAllBrands(nameFilter?: string): Observable<Brand[]> {
    let params = new HttpParams();
    if (nameFilter) {
      params = params.append('name', nameFilter);
    }
    return this.http.get<Brand[]>(`${this.apiUrl}/filter`, { params });
  }

  createBrand(name: string, desc: string): Observable<any> {
    return this.http.post(`${this.apiUrl}`, { Name: name, Description: desc });
  }

  removeBrand(BrandId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${BrandId}`);
  }

  updateBrand(Brand: Brand): Observable<any> {
    return this.http.put(`${this.apiUrl}/${Brand.brandID}`, Brand);
  }

  // Optional: Keep this if you want a dedicated filter method
  // getBrandsByName(name: string): Observable<any> {
  //   return this.getAllBrands(name);
  // }
}