import { CommonModule } from '@angular/common';
import {
  AfterViewChecked,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, Subject, Subscription, timer } from 'rxjs';
import {
  catchError,
  debounceTime,
  takeWhile,
  throttleTime,
} from 'rxjs/operators';
import { ChatMessage, ChatService } from '../../../services/Chat/chat.service';
import { AuthService } from '../../../services/auth.service';
import { ChatDiagnostics } from './chat-diagnostics';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  imports: [CommonModule, FormsModule],
  standalone: true,
})
export class ChatComponent implements OnInit, AfterViewChecked, OnDestroy {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  messages: ChatMessage[] = [];
  groups: any[] = [];
  selectedGroupId: string | null = null;
  newMessage = '';
  currentUserId: string = '';
  currentUserName: string = '';
  newGroupName = '';
  connectionRetries = 0;
  private shouldScrollToBottom = false;
  private messageSubscription?: Subscription;
  private connectionSubscription?: Subscription;
  private diagnosticTimerSubscription?: Subscription;
  private componentActive = true;
  public isConnected = false;

  private userNameCache: { [userId: string]: string } = {};
  public userAvatarCache: { [userId: string]: string } = {};
  private pendingUserRequests: { [userId: string]: boolean } = {};
  private userInfoRequestSubject = new Subject<string>();
  private userInfoSubscription?: Subscription;

  constructor(
    private chatService: ChatService,
    protected authService: AuthService,
    private chatDiagnostics: ChatDiagnostics,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Check if user is a gym owner and redirect if so
    if (this.authService.getUserRole() === 'GymOwner') {
      console.log('Gym owners do not have access to chat functionality');
      this.router.navigate(['/']);
      return;
    }

    console.log('Initializing Chat Component');
    this.currentUserId = this.authService.getUserId() || 'anonymous-user';
    this.currentUserName = this.authService.getUserName() || 'Anonymous User';
    const profileImage = this.authService.getProfileImg();
    this.userNameCache[this.currentUserId] = this.currentUserName;
    if (profileImage) {
      this.userAvatarCache[this.currentUserId] = profileImage;
    }
    console.log('Auth User ID:', this.currentUserId);
    console.log('Auth User Name:', this.currentUserName);
    console.log('JWT Token exists:', !!this.authService.getToken());

    this.chatDiagnostics.initialize();
    this.userInfoSubscription = this.userInfoRequestSubject
      .pipe(throttleTime(1000), debounceTime(300))
      .subscribe((userId) => {
        this.fetchUserInfo(userId);
      });

    this.connectionSubscription = this.chatService
      .connectionStatus()
      .subscribe({
        next: (connected) => {
          console.log('SignalR connection status changed:', connected);
          const wasConnected = this.isConnected;
          this.isConnected = connected;
          if (connected) {
            this.connectionRetries = 0;
            if (this.selectedGroupId) {
              this.joinGroup(this.selectedGroupId);
            }
            setTimeout(() => {
              this.chatDiagnostics
                .sendTestMessage()
                .catch((err) =>
                  console.error('Error sending test message:', err)
                );
            }, 2000);
          } else if (wasConnected && !connected) {
            this.handleDisconnection();
          }
        },
        error: (err) => {
          console.error('Error in connection status subscription:', err);
          this.handleDisconnection();
        },
      });

    this.messageSubscription = this.chatService.getMessages().subscribe({
      next: (message) => {
        console.log('Received message in component:', message);
        if (
          !this.selectedGroupId ||
          message.groupId === this.selectedGroupId ||
          message.groupId === 'test-group'
        ) {
          if (!this.messages.find((m) => m.id === message.id && m.id !== 0)) {
            this.messages.push(message);
            this.shouldScrollToBottom = true;
            if (
              message.senderId !== this.currentUserId &&
              message.senderId !== 'system' &&
              message.senderId !== 'system-diagnostic' &&
              !this.userNameCache[message.senderId] &&
              !this.pendingUserRequests[message.senderId]
            ) {
              this.userNameCache[message.senderId] = 'User';
              this.queueUserInfoRequest(message.senderId);
            }
          }
        }
      },
      error: (err) => {
        console.error('Error receiving message:', err);
      },
    });

    this.loadUserGroups();
    this.startDiagnosticTimer();
  }

