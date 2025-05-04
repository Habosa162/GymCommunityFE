import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { baseUrl } from '../enviroment';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private hubConnection!: HubConnection;
  apiUrl = `${baseUrl}/Notification`
  constructor(
    private toastr: ToastrService
    ,private http:HttpClient) { }

    private notificationsSubject = new BehaviorSubject<any[]>([]);
    notifications$ = this.notificationsSubject.asObservable();

    private unreadCountSubject = new BehaviorSubject<number>(0);
    unreadCount$ = this.unreadCountSubject.asObservable();

    startConnection() {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(`${baseUrl}/notificationHub`, {
        accessTokenFactory: () => localStorage.getItem('token')!
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start().catch(err => console.log('Error: ' + err));

    this.hubConnection.on('ReceiveNotification', (notification) => {
      console.log('New notification:', notification);
      this.toastr.info(notification.body, notification.title);
      this.loadNotifications();

    });
  }
 // Load all notifications
 loadNotifications() {
  return this.http.get<any[]>(`${this.apiUrl}`)
    .subscribe(data => this.notificationsSubject.next(data));
}

//  Get unread count
getUnreadCount() {
  this.http.get<number>(`${this.apiUrl}/unread`)
    .subscribe(count => this.unreadCountSubject.next(count));
}

// Mark one notification as read
markAsRead(id: number) {
  return this.http.put(`${this.apiUrl}/${id}`, null)
    .subscribe(() => {
      this.loadNotifications();
      this.getUnreadCount();
    });
}

// Delete one notification
deleteNotification(id: number) {
  return this.http.delete(`${this.apiUrl}/${id}`)
    .subscribe(() => {
      this.loadNotifications();
      this.getUnreadCount();
    });
}

}
