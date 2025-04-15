import { Routes } from '@angular/router';
import { LoginComponent } from './presentation/auth/components/login/login.component';
import { SubjectComponent } from './presentation/Forum/components/subject/subject.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'subjects', component: SubjectComponent },
    { path: 'subjects/create', component: SubjectComponent },
    { path: 'subjects/edit/:id', component: SubjectComponent },
    { path: 'subjects/details/:id', component: SubjectComponent },
];
