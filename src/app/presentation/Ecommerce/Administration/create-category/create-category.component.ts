import { Component, OnInit } from '@angular/core';
import { CategoryService } from './../../../../services/Ecommerce/category.service';
import { Category } from '../../../../domain/models/Ecommerce/category.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-category',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './create-category.component.html',
  styleUrls: ['./create-category.component.css']
})
export class CreateCategoryComponent implements OnInit {

  categories: Category[] = [];
  CategoryName: string = '';

  constructor(private CategoryService: CategoryService) {}

  ngOnInit(): void {
    this.CategoryService.getAllCategories().subscribe((categories) => {
      this.categories = categories;
    });
  }

  onAddCategory() {
    if (!this.CategoryName.trim()) return;

    this.CategoryService.createCategory(this.CategoryName.toUpperCase()).subscribe((category) => {
      this.categories.push(category);
      this.CategoryName = '';
    });
  }

  onRemoveCategory(id: number) {
    this.CategoryService.deleteCategory(id).subscribe(() => {
      this.categories = this.categories.filter(c => c.categoryID !== id);
    });
  }
}
