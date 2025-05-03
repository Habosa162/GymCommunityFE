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


    isOpen24h:true;
    isPopular:true;
    amenities: string[]; 
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
  