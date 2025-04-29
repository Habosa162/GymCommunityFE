import { Routes } from '@angular/router';
import { LoginComponent } from './presentation/auth/components/login/login.component';

import { SubjectComponent } from './presentation/Forum/components/subject/subject.component';
import { ForgotPasswordComponent } from './presentation/auth/components/forgot-password/forgot-password.component';
import { RegisterComponent } from './presentation/auth/components/register/register.component';

import { ForumComponent } from './presentation/Forum/components/forum/forum.component';
import { ResetPasswordComponent } from './presentation/auth/components/reset-password/reset-password.component';
import { ClientProfileComponent } from './presentation/client/components/client-profile/client-profile.component';
import { TrainingPlansComponent } from './presentation/training-plans/training-plans.component';

import { CoachProfileComponent } from './presentation/Coach/coach-profile/coach-profile.component';
import { ProductsListComponent } from './presentation/Ecommerce/products-list/products-list.component';
import { CreateCategoryComponent } from './presentation/Ecommerce/Administration/create-category/create-category.component';
import { CreateBrandComponent } from './presentation/Ecommerce/Administration/create-brand/create-brand.component';
import { CreateProductComponent } from './presentation/Ecommerce/Administration/create-product/create-product.component';
import { WishListComponent } from './presentation/Ecommerce/wish-list/wish-list.component';
import { AuthGuard } from './core/guards/auth.guard';
import { clientGuard } from './core/guards/client.guard';
import { CoachGuard } from './core/guards/coach.guard';
import { AdminGuard } from './core/guards/admin.guard';
import { AdminCoachGuard } from './core/guards/admin-coach.guard';
import { ProductDetailsComponent } from './presentation/Ecommerce/product-details/product-details.component';

import { GymOwnerDashboardComponent } from './presentation/Gym/gym-owner-dashboard/gym-owner-dashboard.component';

import { CoachPortfolioComponent } from './presentation/Coach/coach-portfolio/coach-portfolio.component';
import { CoachCertificatesComponent } from './presentation/Coach/coach-certificates/coach-certificates.component';
import { CoachWorkSamplesComponent } from './presentation/Coach/coach-work-samples/coach-work-samples.component';
import { PublicCoachProfileComponent } from './presentation/Coach/public-coach-profile/public-coach-profile.component';
import { CoachRatingComponent } from './presentation/Coach/coach-rating/coach-rating.component';

