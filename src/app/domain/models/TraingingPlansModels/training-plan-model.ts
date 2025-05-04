export interface trainingPlan {
  id: number;
  coachId: string;
  clientId: string;
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
  paymentId: number;
}
