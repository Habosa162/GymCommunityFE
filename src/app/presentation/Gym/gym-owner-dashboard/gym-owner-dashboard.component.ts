import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GymReadDTO, GymCreateDTO } from '../../../domain/models/Gym/gym.model';
import { GymService } from '../../../services/Gym/gym.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-gym-owner-dashboard',
  imports: [CommonModule,FormsModule],
  templateUrl: './gym-owner-dashboard.component.html',
  styleUrl: './gym-owner-dashboard.component.css'
})
export class GymOwnerDashboardComponent implements OnInit {
  gyms: GymReadDTO[] = [];
  showAddGymForm = false;
  newGym: GymCreateDTO = {
    ownerId: '', 
    name: '',
    location: '',
    description: '',
    latitude: 0,
    longitude: 0
  };

  constructor(
    private gymService: GymService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadGyms();
  }

  loadGyms(): void {
    const ownerId = 'fd6a3800-35d3-4d8b-8595-2e82a4adf6d8'; // Replace with actual owner ID 
    this.gymService.getByOwnerId(ownerId).subscribe({
      next: (gyms) => this.gyms = gyms,
      error: (err) => console.error('Failed to load gyms', err)
    });
  }

  toggleAddGymForm(): void {
    this.showAddGymForm = !this.showAddGymForm;
  }

  addGym(): void {
    this.newGym.ownerId = 'fd6a3800-35d3-4d8b-8595-2e82a4adf6d8'; // Replace with actual owner ID
    this.gymService.createGym(this.newGym).subscribe({
      next: (createdGym) => {
        this.gyms.push(createdGym);
        this.showAddGymForm = false;
        this.newGym = {
          ownerId: '',
          name: '',
          location: '',
          phoneNumber: '',
          website: '',
          email: '',
          description: '',
          latitude: 0,
          longitude: 0
        };
      },
      error: (err) => console.error('Failed to create gym', err)
    });
  }

  viewGymDetails(gymId: number): void {
    this.router.navigate(['/gym-owner/gym', gymId]);
  }

}
