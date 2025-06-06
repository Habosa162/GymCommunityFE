import { Routes } from '@angular/router';
import { LoginComponent } from './presentation/auth/components/login/login.component';

import { SubjectComponent } from './presentation/Forum/components/subject/subject.component';
import { ForgotPasswordComponent } from './presentation/auth/components/forgot-password/forgot-password.component';
import { RegisterComponent } from './presentation/auth/components/register/register.component';

import { ForumComponent } from './presentation/Forum/components/forum/forum.component';
import { ResetPasswordComponent } from './presentation/auth/components/reset-password/reset-password.component';
import { ClientProfileComponent } from './presentation/client/components/client-profile/client-profile.component';
import { TrainingPlansComponent } from './presentation/training-plans/training-plans.component';

import { AdminCoachGuard } from './core/guards/admin-coach.guard';
import { AdminGuard } from './core/guards/admin.guard';
import { AuthGuard } from './core/guards/auth.guard';
import { clientGuard } from './core/guards/client.guard';
import { CoachGuard } from './core/guards/coach.guard';
import { CoachProfileComponent } from './presentation/Coach/coach-profile/coach-profile.component';
import { CreateBrandComponent } from './presentation/Ecommerce/Administration/create-brand/create-brand.component';
import { CreateCategoryComponent } from './presentation/Ecommerce/Administration/create-category/create-category.component';
import { CreateProductComponent } from './presentation/Ecommerce/Administration/create-product/create-product.component';
import { ProductDetailsComponent } from './presentation/Ecommerce/product-details/product-details.component';
import { ProductsListComponent } from './presentation/Ecommerce/products-list/products-list.component';
import { WishListComponent } from './presentation/Ecommerce/wish-list/wish-list.component';

import { GymOwnerDashboardComponent } from './presentation/Gym/gym-owner-dashboard/gym-owner-dashboard.component';

import { CoachCertificatesComponent } from './presentation/Coach/coach-certificates/coach-certificates.component';
import { CoachPortfolioComponent } from './presentation/Coach/coach-portfolio/coach-portfolio.component';
import { CoachRatingComponent } from './presentation/Coach/coach-rating/coach-rating.component';
import { CoachWorkSamplesComponent } from './presentation/Coach/coach-work-samples/coach-work-samples.component';

import { GymOwnerGuard } from './core/guards/gym-owner.guard';
import { CoachesListComponent } from './presentation/Coach/coaches-list/coaches-list.component';
import { MyClientsComponent } from './presentation/Coach/my-clients/my-clients/my-clients.component';
import { CartComponent } from './presentation/Ecommerce/cart/cart.component';
import { CheckoutComponent } from './presentation/Ecommerce/checkout/checkout.component';
import { MyOrdersComponent } from './presentation/Ecommerce/my-orders/my-orders.component';
import { OrderSummaryComponent } from './presentation/Ecommerce/order-summery/order-summary.component';
import { PaymentSuccessComponent } from './presentation/Ecommerce/payment-success/payment-success.component';
import { GymDetailsComponent } from './presentation/Gym/gym-details.component/gym-details.component.component';
import { GymListComponent } from './presentation/Gym/gym-list/gym-list.component';
import { PlanDetailsComponent } from './presentation/Gym/plan-details/plan-details.component';
import { SubPaymentSuccessComponent } from './presentation/Gym/sub-payment-success/sub-payment-success.component';
import { SubscriptionDetailsComponent } from './presentation/Gym/subscription-details/subscription-details.component';
import { UserGymDetailsComponent } from './presentation/Gym/user-gym-details/user-gym-details.component';
import { BuyPremiumComponent } from './presentation/Premium/buy-premium/buy-premium.component';
import { PremiumPaymentSuccessComponent } from './presentation/Premium/premium-payment-success/premium-payment-success.component';
import { DashboardComponent } from './presentation/admin/dashboard/dashboard.component';
import { OrderManagementComponent } from './presentation/admin/order-management/order-management.component';
import { ProductManagementComponent } from './presentation/admin/product-management/product-management.component';
import { SelectRoleComponent } from './presentation/auth/components/select-role/select-role.component';
import { ClientPresonalInfoComponent } from './presentation/client/components/client-presonal-info/client-presonal-info/client-presonal-info.component';
import { MyPlansClientComponent } from './presentation/client/components/my-plans-client/my-plans-client.component';
import { ChatComponent } from './presentation/home/Chat/chat.component';
import { HomeComponent } from './presentation/home/home/home.component';
import { ClientPlansComponent } from './presentation/traningPlans/client-plans/client-plans.component';
import { TrainingPlanComponent } from './presentation/traningPlans/training-plan/training-plan.component';

