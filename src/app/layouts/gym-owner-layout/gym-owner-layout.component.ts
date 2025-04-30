import { Component, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../core/shared/components/navbar/navbar.component';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../../core/shared/components/footer/footer.component';

@Component({
  selector: 'app-gym-owner-layout',

  imports: [RouterModule, CommonModule, NavbarComponent,FooterComponent],

  templateUrl: './gym-owner-layout.component.html',
  styleUrl: './gym-owner-layout.component.css'
})
export class GymOwnerLayoutComponent {
  sidebarCollapsed: boolean = false;

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

    
}
