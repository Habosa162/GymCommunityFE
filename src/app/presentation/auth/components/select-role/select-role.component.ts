import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-select-role',
  imports: [],
  templateUrl: './select-role.component.html',
  styleUrl: './select-role.component.css'
})
export class SelectRoleComponent {
constructor(private http: HttpClient, private router: Router) {}
selectRole(role: string) {
  const token = localStorage.getItem('token');
  this.http.post('https://localhost:7130/api/auth/set-role', JSON.stringify(role), {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json' // Important!
    },
    
  }).subscribe((response: any) => {
    localStorage.setItem('token', response.token);
    console.log(response);
    this.router.navigate(['/']);
  }, error => {
    console.error('Error assigning role:', error);
  });
}

}
