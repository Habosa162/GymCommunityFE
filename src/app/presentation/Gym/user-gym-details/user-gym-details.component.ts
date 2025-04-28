import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { GymReadDTO } from '../../../domain/models/Gym/gym.model';
import { PaymentService } from '../../../services/Ecommerce/payment.service';
import { GymCoachService } from '../../../services/Gym/gym-coach.service';
import { GymImgService } from '../../../services/Gym/gym-img.service';
import { GymPlanService } from '../../../services/Gym/gym-plan.service';
import { GymService } from '../../../services/Gym/gym.service';
import { UserSubscriptionService } from '../../../services/Gym/user-subscription.service';
import { CommonModule, ViewportScroller } from '@angular/common';
import { ClientProfileService } from '../../../services/Client/client-profile.service';
import { GoogleMapsModule } from '@angular/google-maps';
import { switchMap } from 'rxjs';
import { PaymentDTO } from '../../../domain/models/Ecommerce/payment.mdoel';
import { UserSubscriptionCreate, UserSubscriptionRead, PaymentStatus } from '../../../domain/models/Gym/user-subscription.model';
import { AuthService } from '../../../services/auth.service';
import { FrontbaseUrl } from '../../../services/enviroment';
import { GymPlanRead } from '../../../domain/models/Gym/gym-plan.model';

@Component({
  selector: 'app-user-gym-details',
  imports: [CommonModule,RouterModule,GoogleMapsModule],
  templateUrl: './user-gym-details.component.html',
  styleUrl: './user-gym-details.component.css'
})
export class UserGymDetailsComponent {
  gym: GymReadDTO | null = null;
  gymId!: number;
  activeTab: 'info' | 'coaches' | 'images' | 'plans' = 'info';
  coaches: any[] = [];
  images: any[] = [];
  plans: any[] = [];
  selectedPlan: GymPlanRead | null = null; 
  subscriptionData: any = {
    userId: '', 
    startDate: new Date(),
    expiresAt: new Date(new Date().setMonth(new Date().getMonth() + 1))
  };

  userId: string ='';

  coachImages: { [key: string]: string } = {};
  isLoading = false;

  // Google Maps
  mapOptions: google.maps.MapOptions = {
    zoom: 18,
    disableDefaultUI: true,
    styles: [
      {
        featureType: "poi",
        elementType: "labels",
        stylers: [{ visibility: "off" }]
      }
    ]
  };
  markerPosition: google.maps.LatLngLiteral | null = null;
  mapInitialized = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private gymService: GymService,
    private gymCoachService: GymCoachService,
    private gymImgService: GymImgService,
    private gymPlanService: GymPlanService,
    private userSubscriptionService: UserSubscriptionService,
    private paymentService: PaymentService,
    private clientProfileService: ClientProfileService ,
    private viewportScroller: ViewportScroller,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserId() || ''; // Get the user ID from the auth service
    if (!this.userId) {
      console.error('User ID not found');
      return;
    }


