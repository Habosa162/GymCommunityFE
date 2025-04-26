import { WeekPlanDto } from './weekly-plan-dto';

export interface CreateDailyPlanDto {
  weekPlanId: number;
  // weekPlan: WeekPlanDto;
  extraTips?: string;
  dayDate: string; // Assuming the API expects a string format for the date.
  dayNumber: number;
  dailyPlanJson: string;
}
