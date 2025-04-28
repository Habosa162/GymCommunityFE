import { Component } from '@angular/core';
import { OrderService } from '../../../services/Ecommerce/order.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ShippingService } from '../../../services/Ecommerce/shipping.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-my-orders',
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent {
  orders: any[] = [];
  filteredOrders: any[] = [];
  isLoading: boolean = true;

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalItems: number = 0;

  // Filters
  statusFilter: string = 'all';
  dateFilter: string = 'all';
  searchQuery: string = '';

  // Status options
  statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: '0', label: 'Processing' },
    { value: '1', label: 'Shipped' },
    { value: '2', label: 'Delivered' }
  ];

  // Date options
  dateOptions = [
    { value: 'all', label: 'All Dates' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' }
  ];

  constructor(
    private orderService: OrderService,
    private router: Router,
    private shippingService: ShippingService
  ) { }

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading = true;
    this.orderService.getUserOrders().subscribe(
      (orders) => {
        this.orders = orders;
        this.totalItems = orders.length;
        this.applyFilters();
        this.isLoading = false;
      },
      (error) => {
        console.error('Error loading orders:', error);
        this.isLoading = false;
      }
    );
  }

  applyFilters(): void {
    let result = [...this.orders];

    // Apply status filter
    if (this.statusFilter !== 'all') {
      result = result.filter(order =>
        order.shipping.shippingStatus.toString() === this.statusFilter
      );
    }

    // Apply date filter
    if (this.dateFilter !== 'all') {
      const now = new Date();
      result = result.filter(order => {
        const orderDate = new Date(order.orderDate);

        switch(this.dateFilter) {
          case 'today':
            return orderDate.toDateString() === now.toDateString();
          case 'week':
            const startOfWeek = new Date(now);
            startOfWeek.setDate(now.getDate() - now.getDay());
            return orderDate >= startOfWeek;
          case 'month':
            return orderDate.getMonth() === now.getMonth() &&
                   orderDate.getFullYear() === now.getFullYear();
          default:
            return true;
        }
      });
    }

    // Apply search filter
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      result = result.filter(order =>
        order.id.toString().includes(query) ||
        order.orderItems.some((item: any) =>
          item.productName.toLowerCase().includes(query)
        )
      );
    }

    this.filteredOrders = result;
    this.totalItems = result.length;
    this.currentPage = 1; // Reset to first page when filters change
  }

  getOrderTotal(order: any): number {
    return order.orderItems.reduce((total: number, item: any) =>
      total + (item.price * item.quantity), 0);
  }

  getShippingStatusText(status: number): string {
    return this.shippingService.getShippingStatusText(status);
  }

  viewOrderDetails(orderId: number): void {
    this.router.navigate(['/order-summary', orderId]);
  }

  // Pagination methods
  get paginatedOrders(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredOrders.slice(startIndex, startIndex + this.itemsPerPage);
  }

  changePage(page: number): void {
    this.currentPage = page;
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
}
