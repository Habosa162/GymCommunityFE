import { Component } from '@angular/core';
import { OrderService } from '../../../services/Ecommerce/order.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, CurrencyPipe } from '@angular/common';
import * as L from 'leaflet';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-order-summary',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.css']
})
export class OrderSummaryComponent {
  map: any;
  marker: any;
  order: any = null;
  loading: boolean = true;
  error: string | null = null;
  mapsLoaded = false;

  constructor(
    private orderService: OrderService,
    protected activatedRoute: ActivatedRoute,
    private toastrService:ToastrService
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
        setTimeout(() => this.initMap(), 1); 
      },
      error: (err) => {
        this.toastrService.error("Connection Faild !","Error") ;
        this.loading = false;
      }
    });
  }

  initMap() {
    if (this.mapsLoaded) return;
    this.mapsLoaded = true;

    const lat = this.order.shipping.Latitude;
    const lng = this.order.shipping.Longitude;

    this.map = L.map('map').setView([lat, lng], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    // Show marker for existing shipping address
    this.marker = L.marker([lat, lng])
      .addTo(this.map)
      .bindPopup(`Shipping Address: ${lat.toFixed(4)}, ${lng.toFixed(4)}`)
      .openPopup();

    // Optional: allow user to click and see other coords
    this.map.on('click', (e: any) => {
      const newLat = e.latlng.lat;
      const newLng = e.latlng.lng;

      if (this.marker) {
        this.map.removeLayer(this.marker);
      }

      this.marker = L.marker([newLat, newLng]).addTo(this.map)
        .bindPopup(`Latitude: ${newLat.toFixed(4)}, Longitude: ${newLng.toFixed(4)}`)
        .openPopup();
    });
  }

  getTotal(): number {
    if (!this.order?.orderItems) return 0;
    return this.order.orderItems.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
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
      2: 'status-delivered',
      3: 'status-cancelled'
    };
    return statusClasses[status] || '';
  }

  copyCoordinates() {
    const coords = `${this.order.shipping.Latitude}, ${this.order.shipping.Longitude}`;
    navigator.clipboard.writeText(coords);
    // Optional: show a toast or confirmation message
  }
}
