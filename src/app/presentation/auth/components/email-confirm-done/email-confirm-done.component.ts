import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-email-confirm-done',
  imports: [CommonModule],
  templateUrl: './email-confirm-done.component.html',
  styleUrl: './email-confirm-done.component.css',
})
export class EmailConfirmDoneComponent implements OnInit {
  message = 'Confirming...';
  isConfirmed = false;
  private baseUrl = 'https://localhost:7130/api';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    const email = this.route.snapshot.queryParamMap.get('email');

    if (token && email) {
      const url = `${this.baseUrl}/auth/ConfirmEmail?token=${encodeURIComponent(
        token
      )}&email=${encodeURIComponent(email)}`;

      // Send POST with no body, only query parameters
      this.http.post(url, {}).subscribe({
        next: () => {
          this.message = 'Email confirmed successfully!';
          // Optional redirect:
          this.isConfirmed = true;

          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000); //
        },
        error: (err) => {
          this.message = 'Email confirmation failed.';
          this.isConfirmed = false;
        },
      });
    } else {
      this.message = 'Invalid confirmation link.';
    }
  }
}
