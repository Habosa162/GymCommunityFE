import { Routes } from '@angular/router';
import { LoginComponent } from './presentation/auth/components/login/login.component';

import { SubjectComponent } from './presentation/Forum/components/subject/subject.component';
import { RegisterComponent } from './presentation/auth/components/register/register.component';
import { ForgotPasswordComponent } from './presentation/auth/components/forgot-password/forgot-password.component';

import { ForumComponent } from './presentation/Forum/components/forum/forum.component';
import { ResetPasswordComponent } from './presentation/auth/components/reset-password/reset-password.component';
import { ClientProfileComponent } from './presentation/client/components/client-profile/client-profile.component';

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
];
