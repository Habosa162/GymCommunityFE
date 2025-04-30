import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

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

  constructor(private http: HttpClient) {
    this.createConnection();
    this.registerOnServerEvents();
    this.startConnection();
  }

  private createConnection() {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl)
      .withAutomaticReconnect()
      .build();
  }

  private startConnection(): void {
    this.hubConnection
      .start()
      .then(() => {
        console.log('SignalR connection started');
        this.connectionEstablished.next(true);
      })
      .catch((err) => {
        console.error('Error while establishing connection: ', err);
        // Retry connection after 5 seconds
        setTimeout(() => this.startConnection(), 5000);
      });
  }

  private registerOnServerEvents(): void {
    this.hubConnection.on(
      'ReceiveMessage',
      (senderId: string, message: string, timestamp: Date) => {
        console.log('Received message from SignalR:', senderId, message);
        this.messageSubject.next({
          id: 0, // ID will be set when message history is fetched
          senderId,
          groupId: this.getCurrentGroupId() || '',
          content: message,
          timestamp: new Date(timestamp),
        });
      }
    );

    this.hubConnection.onreconnected(() => {
      console.log('Connection reestablished');
      // Rejoin groups when connection is reestablished
      this.joinCurrentGroup();
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
      this.joinGroup(this.currentGroupId);
    }
  }

  joinGroup(groupId: string): Promise<void> {
    this.setCurrentGroupId(groupId);
    return this.hubConnection.invoke('JoinGroup', groupId);
  }

  leaveGroup(groupId: string): Promise<void> {
    if (this.currentGroupId === groupId) {
      this.setCurrentGroupId(null);
    }
    return this.hubConnection.invoke('LeaveGroup', groupId);
  }

  sendMessageToGroup(
    senderId: string,
    groupId: string,
    message: string
  ): Promise<void> {
    console.log('Sending message to group:', senderId, groupId, message);
    return this.hubConnection.invoke(
      'SendMessageToGroup',
      senderId,
      groupId,
      message
    );
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
