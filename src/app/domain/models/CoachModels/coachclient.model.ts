export interface AppUser {
  id: string;
  firstName: string;
  lastName: string;
  gender?: string;
  profileImg?: string;
  birthDate?: Date;
}

export interface CoachClientsDTO {
  planId: number;
  client: AppUser;
}
