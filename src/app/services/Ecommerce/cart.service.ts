import { Injectable, signal } from '@angular/core';
import { AuthService } from '../auth.service';
@Injectable({
  providedIn: 'root'
})
export class CartService {
  private userId: string | null = null;

  // Signal to track the current cart items reactively
  private cartItems = signal<any[]>(this.loadCart());

  constructor(private authService: AuthService) {}

  // Set the current user ID and merge guest cart if switching from guest to user
  setUser(userId: string | null) {
    const isSwitchingToUser = !this.userId && userId;
    this.userId = userId;

    if (isSwitchingToUser) {
      this.mergeGuestToUserCart();
    }

    // Load the appropriate cart (user or guest)
    this.cartItems.set(this.loadCart());
  }

  // Determine which localStorage key to use for the cart
  private getCartStorageKey(): string {
    return this.userId ? `cart_${this.userId}` : 'cart_guest';
  }

  // Load cart data from localStorage
  private loadCart(): any[] {
    const storedCart = localStorage.getItem(this.getCartStorageKey());
    return storedCart ? JSON.parse(storedCart) : [];
  }

  // Save the current cart to localStorage
  saveCart(): void {
    const cartKey = this.getCartStorageKey();
    localStorage.setItem(cartKey, JSON.stringify(this.cartItems()));
  }

  // Check if a product is already in the cart
  isInCart(productId: number): boolean {
    return this.cartItems().some(item => item.id === productId);
  }

  // Get current cart items
  getCart() {
    return this.cartItems();
  }

  // Clear cart data
  clearCart() {
    this.cartItems.set([]);
    localStorage.removeItem(this.getCartStorageKey());
  }

  // Add item to cart (or increase quantity if it exists)
  addToCart(product: any, quantity: number = 1) {
    const currentItems = this.cartItems();
    const existingItem = currentItems.find(item => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      currentItems.push({
        ...product,
        quantity: quantity,
        price: Number(product.price),
        finalPrice: Number(product.finalPrice) || Number(product.price)
      });
    }

    this.cartItems.set(currentItems);
    this.saveCart();
  }

  // Update item quantity by a change value (+1 or -1)
  updateQuantity(productId: number, change: number) {
    const updatedItems = this.cartItems().map(item => {
      if (item.id === productId) {
        const updatedQuantity = item.quantity + change;
        return updatedQuantity > 0 ? { ...item, quantity: updatedQuantity } : null;
      }
      return item;
    }).filter(item => item !== null);

    this.cartItems.set(updatedItems as any[]);
    this.saveCart();
  }

  // Remove an item from the cart completely
  removeFromCart(productId: number) {
    const updatedItems = this.cartItems().filter(item => item.id !== productId);
    this.cartItems.set(updatedItems);
    this.saveCart();
  }

  // Get the total number of items in the cart
  getCartCount(): number {
    const currentUserId = this.authService.getUserId() ?? null;

    if (this.userId !== currentUserId) {
      this.userId = currentUserId;
      // Use queueMicrotask to avoid change detection issues
      queueMicrotask(() => {
        this.cartItems.set(this.loadCart());
      });
    }

    return this.cartItems().reduce((acc, item) => acc + item.quantity, 0);
  }

  // Calculate total price of all items in the cart
  getTotalPrice() {
    return this.cartItems().reduce(
      (acc, item) => acc + item.finalPrice * item.quantity,
      0
    );
  }

  // Merge guest cart with user's cart after login
  private mergeGuestToUserCart() {
    const guestCart = localStorage.getItem('cart_guest');
    const userCartKey = this.getCartStorageKey();

    if (guestCart) {
      const guestItems = JSON.parse(guestCart);
      const userItems = JSON.parse(localStorage.getItem(userCartKey) || '[]');

      guestItems.forEach((guestItem: any) => {
        const existingItem = userItems.find((item: any) => item.id === guestItem.id);
        if (existingItem) {
          existingItem.quantity += guestItem.quantity;
        } else {
          userItems.push(guestItem);
        }
      });

      localStorage.setItem(userCartKey, JSON.stringify(userItems));
      localStorage.removeItem('cart_guest');
    }
  }
}
