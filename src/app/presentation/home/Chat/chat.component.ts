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

  // Add a cache for user names
  private userNameCache: { [userId: string]: string } = {};
  public userAvatarCache: { [userId: string]: string } = {};

  // Add a map to track pending user info requests
  private pendingUserRequests: { [userId: string]: boolean } = {};

  // Add a throttled subject for user info requests
  private userInfoRequestSubject = new Subject<string>();
  private userInfoSubscription?: Subscription;

  constructor(
    private chatService: ChatService,
    private authService: AuthService,
    private chatDiagnostics: ChatDiagnostics
  ) {}

  ngOnInit(): void {
    console.log('Initializing Chat Component');

    // Get current user ID from JWT token
    this.currentUserId = this.authService.getUserId() || 'anonymous-user';
    this.currentUserName = this.authService.getUserName() || 'Anonymous User';
    const profileImage = this.authService.getProfileImg();

    // Add current user to cache
    this.userNameCache[this.currentUserId] = this.currentUserName;
    if (profileImage) {
      this.userAvatarCache[this.currentUserId] = profileImage;
    }

    // Log authentication info
    console.log('Auth User ID:', this.currentUserId);
    console.log('Auth User Name:', this.currentUserName);
    console.log('JWT Token exists:', !!this.authService.getToken());

    // Initialize the diagnostics and chat service
    this.chatDiagnostics.initialize();

    // Setup throttled user info requests - process at most once per second
    this.userInfoSubscription = this.userInfoRequestSubject
      .pipe(
        throttleTime(1000), // Throttle to once per second
        debounceTime(300) // Wait for a pause in the stream
      )
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

          // Reset connection retries on successful connection
          if (connected) {
            this.connectionRetries = 0;

            // If we're connected and have a selected group, join it
            if (this.selectedGroupId) {
              this.joinGroup(this.selectedGroupId);
            }

            // Schedule a diagnostic test message after connection to verify everything works
            setTimeout(() => {
              this.chatDiagnostics
                .sendTestMessage()
                .catch((err) =>
                  console.error('Error sending test message:', err)
                );
            }, 2000);
          }
          // If we've lost connection, try to reconnect
          else if (wasConnected && !connected) {
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
        // Check if message belongs to current group
        if (
          !this.selectedGroupId ||
          message.groupId === this.selectedGroupId ||
          message.groupId === 'test-group'
        ) {
          // Check if message already exists to avoid duplicates
          if (!this.messages.find((m) => m.id === message.id && m.id !== 0)) {
            this.messages.push(message);
            this.shouldScrollToBottom = true;

            // Queue user info request if needed
            if (
              message.senderId !== this.currentUserId &&
              message.senderId !== 'system' &&
              message.senderId !== 'system-diagnostic' &&
              !this.userNameCache[message.senderId] &&
              !this.pendingUserRequests[message.senderId]
            ) {
              // Set initial name and queue the request
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

    // Setup diagnostic timer to periodically check connection health
    this.startDiagnosticTimer();
  }

  /**
   * Start a diagnostic timer to periodically check connection health
   */
  private startDiagnosticTimer(): void {
    // Check every 30 seconds
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

  /**
   * Handle disconnection by attempting to reconnect
   */
  private handleDisconnection(): void {
    this.connectionRetries++;
    console.log(`Connection lost. Retry attempt ${this.connectionRetries}`);

    if (this.connectionRetries < 5) {
      // Reinitialize the chat service with an exponential backoff
      const delay = Math.min(1000 * Math.pow(2, this.connectionRetries), 30000);
      console.log(`Attempting to reconnect in ${delay / 1000} seconds...`);

      setTimeout(() => {
        if (!this.isConnected && this.componentActive) {
          this.chatDiagnostics.initialize();
        }
      }, delay);
    } else {
      console.error(
        'Failed to reconnect after multiple attempts. Please refresh the page.'
      );
    }
  }

  ngOnDestroy(): void {
    console.log('Destroying Chat Component');
    this.componentActive = false;

    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }

    if (this.connectionSubscription) {
      this.connectionSubscription.unsubscribe();
    }

    if (this.diagnosticTimerSubscription) {
      this.diagnosticTimerSubscription.unsubscribe();
    }

    if (this.userInfoSubscription) {
      this.userInfoSubscription.unsubscribe();
    }

    // Leave the current group when component is destroyed
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
        console.log('User groups loaded:', this.groups);

        // If we have groups but none selected, select the first one automatically
        if (this.groups.length > 0 && !this.selectedGroupId) {
          this.selectGroup(this.groups[0].groupId);
        }
      },
      error: (err) => {
        console.error('Error loading groups:', err);

        // If no groups available, create a default group
        if (!this.groups || this.groups.length === 0) {
          this.createDefaultGroup();
        }
      },
    });
  }

  /**
   * Create a default group if none exist
   */
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

    // Leave current group if one is selected
    if (this.selectedGroupId) {
      this.chatService
        .leaveGroup(this.selectedGroupId)
        .catch((err) => console.error('Error leaving group:', err));
    }

    this.selectedGroupId = groupId;
    this.messages = [];

    // Join the new group
    this.joinGroup(groupId);

    // Load message history
    console.log('Loading message history for group:', groupId);
    this.chatService.getGroupHistory(groupId).subscribe({
      next: (messages) => {
        console.log('Group history loaded:', messages);
        this.messages = messages;
        this.shouldScrollToBottom = true;

        // Preload user information for all messages
        this.preloadUserInfo(messages);
      },
      error: (err) => {
        console.error('Error loading message history:', err);
        // Add a system message to indicate the error
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

  // Preload user information for all messages
  private preloadUserInfo(messages: ChatMessage[]): void {
    // Get unique user IDs from messages (excluding current user and system)
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

    // Queue user info requests for each unique user ID - will be throttled
    userIds.forEach((userId) => {
      this.userNameCache[userId] = 'User';
      this.queueUserInfoRequest(userId);
    });
  }

  getSelectedGroupName(): string {
    const group = this.groups.find((g) => g.groupId === this.selectedGroupId);
    return group ? group.groupName : 'Chat';
  }

  sendMessage(): void {
    if (!this.newMessage.trim() || !this.selectedGroupId) {
      return;
    }

    if (!this.isConnected) {
      // Add a local-only message
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

    // Add message to UI immediately for better UX
    const tempMessage: ChatMessage = {
      id: 0, // Temporary ID
      senderId: this.currentUserId,
      senderName: this.currentUserName,
      groupId: this.selectedGroupId,
      content: this.newMessage,
      timestamp: new Date(),
    };

    this.messages.push(tempMessage);
    this.shouldScrollToBottom = true;

    // Send message via SignalR
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
        // Remove the temporary message if sending failed
        this.messages = this.messages.filter((m) => m !== tempMessage);

        // Add an error message
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

              // Automatically select the new group
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

  // Add a function to get user name - simplified to just return cached value or trigger a fetch
  getUserName(userId: string): string {
    // Return cached name if available
    if (this.userNameCache[userId]) {
      return this.userNameCache[userId];
    }

    // Return placeholder for system messages
    if (userId === 'system' || userId === 'system-diagnostic') {
      return userId === 'system' ? 'System' : 'Chat System';
    }

    // Set a temporary name and queue a fetch if not already pending
    if (!this.pendingUserRequests[userId]) {
      this.userNameCache[userId] = 'User';
      this.queueUserInfoRequest(userId);
    }

    return this.userNameCache[userId];
  }

  // Queue a request to fetch user info - will be throttled
  private queueUserInfoRequest(userId: string): void {
    this.pendingUserRequests[userId] = true;
    this.userInfoRequestSubject.next(userId);
  }

  // Actually fetch the user info from the API
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

          // Only update if we got a real name (not 'User' or empty)
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
          // On error, mark request as not pending so we can try again later
          this.pendingUserRequests[userId] = false;
        },
      });
  }

  // Debug method for inspecting chat state
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

  // Add function to get user avatar - simplified to just return cached value or default
  getUserAvatar(userId: string): string {
    return this.userAvatarCache[userId] || 'assets/images/default-avatar.png';
  }

  // Check if the message is from the current user
  isMessageFromCurrentUser(message: ChatMessage): boolean {
    return (
      message.senderId === this.currentUserId ||
      message.senderId === 'system-diagnostic'
    );
  }

  // Check if the message is from the system
  isSystemMessage(message: ChatMessage): boolean {
    return message.senderId === 'system';
  }

  // Force reconnect the SignalR connection
  forceReconnect(): void {
    console.log('User requested reconnection');
    this.chatDiagnostics.initialize();
  }
}