  private startDiagnosticTimer(): void {
    this.diagnosticTimerSubscription = timer(30000, 30000)
      .pipe(takeWhile(() => this.componentActive))
      .subscribe(() => {
        if (!this.isConnected) {
          console.log(
            'Diagnostic timer: Connection lost, attempting reconnect'
          );
          this.handleDisconnection();
        } else {
          console.log('Diagnostic timer: Connection is healthy');
        }
      });
  }

  private handleDisconnection(): void {
    this.connectionRetries++;
    console.log(`Connection lost. Retry attempt ${this.connectionRetries}`);
    if (this.connectionRetries < 5) {
      const delay = Math.min(1000 * Math.pow(2, this.connectionRetries), 30000);
      console.log(`Attempting to reconnect in ${delay / 1000} seconds...`);
      setTimeout(() => {
        if (!this.isConnected && this.componentActive) {
          this.chatDiagnostics.initialize();
        }
      }, delay);
    } else {
      console.error('Failed to reconnect after multiple attempts.');
    }
  }

  ngOnDestroy(): void {
    console.log('Destroying Chat Component');
    this.componentActive = false;
    this.messageSubscription?.unsubscribe();
    this.connectionSubscription?.unsubscribe();
    this.diagnosticTimerSubscription?.unsubscribe();
    this.userInfoSubscription?.unsubscribe();
    if (this.selectedGroupId) {
      this.chatService
        .leaveGroup(this.selectedGroupId)
        .catch((err) => console.error('Error leaving group:', err));
    }
  }

