export class CoachOffer {
    id?: number;
    title!: string;
    desc?: string;
    price!: number;
    imageUrl?: string;
    durationMonths!: number;
    coachId!: string;
    coachName?: string;
}

// export interface CreateCoachOffer {
//     title: string;
//     desc?: string;
//     price: number;
//     durationMonths: number;
//     image?: File; // For upload
// }
