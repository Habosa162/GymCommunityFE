import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { TopNavComponent } from "./shared/components/top-nav/top-nav.component";
import { ClientLayoutComponent } from './layouts/client-layout/client-layout/client-layout.component';
import { AuthService } from './services/auth.service';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout/admin-layout.component';
import { CoachLayoutComponent } from './layouts/coach-layout/coach-layout.component';
import { NavbarComponent } from "./core/shared/components/navbar/navbar.component";

@Component({
  selector: 'app-root',
  imports: [RouterModule, CommonModule, TopNavComponent, ClientLayoutComponent, AdminLayoutComponent, CoachLayoutComponent, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'GymCommunity';

  constructor(protected authService: AuthService) {


  }
}
