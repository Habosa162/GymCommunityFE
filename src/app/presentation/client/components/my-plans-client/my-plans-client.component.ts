import { trainingPlan } from './../../../../domain/models/TraingingPlansModels/training-plan-model';
import { TrainingPlansService } from './../../../../services/Training Plans/training-plan.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-my-plans-client',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './my-plans-client.component.html',
  styleUrl: './my-plans-client.component.css',
})
export class MyPlansClientComponent implements OnInit {
  constructor(private trainingPlansService: TrainingPlansService) {}

  myPlans: any[] = [];
  filteredPlans: any[] = [];
  searchTerm: string = '';
  planType: string = '';
  durationFilter: string = '';
  
  // Pagination properties
  currentPage: number = 1;
  itemsPerPage: number = 6;
  totalPages: number = 1;

  ngOnInit(): void {
    this.getMyPlans();
  }

  getMyPlans() {
    this.trainingPlansService
      .getAllTrainingPlans()
      .subscribe((response: any[]) => {
        this.myPlans = response;
        this.filteredPlans = response;
        this.updatePagination();
        console.log(this.myPlans);
      });
  }

  resetFilters() {
    this.searchTerm = '';
    this.planType = '';
    this.durationFilter = '';
    this.currentPage = 1;
    this.applyFilters();
  }

  applyFilters() {
    this.filteredPlans = this.myPlans.filter(plan => {
      // Search by name
      const nameMatch = !this.searchTerm || 
        plan.name.toLowerCase().includes(this.searchTerm.toLowerCase());

      // Filter by plan type
      const typeMatch = !this.planType || 
        plan.isStaticPlan.toString() === this.planType;

      // Filter by duration range
      let durationMatch = true;
      if (this.durationFilter) {
        const duration = plan.durationMonths;
        switch (this.durationFilter) {
          case '1-3':
            durationMatch = duration >= 1 && duration < 3;
            break;
          case '3-6':
            durationMatch = duration >= 3 && duration < 6;
            break;
          case '6-12':
            durationMatch = duration >= 6 && duration < 12;
            break;
          case '12+':
            durationMatch = duration >= 12;
            break;
        }
      }

      return nameMatch && typeMatch && durationMatch;
    });

    this.updatePagination();
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredPlans.length / this.itemsPerPage);
    if (this.currentPage > this.totalPages) {
      this.currentPage = 1;
    }
  }

  getCurrentPagePlans() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredPlans.slice(startIndex, endIndex);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }
}
