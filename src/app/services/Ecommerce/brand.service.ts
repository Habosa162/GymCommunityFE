import { Brand } from '../../domain/models/Ecommerce/brand.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseUrl } from '../enviroment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BrandService {

  private apiUrl:string = `${baseUrl}/Brand` ;
  constructor(private http : HttpClient) {}

  getAllBrands():Observable<any>{
      return this.http.get(`${this.apiUrl}`) ;
  }

  createBrand(name:string,desc:string) : Observable<any>{
    return this.http.post(`${this.apiUrl}`, {Name:name,Description:desc}) ;
  }

  removeBrand(BrandId : number ) : Observable<any>{
    return this.http.delete(`${this.apiUrl}/${BrandId}`) ;
  }
  updateBrand(Brand:Brand):Observable<any>{
    return this.http.put(`${this.apiUrl}/${Brand.brandID}`, Brand);
  }

}
