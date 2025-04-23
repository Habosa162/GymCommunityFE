import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LoaderComponent } from '../../../../core/shared/components/Loader/loader/loader.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-select-role',
  imports: [LoaderComponent,CommonModule,RouterModule],
  templateUrl: './select-role.component.html',
  styleUrl: './select-role.component.css'
})
export class SelectRoleComponent {
constructor(private http: HttpClient, private router: Router) {}

isLoading = false;
selectRole(role: string) {
  this.isLoading = true;
  const token = localStorage.getItem('token');
  this.http.post('https://localhost:7130/api/auth/set-role', JSON.stringify(role), {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json' // Important!
    },
    
  }).subscribe((response: any) => {
    localStorage.setItem('token', response.token);
    console.log(response);
    this.isLoading = false;
    this.router.navigate(['/']);
  }, error => {
    console.error('Error assigning role:', error);
    this.isLoading = false;
  });
}

}
