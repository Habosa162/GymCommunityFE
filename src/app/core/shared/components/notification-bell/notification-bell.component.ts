import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { NotificationService } from '../../../../services/Notification/notification.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-notification-bell',
  imports: [CommonModule,FormsModule],
  templateUrl: './notification-bell.component.html',
  styleUrl: './notification-bell.component.css'
})
export class NotificationBellComponent  implements OnInit{
  notifications: any[] = [];
  unreadCount = 0;
  showDropdown = false;

  constructor(
     private notificationService: NotificationService
    ,private eRef : ElementRef
  ){}

  ngOnInit(): void {
    this.notificationService.startConnection(); // Start SignalR
    this.notificationService.loadNotifications();
    this.notificationService.getUnreadCount();

    this.notificationService.notifications$.subscribe(n => this.notifications = n);
    this.notificationService.unreadCount$.subscribe(c => this.unreadCount = c);
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  markAsRead(id: number) {
    this.notificationService.markAsRead(id);
  }

  deleteNotification(id: number) {
    this.notificationService.deleteNotification(id);
  }
  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.showDropdown = false;
    }
  }
}
