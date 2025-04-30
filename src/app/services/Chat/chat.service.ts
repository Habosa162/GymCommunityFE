import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { AuthService } from '../auth.service';

export interface ChatMessage {
  id: number;
  senderId: string;
  senderName?: string;
  groupId: string;
  content: string;
  timestamp: Date;
}

export interface ChatGroup {
  groupId: string;
  groupName: string;
}

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private hubConnection!: HubConnection;
  private messageSubject = new Subject<ChatMessage>();
  private connectionEstablished = new BehaviorSubject<boolean>(false);

  private apiUrl = 'https://localhost:7130/api';
  private hubUrl = 'https://localhost:7130/chatHub';

  constructor(private http: HttpClient, private authService: AuthService) {
    this.createConnection();
  }

  // Manually initialize the connection instead of in constructor
  public initialize() {
    this.registerOnServerEvents();
    this.startConnection();
  }

  private createConnection() {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl, {
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
  }

  private startConnection(): void {
    if (this.hubConnection.state === 'Connected') {
      console.log('Hub connection already established');
      this.connectionEstablished.next(true);
      return;
    }

    console.log('Starting SignalR connection...');
    this.hubConnection
      .start()
      .then(() => {
        console.log('SignalR connection started successfully');
        this.connectionEstablished.next(true);
      })
      .catch((err) => {
        console.error('Error while establishing SignalR connection: ', err);
        // Retry connection after 5 seconds
        setTimeout(() => this.startConnection(), 5000);
      });
  }

  private registerOnServerEvents(): void {
    // Handle both message formats that might come from the server
    this.hubConnection.on(
      'ReceiveMessage',
      (arg1: any, arg2?: any, arg3?: any) => {
        console.log('Received message from SignalR:', arg1, arg2, arg3);

        let message: ChatMessage;

        // If the first argument is a full message object
        if (arg1 && typeof arg1 === 'object' && arg1.content) {
          message = arg1;
        }
        // If server sends parameters separately (senderId, content, timestamp)
        else if (arg2 !== undefined) {
          message = {
            id: 0,
            senderId: arg1, // First arg is senderId
            content: arg2, // Second arg is message content
            groupId: this.getCurrentGroupId() || '',
            timestamp: arg3 ? new Date(arg3) : new Date(), // Third arg might be timestamp
          };
        }
        // Single parameter string message
        else if (typeof arg1 === 'string') {
          message = {
            id: 0,
            senderId: '', // Unknown sender
            content: arg1, // First arg is the message content
            groupId: this.getCurrentGroupId() || '',
            timestamp: new Date(),
          };
        } else {
          console.error(
            'Received message in unexpected format:',
            arg1,
            arg2,
            arg3
          );
          return;
        }

        this.messageSubject.next(message);
      }
    );

    this.hubConnection.onreconnected(() => {
      console.log('Connection reestablished');
      this.connectionEstablished.next(true);
      // Rejoin groups when connection is reestablished
      this.joinCurrentGroup();
    });

    this.hubConnection.onclose((error) => {
      console.error('SignalR connection closed:', error);
      this.connectionEstablished.next(false);
      // Retry connection after a delay
      setTimeout(() => this.startConnection(), 5000);
    });
  }

  // Keep track of the current group
  private currentGroupId: string | null = null;

  private getCurrentGroupId(): string | null {
    return this.currentGroupId;
  }

  private setCurrentGroupId(groupId: string | null): void {
    this.currentGroupId = groupId;
  }

  private joinCurrentGroup(): void {
    if (this.currentGroupId) {
      this.joinGroup(this.currentGroupId).catch((err) =>
        console.error('Error rejoining group:', err)
      );
    }
  }

  joinGroup(groupId: string): Promise<void> {
    this.setCurrentGroupId(groupId);
    console.log('Joining group:', groupId);

    // Make sure connection is established before joining group
    if (this.hubConnection.state !== 'Connected') {
      console.log('Connection not established, starting connection...');
      return this.hubConnection.start().then(() => {
        console.log('Connection started, now joining group');
        return this.hubConnection.invoke('JoinGroup', groupId);
      });
    }

    return this.hubConnection.invoke('JoinGroup', groupId).catch((err) => {
      console.error('Error joining group:', err);
      throw err;
    });
  }

  leaveGroup(groupId: string): Promise<void> {
    if (this.currentGroupId === groupId) {
      this.setCurrentGroupId(null);
    }

    // Only try to leave if connection is active
    if (this.hubConnection.state === 'Connected') {
      console.log('Leaving group:', groupId);
      return this.hubConnection.invoke('LeaveGroup', groupId).catch((err) => {
        console.error('Error leaving group:', err);
        // Return a resolved promise to avoid errors in calling code
        return Promise.resolve();
      });
    }

    return Promise.resolve();
  }

  sendMessageToGroup(
    senderId: string,
    groupId: string,
    message: string
  ): Promise<void> {
    console.log('Sending message to group:', senderId, groupId, message);

    // Check connection status
    if (this.hubConnection.state !== 'Connected') {
      console.log('Connection not established, attempting to reconnect...');
      return this.hubConnection.start().then(() => {
        console.log('Connection established, now sending message');
        return this.hubConnection.invoke(
          'SendMessageToGroup',
          senderId,
          groupId,
          message
        );
      });
    }

    return this.hubConnection
      .invoke('SendMessageToGroup', senderId, groupId, message)
      .catch((err) => {
        console.error('Error sending message to group:', err);
        throw err;
      });
  }

  public connectionStatus(): Observable<boolean> {
    return this.connectionEstablished.asObservable();
  }

  getMessages(): Observable<ChatMessage> {
    return this.messageSubject.asObservable();
  }

  getGroupHistory(groupId: string): Observable<ChatMessage[]> {
    return this.http.get<ChatMessage[]>(
      `${this.apiUrl}/chat/history/${groupId}`
    );
  }

  createGroup(groupName: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/group`, { groupName });
  }

  addToGroup(groupId: string, userId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/group/${groupId}/members`, {
      userId,
    });
  }

  getUserGroups(): Observable<any[]> {
    return this.http.get<ChatGroup[]>(`${this.apiUrl}/group/groups`);
  }
}
