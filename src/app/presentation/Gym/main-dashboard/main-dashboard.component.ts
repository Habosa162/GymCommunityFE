import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartType } from 'chart.js';
import { GymService } from '../../../services/Gym/gym.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { DashboardService } from '../../../services/Gym/dashboard.service';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, registerables } from 'chart.js';
import { DashboardSummary, TopPlan, RecentMember } from '../../../domain/models/Gym/dashboard.model';
@Component({
  selector: 'app-main-dashboard',
  imports: [CommonModule,BaseChartDirective],
  templateUrl: './main-dashboard.component.html',
  styleUrl: './main-dashboard.component.css'
})
export class MainDashboardComponent implements OnInit {
  // Add these to your component
currentDate = new Date();
revenueTrend = 12.5; // Calculate from your data
memberTrend = 8.3;   // Calculate from your data

getPlanColor(planName: string): string {
  const colors: {[key: string]: string} = {
    'Basic': '#FF6384',
    'Premium': '#36A2EB',
    'VIP': '#FFCE56',
    'Family': '#4BC0C0',
    'Student': '#9966FF'
  };
  return colors[planName] || '#CCCCCC';
}

getPlanBadgeClass(planName: string): string {
  const classes: {[key: string]: string} = {
    'Basic': 'danger',
    'Premium': 'primary',
    'VIP': 'warning',
    'Family': 'info',
    'Student': 'success'
  };
  return classes[planName] || 'secondary';
}

getMemberBadgeClass(planName: string): string {
  const classes: {[key: string]: string} = {
    'Basic': 'bg-danger',
    'Premium': 'bg-primary',
    'VIP': 'bg-warning',
    'Family': 'bg-info',
    'Student': 'bg-success'
  };
  return classes[planName] || 'bg-secondary';
}


  summary!: DashboardSummary;
  topPlans: TopPlan[] = [];
  recentMembers: RecentMember[] = [];

  revenueFlowChart: ChartConfiguration<'bar'> = {
    type: 'bar',
    data: {
      labels: [],
      datasets: [{
        label: 'Revenue Flow',
        data: [],
        backgroundColor: 'rgba(54, 162, 235, 0.6)'
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'EGP'
          }
        }
      }
    }
  };

  membershipDistributionChart: ChartConfiguration<'doughnut'> = {
    type: 'doughnut',
    data: {
      labels: [],
      datasets: [{
        label: 'Membership Distribution',
        data: [],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)'
        ]
      }]
    }
  };

  memberGrowthChart: ChartConfiguration<'line'> = {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: 'Member Growth',
        data: [],
        fill: true,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)'
      }]
    }
  };

  constructor(
    private dashboardService: DashboardService,
    private authService: AuthService
  ) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    const gymOwnerId = this.authService.getUserId() || '';
    this.loadDashboardData(gymOwnerId);
  }

  loadDashboardData(gymOwnerId:string){
    // Fetch summary
    this.dashboardService.getSummary(gymOwnerId).subscribe(summary => {
      this.summary = summary;

      // Revenue chart
      this.revenueFlowChart.data.labels = summary.monthlyRevenue.map((m: { month: any; }) => m.month);
      this.revenueFlowChart.data.datasets[0].data = summary.monthlyRevenue.map((m: { amount: any; }) => m.amount);

      // Member growth chart
      this.memberGrowthChart.data.labels = summary.monthlyMembers.map((m: { month: any; }) => m.month);
      this.memberGrowthChart.data.datasets[0].data = summary.monthlyMembers.map((m: { count: any; }) => m.count);
    });

    // Top plans for doughnut chart
    this.dashboardService.getTopPlans(gymOwnerId).subscribe(plans => {
      this.topPlans = plans;
      this.membershipDistributionChart.data.labels = plans.map(p => p.name);
      this.membershipDistributionChart.data.datasets[0].data = plans.map(p => p.subscribers);
    });

    // Recent members list
    this.dashboardService.getRecentMembers(gymOwnerId).subscribe(members => {
      this.recentMembers = members;
    });

  }
  getAbsoluteValue(value: number): number {
    return Math.abs(value);
  }
}
