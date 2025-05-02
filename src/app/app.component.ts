import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FooterComponent } from './core/shared/components/footer/footer.component';
import { NavbarComponent } from './core/shared/components/navbar/navbar.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout/admin-layout.component';
import { ClientLayoutComponent } from './layouts/client-layout/client-layout/client-layout.component';
import { CoachLayoutComponent } from './layouts/coach-layout/coach-layout.component';
import { GymOwnerLayoutComponent } from './layouts/gym-owner-layout/gym-owner-layout.component';
import { ChatbotComponent } from './presentation/ChatBot/chatbot.component';
import { AuthService } from './services/auth.service';
import { TopNavComponent } from './shared/components/top-nav/top-nav.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterModule,
    CommonModule,
    TopNavComponent,
    ClientLayoutComponent,
    AdminLayoutComponent,
    CoachLayoutComponent,
    GymOwnerLayoutComponent,
    NavbarComponent,
    FooterComponent,
    ChatbotComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'GymCommunity';

  constructor(protected authService: AuthService) {}
}
