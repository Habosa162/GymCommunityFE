import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NotificationService } from '../../../../services/Notification/notification.service';

@Component({
  selector: 'app-notification-bell',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './notification-bell.component.html',
  styleUrls: ['./notification-bell.component.css'],
})
export class NotificationBellComponent implements OnInit, OnDestroy {
  notifications: any[] = [];
  unreadCount = 0;
  showDropdown = false;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private notificationService: NotificationService,
    private eRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.notificationService
      .startConnection()
      .then(() => {
        this.notificationService.loadNotifications();
        this.notificationService.getUnreadCount();
      })
      .catch((err) => {
        console.error('Failed to initialize SignalR connection:', err);
      });

    this.subscriptions.add(
      this.notificationService.notifications$.subscribe(
        (n) => (this.notifications = n)
      )
    );
    this.subscriptions.add(
      this.notificationService.unreadCount$.subscribe(
        (c) => (this.unreadCount = c)
      )
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.notificationService.stopConnection();
  }

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  markAsRead(id: number): void {
    this.notificationService.markAsRead(id);
  }

  deleteNotification(id: number): void {
    this.notificationService.deleteNotification(id);
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent): void {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.showDropdown = false;
    }
  }
}