  ngAfterViewChecked() {
    if (this.shouldScrollToBottom && this.messagesContainer) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  scrollToBottom(): void {
    try {
      this.messagesContainer.nativeElement.scrollTop =
        this.messagesContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Error scrolling to bottom:', err);
    }
  }

  loadUserGroups(): void {
    console.log('Loading user groups');
    this.chatService.getUserGroups().subscribe({
      next: (groups) => {
        this.groups = groups;
        console.log('User groups loaded:', groups);
        if (groups.length > 0 && !this.selectedGroupId) {
          this.selectGroup(groups[0].groupId);
        }
        this.preloadGroupUsernames();
      },
      error: (err) => {
        console.error('Error loading groups:', err);
        if (!this.groups || this.groups.length === 0) {
          this.createDefaultGroup();
        }
      },
    });
  }

  private createDefaultGroup(): void {
    const defaultGroupName = 'General Chat';
    console.log(`Creating default group: ${defaultGroupName}`);
    this.chatService.createGroup(defaultGroupName).subscribe({
      next: (group) => {
        console.log('Default group created:', group);
        this.loadUserGroups();
      },
      error: (err) => {
        console.error('Error creating default group:', err);
      },
    });
  }

  joinGroup(groupId: string): void {
    console.log('Joining group:', groupId, 'Connected:', this.isConnected);
    if (this.isConnected) {
      this.chatService
        .joinGroup(groupId)
        .then(() => console.log('Successfully joined group:', groupId))
        .catch((err) => console.error('Error joining group:', err));
    } else {
      console.warn('Cannot join group - not connected to SignalR hub');
    }
  }

  selectGroup(groupId: string): void {
    console.log('Selecting group:', groupId);
    if (this.selectedGroupId) {
      this.chatService
        .leaveGroup(this.selectedGroupId)
        .catch((err) => console.error('Error leaving group:', err));
    }
    this.selectedGroupId = groupId;
    this.messages = [];
    this.joinGroup(groupId);
    console.log('Loading message history for group:', groupId);
    this.chatService.getGroupHistory(groupId).subscribe({
      next: (messages) => {
        console.log('Group history loaded:', messages);
        this.messages = messages;
        this.shouldScrollToBottom = true;
        this.preloadUserInfo(messages);
      },
      error: (err) => {
        console.error('Error loading message history:', err);
        this.messages.push({
          id: 0,
          senderId: 'system',
          senderName: 'System',
          groupId: this.selectedGroupId || '',
          content: 'Unable to load message history. Please try again later.',
          timestamp: new Date(),
        });
      },
    });
  }

  private preloadUserInfo(messages: ChatMessage[]): void {
    const userIds = [
      ...new Set(
        messages
          .filter(
            (m) =>
              m.senderId !== this.currentUserId &&
              m.senderId !== 'system' &&
              m.senderId !== 'system-diagnostic' &&
              !this.userNameCache[m.senderId] &&
              !this.pendingUserRequests[m.senderId]
          )
          .map((m) => m.senderId)
      ),
    ];
    console.log(`Preloading user info for ${userIds.length} users`);
    userIds.forEach((userId) => {
      this.userNameCache[userId] = 'User';
      this.queueUserInfoRequest(userId);
    });
  }

  private preloadGroupUsernames(): void {
    const userIds: string[] = [];
    this.groups.forEach((group) => {
      const coachIdMatch = group.groupName.match(/"CoachId"\s*:\s*"([^"]+)"/);
      const clientIdMatch = group.groupName.match(/"ClientId"\s*:\s*"([^"]+)"/);
      if (
        coachIdMatch &&
        coachIdMatch[1] &&
        !this.userNameCache[coachIdMatch[1]] &&
        !this.pendingUserRequests[coachIdMatch[1]]
      ) {
        userIds.push(coachIdMatch[1]);
      }
      if (
        clientIdMatch &&
        clientIdMatch[1] &&
        !this.userNameCache[clientIdMatch[1]] &&
        !this.pendingUserRequests[clientIdMatch[1]]
      ) {
        userIds.push(clientIdMatch[1]);
      }
    });
    console.log(`Preloading usernames for ${userIds.length} users from groups`);
    userIds.forEach((userId) => {
      this.userNameCache[userId] = 'User';
      this.queueUserInfoRequest(userId);
    });
  }

  // Updated getSelectedGroupName
  getSelectedGroupName(): string {
    const group = this.groups.find((g) => g.groupId === this.selectedGroupId);
    if (!group) {
      return 'Chat';
    }
    try {
      const planName = this.parsePlanName(group.groupName);
      const userRole = this.authService.getUserRole();
      let userName = '';
      if (userRole === 'Client') {
        userName = this.getCoachName(group.groupName);
      } else if (userRole === 'Coach') {
        userName = this.getClientName(group.groupName);
      }
      // Return formatted string: plan name only if no user name, otherwise combine
      return planName && userName
        ? `${planName} - ${userName}`
        : planName || userName || 'Chat';
    } catch (error) {
      console.error('Error formatting selected group name:', error);
      return 'Chat';
    }
  }

  sendMessage(): void {
    if (!this.newMessage.trim() || !this.selectedGroupId) {
      return;
    }
    if (!this.isConnected) {
      this.messages.push({
        id: 0,
        senderId: 'system',
        senderName: 'System',
        groupId: this.selectedGroupId,
        content:
          'Cannot send message - not connected to chat server. Please try again later.',
        timestamp: new Date(),
      });
      this.shouldScrollToBottom = true;
      return;
    }
    console.log('Sending message to group:', this.selectedGroupId);
    const tempMessage: ChatMessage = {
      id: 0,
      senderId: this.currentUserId,
      senderName: this.currentUserName,
      groupId: this.selectedGroupId,
      content: this.newMessage,
      timestamp: new Date(),
    };
    this.messages.push(tempMessage);
    this.shouldScrollToBottom = true;
    this.chatService
      .sendMessageToGroup(
        this.currentUserId,
        this.selectedGroupId,
        this.newMessage
      )
      .then(() => {
        console.log('Message sent successfully');
      })
      .catch((err) => {
        console.error('Error sending message:', err);
        this.messages = this.messages.filter((m) => m !== tempMessage);
        this.messages.push({
          id: 0,
          senderId: 'system',
          senderName: 'System',
          groupId: this.selectedGroupId || '',
          content: 'Failed to send message. Please try again.',
          timestamp: new Date(),
        });
        this.shouldScrollToBottom = true;
      });
    this.newMessage = '';
  }

  createGroup(): void {
    if (!this.newGroupName.trim()) {
      return;
    }
    console.log('Creating new group:', this.newGroupName);
    this.chatService.createGroup(this.newGroupName).subscribe({
      next: (group) => {
        console.log('Group created:', group);
        this.chatService
          .addToGroup(group.groupId, this.currentUserId)
          .subscribe({
            next: () => {
              console.log('Added user to group:', group.groupId);
              this.loadUserGroups();
              this.newGroupName = '';
              setTimeout(() => {
                this.selectGroup(group.groupId);
              }, 500);
            },
            error: (err) => {
              console.error('Error adding user to group:', err);
            },
          });
      },
      error: (err) => {
        console.error('Error creating group:', err);
      },
    });
  }

  getUserName(userId: string): string {
    if (this.userNameCache[userId]) {
      return this.userNameCache[userId];
    }
    if (userId === 'system' || userId === 'system-diagnostic') {
      return userId === 'system' ? 'System' : 'Chat System';
    }
    if (!this.pendingUserRequests[userId]) {
      this.userNameCache[userId] = 'User';
      this.queueUserInfoRequest(userId);
    }
    return this.userNameCache[userId];
  }

  getCoachName(group: string): string {
    try {
      const match = group.match(/"CoachId"\s*:\s*"([^"]+)"/);
      if (match && match[1]) {
        return 'Coach Name: ' + this.getUserName(match[1]);
      }
      return 'Coach';
    } catch (error) {
      console.error('Error parsing CoachId:', error);
      return 'Coach';
    }
  }

  getClientName(group: string): string {
    try {
      const match = group.match(/"ClientId"\s*:\s*"([^"]+)"/);
      if (match && match[1]) {
        return 'Client Name: ' + this.getUserName(match[1]);
      }
      return 'Client';
    } catch (error) {
      console.error('Error parsing ClientId:', error);
      return 'Client';
    }
  }

  parsePlanName(group: string): string {
    try {
      console.log(group);
      const match = group.match(/"Name"\s*:\s*"([^"]+)"/);
      if (match && match[1]) {
        return 'Plan: ' + match[1];
      }
      throw new Error('Name field not found');
    } catch (error) {
      console.error('Error parsing Name:', error);
      return '';
    }
  }

  private queueUserInfoRequest(userId: string): void {
    this.pendingUserRequests[userId] = true;
    this.userInfoRequestSubject.next(userId);
  }

  private fetchUserInfo(userId: string): void {
    console.log(`Fetching user info for: ${userId}`);
    this.chatService
      .getUserNameById(userId)
      .pipe(
        catchError((err) => {
          console.error(`Error fetching user info for ${userId}:`, err);
          return of({ Name: 'User', ProfileImage: '' });
        })
      )
      .subscribe({
        next: (result) => {
          console.log(`Received user info for ${userId}:`, result);
          if (result.Name && result.Name !== 'User') {
            this.userNameCache[userId] = result.Name;
            console.log(`Updated username for ${userId} to "${result.Name}"`);
            if (result.ProfileImage) {
              this.userAvatarCache[userId] = result.ProfileImage;
              console.log(`Updated profile image for ${userId}`);
            }
          } else {
            console.warn(
              `Received invalid name for user ${userId}: "${result.Name}"`
            );
          }
          this.pendingUserRequests[userId] = false;
        },
        error: () => {
          this.pendingUserRequests[userId] = false;
        },
      });
  }

  inspectChatState(): void {
    console.group('Chat Component State');
    console.log('User caches:', {
      names: this.userNameCache,
      avatars: this.userAvatarCache,
      pending: this.pendingUserRequests,
    });
    console.log('Current messages:', this.messages);
    console.log('Connection status:', this.isConnected);
    console.groupEnd();
  }

  getUserAvatar(userId: string): string {
    return this.userAvatarCache[userId] || 'assets/images/default-avatar.png';
  }

  isMessageFromCurrentUser(message: ChatMessage): boolean {
    return (
      message.senderId === this.currentUserId ||
      message.senderId === 'system-diagnostic'
    );
  }

  isSystemMessage(message: ChatMessage): boolean {
    return message.senderId === 'system';
  }

  forceReconnect(): void {
    console.log('User requested reconnection');
    this.chatDiagnostics.initialize();
  }

  showSenderForMessage(index: number, message: ChatMessage): boolean {
    if (index === 0) return true;

    const previousMessage = this.messages[index - 1];
    return previousMessage.senderId !== message.senderId;
  }

  getMessageTime(message: ChatMessage): string {
    if (!message.timestamp) return '';

    const messageDate = new Date(message.timestamp);
    const today = new Date();

    if (messageDate.toDateString() === today.toDateString()) {
      return messageDate.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
    }

    return (
      messageDate.toLocaleDateString() +
      ' ' +
      messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    );
  }
}
