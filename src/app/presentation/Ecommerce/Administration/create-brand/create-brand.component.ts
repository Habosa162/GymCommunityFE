import { Component } from '@angular/core';
import { Brand } from '../../../../domain/models/Ecommerce/brand.model';
import { BrandService } from '../../../../services/Ecommerce/brand.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-brand',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './create-brand.component.html',
  styleUrls: ['./create-brand.component.css']
})
export class CreateBrandComponent {

  brands: Brand[] = [];
  brandName: string = '';
  brandDesc: string = '';

  constructor(private brandService: BrandService) { }
getBrands(){
  this.brandService.getAllBrands().subscribe((brands) => {
    console.log(brands);
    this.brands = brands;
  });
}
  ngOnInit(): void {
    this.getBrands() ;
  }

  onAddBrand() {
    if (!this.brandName.trim() || !this.brandDesc.trim()) {
      console.log("Please provide both name and description.");
      return;
    }

    this.brandService.createBrand(this.brandName.toUpperCase(), this.brandDesc.toLowerCase()).subscribe((brand) => {
      this.getBrands() ;
      this.brandName = '';
      this.brandDesc = '';
    });
  }

  onRemoveBrand(id: number) {
    this.brandService.removeBrand(id).subscribe(() => {
      console.log(`Brand with id ${id} deleted`);
    });
    this.brands = this.brands.filter(b => b.brandID !== id);
  }
}
