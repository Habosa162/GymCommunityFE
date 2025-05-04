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
import {ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {
  @ViewChild('checkoutForm') checkoutForm!: NgForm;
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
      orderItems: this.cartItems.map((item) => ({
        name: item.name,
        amount: item.price * 100, 
        description: item.description,
        quantity: item.quantity
      })),
      billing_data: {
        "apartment": "",
        "first_name": this.shipping.CustomerName ,
        "last_name": "Client",
        "street": this.shipping.ShippingAddress,
        "building": "",
        "phone_number": this.shipping.PhoneNumber,
        "city": "",
        "country": "",
        "email": "habosa@habosa.com",
        "floor": "",
        "state": ""
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

    if (this.shipping.PhoneNumber.length !== 11) {
      alert("Please enter a valid 11-digit phone number starting with 01.");
      return;
    }

    // Manually trigger validation for all fields
    Object.keys(this.checkoutForm.controls).forEach(field => {
      const control = this.checkoutForm.controls[field];
      control.markAsTouched({ onlySelf: true });
    });

    if (this.checkoutForm.invalid) {
      alert("Please fill all required fields correctly.");
      return;
    }

    if (!this.paymentMethod) {
      alert("💳 Please select a payment method.");
      return;
    }

    // Set dummy phone number before processing
    this.shipping.PhoneNumber = 'XXXXXXXXXXX';
    this.processPayment();
    this.resetForm();
  }

  private resetForm() {
    this.shipping = {
      CustomerName: '',
      ShippingAddress: '',
      PhoneNumber: '',
      Carrier: 'DHL',
      TrackingNumber: 'ABC123456',
      Latitude: 30.0444,
      Longitude: 31.2357,
      EstimatedDeliveryDate: null,
    };
    this.maskedPhoneNumber = '';
    this.paymentMethod = 'Paymob';
    this.checkoutForm?.resetForm();
  }

  // formatPhoneNumber() {
  //   if (this.shipping.PhoneNumber) {
  //     // Remove all non-digit characters first
  //     let numbers = this.shipping.PhoneNumber.replace(/\D/g, '');

  //     // Ensure it starts with 01 and has correct length
  //     if (numbers.startsWith('01') && numbers.length <= 11) {
  //       // Format with spaces for display (optional)
  //       let formatted = numbers.substring(0, 5);
  //       if (numbers.length > 5) {
  //         formatted += ' ' + numbers.substring(5, 8);
  //       }
  //       if (numbers.length > 8) {
  //         formatted += ' ' + numbers.substring(8, 11);
  //       }
  //       this.shipping.PhoneNumber = formatted;
  //     } else {
  //       // If not valid, just keep the numbers
  //       this.shipping.PhoneNumber = numbers;
  //     }
  //   }
  // }

  blockSymbols(event: KeyboardEvent) {
    // Allow: backspace, delete, tab, escape, enter, arrows
    if ([46, 8, 9, 27, 13, 110].includes(event.keyCode) ||
        // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
        (event.keyCode === 65 && event.ctrlKey === true) ||
        (event.keyCode === 67 && event.ctrlKey === true) ||
        (event.keyCode === 86 && event.ctrlKey === true) ||
        (event.keyCode === 88 && event.ctrlKey === true) ||
        // Allow: home, end, left, right
        (event.keyCode >= 35 && event.keyCode <= 39)) {
      return;
    }

    // Ensure it's a number (0-9) or space (keyCode 32)
    if ((event.keyCode < 48 || event.keyCode > 57) &&
        (event.keyCode < 96 || event.keyCode > 105) &&
        event.keyCode !== 32) {
      event.preventDefault();
    }
  }
  maskedPhoneNumber: string = '';

  formatMaskedPhone(event: any) {
    const value = event.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
      this.shipping.PhoneNumber = value;
    }
  }



}
