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



export const routes: Routes = [
  //auth routes
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'ResetPassword', component: ResetPasswordComponent },
  //client routes
  { path: 'profile/me', component: ClientProfileComponent },
  { path: 'profile/:userId', component: ClientProfileComponent },
  //Forum routes
  { path: 'subjects', component: SubjectComponent },
  { path: 'subjects/create', component: SubjectComponent },
  { path: 'subjects/edit/:id', component: SubjectComponent },
  { path: 'subjects/details/:id', component: SubjectComponent },
  { path: 'forum', component: ForumComponent },
  //Plan routes
  { path: 'training-plans', component: TrainingPlansComponent },
  { path: 'training-plans/create', component: TrainingPlansComponent },
  { path: 'training-plans/edit/:id', component: TrainingPlansComponent },
  { path: 'training-plans/details/:id', component: TrainingPlansComponent },
  //Ecommerce routes
  {path: 'shop', component: ProductsListComponent},
  {path: 'create-category', component: CreateCategoryComponent},
  {path: 'create-brand', component: CreateBrandComponent},



  //coach
  { path: 'portofolio', component: CoachProfileComponent },
  { path: 'portofolio/:id', component: CoachProfileComponent }

];
