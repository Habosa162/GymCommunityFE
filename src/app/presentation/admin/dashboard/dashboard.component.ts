import { Component, OnInit } from '@angular/core';
import { AdminService } from './../../../services/Admin/admin.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports:[CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  isLoading = true;
  dashboardSummary: any = null;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.getDashboardSummary();
  }

  getDashboardSummary(): void {
    this.adminService.getDashBoardSummary().subscribe({
      next: (res) => {
        this.isLoading = false;
        this.dashboardSummary = res;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }


  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 0
    }).format(value);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }
}