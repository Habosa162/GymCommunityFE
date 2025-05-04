import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
} from '@microsoft/signalr';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../auth.service';
import { baseUrl } from '../enviroment';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private hubConnection!: HubConnection;
  apiUrl = `${baseUrl}/Notification`;
  constructor(
    private toastr: ToastrService,
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private notificationsSubject = new BehaviorSubject<any[]>([]);
  notifications$ = this.notificationsSubject.asObservable();

  private unreadCountSubject = new BehaviorSubject<number>(0);
  unreadCount$ = this.unreadCountSubject.asObservable();

  startConnection(): Promise<void> {
    if (this.hubConnection?.state === HubConnectionState.Connected) {
      return Promise.resolve();
    }

    this.hubConnection = new HubConnectionBuilder()
      .withUrl(`${baseUrl}/notificationHub`, {
        accessTokenFactory: () => {
          // Try both token locations
          const token =
            this.authService.getToken() || localStorage.getItem('jwt');
          console.log('Token for SignalR:', token ? 'Found' : 'Not found');
          return token || '';
        },
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.on('ReceiveNotification', (message: string) => {
      console.log('New notification:', message);
      this.loadNotifications();
      this.getUnreadCount();
    });

    return this.hubConnection
      .start()
      .then(() => console.log('SignalR connection started'))
      .catch((err) => {
        console.error('Error starting SignalR connection:', err);
        throw err;
      });
  }

  stopConnection(): void {
    if (this.hubConnection?.state === HubConnectionState.Connected) {
      this.hubConnection
        .stop()
        .catch((err) =>
          console.error('Error stopping SignalR connection:', err)
        );
    }
  }
  // Load all notifications
  loadNotifications() {
    return this.http
      .get<any[]>(`${this.apiUrl}`)
      .subscribe((data) => this.notificationsSubject.next(data));
  }

  //  Get unread count
  getUnreadCount() {
    this.http
      .get<number>(`${this.apiUrl}/unread`)
      .subscribe((count) => this.unreadCountSubject.next(count));
  }

  // Mark one notification as read
  markAsRead(id: number) {
    return this.http.put(`${this.apiUrl}/${id}`, null).subscribe(() => {
      this.loadNotifications();
      this.getUnreadCount();
    });
  }

  // Delete one notification
  deleteNotification(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`).subscribe(() => {
      this.loadNotifications();
      this.getUnreadCount();
    });
  }
  sendNotification(userId: string, title: string, body: string) {
    return this.http.post(`${this.apiUrl}`, {
      title: title,
      body: body,
      userId: userId,
    });
  }
}
