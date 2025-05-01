import { Component, NgModule, NgModuleRef, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CoachService } from '../../../services/Coachservice/coach.service';
import { CoachFullProfile } from '../../../domain/models/CoachModels/coach-full-profile.model';
import { Coachportfolio } from '../../../domain/models/CoachModels/coachportfolio.model';
import { Coachcertficate } from '../../../domain/models/CoachModels/coachcertficate.model';
import { Coachworksample } from '../../../domain/models/CoachModels/coachworksample.model';
import { Coachrating } from '../../../domain/models/CoachModels/coachrating.model';
import { CommonModule } from '@angular/common';
import { FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { CoachCleintsService } from '../../../services/Coachservice/coacclients.service';
import { CoachClientsDTO } from '../../../domain/models/CoachModels/coachclient.model';
import { ProductService } from '../../../services/Ecommerce/product.service';
import { Product } from '../../../domain/models/Ecommerce/product.model';
import { CoachOfferService } from '../../../services/Coachservice/coach-offer.service';
import { CoachOffer } from '../../../domain/models/CoachModels/coach-offer.model';
import { FrontbaseUrl } from '../../../services/enviroment';
import { PaymentService } from '../../../services/Ecommerce/payment.service';
import { SubscriptionToPlanService } from '../../../services/subscription-to-plan.service';

@Component({
  selector: 'app-coach-profile',
  templateUrl: './coach-profile.component.html',
  styleUrls: ['./coach-profile.component.css'],
  imports: [CommonModule, FormsModule, RouterModule, ReactiveFormsModule]
})
export class CoachProfileComponent implements OnInit {
  coachId: string = '';
  clients: CoachClientsDTO[] = [];
  portfolio: Coachportfolio | null = null;
  certificates: Coachcertficate[] = [];
  workSamples: Coachworksample[] = [];
  ratings: Coachrating[] = [];
  averageRating: number = 0;
  isLoading: boolean = true;
  currentYear: number = new Date().getFullYear();
  coach: CoachFullProfile | null = null;
  imgurl!: string;
  // Pagination properties
  currentPage: number = 1;
  pageSize: number = 9;
  totalPages: number = 0;
  totalCount: number = 0;
  coachproducts: Product[] = [];
  coachoffers: CoachOffer[] = [];
  expandedOffers: { [key: number]: boolean } = {};

  constructor(
    private route: ActivatedRoute,
    private coachService: CoachService,
    private authservice: AuthService,
    private coachclientservice: CoachCleintsService,
    private productservice: ProductService,
    private offersservice: CoachOfferService,
    private paymentService: PaymentService,
    private subscriptionToPlanService: SubscriptionToPlanService
  ) { }

  ngOnInit(): void {
    this.coachId = this.route.snapshot.paramMap.get('coachId') || this.authservice.getUserId()!;

    if (this.coachId) {
      this.loadCoachProfile();
      this.loadcoachclient();
      this.loadcoachproducts();
      this.loadcoachoffers(this.coachId);
    }
  }

  loadcoachproducts(): void {
    this.productservice.getUserProducts(this.coachId).subscribe({
      next: (response: any) => {
        this.coachproducts = response || [];
        console.log(this.coachproducts)
      },
    })
  }

  loadcoachoffers(coachid: any): void {
    this.offersservice.getByCoachId(this.coachId).subscribe({
      next: (res: any) => {
        this.coachoffers = res || [];
        console.log(this.coachoffers)
      }
    })
  }
  loadcoachclient(): void {
    this.coachclientservice.getClientsByCoachId(this.currentPage, this.pageSize).subscribe({
      next: (response: any) => {
        this.clients = response.data || [];
        this.currentPage = response.currentPage;
        this.totalPages = response.totalPages;
        this.totalCount = response.totalCount;
      },
      error: (error: any) => {
        console.error('Error loading clients:', error);
        this.clients = [];
      }
    });
  }
  loadCoachProfile(): void {
    this.isLoading = true;
    this.coachService.getCoachFullProfile(this.coachId).subscribe({
      next: (data) => {
        this.coach = data;
        this.portfolio = data.portfolio;
        this.imgurl = this.portfolio.aboutMeImageUrl;
        this.certificates = data.certificates;
        this.workSamples = data.workSamples;
        this.ratings = data.ratings;
        if (typeof this.portfolio?.skillsJson === 'string') {
          this.portfolio.skillsJson = JSON.parse(this.portfolio.skillsJson);
        }
        if (typeof this.portfolio?.socialMediaLinksJson === 'string') {
          this.portfolio.socialMediaLinksJson = JSON.parse(this.portfolio.socialMediaLinksJson);
        }
        this.calculateAverageRating();
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error fetching coach profile:', error);
        this.isLoading = false;
      }
    });

  }

  calculateAverageRating(): void {
    if (this.ratings.length > 0) {
      const sum = this.ratings.reduce((total, rating) => total + rating.rate, 0);
      this.averageRating = sum / this.ratings.length;
    }
  }

  getSkills(): string[] {
    return this.portfolio?.skillsJson || [];
  }

  getSocialMediaLinks(): string[] {
    return this.portfolio?.socialMediaLinksJson || [];
  }

  toggleOfferExpansion(offerId: number): void {
    this.expandedOffers[offerId] = !this.expandedOffers[offerId];
  }

  isOfferExpanded(offerId: number): boolean {
    return this.expandedOffers[offerId] || false;
  }


  //*********subscribe to offer*********



  subscribeToOffer(price: number, title: string, duration: number, coachId: string): void {
    this.subscriptionToPlanService.subscribeToOffer(price, title, duration, coachId);
    this.paymobpayment(price, title, coachId, duration);
  }

  paymobpayment(price: number, title: string, coachId: string, duration: number,) {
    const userName = this.authservice.getUserName();
    const userEmail = this.authservice.getUserEmail();



    const orderData = {
      amount: price * 100,
      currency: "EGP",
      payment_methods: [4419883, 4437311, 4437297],
      orderItems: title,
      billing_data: {
        "apartment": "dumy",
        "first_name": userName,
        "last_name": userName,
        "street": "dumy",
        "building": "dumy",
        "phone_number": "01228987781",
        "city": "dumy",
        "country": "dumy",
        "email": userEmail,
        "floor": "dumy",
        "state": "dumy"
      },
      extras: {},
      redirection_url: `${FrontbaseUrl}/plan-payment-success`,
    };
    this.paymentService.PaymobRequest(orderData).subscribe({
      next: (response: any) => {
        const clientSecret = response.client_secret;
        if (clientSecret) {
          const paymentUrl = `https://accept.paymob.com/unifiedcheckout/?publicKey=egy_pk_test_jrlnWL5oJX8IRTp9xpeHq5mmQhAMfXES&clientSecret=${clientSecret}`;
          window.location.href = paymentUrl;

        } else {
          console.error("Client secret not found in the response.");
          alert("Failed to retrieve payment details.");
        }
      },
      error: (error) => {
        console.log(error);
        console.error("Error in Paymob API request:", error);
        alert("Failed to process payment. Please try again.");
      }
    });

  }

}