    this.initGoogleMaps();
    this.gymId = +this.route.snapshot.params['id'];
    this.loadGym();
    this.loadCoaches();
    this.loadImages();
    this.loadPlans();
  }

  loadGym(): void {
    this.gymService.getGymById(this.gymId).subscribe({
      next: (gym) =>{ 
        this.gym = gym;
        console.log(gym.latitude , gym.longitude);
        if (gym.latitude && gym.longitude) {
          this.updateMapPosition(gym.latitude, gym.longitude);
        }

      },
      error: (err) => console.error('Failed to load gym', err)
    });
  }

  loadCoaches(): void {
    this.gymCoachService.getGymCoachesByGymId(this.gymId).subscribe({
      next: (coaches) => {
        this.coaches = coaches;
        this.coaches.forEach(coach => {
          this.getCoachProfileImage(coach.coachID);
        });
      },
      error: (err) => console.error('Failed to load coaches', err)
    });
  }
  
  getCoachProfileImage(coachId: string): void {
    this.clientProfileService.getClientProfileById(coachId).subscribe({
      next: (response: any) => {
        if (response.success && response.data?.profileImg) {
          console.log(`Profile image for coach ${coachId}:`, response.data.profileImg);
          this.coachImages[coachId] = response.data.profileImg; // Store the image URL
        } else {
          console.warn(`No profile image found for coach ${coachId}`);
        }
      },
      error: (err) => console.error(`Failed to load profile image for coach ${coachId}`, err)
    });
  }

  loadImages(): void {
    this.gymImgService.getByGymId(this.gymId).subscribe({
      next: (images) => this.images = images,
      error: (err) => console.error('Failed to load images', err)
    });
  }

  loadPlans(): void {
    this.gymPlanService.getByGymId(this.gymId).subscribe({
      next: (plans) => this.plans = plans,
      error: (err) => console.error('Failed to load plans', err)
    });
  }

  selectPlan(plan: any): void {
    this.selectedPlan = plan;
    this.subscriptionData.planId = plan.id;
    this.subscriptionData.gymId = this.gymId;
    this.scrollTo('plans');
  }

  processSubscriptionAndPayment(): void {
    if (!this.selectedPlan) {
      alert('Please select a plan first');
      return;
    }
  
    this.isLoading = true;
  
    const startDate = new Date();
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 1);
  
    const subscriptionData: UserSubscriptionCreate = {
      userId: this.userId,
      gymId: this.gymId,
      planId: this.selectedPlan.id,
      startDate: startDate,
      expiresAt: expiresAt
    };
  
    this.userSubscriptionService.create(subscriptionData).pipe(
      switchMap((subscription: UserSubscriptionRead) => {
        // Create local payment record first
        const paymentData: PaymentDTO = {
          amount: this.selectedPlan?.price ?? 0,
          currency: 'EGP',
          paymentMethod: 'Paymob',
          status: PaymentStatus.Completed,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        localStorage.setItem('subscriptionId', subscription.id.toString());

        return this.paymentService.CreatePayment(paymentData).pipe(
          switchMap((createdPayment: PaymentDTO) => {
            // Prepare Paymob request with both IDs in extras
            const orderData = {
              amount: (this.selectedPlan?.price ?? 0) * 100,
              currency: "EGP",
              payment_methods: [4419883, 4437311, 4437297],
              billing_data: {
                "first_name": "N/A",
                "last_name": "N/A",
                "phone_number": "N/A",
              },
              extras: { 
                subscription_id: subscription.id,
                payment_id: createdPayment.id,
                user_id: this.userId
              },
              redirection_url:  `${FrontbaseUrl}/sub-payment-success`};
            if (createdPayment.id !== undefined && createdPayment.id !== null) {
              localStorage.setItem("paymentId", createdPayment.id.toString());
            } else {
              console.error('Payment ID is undefined or null');
            }
  
            return this.paymentService.PaymobRequest(orderData);
          })
        );
      })
    ).subscribe({
      next: (paymobResponse: any) => {
        this.isLoading = false;
        const clientSecret = paymobResponse.client_secret;
        if (clientSecret) {
          const paymentUrl = `https://accept.paymob.com/unifiedcheckout/?publicKey=egy_pk_test_jrlnWL5oJX8IRTp9xpeHq5mmQhAMfXES&clientSecret=${clientSecret}`;
          window.location.href = paymentUrl;
        }

      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error:', err);
        alert('There was an error processing your subscription. Please try again.');
      }
    });
  }
  

  viewCoachProfile(coachId: string): void {
    this.router.navigate(['/coach/profile', coachId]);
  }

  scrollTo(section: string): void {
    this.viewportScroller.scrollToAnchor(section);
  }

  openImageInNewTab(url: string): void {
    window.open(url, '_blank');
  }

  // Google Maps Methods
  initGoogleMaps(): void {
    if (typeof google === 'undefined' || !google.maps || !google.maps.places) {
      this.loadGoogleMapsScript();
    } else {
      this.mapInitialized = true;
      if (this.gym?.latitude && this.gym?.longitude) {
        this.updateMapPosition(this.gym.latitude, this.gym.longitude);
      }
    }
  }
  
  loadGoogleMapsScript(): void {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAFEYZKTxhZz5eY9c760Gyz7kJ3mNbXb34&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => this.mapInitialized = true;
    document.head.appendChild(script);
}

  updateMapPosition(lat: number, lng: number): void {
    this.markerPosition = { lat, lng };
    this.mapOptions = {
      ...this.mapOptions,
      center: this.markerPosition
    };
  }

  openDirections(): void {
    if (this.gym?.latitude && this.gym?.longitude) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${this.gym.latitude},${this.gym.longitude}`;
      window.open(url, '_blank');
    }
  }

}
