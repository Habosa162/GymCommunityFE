import { ShippingDTO } from './../../../domain/models/Ecommerce/shipping.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CartService } from '../../../services/Ecommerce/cart.service';
import { FormControl, FormGroup, FormsModule } from '@angular/forms';
import { FrontbaseUrl } from '../../../services/enviroment';
import { PaymentService } from '../../../services/Ecommerce/payment.service';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ShippingService } from '../../../services/Ecommerce/shipping.service';


@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {
  cartItems: any[] = [];
  paymentMethod: string = 'Paymob';
  totalPrice: number = 0;

  map: any;
  marker: any;


  shipping:ShippingDTO = {
    Carrier: 'DHL',
    TrackingNumber: 'ABC123456',
    Latitude: 30.0444,
    Longitude: 31.2357,
    CustomerName: '',
    ShippingAddress: '',
    PhoneNumber: '',
    EstimatedDeliveryDate: null,
  };


  constructor(private cartService: CartService
    , private router: Router
    , private paymentService: PaymentService
    ,private shippingService:ShippingService
  ) { }

  initMap() {
    this.map = L.map('map').setView([30.0444, 31.2357], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    this.map.on('click', (e: any) => {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;

      // Update form controls
      this.shipping.Latitude = lat;
      this.shipping.Longitude = lng;


      // If marker exists, remove it
      if (this.marker) {
        this.map.removeLayer(this.marker);
      }

      // Add a new marker
      this.marker = L.marker([lat, lng]).addTo(this.map)
        .bindPopup(`Latitude: ${lat.toFixed(4)}, Longitude: ${lng.toFixed(4)}`)
        .openPopup();
    });
  }

  ngOnInit(): void {
    this.cartItems = this.cartService.getCart();
    this.totalPrice = this.cartService.getTotalPrice();
    this.initMap();
  }

  processPayment() {
    if (this.paymentMethod === 'Paymob') {
      this.PaymobRequest();
    } else {
      alert("Please select Paymob to proceed with payment.");
    }
  }

  PaymobRequest() {

    this.shippingService.saveShipping(this.shipping) ;

    const orderData = {
      amount: this.totalPrice * 100,
      currency: "EGP",
      payment_methods: [4419883, 4437311, 4437297],
      orderItems: this.cartItems,
      billing_data: {
        "apartment": "dumy",
        "first_name": this.shipping.CustomerName ,  // First Name, Last Name, Phone number, & Email are mandatory fields within sending the intention request
        "last_name": "Hany",
        "street": this.shipping.ShippingAddress,
        "building": "dumy",
        "phone_number": this.shipping.PhoneNumber,
        "city": "dumy",
        "country": "dumy",
        "email": "habosa@habosa.com",
        "floor": "dumy",
        "state": "dumy"
      },
      extras: { id: "USER_ID" },
      redirection_url: `${FrontbaseUrl}/payment-success`,
    };

    this.paymentService.PaymobRequest(orderData).subscribe({
      next: (response: any) => {
        const clientSecret = response.client_secret;
        if (clientSecret) {
          const paymentUrl = `https://accept.paymob.com/unifiedcheckout/?publicKey=egy_pk_test_jrlnWL5oJX8IRTp9xpeHq5mmQhAMfXES&clientSecret=${clientSecret}`;
          window.location.href = paymentUrl;
        } else {
          console.error("Client secret not found in the response.");
          alert("Failed to retrieve payment details.");
        }
      },
      error: (error) => {
        console.log(error);
        console.error("Error in Paymob API request:", error);
        alert("Failed to process payment. Please try again.");
      }
    });
  }

  submitOrder() {
    if (this.cartItems.length === 0) {
      alert("🛒 Your cart is empty!");
      return;
    }

    if (!this.paymentMethod) {
      alert("💳 Please select a payment method.");
      return;
    }


    alert('Order submitted successfully ✅');
    this.processPayment();
    this.shipping = {
      CustomerName: ''
      , ShippingAddress: ''
      , PhoneNumber: ''
      , Carrier: ''
      , TrackingNumber: ''
      , Latitude: 30.0444
      , Longitude: 31.2357
      ,EstimatedDeliveryDate: ''
    };
    this.paymentMethod = 'COD';
    alert("✅ Order confirmed! We'll deliver it soon.");
  }
}
