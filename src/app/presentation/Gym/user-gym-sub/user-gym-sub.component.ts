import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UserSubscriptionService } from '../../../services/Gym/user-subscription.service';
import { AuthService } from '../../../services/auth.service';
import { UserSubscriptionRead } from '../../../domain/models/Gym/user-subscription.model';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-gym-sub',
  imports: [CommonModule,RouterModule,FormsModule ],
  templateUrl: './user-gym-sub.component.html',
  styleUrl: './user-gym-sub.component.css'
})
export class UserGymSubComponent implements OnInit{
  activeMemberships: any[] = [];
  expiredMemberships: any[] = [];
  showExpired: boolean = false;
  currentUserId : string ='';
  sampleMemberships : UserSubscriptionRead[]= [];
 
  constructor(private userSubService: UserSubscriptionService,
     private authService:AuthService) { }

  ngOnInit(): void {
    this.currentUserId = this.authService.getUserId() || '';
    this.userSubService.getByUserId(this.currentUserId).subscribe((memberships: UserSubscriptionRead[]) => {
      this.sampleMemberships = memberships;
      this.loadMemberships();

    });
  }

  loadMemberships(): void {
    const today = new Date();
    this.activeMemberships = this.sampleMemberships.filter(m => 
      new Date(m.expiresAt) >= today
    );
    
    this.expiredMemberships = this.sampleMemberships.filter(m => 
      new Date(m.expiresAt) < today
    );

  }

  isExpiringSoon(endDate: Date): boolean {
    const today = new Date();
    const expireDate = new Date(endDate);
    const daysLeft = (expireDate.getTime() - today.getTime()) / (1000 * 3600 * 24);
    return daysLeft <= 5 && daysLeft > 0;
  }
  

  getRemainingDays(endDate: Date): number {
    const today = new Date();
    const expiryDate = new Date(endDate);
    return Math.floor(
      (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
  }


  searchTerm: string = '';
filterOption: string = '';

get filteredActiveMemberships() {
  return this.activeMemberships.filter(m => {
    const matchesSearch =
      m.gymName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      m.planTitle.toLowerCase().includes(this.searchTerm.toLowerCase());

    let matchesFilter = true;
    if (this.filterOption === 'privateCoach') {
      matchesFilter = m.hasPrivateCoach;
    } else if (this.filterOption === 'nutritionPlan') {
      matchesFilter = m.hasNutritionPlan;
    } else if (this.filterOption === 'allAccess') {
      matchesFilter = m.hasAccessToAllAreas;
    } else if (this.filterOption === 'expiringSoon') {
      matchesFilter = this.isExpiringSoon(m.expiresAt); 
    }

    return matchesSearch && matchesFilter;
  });
}



}
