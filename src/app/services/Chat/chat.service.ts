import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { BehaviorSubject, Observable, Subject, of } from 'rxjs';
import { catchError, map, tap, timeout } from 'rxjs/operators';
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
      .catch((err :any) => {
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

    this.hubConnection.onclose((error :any) => {
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

    return this.hubConnection.invoke('JoinGroup', groupId).catch((err :any) => {
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
      return this.hubConnection.invoke('LeaveGroup', groupId).catch((err :any) => {
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

    // Get current user's name from JWT
    const senderName = this.authService.getUserName() || 'Anonymous User';

    // Check connection status
    if (this.hubConnection.state !== 'Connected') {
      console.log('Connection not established, attempting to reconnect...');
      return this.hubConnection.start().then(() => {
        console.log('Connection established, now sending message');
        return this.hubConnection.invoke(
          'SendMessageToGroup',
          senderId,
          groupId,
          message,
          senderName
        );
      });
    }

    return this.hubConnection
      .invoke('SendMessageToGroup', senderId, groupId, message, senderName)
      .catch((err:any) => {
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

  /**
   * Fetches a user's name by their user ID
   * @param userId The ID of the user to fetch
   * @returns Observable of the user's name or error
   */
  getUserNameById(
    userId: string
  ): Observable<{ Name: string; ProfileImage: string }> {
    console.log(`Fetching user info for: ${userId}`);

    // If no userId is provided, return default values
    if (!userId) {
      console.error('Invalid user ID provided');
      return of({ Name: 'Unknown User', ProfileImage: '' });
    }

    return this.http.get<any>(`${this.apiUrl}/group/user/${userId}`).pipe(
      // Add timeout to prevent hanging requests
      timeout(5000),
      // Log the response for debugging
      tap((response) => {
        console.log(`Raw user info response for ${userId}:`, response);
        // Log structure to help debug
        if (response && typeof response === 'object') {
          console.log(`Response keys for ${userId}:`, Object.keys(response));
        }
      }),
      // Transform the response to match our expected format
      map((response) => {
        // For debugging - log entire response object
        console.log(
          `Full response object for ${userId}:`,
          JSON.stringify(response)
        );

        // Check different possible response formats
        if (response && typeof response === 'object') {
          // Format 1: { Name: "...", ProfileImage: "..." }
          if (response.Name !== undefined) {
            return {
              Name: response.Name,
              ProfileImage: response.ProfileImage || '',
            };
          }

          // Format 2: { name: "...", profileImage: "..." }
          if (response.name !== undefined) {
            return {
              Name: response.name,
              ProfileImage:
                response.profileImage || response.ProfileImage || '',
            };
          }

          // Format 3: { userName: "...", profileImg: "..." }
          if (response.userName !== undefined) {
            return {
              Name: response.userName,
              ProfileImage: response.profileImg || response.profileImage || '',
            };
          }

          // Try case-insensitive search for name properties
          for (const key of Object.keys(response)) {
            const lowerKey = key.toLowerCase();
            if (
              lowerKey === 'name' ||
              lowerKey === 'username' ||
              lowerKey.includes('name')
            ) {
              console.log(
                `Found name property "${key}" with value "${response[key]}"`
              );
              return {
                Name: response[key],
                ProfileImage:
                  response.profileImage ||
                  response.ProfileImage ||
                  response.profileImg ||
                  response.ProfileImg ||
                  '',
              };
            }
          }

          // If we have a single key, assume it might be the response
          if (Object.keys(response).length === 1) {
            const onlyKey = Object.keys(response)[0];
            console.log(
              `Single property response: ${onlyKey} = ${response[onlyKey]}`
            );
            return {
              Name: response[onlyKey],
              ProfileImage: '',
            };
          }
        } else if (typeof response === 'string') {
          // If response is just a string, assume it's the name
          return {
            Name: response,
            ProfileImage: '',
          };
        }

        // Last resort - log the full response for debugging
        console.warn(`Unrecognized user info response format:`, response);
        return {
          Name: 'Unknown User',
          ProfileImage: '',
        };
      }),
      // Handle errors
      catchError((err) => {
        console.error(`Error fetching user info for ${userId}:`, err);
        // Return a default value instead of propagating the error
        return of({ Name: 'User', ProfileImage: '' });
      })
    );
  }
}
