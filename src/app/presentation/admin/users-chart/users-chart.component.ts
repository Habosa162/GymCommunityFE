import { Component, OnInit } from '@angular/core';
import { ChartData, ChartOptions, ChartType } from 'chart.js';
import { AdminService } from '../../../services/Admin/admin.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-users-chart',
  imports: [CommonModule, BaseChartDirective,FormsModule],
  templateUrl: './users-chart.component.html',
  styleUrls: ['./users-chart.component.css']
})
export class UsersChartComponent implements OnInit {
  isLoading: boolean = false;
  roles: string[] = ['Client', 'Admin', 'Coach'];
  years: number[] = [2023, 2024, 2025];
  role: string = 'Client';
  year: number = 2025;
  chartInfo: { month: number; count: number }[] = [];

  barChartLabels: string[] = [];



  barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [{ data: [], label: 'Users per Month' }]
  };


  barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0 // Ensures whole numbers on Y-axis
        }
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'top'
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.parsed.y} users`
        }
      }
    }
  };


  constructor(private adminService: AdminService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getUsersChartInfo();
  }


// Update your getUsersChartInfo method
getUsersChartInfo(): void {
  this.isLoading = true;
  this.adminService.getUsersSummary(this.role, this.year).subscribe({
    next: (res) => {
      this.chartInfo = res;

      this.chartInfo.sort((a, b) => a.month - b.month);

      this.barChartLabels = this.chartInfo.map(x => this.getMonthName(x.month));

      this.barChartData = {
        labels: this.chartInfo.map(x => this.getMonthName(x.month)),
        datasets: [
          { data: this.chartInfo.map(x => x.count), label: 'Users per Month' }
        ]
      };

      this.isLoading = false;
    },
    error: () => {
      this.toastr.error('Failed to load chart data', 'Error');
      this.isLoading = false;
    }
  });
}
  onFilterChange(): void {
    this.getUsersChartInfo();
  }
  getMonthName(month: number): string {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[month - 1] || '';
  }
}