import { CartComponent } from './presentation/Ecommerce/cart/cart.component';
import { GymDetailsComponent } from './presentation/Gym/gym-details.component/gym-details.component.component';
import { PlanDetailsComponent } from './presentation/Gym/plan-details/plan-details.component';
import { SubscriptionDetailsComponent } from './presentation/Gym/subscription-details/subscription-details.component';
import { CheckoutComponent } from './presentation/Ecommerce/checkout/checkout.component';
import { CoachesListComponent } from './presentation/Coach/coaches-list/coaches-list.component';
import { MyClientsComponent } from './presentation/Coach/my-clients/my-clients/my-clients.component';
import { SelectRoleComponent } from './presentation/auth/components/select-role/select-role.component';
import { HomeComponent } from './presentation/home/home/home.component';
import { PaymentSuccessComponent } from './presentation/Ecommerce/payment-success/payment-success.component';
import { TrainingPlanComponent } from './presentation/traningPlans/training-plan/training-plan.component';
import { OrderSummaryComponent } from './presentation/Ecommerce/order-summery/order-summary.component';
import { CoachViewProfileComponent } from './presentation/Coach/coachviewprofile/coachviewprofile.component';
import { MyOrdersComponent } from './presentation/Ecommerce/my-orders/my-orders.component';
import { GymListComponent } from './presentation/Gym/gym-list/gym-list.component';
import { UserGymDetailsComponent } from './presentation/Gym/user-gym-details/user-gym-details.component';
import { DashboardComponent } from './presentation/admin/dashboard/dashboard.component';
import { SubPaymentSuccessComponent } from './presentation/Gym/sub-payment-success/sub-payment-success.component';
import { ClientPresonalInfoComponent } from './presentation/client/components/client-presonal-info/client-presonal-info/client-presonal-info.component';
import { GymOwnerGuard } from './core/guards/gym-owner.guard';
import { ProductManagementComponent } from './presentation/admin/product-management/product-management.component';
import { PremiumPaymentSuccessComponent } from './presentation/Premium/premium-payment-success/premium-payment-success.component';
import { BuyPremiumComponent } from './presentation/Premium/buy-premium/buy-premium.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  //auth routes
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'ResetPassword', component: ResetPasswordComponent },
  { path: 'Choose-role', component: SelectRoleComponent },
  //client routes

  {
    path: 'profile/me',
    component: ClientProfileComponent,
    canActivate: [AuthGuard, clientGuard],
    children: [
      { path: '', redirectTo: 'info', pathMatch: 'full' },
      { path: 'info', component: ClientPresonalInfoComponent },
      { path: 'posts', component: ForumComponent },
    ],
  },
  { path: 'profile/:userId', component: ClientProfileComponent,
    children:[
      { path: '', redirectTo: 'info', pathMatch: 'full' },
      { path: 'info', component: ClientPresonalInfoComponent },
      { path: 'posts', component: ForumComponent },
    ]
  },
  //Forum routes
  { path: 'subjects', component: SubjectComponent, canActivate: [AuthGuard] },
  {
    path: 'subjects/create',
    component: SubjectComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'subjects/edit/:id',
    component: SubjectComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'subjects/details/:id',
    component: SubjectComponent,
    canActivate: [AuthGuard],
  },
  { path: 'forum', component: ForumComponent, canActivate: [AuthGuard] },
  //Plan routes
  {
    path: 'training-plans',
    component: TrainingPlansComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'plan/:id',
    component: TrainingPlanComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'trainingPlan/:id',
    component: TrainingPlanComponent,
    canActivate: [AuthGuard],
  },

  {
    path: 'training-plans/create',
    component: TrainingPlansComponent,
    canActivate: [AuthGuard, AdminCoachGuard],
  },
  {
    path: 'training-plans/edit/:id',
    component: TrainingPlansComponent,
    canActivate: [AuthGuard, AdminCoachGuard],
  },
  {
    path: 'training-plans/details/:id',
    component: TrainingPlansComponent,
    canActivate: [AuthGuard, AdminCoachGuard],
  },
  //Ecommerce routes

  { path: 'shop', component: ProductsListComponent },

  {
    path: 'wish-list',
    component: WishListComponent,
    title: 'wish-list',
    canActivate: [AuthGuard, clientGuard],
  },
  {
    path: 'product-details/:id',
    component: ProductDetailsComponent,
    title: 'product details',
    canActivate: [AuthGuard, clientGuard],
  },
  { path: 'cart', component: CartComponent, title: 'Cart' },
  { path: 'checkout', component: CheckoutComponent, title: 'Checkout' },
  {
    path: 'payment-success',
    component: PaymentSuccessComponent,
    title: 'payment',
  },
  {
    path: 'order-summary/:id',
    component: OrderSummaryComponent,
    title: 'order summary',
  },
  {
    path: 'my-orders',
    component: MyOrdersComponent,
    title: 'My Orders',
  },


  //Gym routes
  /// For Gym Owner
  { path: 'gym-owner', component: GymOwnerDashboardComponent,
    canActivate: [AuthGuard, GymOwnerGuard],
  },
  { path: 'gym-owner/gym/:id', component: GymDetailsComponent,
    canActivate: [AuthGuard, GymOwnerGuard],
  },
  { path: 'gym-owner/plan/:id', component: PlanDetailsComponent,
    canActivate: [AuthGuard, GymOwnerGuard],
   },
  {
    path: 'gym-owner/subscription/:id',
    component: SubscriptionDetailsComponent,
  },

  //For Users
  {path: 'gyms/:id', component: UserGymDetailsComponent},
  {path: 'gyms', component: GymListComponent},
  {
    path: 'sub-payment-success',
    component: SubPaymentSuccessComponent,
    canActivate: [AuthGuard]
  },

 //AdminRoutes
 {
  path: 'dashboard',
  component: DashboardComponent,
  // canActivate: [AuthGuard],
},
{
  path: 'create-category',
  component: CreateCategoryComponent,
  canActivate: [AuthGuard, AdminGuard],
},
{
  path: 'create-brand',
  component: CreateBrandComponent,
  canActivate: [AuthGuard, AdminGuard],
},
{
  path: 'create-product',
  component: CreateProductComponent,
  canActivate: [AuthGuard, AdminCoachGuard],
},
{
  path: 'product-management',
  component: ProductManagementComponent,
  canActivate: [AuthGuard],
},

  //coach

  //coach routes
  {
    path: 'coach',
    children: [
      // Public coach routes
      {
        path: '',
        component: CoachesListComponent,
      },
      {
        path: 'profile/:coachId',
        component: CoachViewProfileComponent,
      },
      {
        path: 'rate/:coachId',
        component: CoachRatingComponent,
        canActivate: [AuthGuard, clientGuard],
      },

      // Private coach routes (requires authentication and coach role)
      {
        path: 'dashboard',
        canActivate: [AuthGuard, CoachGuard],
        children: [
          { path: '', component: CoachViewProfileComponent },
          { path: 'portfolio', component: CoachPortfolioComponent },
          { path: 'certificates', component: CoachCertificatesComponent },
          { path: 'work-samples', component: CoachWorkSamplesComponent },
          { path: 'my-client', component: MyClientsComponent },
        ],
      },

      // Private coach routes (requires authentication and coach role)
      {
        path: 'admin',
        canActivate: [AuthGuard, AdminGuard],
        children: [
          { path: '', component: DashboardComponent },
        ],
      },
    ],
  },
    //Premium routes
  { path: 'buy-premium', component: BuyPremiumComponent },
  { path: 'premium-payment-success', component: PremiumPaymentSuccessComponent },

  // Default route
  { path: '', redirectTo: '/', pathMatch: 'full' },
];
