import { Injectable } from '@angular/core';
import { baseUrl } from '../enviroment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../../domain/models/Ecommerce/category.model';
@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiUrl = `${baseUrl}/Category`;
  constructor(private http:HttpClient) {}

  getAllCategories() : Observable<any>{
    return this.http.get(`${this.apiUrl}`) ;
  }
  createCategory(categoryName:string):  Observable<any>{
    return this.http.post(`${this.apiUrl}`,categoryName) ;
  }
  updateCategory(category:Category) : Observable<any>{
    return this.http.put(`${this.apiUrl}/${category.id}`,category) ;
  }
  deleteCategory(categoryId:number)  : Observable<any>{
    return this.http.delete(`${this.apiUrl}/${categoryId}`) ;
  }

}
