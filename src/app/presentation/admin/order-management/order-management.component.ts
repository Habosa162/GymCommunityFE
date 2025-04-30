import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrderService } from '../../../services/Ecommerce/order.service';
import { ShippingService } from '../../../services/Ecommerce/shipping.service';
import { PaymentService } from '../../../services/Ecommerce/payment.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-order-management',
  standalone: true,
  imports: [CommonModule, RouterModule,FormsModule],
  templateUrl: './order-management.component.html',
  styleUrls: ['./order-management.component.css']
})
export class OrderManagementComponent implements OnInit {
  isLoading: boolean = true;
  query: string = "";
  page: number = 1;
  pageSize: number = 10;
  sort: string | null = null;
  status: number | null = null;
  date: Date | null = null;
  selectedOrder: any = null;

  ordersResponse!: any;
  orders: any[] = [];
  totalCount: number = 0;
  errorMessage: string | null = null;

  constructor(
    private orderService: OrderService,
    protected shippingService: ShippingService,
    private paymentService: PaymentService
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.orderService.getAllOrders(
      this.query,
      this.page,
      this.pageSize,
      this.sort,
      this.status,
      this.date
    ).subscribe({
      next: (res: any) => {
        this.ordersResponse = res;
        this.orders = res.data;
        this.totalCount = res.totalCount;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load orders:', err);
        this.errorMessage = err.error?.message || 'Failed to load orders. Please try again.';
        this.isLoading = false;
      }
    });
  }

  getShippingStatusText(status: number): string {
    return this.shippingService.getShippingStatusText(status);
  }

  getPaymentStatusText(status: number): string {
    return this.paymentService.getPaymentStatusText(status);
  }

  nextPage(): void {
    if (this.page < this.ordersResponse.totalPages) {
      this.page++;
      this.loadOrders();
    }
  }

  prevPage(): void {
    if (this.page > 1) {
      this.page--;
      this.loadOrders();
    }
  }

  onSearch(): void {
    this.page = 1; // Reset to first page when searching
    this.loadOrders();
  }

  onStatusFilterChange(status: number | null): void {
    this.status = status;
    this.page = 1;
    this.loadOrders();
  }

  onDateFilterChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.date = input.valueAsDate;
    this.page = 1;
    this.loadOrders();
  }
  viewOrder(order: any) {
    this.selectedOrder = { ...order };
  }
  updateShippingStatus() {
    if (!this.selectedOrder) return;

    this.shippingService.updateShippingStatus(this.selectedOrder.shipping.id, this.selectedOrder.shipping.shippingStatus)
      .subscribe({
        next: (res) => {
          console.log(res);
          alert('Shipping status updated successfully!');
          this.loadOrders(); 
        },
        error: err => {
          alert('Failed to update shipping status.');
          console.error(err);
        }
      });
  }
}
