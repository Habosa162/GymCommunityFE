export interface GymReadDTO {
    id: number;
    ownerId: string;
    name: string;
    location: string;
    description: string;
    phoneNumber?: string;
    website?: string;
    email?: string;
    latitude: number;
    longitude: number;
    createdAt: string;
  }
  
  export interface GymCreateDTO {
    ownerId: string;
    name: string;
    location: string;
    description: string;
    phoneNumber?: string;
    website?: string;
    email?: string;
    latitude: number;
    longitude: number;
  }
  