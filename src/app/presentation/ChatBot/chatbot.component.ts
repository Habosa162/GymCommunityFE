import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { catchError, throwError, timeout } from 'rxjs';
import { MarkdownComponent, provideMarkdown } from 'ngx-markdown';

interface ClientInfo {
  height?: number;
  weight?: number;
  workoutAvailability?: number;
  clientGoal?: 'BuildMuscle' | 'LoseFat' | 'ImproveEndurance' | 'GeneralFitness' | null;
  otherGoal?: string | null;
  bodyFat?: number;
  bio?: string;
  firstName?: string;
  lastName?: string;
  address?: string;
  birthDate?: string;
  isActive?: boolean;
  isPremium?: boolean;
  gender?: string;
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule, MarkdownComponent],
  providers: [provideMarkdown()],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css'],
})
export class ChatbotComponent implements OnInit {
  isChatOpen = false;
  messages: { sender: 'user' | 'bot'; text: string; isMarkdown?: boolean }[] = [];
  userInput = '';
  apiUrl = 'https://localhost:7130/api/chatbot/chat';
  profileUrl = 'https://localhost:7130/api/ClientProfile/me';
  isLoading = false;
  clientInfo: ClientInfo | null = null;

  private welcomeMessages = [
    "Hi! I'm your Gym Coach. Ask me for workout plans or fitness tips!",
    "Hello! Ready to crush your fitness goals? Ask me anything about workouts or nutrition!",
    "Welcome! Need help with exercise routines or fitness advice? I'm here to help!",
    "Hey there! Looking for personalized workout tips? Just ask away!"
  ];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Fetch ClientProfile
    this.fetchClientProfile();

    // Show welcome message
    const randomIndex = Math.floor(Math.random() * this.welcomeMessages.length);
    this.messages.push({
      sender: 'bot',
      text: this.welcomeMessages[randomIndex],
      isMarkdown: false
    });
  }

  fetchClientProfile(): void {
    const token = localStorage.getItem('token'); // Adjust based on your auth setup
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.http.get<{ success: boolean; isOwner: boolean; data: ClientInfo }>(this.profileUrl, { headers })
      .pipe(
        catchError((error) => {
          this.messages.push({ 
            sender: 'bot', 
            text: 'Yo, bro, couldn’t grab your profile! Set up your fitness deets and try again.' 
          });
          return throwError(() => error);
        })
      )
      .subscribe({
        next: (response) => {
          if (response.success && response.isOwner) {
            this.clientInfo = response.data;
          }
        }
      });
  }

  toggleChat(): void {
    this.isChatOpen = !this.isChatOpen;
  }

  sendMessage(): void {
    if (!this.userInput.trim()) return;

    this.messages.push({ sender: 'user', text: this.userInput });
    this.isLoading = true;

    const payload = { 
      prompt: this.userInput,
      clientInfo: this.clientInfo
    };

    this.http
      .post<any>(this.apiUrl, payload)
      .pipe(
        timeout(100000),
        catchError((error) => {
          let errorMessage = 'Sorry, something went wrong. Please try again.';
          if (error.name === 'TimeoutError') {
            errorMessage = 'Request timed out. Check your connection and try again.';
          } else if (error.status === 429) {
            errorMessage = 'Quota exceeded. Try again later or contact support.';
          } else if (error.status === 401) {
            errorMessage = 'Please Login To Be Able To Use Gym Bro Chatbot!';
          }
          this.messages.push({ sender: 'bot', text: errorMessage });
          this.isLoading = false;
          return throwError(() => error);
        })
      )
      .subscribe({
        next: (response) => {
          this.messages.push({ 
            sender: 'bot', 
            text: response.message,
            isMarkdown: true
          });
          this.isLoading = false;
        },
        error: () => {
          // Handled in catchError
        }
      });

    this.userInput = '';
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }
}