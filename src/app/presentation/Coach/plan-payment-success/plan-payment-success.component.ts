import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from '../../../services/Ecommerce/payment.service';
import { TrainingPlansService } from '../../../services/Training Plans/training-plan.service';
import { PaymentDTO } from '../../../domain/models/Ecommerce/payment.mdoel';
import { SubscriptionToPlanService } from '../../../services/subscription-to-plan.service';
import { CreatetrainingPlan } from '../../../domain/models/TraingingPlansModels/training-plan-model';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-plan-payment-success',
  imports: [],
  templateUrl: './plan-payment-success.component.html',
  styleUrl: './plan-payment-success.component.css'
})
export class PlanPaymentSuccessComponent {
  //plan data
  price: number = 0;
  title: string = '';
  duration: number = 0;
  coachId: string = '';
  clientId: string = '';
// Payment state
paymentState: boolean = false;
paymentDetails: any = null;
errorMessage: string = 'Payment processing failed. Please try again.';

  paymentInfo = {
    pending: false,
    amount_cents: 0,
    success: false,
    created_at: '',
    currency: '',
    paymentMethod: ''
  };


  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private paymentService: PaymentService,
    private trainingPlanService: TrainingPlansService,
    private subscriptionToPlanService: SubscriptionToPlanService,
    private authService: AuthService
  ) {}

    ngOnInit() {
    const plan = this.subscriptionToPlanService.getPlanSubscription();
    const planData = JSON.parse(plan || '{}');
    this.price = planData.price;
    this.title = planData.title;
    this.duration = planData.duration;
    this.coachId = planData.coachId;
    console.log('coachId is',this.coachId);
    this.clientId = this.authService.getUserId()!;

    this.activatedRoute.queryParamMap.subscribe(params => {
      this.paymentInfo.pending = params.get('pending') === 'true';
      this.paymentInfo.amount_cents = Number(params.get('amount_cents'));
      this.paymentInfo.success = params.get('success') === 'true';
      this.paymentInfo.created_at = params.get('created_at') ?? '';
      this.paymentInfo.currency = params.get('currency') || 'EGP';
      this.paymentInfo.paymentMethod = params.get('source_data.sub_type') || 'Credit Card';

      this.createPlan();
    });
    this.paymentService.CreatePayment;
  }

  createPlan(){
   const expectedAmount = this.paymentInfo.amount_cents / 100;
 

    if(this.paymentInfo.success || this.price == expectedAmount){
      //create plan
    const paymentObj: PaymentDTO = {
        amount: expectedAmount,
        currency: this.paymentInfo.currency,
        paymentMethod: this.paymentInfo.paymentMethod,
        status: this.paymentInfo.success==true ? 2 : 3,
        createdAt: this.paymentInfo.created_at,
        updatedAt: this.paymentInfo.created_at
      };


       this.paymentService.CreatePayment(paymentObj).subscribe({
        next: (paymentRes) => {
          console.log(paymentRes);
          if (!paymentRes.id) {
            this.paymentState = false;
            console.error('Payment ID is missing!');
            return;
          }

          const trainingPlan: CreatetrainingPlan = {
            coachId: this.coachId,
            clientId: this.clientId,
            name: this.title,
            durationMonths: this.duration,
            startDate: new Date(this.paymentInfo.created_at)
          }
          //create training plan
          this.trainingPlanService.createTrainingPlan(trainingPlan).subscribe({
            next: (planRes) => {
              console.log('Training plan created:', planRes);
              this.router.navigate(['/my-plans']);
            },
            error: (error) => {
              console.error('Training plan creation failed:', error);
            }
          })

       

        },
        error: (error) => {
          console.error('Payment creation failed:', error);
          this.paymentState = false;
          this.errorMessage = 'Payment processing failed. Please try again.';
        }
      });
      

 


    
    }
  }
}


         

        


      
