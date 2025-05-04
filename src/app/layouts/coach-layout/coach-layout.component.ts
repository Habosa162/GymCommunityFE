import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NavbarComponent } from '../../core/shared/components/navbar/navbar.component';
import { SideBarComponent } from '../../presentation/admin/side-bar/side-bar.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-coach-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    NavbarComponent,
    SideBarComponent,
  ],
  templateUrl: './coach-layout.component.html',
  styleUrls: ['./coach-layout.component.css'],
})
export class CoachLayoutComponent implements OnInit {
  isSidebarOpen = true;
  isProfileDropdownOpen = false;
  isAuthenticated = false;
  userName = '';
  userImage = '';
  isDarkMode = false;
  coachId = '';
  showNotifications = false;
  notifications = [
    {
      id: 1,
      message: 'New message from client',
      time: '5 min ago',
      read: false,
    },
    {
      id: 2,
      message: 'Training session scheduled',
      time: '1 hour ago',
      read: false,
    },
    { id: 3, message: 'New product order', time: 'Yesterday', read: true },
  ];

  @ViewChild('profileDropdown') profileDropdown!: ElementRef;

  constructor(private authService: AuthService, private router: Router) {
    if (
      !this.authService.isLoggedIn() ||
      this.authService.getUserRole() !== 'Coach'
    ) {
      this.router.navigate(['/login']);
    }
  }

  ngOnInit(): void {
    this.checkAuthentication();
    this.loadUserData();
    this.checkDarkModePreference();
  }

  private checkAuthentication(): void {
    this.isAuthenticated = this.authService.isLoggedIn();
    if (!this.isAuthenticated || this.authService.getUserRole() !== 'Coach') {
      this.router.navigate(['/login']);
      return;
    }
    this.coachId = this.authService.getUserId() || '';
  }

  private loadUserData(): void {
    if (this.isAuthenticated) {
      this.userName = this.authService.getUserName() || 'Coach';
      this.userImage =
        this.authService.getProfileImg() || 'assets/images/default-avatar.png';
      if (this.router.url === '/coach' || this.router.url === '/coach/') {
        this.router.navigate(['/coach/dashboard']);
      }
    }
  }

  private checkDarkModePreference(): void {
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;
    const savedMode = localStorage.getItem('darkMode');

    if (savedMode) {
      this.isDarkMode = savedMode === 'true';
    } else {
      this.isDarkMode = prefersDark;
    }

    this.applyTheme();
  }

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('darkMode', this.isDarkMode.toString());
    this.applyTheme();
  }

  private applyTheme(): void {
    if (this.isDarkMode) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
  }

  toggleProfileDropdown(): void {
    this.isProfileDropdownOpen = !this.isProfileDropdownOpen;
    if (this.isProfileDropdownOpen) {
      this.showNotifications = false;
    }
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
    if (this.showNotifications) {
      this.isProfileDropdownOpen = false;
    }
  }

  markNotificationAsRead(id: number): void {
    const notification = this.notifications.find((n) => n.id === id);
    if (notification) {
      notification.read = true;
    }
  }

  getUnreadCount(): number {
    return this.notifications.filter((n) => !n.read).length;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (
      this.profileDropdown &&
      !this.profileDropdown.nativeElement.contains(event.target)
    ) {
      this.isProfileDropdownOpen = false;
    }

    // Close notifications dropdown when clicking outside
    const target = event.target as HTMLElement;
    if (!target.closest('.notifications-dropdown')) {
      this.showNotifications = false;
    }
  }
}
