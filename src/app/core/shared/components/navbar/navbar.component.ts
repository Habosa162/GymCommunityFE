import { CommonModule } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../../services/auth.service';
import { NotificationBellComponent } from '../notification-bell/notification-bell.component';
import { CartService } from '../../../../services/Ecommerce/cart.service';
import { CategoryService } from '../../../../services/Ecommerce/category.service';
import { ProductService } from '../../../../services/Ecommerce/product.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule, NotificationBellComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit{
  profileBtnClicked: boolean = false;
  searchQuery: string = '';
  showSearchResults: boolean = true;
  isLoggedIn: boolean = false;
  isLoading: boolean = false;
  constructor(
    private productService: ProductService,
    private cartService: CartService,
    protected authService: AuthService,
    protected categoryService: CategoryService,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {

  }
  profileBtn() {
    this.profileBtnClicked = !this.profileBtnClicked;
  }

  cartCount() {
    return this.cartService.getCartCount();
  }


}
