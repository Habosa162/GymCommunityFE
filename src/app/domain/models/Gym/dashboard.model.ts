export interface DashboardSummary {
  totalGyms: number;
  totalMembers: number;
  activePlans: number;
  totalRevenue: number;
  platformFees: number;
  netProfit: number;
  monthlyRevenue: MonthlyRevenue[];
  monthlyMembers: MonthlyMembers[];
}

export interface MonthlyRevenue {
  month: string;
  amount: number;
}

export interface MonthlyMembers {
  month: string;
  count: number;
}

export interface TopPlan {
  name: string;
  subscribers: number;
}

export interface RecentMember {
  name: string;
  plan: string;
  joinDate: Date;
}
