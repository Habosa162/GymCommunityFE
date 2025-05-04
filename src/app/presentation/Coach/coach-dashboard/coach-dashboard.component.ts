import { RouterModule } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { CoachDashboardService } from '../../../services/Coachservice/coachdashboard.service';
import {
  Chart,
  BarElement,
  CategoryScale,
  LinearScale,
  BarController,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { CommonModule } from '@angular/common';

// Register the necessary Chart.js components
Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

@Component({
  selector: 'app-coach-dashboard',
  templateUrl: './coach-dashboard.component.html',
  styleUrls: ['./coach-dashboard.component.css'],
  imports: [CommonModule, RouterModule],
})
export class CoachDashboardComponent implements OnInit {
  //data from the API
  coachData: any;
  plans: any[] = [];

  profitsData: any;
  totalBudgets: number = 0;

  //visuals
  totalClients: number = 0;
  totalPlans: number = 0;
  public barChartLabels: string[] = [];
  public barChartData: any[] = [];

  constructor(private coachDashboardService: CoachDashboardService) {}

  ngOnInit(): void {
    this.getCoachDashboard();
  }

  getCoachDashboard() {
    this.coachDashboardService.getCoachDashboard().subscribe(
      (response) => {
        console.log(response);
        this.plans = response.tplans;
        this.profitsData = response.data;
        this.totalBudgets =
          response.data.totalPlansSoldRevenue +
          response.data.totalRevenueProducts;
        this.coachData = response.tplans[0].coach;
        this.calculatePlanAndClients(response.tplans);
        // console.log(this.totalPlans, this.totalClients);
        this.loadTopClientsChartData(response.tplans);

        console.log(this.getClientWorkoutStats(response.tplans));
        // console.log(this.getTopClientsByPlans(response.tplans));

        // this.loadTopClientsChartData(response.tplans);
      },
      (error) => {
        console.error('Error fetching coach dashboard data', error);
      }
    );
  }

  calculatePlanAndClients(allPlans: any) {
    this.totalPlans = allPlans.length;

    // Create a Set of unique client IDs
    const clientIdSet = new Set<string>();

    for (const plan of allPlans) {
      if (plan.client && plan.client.id) {
        clientIdSet.add(plan.client.id);
      }
    }

    this.totalClients = clientIdSet.size;
  }

  getClientWorkoutStats(tPlan: any): any[] {
    const statsMap = new Map<string, { name: string; count: number }>();

    for (const plan of tPlan) {
      const client = plan.client;
      if (!client || !client?.firstName || !plan.weekPlans) continue;

      const clientId = client.id;
      const clientName = `${client?.firstName} ${client?.lastName}`;

      let doneCount = 0;

      for (const week of plan.weekPlans) {
        for (const day of week.workoutDays || []) {
          if (day.isDone) {
            doneCount++;
          }
        }
      }

      if (statsMap.has(clientId)) {
        statsMap.get(clientId)!.count += doneCount;
      } else {
        statsMap.set(clientId, { name: clientName, count: doneCount });
      }
    }

    // Convert map to array
    return Array.from(statsMap.values()).map((item) => ({
      clientName: item.name,
      isDoneCount: item.count,
    }));
  }

  //top clients with most plans
  getTopClientsByPlans(tplans: any): any[] {
    const clientPlanMap = new Map<string, { name: string; count: number }>();

    for (const plan of tplans) {
      const client = plan.client;
      if (!client || !client.id || !client.firstName) continue;

      const clientId = client.id;
      const clientName = `${client.firstName} ${client.lastName}`;

      if (clientPlanMap.has(clientId)) {
        clientPlanMap.get(clientId)!.count++;
      } else {
        clientPlanMap.set(clientId, { name: clientName, count: 1 });
      }
    }

    // Convert to array and sort by count descending
    return Array.from(clientPlanMap.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }

  loadTopClientsChartData(tPlans: any) {
    const topClients = this.getTopClientsByPlans(tPlans);
    this.barChartLabels = topClients.map((c) => c.name); // changed from clientName
    this.barChartData = [
      {
        data: topClients.map((c) => c.count), // fixed from c.planCount
        label: 'Number of Plans',
        backgroundColor: 'rgba(56, 120, 56,1 );',
        borderColor: 'rgb(0, 255, 94)',
        borderWidth: 1,
      },
    ];
    this.rendertopClientChart();
  }

  rendertopClientChart() {
    const ctx = (
      document.getElementById('topClientsChart') as HTMLCanvasElement
    ).getContext('2d');
    if (!ctx) return;

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.barChartLabels,
        datasets: this.barChartData,
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true },
          title: {
            display: true,
            text: 'Top 6 Clients by Number of Plans',
          },
        },
      },
    });
  }
}
