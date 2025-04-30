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
import { Subscription } from 'rxjs';
import { ChatMessage, ChatService } from '../../../services/Chat/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  imports: [CommonModule, FormsModule],
  standalone: true,
})
export class ChatComponent implements OnInit, AfterViewChecked, OnDestroy {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  messages: ChatMessage[] = [];
  groups: any[] = [];
  selectedGroupId: string | null = null;
  newMessage = '';
  currentUserId = '5d0b5d7a-606f-47f9-a2f4-16113bca073f'; // Replace with actual user ID
  newGroupName = '';
  private shouldScrollToBottom = false;
  private messageSubscription?: Subscription;
  private connectionSubscription?: Subscription;
  private isConnected = false;

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.connectionSubscription = this.chatService
      .connectionStatus()
      .subscribe((connected) => {
        this.isConnected = connected;
        console.log('SignalR connection status:', connected);

        // If we're connected and have a selected group, join it
        if (connected && this.selectedGroupId) {
          this.joinGroup(this.selectedGroupId);
        }
      });

    this.messageSubscription = this.chatService
      .getMessages()
      .subscribe((message) => {
        console.log('Received message:', message);
        // Check if message belongs to current group
        if (message.groupId === this.selectedGroupId) {
          // Check if message already exists to avoid duplicates
          if (!this.messages.find((m) => m.id === message.id && m.id !== 0)) {
            this.messages.push(message);
            this.shouldScrollToBottom = true;
          }
        }
      });

    this.loadUserGroups();
  }

  ngOnDestroy(): void {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
    if (this.connectionSubscription) {
      this.connectionSubscription.unsubscribe();
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
    this.chatService.getUserGroups().subscribe((groups) => {
      this.groups = groups;
      console.log('User groups loaded:', this.groups);
    });
  }

  joinGroup(groupId: string): void {
    if (this.isConnected) {
      this.chatService
        .joinGroup(groupId)
        .then(() => console.log('Joined group:', groupId))
        .catch((err) => console.error('Error joining group:', err));
    }
  }

  selectGroup(groupId: string): void {
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
    this.chatService.getGroupHistory(groupId).subscribe((messages) => {
      this.messages = messages;
      this.shouldScrollToBottom = true;
    });
  }

  getSelectedGroupName(): string {
    const group = this.groups.find((g) => g.groupId === this.selectedGroupId);
    return group ? group.groupName : 'Chat';
  }

  sendMessage(): void {
    if (this.newMessage.trim() && this.selectedGroupId) {
      // Add message to UI immediately for better UX
      const tempMessage: ChatMessage = {
        id: 0, // Temporary ID
        senderId: this.currentUserId,
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
        });

      this.newMessage = '';
    }
  }

  createGroup(): void {
    if (this.newGroupName.trim()) {
      this.chatService.createGroup(this.newGroupName).subscribe((group) => {
        this.chatService
          .addToGroup(group.groupId, this.currentUserId)
          .subscribe(() => {
            this.loadUserGroups();
            this.newGroupName = '';

            // Automatically select the new group
            setTimeout(() => {
              this.selectGroup(group.groupId);
            }, 500);
          });
      });
    }
  }
}
