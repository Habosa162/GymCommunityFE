export interface trainingPlan {
  id: number;
  coachId: number;
  clientId: number;
  isStaticPlan: boolean;
  name: string;
  durationMonths: number;
  type: string;
  startDate: Date;
  endDate: Date;
}
export interface CreatetrainingPlan {
  coachId: string;
  clientId: string;
  name: string;
  durationMonths: number;
  startDate: Date;
}