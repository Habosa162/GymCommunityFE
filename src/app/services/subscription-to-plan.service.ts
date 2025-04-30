import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionToPlanService {

  constructor() { }
    subscribeToOffer(price: number, title: string, duration: number, coachId: string): void {
     localStorage.setItem('plan', JSON.stringify({price, title, duration, coachId}));
  }
  getPlanSubscription(){
    return localStorage.getItem('plan');
    
  }
  deletePlanSubscription(){
    localStorage.removeItem('plan');

  }
}
