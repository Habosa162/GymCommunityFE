import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UserSubscriptionService } from '../../../services/Gym/user-subscription.service';
import { AuthService } from '../../../services/auth.service';
import { UserSubscriptionRead } from '../../../domain/models/Gym/user-subscription.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-gym-sub',
  imports: [CommonModule,RouterModule],
  templateUrl: './user-gym-sub.component.html',
  styleUrl: './user-gym-sub.component.css'
})
export class UserGymSubComponent implements OnInit{
  activeMemberships: any[] = [];
  expiredMemberships: any[] = [];
  showExpired: boolean = false;
  currentUserId : string ='';
  // Sample data - replace with actual API calls
  sampleMemberships : UserSubscriptionRead[]= [];
  //   {
  //     id: 1,
  //     planName: "Premium Fitness",
  //     status: "Active",
  //     qrCodeData: "MEM-001-USER-123",
  //     startDate: new Date(2023, 5, 1),
  //     endDate: new Date(2024, 5, 1),
  //     planType: "Premium",
  //     accessHours: "24/7 Access",
  //     features: [
  //       "All gym areas",
  //       "Unlimited classes",
  //       "Pool access",
  //       "Sauna & steam room",
  //       "Personal trainer discount"
  //     ]
  //   },
  //   {
  //     id: 2,
  //     planName: "Standard Membership",
  //     status: "Active",
  //     qrCodeData: "MEM-002-USER-123",
  //     startDate: new Date(2023, 8, 15),
  //     endDate: new Date(2025, 11, 15),
  //     planType: "Standard",
  //     accessHours: "6AM-10PM",
  //     features: [
  //       "Main gym area",
  //       "3 classes/week",
  //       "Locker access"
  //     ]
  //   },
  //   {
  //     id: 3,
  //     planName: "Student Plan",
  //     status: "Expired",
  //     qrCodeData: "MEM-003-USER-123",
  //     startDate: new Date(2022, 8, 1),
  //     endDate: new Date(2023, 5, 31),
  //     planType: "Student",
  //     accessHours: "8AM-8PM",
  //     features: [
  //       "Main gym area",
  //       "1 class/week",
  //       "Student ID required"
  //     ]
  //   }
  // ];
  constructor(private userSubService: UserSubscriptionService,
     private authService:AuthService) { }

  ngOnInit(): void {
    this.currentUserId = this.authService.getUserId() || '';
    this.userSubService.getByUserId(this.currentUserId).subscribe((memberships: UserSubscriptionRead[]) => {
      console.log("subs: ", memberships);
      this.sampleMemberships = memberships;
      console.log("sampleMemberships: ", this.sampleMemberships);
      this.loadMemberships();

    });

    
  }

  loadMemberships(): void {
    // In a real app, you would call an API service here
    const today = new Date();
    console.log("sampleMemberships: ", this.sampleMemberships);

    this.activeMemberships = this.sampleMemberships.filter(m => 
      new Date(m.expiresAt) >= today
    );
    console.log("activeMemberships: ", this.activeMemberships);

    
    this.expiredMemberships = this.sampleMemberships.filter(m => 
      new Date(m.expiresAt) < today
    );
    console.log("expiredMemberships: ", this.expiredMemberships);

  }

  isExpiringSoon(endDate: Date): boolean {
    const today = new Date();
    const expiryDate = new Date(endDate);
    const daysUntilExpiry = Math.floor(
      (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    return daysUntilExpiry <= 30 && daysUntilExpiry >= 0;
  }

  getRemainingDays(endDate: Date): number {
    const today = new Date();
    const expiryDate = new Date(endDate);
    return Math.floor(
      (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
  }

  showDetails(membership: any): void {
    // In a real app, you might navigate to a details page
    console.log('Showing details for:', membership);
    alert(`Membership Details:\n\nPlan: ${membership.planName}\nStatus: ${membership.status}\nExpires: ${membership.endDate.toDateString()}`);
  }

  renewMembership(membership: any): void {
    // In a real app, this would navigate to a renewal page
    console.log('Renewing membership:', membership);
    alert(`Redirecting to renewal page for ${membership.planName}`);
  }

  // Utility function to format dates nicely
  formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

}
