export interface CreateWeekPlanDto {
  trainingPlanId: number;
  weekName: string;
  startDate: string; // Use string for DateTime, typically ISO format (e.g., '2023-10-01')
}
