import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GymReadDTO } from '../../../domain/models/Gym/gym.model';
import { GymService } from '../../../services/Gym/gym.service';
import { GeolocationService } from '../../../services/Gym/geolocation.service';
import { CommonModule } from '@angular/common';
import { GymImgService } from '../../../services/Gym/gym-img.service';
import { GymImgReadDTO } from '../../../domain/models/Gym/gym-img.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-gym-list',
  imports: [CommonModule,FormsModule],
  templateUrl: './gym-list.component.html',
  styleUrl: './gym-list.component.css'
})
export class GymListComponent implements OnInit {
  gyms: GymReadDTO[] = [];
  nearbyGyms: GymReadDTO[] = [];
  userLocation: { lat: number, lng: number } | null = null;
  showNearbyOnly = false;

  gymImages: { [key: number]: string } =[];

  searchQuery: string = '';
  selectedAmenities: string[] = [];
  sortOption: string = 'distance';
  isLoading: boolean = false;
  amenitiesList: string[] = [
    'Parking', 'Pool', 'Sauna', '24/7', 
    'Yoga', 'Personal Trainer', 'Locker Room'
  ];

  constructor(
    private gymService: GymService,
    private router: Router,
    private geolocationService: GeolocationService,
    private gymImgService: GymImgService
  ) {}

  ngOnInit(): void {
    this.loadAllGyms();
    this.getUserLocation();
  }

  loadAllGyms(): void {
    this.isLoading = true;
    this.gymService.getAllGyms().subscribe({
      next: (gyms) =>{
        this.gyms = gyms;
        this.isLoading = false;
        gyms.forEach(gym => {
          gym.isOpen24h = true;
          gym.isPopular = true;
          gym.amenities = ['Parking', 'Pool', 'Sauna', '24/7', 
    'Yoga', 'Personal Trainer', 'Locker Room'];
          this.gymImgService.getByGymId(gym.id).subscribe({
            next: (images: GymImgReadDTO[]) => {
              if (images.length > 0) {
                this.gymImages[gym.id] = images[0].imageUrl;
              } else {
                console.warn(`No images found for gym with ID ${gym.id}`);
              }
            },
            error: (err) => {
              console.error('Failed to load gym image', err);
              this.isLoading = false;
            }
          });
        });
      } ,
      error: (err) => console.error('Failed to load gyms', err)

    });
  }

  getUserLocation(): void {
    this.geolocationService.getCurrentPosition().then((position: { coords: { latitude: any; longitude: any; }; }) => {
      this.userLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
    }).catch((err: any) => {
      console.error('Error getting location', err);
    });
  }

  loadNearbyGyms(): void {
    if (!this.userLocation) return;
    
    this.gymService.getNearbyGyms(
      this.userLocation.lat,
      this.userLocation.lng,
      10 
    ).subscribe({
      next: (gyms) => {
        gyms.forEach(gym => {
          gym.isOpen24h = true;
          gym.isPopular = true;
          gym.amenities = ['Parking', 'Pool', 'Sauna', '24/7', 
    'Yoga', 'Personal Trainer', 'Locker Room']
  },
        this.nearbyGyms = gyms)
        this.showNearbyOnly = true;
      },
      error: (err: any) => console.error(`Failed to load nearby gyms: ${err.message || err}`)
    });
  }

  showAllGyms(): void {
    this.showNearbyOnly = false;
  }

  viewGymDetails(gymId: number): void {
    this.router.navigate(['/gyms', gymId]);
  }

  getDistance(gymLat: number, gymLng: number): number {
    if (!this.userLocation) return 0;
    
    return this.geolocationService.calculateDistance(
      this.userLocation.lat,
      this.userLocation.lng,
      gymLat,
      gymLng
    );
  }

  filterGyms(): GymReadDTO[] {
    let filtered = this.showNearbyOnly ? this.nearbyGyms : this.gyms;
    
    // Search by name or location
    if (this.searchQuery) {
      filtered = filtered.filter(gym => 
        gym.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        gym.location.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
    

    
    // Sort results
    switch (this.sortOption) {
      case 'distance':
        if (this.userLocation) {
          filtered.sort((a, b) => 
            this.getDistance(a.latitude, a.longitude) - 
            this.getDistance(b.latitude, b.longitude)
          );
        }
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }
    
    return filtered;
  }

  
  showAmenities:boolean =false;
// Add these to your component class
getAmenityIcon(amenity: string): string {
  const icons: {[key: string]: string} = {
    'Parking': 'bi-p-circle',
    'Pool': 'bi-droplet',
    'Sauna': 'bi-thermometer-sun',
    '24/7': 'bi-clock',
    'Yoga': 'bi-flower1',
    'Personal Trainer': 'bi-person-badge',
    'Locker Room': 'bi-lock'
  };
  return icons[amenity] || 'bi-check';
}

toggleAmenity(amenity: string): void {
  if (this.selectedAmenities.includes(amenity)) {
    this.selectedAmenities = this.selectedAmenities.filter(a => a !== amenity);
  } else {
    this.selectedAmenities = [...this.selectedAmenities, amenity];
  }
}
}
