import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import {
  GymManagementService,
  GymReadDTO,
} from '../../../services/Admin/gym-management.service';
import { GymComponent } from '../../Gym/gym/gym.component';

@Component({
  selector: 'app-gym-management',
  standalone: true,
  imports: [CommonModule, RouterModule, GymComponent, FormsModule],
  templateUrl: './gym-management.component.html',
  styleUrls: ['./gym-management.component.css'],
})
export class GymManagementComponent implements OnInit {
  isLoading: boolean = true;
  query: string = '';
  page: number = 1;
  eleNo: number = 8; // Fixed number of items per page (8)
  gymsList: GymReadDTO[] = [];
  filteredGymsList: GymReadDTO[] = [];
  totalCount: number = 0;
  totalPages: number = 0;
  sort: string = 'asc'; // Restored sort property

  constructor(
    private gymService: GymManagementService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getAllGyms();
  }

  // Function to fetch gyms
  getAllGyms() {
    this.isLoading = true;

    this.gymService.getAllGyms().subscribe(
      (res: GymReadDTO[]) => {
        this.gymsList = res;
        this.applyFilters();
        this.isLoading = false;
      },
      (err) => {
        this.isLoading = false;
        console.error(err);
        this.toastr.error('Network Connection', 'Error');
      }
    );
  }

  // Apply filters and pagination
  applyFilters() {
    let filtered = [...this.gymsList];

    // Apply search query filter
    if (this.query) {
      const searchTerm = this.query.toLowerCase();
      filtered = filtered.filter(
        (gym) =>
          gym.name.toLowerCase().includes(searchTerm) ||
          gym.location.toLowerCase().includes(searchTerm)
      );
    }

    // Apply sorting
    if (this.sort === 'asc') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      filtered.sort((a, b) => b.name.localeCompare(a.name));
    }

    // Calculate total count and pages
    this.totalCount = filtered.length;
    this.totalPages = Math.ceil(this.totalCount / this.eleNo);

    // Apply pagination
    const startIndex = (this.page - 1) * this.eleNo;
    this.filteredGymsList = filtered.slice(startIndex, startIndex + this.eleNo);
  }

  // Triggered when search query changes
  onSearchChange(): void {
    this.page = 1; // Reset to page 1 on new search
    this.applyFilters();
  }

  // Sorting handler
  onSortChange(): void {
    this.page = 1; // Reset to page 1 on sorting change
    this.applyFilters();
  }

  // Navigate to the specific page
  goToPage(pageNumber: number): void {
    if (pageNumber >= 1 && pageNumber <= this.totalPages) {
      this.page = pageNumber;
      this.applyFilters();
    }
  }

  // Clear All Filters
  clearAllFilters(): void {
    this.query = '';
    this.page = 1;
    this.applyFilters();
  }

  // Toggle sorting order
  toggleSort(): void {
    this.sort = this.sort === 'asc' ? 'desc' : 'asc';
    this.onSortChange();
  }

  // Get array of page numbers for pagination (max 5 pages shown)
  getPageArray(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;

    if (this.totalPages <= maxPagesToShow) {
      // If we have 5 or fewer pages, show all pages
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      // If we have more than 5 pages, show current page with 2 pages before and after if possible
      let startPage = Math.max(1, this.page - 2);
      let endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);

      // Adjust if we're near the end
      if (endPage - startPage < maxPagesToShow - 1) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }

    return pages;
  }

  onRemoveGym(id: number) {
    if (confirm('Are you sure you want to delete this gym?')) {
      this.gymService.deleteGym(id).subscribe(
        () => {
          this.toastr.success('Gym Removed Successfully!');
          this.getAllGyms();
        },
        (err) => {
          console.log(err);
          this.toastr.error('Network Failed!', 'Error');
        }
      );
    }
  }
}
