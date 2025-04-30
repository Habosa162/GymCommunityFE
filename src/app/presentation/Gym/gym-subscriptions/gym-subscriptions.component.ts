import { Component } from '@angular/core';
import { PaymentStatus, UserSubscriptionRead } from '../../../domain/models/Gym/user-subscription.model';
import { UserSubscriptionService } from '../../../services/Gym/user-subscription.service';
import { AuthService } from '../../../services/auth.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-gym-subscriptions',
  imports: [CommonModule,
    FormsModule,RouterModule],
  templateUrl: './gym-subscriptions.component.html',
  styleUrl: './gym-subscriptions.component.css'
})
export class GymSubscriptionsComponent {
  subscriptions: UserSubscriptionRead[] = [];
  filteredSubscriptions: UserSubscriptionRead[] = [];
  isLoading = true;
  searchTerm = '';
  currentPage = 1;
  itemsPerPage = 10;
  statusFilter = 'all';
  sortColumn = 'startDate';
  sortDirection = 'desc';
  Math = Math;
  // Filters
  statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'active', label: 'Active' },
    { value: 'expired', label: 'Expired' },
  ];

  constructor(
    private subscriptionService: UserSubscriptionService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadSubscriptions();
  }

  loadSubscriptions(): void {
    this.isLoading = true;
    const gymOwnerId = this.authService.getUserId()||'';
    
    this.subscriptionService.getByOwnerId(gymOwnerId).subscribe({
      next: (data) => {
        this.subscriptions = data;
        this.filteredSubscriptions = [...data];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load subscriptions', err);
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    this.filteredSubscriptions = this.subscriptions.filter(sub => {
      const matchesSearch = 
        sub.gymName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        sub.planTitle.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        sub.userName.toLowerCase().includes(this.searchTerm.toLowerCase());
      
        const matchesStatus = this.statusFilter === 'all' || 
          (this.statusFilter === 'active' && !sub.isExpired) || 
          (this.statusFilter === 'expired' && sub.isExpired);
      
      return matchesSearch && matchesStatus;
    });

    this.sortSubscriptions();
    this.currentPage = 1;
  }

  sortSubscriptions(): void {
    this.filteredSubscriptions.sort((a, b) => {
      const valA = a[this.sortColumn as keyof UserSubscriptionRead];
      const valB = b[this.sortColumn as keyof UserSubscriptionRead];
      
      if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  onSort(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.sortSubscriptions();
  }

  getStatusBadgeClass(status: PaymentStatus): string {
    switch (status.toString().toLowerCase()) {
      case 'completed': return 'bg-success';
      case 'pending': return 'bg-warning';
      case 'expired': return 'bg-secondary';
      case 'refunded': return 'bg-danger';
      default: return 'bg-info';
    }
  }

  get paginatedSubscriptions(): UserSubscriptionRead[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredSubscriptions.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredSubscriptions.length / this.itemsPerPage);
  }

  refreshData(): void {
    this.loadSubscriptions();
  }


  // Method to calculate page numbers for pagination
  getPageNumbers(): number[] {
    const totalPages = Math.ceil(this.filteredSubscriptions.length / this.itemsPerPage);
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  viewSubscriptionDetails(subscriptionId: number): void {
    this.router.navigate(['/gym-owner/subscription', subscriptionId]);
  }

}
