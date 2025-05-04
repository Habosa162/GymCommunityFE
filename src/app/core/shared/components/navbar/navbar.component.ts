import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { NotificationBellComponent } from '../notification-bell/notification-bell.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule, NotificationBellComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  isScrolled = false;
  userRole: string | null = null;
  navMenus: any[] = [];

  // Dropdown state management
  activeDropdown: string | null = null;

  constructor(protected authService: AuthService) {}

  ngOnInit(): void {
    this.userRole = this.authService.getUserRole();
    this.setupNavMenus();
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
  }

  setupNavMenus() {
    // Common menus for all authenticated users
    const authenticatedCommonMenus = [
      {
        title: 'Messages',
        route: '/chat',
        icon: 'bi bi-chat-dots-fill',
      },
    ];

    // Common menus for all users
    const commonMenus = [
      {
        title: 'Home',
        route: '/',
        icon: 'bi bi-house-fill',
      },
    ];

    // Client-specific menus
    const clientMenus = [
      {
        title: 'Shop',
        icon: 'bi bi-shop',
        children: [
          { title: 'Browse Products', route: '/shop' },
          { title: 'Wishlist', route: '/wish-list' },
          { title: 'My Cart', route: '/cart' },
          { title: 'My Orders', route: '/my-orders' },
        ],
      },
      {
        title: 'Fitness',
        icon: 'bi bi-heart-pulse-fill',
        children: [
          { title: 'Find Coaches', route: '/coach' },
          { title: 'Find Gyms', route: '/gyms' },
          { title: 'My Plans', route: '/my-plans' },
          { title: 'Buy Premium', route: '/buy-premium' },
          { title: 'My Gym Subscriptions', route: '/user/gym-subs' },
        ],
      },
      {
        title: 'Community',
        icon: 'bi bi-people-fill',
        children: [
          { title: 'Forum', route: '/forum' },
          { title: 'Subjects', route: '/subjects' },
        ],
      },
    ];

    // Coach-specific menus
    const coachMenus = [
      {
        title: 'Coach Dashboard',
        icon: 'bi bi-speedometer',
        children: [
          { title: 'My Profile', route: '/coach/dashboard' },
          { title: 'Portfolio', route: '/coach/dashboard/portfolio' },
          { title: 'Certificates', route: '/coach/dashboard/certificates' },
          { title: 'Work Samples', route: '/coach/dashboard/work-samples' },
          { title: 'My Clients', route: '/coach/dashboard/my-client' },
          { title: 'My Offers', route: '/coach/dashboard/offers' },
          { title: 'My Products', route: '/coach/dashboard/Products' },
        ],
      },
      {
        title: 'Training',
        icon: 'bi bi-journal-bookmark-fill',
        children: [
          { title: 'Training Plans', route: '/training-plans' },
          { title: 'Create Plan', route: '/training-plans/create' },
        ],
      },
      {
        title: 'Products',
        icon: 'bi bi-box-seam-fill',
        children: [
          { title: 'My Products', route: '/coach/dashboard/Products' },
          { title: 'Create Product', route: '/create-product' },
        ],
      },
      {
        title: 'Community',
        icon: 'bi bi-people-fill',
        children: [
          { title: 'Forum', route: '/forum' },
          { title: 'Subjects', route: '/subjects' },
        ],
      },
    ];

    // Gym Owner specific menus
    const gymOwnerMenus = [
      {
        title: 'Gym Management',
        icon: 'bi bi-building-fill',
        children: [
          { title: 'My Gyms', route: '/gym-owner/myGyms' },
          { title: 'Dashboard', route: '/gym-owner/dashboard' },
          { title: 'All Subscriptions', route: '/gym-owner/AllSub' },
        ],
      },
      {
        title: 'Shop',
        icon: 'bi bi-shop',
        children: [
          { title: 'Browse Products', route: '/shop' },
          { title: 'Wishlist', route: '/wish-list' },
          { title: 'My Cart', route: '/cart' },
        ],
      },
      {
        title: 'Community',
        icon: 'bi bi-people-fill',
        children: [
          { title: 'Forum', route: '/forum' },
          { title: 'Subjects', route: '/subjects' },
        ],
      },
    ];

    // Admin-specific menus
    const adminMenus = [
      {
        title: 'Admin Panel',
        icon: 'bi bi-shield-fill-check',
        children: [
          { title: 'Dashboard', route: '/dashboard' },
          { title: 'Users Management', route: '/users-management' },
          { title: 'Gym Management', route: '/gym-management' },
          { title: 'Products Management', route: '/product-management' },
          { title: 'Orders Management', route: '/order-management' },
        ],
      },
      {
        title: 'Store Management',
        icon: 'bi bi-database-fill-gear',
        children: [
          { title: 'Create Category', route: '/create-category' },
          { title: 'Create Brand', route: '/create-brand' },
          { title: 'Create Product', route: '/create-product' },
        ],
      },
      {
        title: 'Community',
        icon: 'bi bi-people-fill',
        children: [
          { title: 'Forum', route: '/forum' },
          { title: 'Subjects', route: '/subjects' },
        ],
      },
    ];

    // Assign menus based on role
    this.navMenus = [...commonMenus];

    // Add authenticated common menus if user is logged in and not a gym owner
    if (this.authService.isLoggedIn() && this.userRole !== 'GymOwner') {
      this.navMenus = [...this.navMenus, ...authenticatedCommonMenus];
    }

    switch (this.userRole) {
      case 'Admin':
        this.navMenus = [...this.navMenus, ...adminMenus];
        break;
      case 'Coach':
        this.navMenus = [...this.navMenus, ...coachMenus];
        break;
      case 'GymOwner':
        this.navMenus = [...this.navMenus, ...gymOwnerMenus];
        break;
      default:
        // For clients or non-logged in users
        if (this.authService.isLoggedIn()) {
          this.navMenus = [...this.navMenus, ...clientMenus];
        }
    }
  }

  toggleDropdown(menuTitle: string) {
    this.activeDropdown = this.activeDropdown === menuTitle ? null : menuTitle;
  }

  closeDropdowns() {
    this.activeDropdown = null;
  }
}
