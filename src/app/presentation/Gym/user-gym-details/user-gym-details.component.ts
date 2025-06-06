import { Component } from '@angular/core';
import { NgxImageZoomModule } from 'ngx-image-zoom';
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
  imports: [CommonModule,RouterModule,GoogleMapsModule,NgxImageZoomModule],
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
  isSubscribed: boolean = false;

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

  zoomConfig = {
    enable: true,
    scale: 2, // Default zoom scale
    zoomMode: 'hover', // or 'click'
    enableScrollZoom: true, // Enable mouse wheel zoom
    scrollStepSize: 0.1,
    enableLens: false,
    lensWidth: 100,
    lensHeight: 100
  };

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
    this.userId = this.authService.getUserId() || ''; 
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
    this.loadAllSubscriptions(); 

    // Scroll to the fragment if it exists
    this.route.fragment.subscribe((fragment) => {
      if (fragment) {
        this.viewportScroller.scrollToAnchor(fragment);
      }
    });

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
    this.loadAllSubscriptions(); 
    this.scrollTo('plans');
  }

  processSubscriptionAndPayment(): void {
    if (!this.selectedPlan) {
      alert('Please select a plan first');
      return;
    }
  
    this.isLoading = true;
    localStorage.setItem("planprice", this.selectedPlan.price.toString());
    localStorage.setItem("gymId", this.gymId.toString());
    localStorage.setItem("planId", this.selectedPlan.id.toString());
    localStorage.setItem("userId", this.userId.toString());


    // Prepare the redirection URL
    const orderData = {
      amount: (this.selectedPlan?.price ?? 0) * 100,
      currency: "EGP",
      payment_methods: [4419883, 4437311, 4437297,4438104],
      billing_data: {
        "first_name": "N/A",
        "last_name": "N/A",
        "phone_number": "N/A",
      },
      extras: { 
        gym_id: this.gymId,
        plan_id: this.selectedPlan.id,
        user_id: this.userId
      },
      redirection_url: `${FrontbaseUrl}/sub-payment-success`
    };
  
    this.paymentService.PaymobRequest(orderData).subscribe({
      next: (paymobResponse: any) => {
        this.isLoading = false;
        const clientSecret = paymobResponse.client_secret;
        if (clientSecret) {
          const paymentUrl = `https://accept.paymob.com/unifiedcheckout/?publicKey=egy_pk_test_jrlnWL5oJX8IRTp9xpeHq5mmQhAMfXES&clientSecret=${clientSecret}`;
          window.location.href = paymentUrl; // Redirect to the payment URL
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error:', err);
        alert('There was an error processing your payment. Please try again.');
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
  subscriptions: any[] = []; 

  loadAllSubscriptions(): void {
    this.userSubscriptionService.getAll().subscribe({
      next: (subscriptions) => {
        this.subscriptions = subscriptions;
        console.log("subscriptions",subscriptions)
        this.checkSubscriptionStatus();
      },
      error: (err) => console.error('Failed to load subscriptions', err)
    });
  }

  checkSubscriptionStatus(): void {
    if (!this.userId || !this.gym?.id) return;
    
    // Check if user has any active subscription for this gym
    const hasActiveSubscription = this.subscriptions.some(sub => 
      sub.userId === this.userId &&
      sub.gymId === this.gym?.id &&
      new Date(sub.expiresAt) > new Date() 
    );
    
    this.isSubscribed = hasActiveSubscription;
    console.log("Subscription status:", this.isSubscribed);
  
  }

  selectedImage: string | null = null;

  openLightbox(imageUrl: string): void {
    this.selectedImage = imageUrl;
  }

  closeLightbox(): void {
    this.selectedImage = null;
  }
  navigateImage(direction: number): void {
    if (!this.selectedImage || !this.images) return;
    
    const currentIndex = this.images.findIndex(img => img.imageUrl === this.selectedImage);
    let newIndex = currentIndex + direction;
    
    // Wrap around
    if (newIndex < 0) newIndex = this.images.length - 1;
    if (newIndex >= this.images.length) newIndex = 0;
    
    this.selectedImage = this.images[newIndex].imageUrl;
  }
}
