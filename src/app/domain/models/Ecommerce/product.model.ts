export interface Product{
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  createdAt: Date;
  rating: number;
  categoryId: number;
  category: string;
  brandId : number ;
  brandName : string ;
  discountAmount:number ;
  // : number;
  // reviews: number;
  // updatedAt: Date;
  // isActive: boolean;
}
