import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MealDto } from './dtos/meal-dto';

@Injectable({
  providedIn: 'root',
})
export class MealService {
  private baseUrl = 'https://localhost:7130/api/Meal';

  constructor(private http: HttpClient) {}

  getMeals(isSupplement?: boolean): Observable<MealDto[]> {
    let params = new HttpParams();
    if (isSupplement !== undefined) {
      params = params.set('isSupplement', isSupplement.toString());
    }
    return this.http.get<MealDto[]>(this.baseUrl, { params });
  }

  getMeal(id: number): Observable<MealDto> {
    return this.http.get<MealDto>(`${this.baseUrl}/${id}`);
  }

  searchMeals(name: string, isSupplement?: boolean): Observable<MealDto[]> {
    let params = new HttpParams().set('name', name);
    if (isSupplement !== undefined) {
      params = params.set('isSupplement', isSupplement.toString());
    }
    return this.http.get<MealDto[]>(`${this.baseUrl}/search`, { params });
  }

  createMeal(meal: MealDto): Observable<MealDto> {
    return this.http.post<MealDto>(this.baseUrl, meal);
  }

  updateMeal(id: number, meal: MealDto): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, meal);
  }

  deleteMeal(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
