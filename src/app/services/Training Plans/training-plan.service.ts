import { trainingPlan } from './../../domain/models/TraingingPlansModels/training-plan-model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateDailyPlanDto } from './dtos/create-daily-plan.dto';
import { CreateWeekPlanDto } from './dtos/create-week-plan.dto';
import { DailyPlanDto } from './dtos/daily-plan-dto';
import { UpdateDailyPlanDto } from './dtos/update-daily-plan.dto';
import { UpdateWeekPlanDto } from './dtos/update-week-plan.dto';
import { WeekPlanDto } from './dtos/weekly-plan-dto';

@Injectable({
  providedIn: 'root',
})
export class TrainingPlansService {
  private baseUrl = 'https://localhost:7130/api/TrainingPlans';

  constructor(private http: HttpClient) {}

  // ========== DAILY PLANS ==========

  getDailyPlansByWeekPlan(weekPlanId: number): Observable<DailyPlanDto[]> {
    const params = new HttpParams().set('weekPlanId', weekPlanId);
    return this.http.get<DailyPlanDto[]>(`${this.baseUrl}/daily-plans`, {
      params,
    });
  }

  getDailyPlanById(id: number): Observable<DailyPlanDto> {
    return this.http.get<DailyPlanDto>(`${this.baseUrl}/daily-plans/${id}`);
  }

  createDailyPlan(plan: CreateDailyPlanDto): Observable<DailyPlanDto> {
    return this.http.post<DailyPlanDto>(`${this.baseUrl}/daily-plans`, plan);
  }

  updateDailyPlan(id: number, plan: UpdateDailyPlanDto): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/daily-plans/${id}`, plan);
  }

  deleteDailyPlan(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/daily-plans/${id}`);
  }

  // ========== WEEK PLANS ==========

  getWeekPlansByTrainingPlan(
    trainingPlanId: number
  ): Observable<WeekPlanDto[]> {
    const params = new HttpParams().set('trainingPlanId', trainingPlanId);
    return this.http.get<WeekPlanDto[]>(`${this.baseUrl}/week-plans`, {
      params,
    });
  }

  getWeekPlanById(id: number): Observable<WeekPlanDto> {
    return this.http.get<WeekPlanDto>(`${this.baseUrl}/week-plans/${id}`);
  }

  createWeekPlan(plan: CreateWeekPlanDto): Observable<WeekPlanDto> {
    return this.http.post<WeekPlanDto>(`${this.baseUrl}/week-plans`, plan);
  }

  updateWeekPlan(id: number, plan: UpdateWeekPlanDto): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/week-plans/${id}`, plan);
  }

  deleteWeekPlan(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/week-plans/${id}`);
  }

  // ========== TRAINING PLANS (mostafa samir) ==========
  getTrainingPlanById(Id: number): Observable<trainingPlan> {
    return this.http.get<trainingPlan>(`${this.baseUrl}/get/${Id}`);
  }
}
