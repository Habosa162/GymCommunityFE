import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GymReadDTO, GymCreateDTO } from '../../../domain/models/Gym/gym.model';
import { GymService } from '../../../services/Gym/gym.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';

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
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadGyms();
    this.loadGoogleMapsScript();
  }

  loadGyms(): void {
    const ownerId = 'fd6a3800-35d3-4d8b-8595-2e82a4adf6d8'; // Replace with actual owner ID 
    this.gymService.getByOwnerId(ownerId).subscribe({
      next: (gyms) => this.gyms = gyms,
      error: (err) => console.error('Failed to load gyms', err)
    });
  }
  loadGoogleMapsScript(): void {
    if (typeof google === 'undefined') {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBRdLpkTJ_S1yEvLAKhbAnmcq66XtO8-xQ&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => this.initializeMap();
      document.head.appendChild(script);
    } else {
      this.initializeMap();
    }
  }
  initializeMap(): void {
    this.mapInitialized = true;
  }

  toggleAddGymForm(): void {
    this.showAddGymForm = !this.showAddGymForm;
    if (this.showAddGymForm) {
      setTimeout(() => this.initAutocomplete(), 100);
    }
  }
  initAutocomplete(): void {
    const locationInput = document.getElementById('location') as HTMLInputElement;
    const autocomplete = new google.maps.places.Autocomplete(locationInput, {
      types: ['establishment', 'geocode']
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (!place.geometry || !place.geometry.location) {
        return;
      }

      this.newGym.location = place.formatted_address || '';
      this.newGym.latitude = place.geometry.location.lat();
      this.newGym.longitude = place.geometry.location.lng();
      
      // Update map marker
      this.markerPosition = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
      };
      
      // Center map on selected location
      this.mapOptions = {
        ...this.mapOptions,
        center: this.markerPosition
      };
    });
  }
  handleMapClick(event: google.maps.MapMouseEvent): void {
    if (event.latLng) {
      this.markerPosition = event.latLng.toJSON();
      this.newGym.latitude = this.markerPosition.lat;
      this.newGym.longitude = this.markerPosition.lng;
      
      // Reverse geocode to get address
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: this.markerPosition }, (results, status) => {
        if (status === 'OK' && results?.[0]) {
          this.newGym.location = results[0].formatted_address;
        }
      });
    }
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

}
