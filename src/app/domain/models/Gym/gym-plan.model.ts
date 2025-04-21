export interface GymPlanCreate {
    gymId: number;
    title: string;
    description: string;
    price: number;
    durationMonths: number;
    hasPrivateCoach: boolean;
    hasNutritionPlan: boolean;
    hasAccessToAllAreas: boolean;
}

export interface GymPlanRead {
    id: number;
    gymId: number;
    title: string;
    description: string;
    price: number;
    durationMonths: number;
    hasPrivateCoach: boolean;
    hasNutritionPlan: boolean;
    hasAccessToAllAreas: boolean;
    noOfSubscriptions: number;
}