import { CoachDashboardComponent } from './presentation/Coach/coach-dashboard/coach-dashboard.component';
import { CoachOffersComponent } from './presentation/Coach/coach-offers/coach-offers.component';
import { CoachproductsComponent } from './presentation/Coach/coachproducts/coachproducts.component';
import { PlanPaymentSuccessComponent } from './presentation/Coach/plan-payment-success/plan-payment-success.component';
import { UpdateProductComponent } from './presentation/Ecommerce/Administration/update-product/update-product.component';
import { GymSubscriptionsComponent } from './presentation/Gym/gym-subscriptions/gym-subscriptions.component';
import { MainDashboardComponent } from './presentation/Gym/main-dashboard/main-dashboard.component';
import { UserGymSubComponent } from './presentation/Gym/user-gym-sub/user-gym-sub.component';
import { GymManagementComponent } from './presentation/admin/Gym-Management/gym-management.component';
import { UpdateGymComponent } from './presentation/admin/Gym-Management/update-gym/update-gym.component';
import { UsersManagementComponent } from './presentation/admin/users-management/users-management.component';
import { EmailConfirmPageComponent } from './presentation/auth/components/email-confirm-page/email-confirm-page.component';
import { EmailConfirmDoneComponent } from './presentation/auth/components/email-confirm-done/email-confirm-done.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [clientGuard] },
  //auth routes
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'ResetPassword', component: ResetPasswordComponent },
  { path: 'Choose-role', component: SelectRoleComponent },
  { path: 'confirm-email', component: EmailConfirmPageComponent },
  { path: 'confirm-done', component: EmailConfirmDoneComponent },
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
  {
    path: 'my-plans',
    component: MyPlansClientComponent,
    canActivate: [AuthGuard, clientGuard],
  },

  {
    path: 'profile/:userId',
    component: ClientProfileComponent,
    children: [
      { path: '', redirectTo: 'info', pathMatch: 'full' },
      { path: 'info', component: ClientPresonalInfoComponent },
      { path: 'posts', component: ForumComponent },
    ],
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
    path: 'client-plan/:id',
    component: ClientPlansComponent,
    canActivate: [AuthGuard, clientGuard],
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

  {
    path: 'shop',
    component: ProductsListComponent,
    canActivate: [clientGuard],
  },

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
  {
    path: 'checkout',
    component: CheckoutComponent,
    title: 'Checkout',
    canActivate: [AuthGuard, clientGuard],
  },
  {
    path: 'payment-success',
    component: PaymentSuccessComponent,
    title: 'payment',
  },
  {
    path: 'order-summary/:id',
    component: OrderSummaryComponent,
    title: 'order summary',
    canActivate: [AuthGuard, clientGuard],
  },
  {
    path: 'my-orders',
    component: MyOrdersComponent,
    title: 'My Orders',
    canActivate: [AuthGuard, clientGuard],
  },

  //Gym routes
  /// For Gym Owner
  {
    path: 'gym-owner/myGyms',
    component: GymOwnerDashboardComponent,
    canActivate: [AuthGuard, GymOwnerGuard],
  },
  {
    path: 'gym-owner/gym/:id',
    component: GymDetailsComponent,
    canActivate: [AuthGuard, GymOwnerGuard],
  },
  {
    path: 'gym-owner/dashboard',
    component: MainDashboardComponent,
    canActivate: [AuthGuard, GymOwnerGuard],
  },
  {
    path: 'gym-owner/AllSub',
    component: GymSubscriptionsComponent,
    canActivate: [AuthGuard, GymOwnerGuard],
  },

  {
    path: 'gym-owner/subscription/:id',
    component: SubscriptionDetailsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'gym-owner/plan/:id',
    component: PlanDetailsComponent,
    canActivate: [AuthGuard],
  },

  //For Users
  { path: 'gyms/:id', component: UserGymDetailsComponent },
  { path: 'gyms', component: GymListComponent ,canActivate:[AuthGuard]},
  {
    path: 'user/gym-subs',
    component: UserGymSubComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'sub-payment-success',
    component: SubPaymentSuccessComponent,
    canActivate: [AuthGuard],
  },

  //AdminRoutes
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard, AdminGuard],
    title: 'Dashboard',
  },
  {
    path: 'create-category',
    component: CreateCategoryComponent,
    canActivate: [AuthGuard, AdminGuard],
    title: 'create category',
  },
  {
    path: 'create-brand',
    component: CreateBrandComponent,
    canActivate: [AuthGuard, AdminGuard],
    title: 'create brand',
  },
  {
    path: 'create-product',
    component: CreateProductComponent,
    canActivate: [AuthGuard, AdminCoachGuard],
    title: 'create product',
  },
  {
    path: 'product-management',
    component: ProductManagementComponent,
    canActivate: [AuthGuard, AdminGuard],
    title: 'product management',
  },
  {
    path: 'order-management',
    component: OrderManagementComponent,
    canActivate: [AuthGuard, AdminGuard],
    title: 'order management',
  },
  {
    path: 'update-product/:id',
    component: UpdateProductComponent,
    canActivate: [AuthGuard, AdminCoachGuard],
    title: 'update-product',
  },
  {
    path: 'users-management',
    component: UsersManagementComponent,
    canActivate: [AuthGuard, AdminCoachGuard],
    title: 'users management',
  },
  // Gym Management Routes
  {
    path: 'gym-management',
    component: GymManagementComponent,
    canActivate: [AuthGuard, AdminGuard],
    title: 'Gym Management',
  },
  {
    path: 'update-gym/:id',
    component: UpdateGymComponent,
    canActivate: [AuthGuard, AdminGuard],
    title: 'Update Gym',
  },
  //coach
  {
    path: 'chat',
    component: ChatComponent,
    canActivate: [AuthGuard],
  },

  //coach routes
  {
    path: 'coachDashboard',
    component: CoachDashboardComponent,
    canActivate: [AuthGuard, CoachGuard],
  },
  {
    path: 'coach',
    children: [
      // Public coach routes
      {
        path: '',
        component: CoachesListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'profile/:coachId',
        component: CoachProfileComponent,
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
          { path: '', component: CoachProfileComponent },
          { path: 'portfolio', component: CoachPortfolioComponent },
          { path: 'certificates', component: CoachCertificatesComponent },
          { path: 'work-samples', component: CoachWorkSamplesComponent },
          { path: 'my-client', component: MyClientsComponent },
          { path: 'offers', component: CoachOffersComponent },
          { path: 'Products', component: CoachproductsComponent },
        ],
      },

      // Private coach routes (requires authentication and coach role)
    ],
  },
  //Premium routes
  { path: 'buy-premium', component: BuyPremiumComponent },
  //buy plan routes
  { path: 'plan-payment-success', component: PlanPaymentSuccessComponent },
  {
    path: 'premium-payment-success',
    component: PremiumPaymentSuccessComponent,
  },

  // Default route
  // { path: '', redirectTo: '/home', pathMatch: 'full' },
];
