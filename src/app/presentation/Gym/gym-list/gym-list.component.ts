import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GymReadDTO } from '../../../domain/models/Gym/gym.model';
import { GymService } from '../../../services/Gym/gym.service';
import { GeolocationService } from '../../../services/Gym/geolocation.service';
import { CommonModule } from '@angular/common';
import { GymImgService } from '../../../services/Gym/gym-img.service';
import { GymImgReadDTO } from '../../../domain/models/Gym/gym-img.model';

@Component({
  selector: 'app-gym-list',
  imports: [CommonModule],
  templateUrl: './gym-list.component.html',
  styleUrl: './gym-list.component.css'
})
export class GymListComponent implements OnInit {
  gyms: GymReadDTO[] = [];
  nearbyGyms: GymReadDTO[] = [];
  userLocation: { lat: number, lng: number } | null = null;
  showNearbyOnly = false;

  gymImages: { [key: number]: string } =[];

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
    this.gymService.getAllGyms().subscribe({
      next: (gyms) =>{this.gyms = gyms;
        gyms.forEach(gym => {
          this.gymImgService.getByGymId(gym.id).subscribe({
            next: (images: GymImgReadDTO[]) => {
              if (images.length > 0) {
                this.gymImages[gym.id] = images[0].imageUrl;
              } else {
                console.warn(`No images found for gym with ID ${gym.id}`);
              }
            },
            error: (err) => console.error('Failed to load gym image', err)
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
      4 
    ).subscribe({
      next: (gyms) => {
        this.nearbyGyms = gyms;
        this.showNearbyOnly = true;
      },
      error: (err) => console.error('Failed to load nearby gyms', err)
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
  


}
