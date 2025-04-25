import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GymReadDTO, GymCreateDTO } from '../../../domain/models/Gym/gym.model';
import { GymService } from '../../../services/Gym/gym.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';
import { AuthService } from '../../../services/auth.service';
declare var google: any; 

@Component({
  selector: 'app-gym-owner-dashboard',
  imports: [CommonModule,FormsModule,GoogleMapsModule],
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

  // Google Maps properties
  mapOptions: google.maps.MapOptions = {
    center: { lat: 30.0444, lng: 31.2357 }, // Cairo coordinates
    zoom: 12
  };
  markerPosition: google.maps.LatLngLiteral | null = null;
  mapInitialized = false;

  constructor(
    private gymService: GymService,
    private router: Router,
    private authService: AuthService 
  ) {}

  ngOnInit(): void {
    this.loadGyms();
    this.initGoogleMaps();
  }

  loadGyms(): void {
    const ownerId = this.authService.getUserId(); // Replace with actual owner ID 
    if (!ownerId) {
      console.error('Owner ID not found');
      return;
    }
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
        this.resetNewGymForm();
      },
      error: (err) => console.error('Failed to create gym', err)
    });
  }
  resetNewGymForm(): void {
    this.newGym = {
      ownerId: '',
      name: '',
      location: '',
      description: '',
      latitude: 0,
      longitude: 0
    };
    this.markerPosition = null;
  }

  viewGymDetails(gymId: number): void {
    this.router.navigate(['/gym-owner/gym', gymId]);
  }

  // Google Maps Methods
  initGoogleMaps(): void {
    if (typeof google === 'undefined' || !google.maps || !google.maps.places) {
      this.loadGoogleMapsScript();
    } else {
      this.mapInitialized = true;
    }
  }
  
  loadGoogleMapsScript(): void {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAFEYZKTxhZz5eY9c760Gyz7kJ3mNbXb34&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => this.mapInitialized = true;
      document.head.appendChild(script);
  }
  handleMapClick(event: google.maps.MapMouseEvent): void {
    if (event.latLng) {
      this.markerPosition = event.latLng.toJSON();
      this.newGym.latitude = this.markerPosition.lat;
      this.newGym.longitude = this.markerPosition.lng;
    }
  }

}
