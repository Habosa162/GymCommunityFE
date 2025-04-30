import { PaymentDTO } from './../../domain/models/Ecommerce/payment.mdoel';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';  // Import catchError
import { Observable, throwError } from 'rxjs';  // Import throwError
import { baseUrl } from '../enviroment';


@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  apiUrl = baseUrl + '/Payment';

  constructor(private httpClient: HttpClient) {}

  // Paymob Payment Request
  PaymobRequest(orderData: any):Observable<any> {
   return this.httpClient.post("https://accept.paymob.com/v1/intention/", orderData, {
      headers: {
        "Authorization": "Token egy_sk_test_68ef89025e9a21df799c8de6e552495b278ed90f7416655c5528e35ebedd8c64",
        "Content-Type": "application/json"
      }
    });
  }

  CreatePayment(paymentData: PaymentDTO) {
    return this.httpClient.post<PaymentDTO>(this.apiUrl, {
      amount: paymentData.amount,
      currency: paymentData.currency,
      paymentMethod: paymentData.paymentMethod,
      status: paymentData.status
    }).pipe(
      catchError(error => {
        console.error("Error creating payment:", error);
        alert("Failed to create payment.");
        return throwError(error);
      })
    );
  }

  GetPaymentById(paymentId: number) {
    return this.httpClient.get<PaymentDTO>(`${this.apiUrl}/${paymentId}`).pipe(
      catchError(error => {
        console.error("Error fetching payment:", error);
        alert("Failed to fetch payment details.");
        return throwError(error);
      })
    );
  }

  UpdatePayment(paymentId: number, paymentData: PaymentDTO) {
    return this.httpClient.put<PaymentDTO>(`${this.apiUrl}/${paymentId}`, paymentData).pipe(
      catchError(error => {
        console.error("Error updating payment:", error);
        alert("Failed to update payment.");
        return throwError(error);
      })
    );
  }

  getPaymentStatusText(status: number): string {
    switch(status) {
      case 0: return 'Unknown';
      case 1: return 'Pending';
      case 2: return 'Completed';
      case 3: return 'Failed';
      default: return 'Refunded';
    }
  }

}
