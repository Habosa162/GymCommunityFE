export interface ClientProfile {
  address: string;
  birthDate: Date;
  clientGoal: string;
  clientId: number;
  createdAt: Date;
  firstName: string;
  lastName: string;
  otherGoal: string;
  profileImg: string;
  weight: number;
  height: number;
  workoutAvailability: number;
  isPremium: boolean;
  isActive: boolean;
  gender: string;
  bodyFat: number;
  bio: string;
  coverImg: string;

}

export interface ProfileData {
  clientProfile: ClientProfile;
  isOwner: boolean;
}
