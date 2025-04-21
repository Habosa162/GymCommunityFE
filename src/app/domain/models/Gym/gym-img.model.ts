export interface GymImgCreateDTO {
    gymId: number;
    imageUrl?: string;
}
  
export interface GymImgReadDTO {
    id: number;
    gymId: number;
    imageUrl: string;
}