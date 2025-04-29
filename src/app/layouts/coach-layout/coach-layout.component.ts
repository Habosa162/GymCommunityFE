import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-coach-layout',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './coach-layout.component.html',
    styleUrls: ['./coach-layout.component.css']
})
export class CoachLayoutComponent implements OnInit {
    isSidebarOpen = true;
    isProfileDropdownOpen = false;
    isAuthenticated = false;
    userName = '';
    userImage = '';
    isDarkMode = false;
    coachId = '';

    constructor(
        private authService: AuthService,
        private router: Router,
        private authservice: AuthService
    ) {
        // Check authentication on component creation
        if (!this.authService.isLoggedIn() || this.authService.getUserRole() !== 'Coach') {
            this.router.navigate(['/login']);
        }
    }

    ngOnInit(): void {
        this.checkAuthentication();
        this.loadUserData();
        this.initializeDarkMode();
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
            this.userImage = this.authService.getProfileImg() || 'assets/images/default-avatar.png';
            // Redirect to dashboard if on root path
            if (this.router.url === '/coach' || this.router.url === '/coach/') {
                this.router.navigate(['/coach/dashboard']);
            }
        }
    }

    private initializeDarkMode(): void {
        const savedMode = localStorage.getItem('darkMode');
        this.isDarkMode = savedMode ? savedMode === 'true' : window.matchMedia('(prefers-color-scheme: dark)').matches;
        this.applyTheme();
    }

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent) {
        const profileDropdown = document.querySelector('.profile-dropdown');
        if (profileDropdown && !profileDropdown.contains(event.target as Node)) {
            this.isProfileDropdownOpen = false;
        }
    }

    toggleSidebar(): void {
        this.isSidebarOpen = !this.isSidebarOpen;
    }

    toggleProfileDropdown(): void {

        this.isProfileDropdownOpen = !this.isProfileDropdownOpen;
        console.log("Dropdown toggled:", this.isProfileDropdownOpen);
    }

    toggleDarkMode(): void {
        this.isDarkMode = !this.isDarkMode;
        localStorage.setItem('darkMode', this.isDarkMode.toString());
        this.applyTheme();
    }

    private applyTheme(): void {
        document.documentElement.setAttribute('data-theme', this.isDarkMode ? 'dark' : 'light');
        if (this.isDarkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }

    logout(): void {
        this.authService.logout();
        this.router.navigate(['/login']);
    }



    @HostListener('document:click', ['$event'])
onClickOutside(event: Event) {
  const target = event.target as HTMLElement;
  if (!target.closest('.profile-dropdown')) {
    this.isProfileDropdownOpen = false;
  }
}
} 