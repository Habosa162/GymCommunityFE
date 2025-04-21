import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ExerciseDto } from './dtos/exercise-dto';
import { MuscleGroupDto } from './dtos/muscle-group.dto';

@Injectable({
  providedIn: 'root',
})
export class ExerciseService {
  private baseUrl = 'https://localhost:7130/api/Exercise';

  constructor(private http: HttpClient) {}

  getAllMuscleGroups(): Observable<MuscleGroupDto[]> {
    return this.http.get<MuscleGroupDto[]>(`${this.baseUrl}/MuscleGroup`);
  }
  getExercises(muscleGroupId?: number): Observable<ExerciseDto[]> {
    let params = new HttpParams();
    if (muscleGroupId !== undefined) {
      params = params.set('muscleGroupId', muscleGroupId);
    }

    return this.http.get<ExerciseDto[]>(this.baseUrl, { params });
  }

  getExercise(id: number): Observable<ExerciseDto> {
    return this.http.get<ExerciseDto>(`${this.baseUrl}/${id}`);
  }

  createExercise(exercise: ExerciseDto): Observable<ExerciseDto> {
    return this.http.post<ExerciseDto>(this.baseUrl, exercise);
  }

  updateExercise(id: number, exercise: ExerciseDto): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, exercise);
  }

  deleteExercise(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
