import { Review } from './Review.model'; // Add this import
export interface Product{
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  createdAt: Date;
  rating: number;
  categoryID: number;
  categoryName: string;
  brandId : number ;
  brandName : string ;
  discountAmount:number ;
  reviews?: Review[]; // Add reviews array to product
  averageRating?: number; // Add calculated rating
  // : number;
  // reviews: number;
  // updatedAt: Date;
  // isActive: boolean;
}
