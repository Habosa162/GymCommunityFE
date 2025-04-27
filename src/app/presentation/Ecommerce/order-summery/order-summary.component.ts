import { Component } from '@angular/core';
import { OrderService } from '../../../services/Ecommerce/order.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-order-summary',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.css']
})
export class OrderSummaryComponent {
  order: any = null;
  loading: boolean = true;
  error: string | null = null;

  constructor(
    private orderService: OrderService,
    protected activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      const orderId = params['id'];
      this.loadOrder(orderId);
    });
  }

  loadOrder(orderId: number) {
    this.loading = true;
    this.error = null;

    this.orderService.getOneOrder(orderId).subscribe({
      next: (res) => {
        this.order = res;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load order details. Please try again later.';
        this.loading = false;
        console.error('Error loading order:', err);
      }
    });
  }

  getTotal(): number {
    if (!this.order?.orderItems) return 0;
    return this.order.orderItems.reduce((sum:number, item:any) => sum + (item.price * item.quantity), 0);
  }

  getShippingStatusText(status: number): string {
    const statusMap: { [key: number]: string } = {
      0: 'Pending',
      1: 'Shipped',
      2: 'Delivered',
      3: 'Cancelled',
    };
    return statusMap[status] || 'Unknown';
  }
  getStatusClass(status: number): string {
    const statusClasses: { [key: number]: string } = {
      0: 'status-pending',
      1: 'status-shipped',
      3: 'status-delivered',
      4: 'status-cancelled'
    };
    return statusClasses[status] || '';
  }
}
