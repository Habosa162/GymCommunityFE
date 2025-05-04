import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { NotificationBellComponent } from '../notification-bell/notification-bell.component';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule, CommonModule,NotificationBellComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {


  constructor(protected authService: AuthService) {


  }
}
