import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ChatGroup,
  ChatMessage,
  ChatService,
} from '../../../services/Chat/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class ChatComponent implements OnInit {
  messages: ChatMessage[] = [];
  groups: ChatGroup[] = [];
  selectedGroupId: string | null = null;
  newMessage = '';
  currentUserId = 'user1'; // Replace with actual user ID
  newGroupName = '';

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.chatService.getMessages().subscribe((message) => {
      if (message.groupId === this.selectedGroupId) {
        this.messages.push(message);
      }
    });

    this.loadUserGroups();
  }

  loadUserGroups(): void {
    this.chatService.getUserGroups(this.currentUserId).subscribe((groups) => {
      this.groups = groups;
    });
  }

  selectGroup(groupId: string): void {
    this.selectedGroupId = groupId;
    this.messages = [];
    this.chatService.getGroupHistory(groupId).subscribe((messages) => {
      this.messages = messages;
    });
  }

  sendMessage(): void {
    if (this.newMessage.trim() && this.selectedGroupId) {
      // Add message locally for the sender
      const localMessage: ChatMessage = {
        id: 0,
        senderId: this.currentUserId,
        groupId: this.selectedGroupId,
        content: this.newMessage,
        timestamp: new Date(),
      };
      this.messages.push(localMessage);

      // Send message to the server
      this.chatService.sendMessageToGroup(
        this.currentUserId,
        this.selectedGroupId,
        this.newMessage
      );
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
          });
      });
    }
  }
}
