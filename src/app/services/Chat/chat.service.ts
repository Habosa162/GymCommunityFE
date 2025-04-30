import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { Observable, Subject } from 'rxjs';

export interface ChatMessage {
  id: number;
  senderId: string;
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
  private hubConnection: HubConnection;
  private messageSubject = new Subject<ChatMessage>();
  private apiUrl = 'https://localhost:7130/api'; // Updated to match backend port
  private hubUrl = 'https://localhost:7130/chatHub'; // Up
  constructor(private http: HttpClient) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl)
      .build();

    this.hubConnection.start().catch((err) => console.error(err));

    this.hubConnection.on(
      'ReceiveMessage',
      (senderId: string, content: string, timestamp: Date) => {
        this.messageSubject.next({
          id: 0,
          senderId,
          groupId: '',
          content,
          timestamp,
        });
      }
    );
  }

  sendMessageToGroup(senderId: string, groupId: string, message: string): void {
    this.hubConnection
      .invoke('SendMessageToGroup', senderId, groupId, message)
      .catch((err) => console.error(err));
  }

  getMessages(): Observable<ChatMessage> {
    return this.messageSubject.asObservable();
  }

  getGroupHistory(groupId: string): Observable<ChatMessage[]> {
    return this.http.get<ChatMessage[]>(
      `${this.apiUrl}/chat/history/${groupId}`
    );
  }

  createGroup(groupName: string): Observable<ChatGroup> {
    return this.http.post<ChatGroup>(`${this.apiUrl}/group`, { groupName });
  }

  addToGroup(groupId: string, userId: string): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}/group/${groupId}/members`,
      userId
    );
  }

  getUserGroups(userId: string): Observable<ChatGroup[]> {
    return this.http.get<ChatGroup[]>(`${this.apiUrl}/group/${userId}/groups`);
  }
}
