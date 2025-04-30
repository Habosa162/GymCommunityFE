import { Injectable } from '@angular/core';
import { ChatService } from '../../../services/Chat/chat.service';

@Injectable({
  providedIn: 'root',
})
export class ChatDiagnostics {
  constructor(private chatService: ChatService) {}

  /**
   * Initializes the diagnostics and chat service
   */
  initialize(): void {
    this.chatService.initialize();
    console.log('Chat diagnostics initialized - chat service started');
  }

  /**
   * Test method to send a message to the current user to validate connection is working
   */
  async sendTestMessage(): Promise<void> {
    // Create a direct message object
    const testMessage = {
      content: `Test message - ${new Date().toLocaleTimeString()}`,
      timestamp: new Date(),
    };

    // Log that we're sending a test message
    console.log('Sending diagnostic test message:', testMessage);

    // Manually invoke the message received handler to simulate getting a message
    if (this.chatService['messageSubject']) {
      this.chatService['messageSubject'].next({
        id: 0,
        senderId: 'system-diagnostic',
        senderName: 'Chat System',
        groupId: 'test-group',
        content: testMessage.content,
        timestamp: testMessage.timestamp,
      });

      console.log('Test message sent to message subject');
      return Promise.resolve();
    } else {
      console.error('Message subject not available in chat service');
      return Promise.reject('Message subject not available');
    }
  }
}
