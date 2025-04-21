export interface GymCoachDTO {
    id: number;
    gymId: number;
    coachID: string;
    coachName?: string;
    gymName?: string;
}
  
export interface GymCoachCreateDTO {
    gymId: number;
    coachID: string;
}
  