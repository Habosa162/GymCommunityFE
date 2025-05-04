import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GymReadDTO } from '../../../services/Admin/gym-management.service';

declare var bootstrap: any;

@Component({
  selector: 'app-gym',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div
      id="gym-carousel-{{ gym.id }}"
      class="carousel slide"
      data-bs-ride="carousel"
    >
      <div class="carousel-inner">
        <div
          *ngIf="!gym.images || gym.images.length === 0"
          class="carousel-item active"
        >
          <div class="card-img-container">
            <img
              src="/assets/images/gym-placeholder.jpg"
              class="card-img-top"
              alt="{{ gym.name }}"
            />
          </div>
        </div>
        <ng-container *ngIf="gym.images && gym.images.length > 0">
          <div
            *ngFor="let image of gym.images; let i = index"
            class="carousel-item"
            [class.active]="i === 0"
          >
            <div class="card-img-container">
              <img
                [src]="image.imageUrl"
                class="card-img-top"
                alt="{{ gym.name }} image {{ i + 1 }}"
              />
            </div>
          </div>
        </ng-container>
      </div>
      <button
        *ngIf="gym.images && gym.images.length > 1"
        class="carousel-control-prev"
        type="button"
        [attr.data-bs-target]="'#gym-carousel-' + gym.id"
        data-bs-slide="prev"
      >
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button
        *ngIf="gym.images && gym.images.length > 1"
        class="carousel-control-next"
        type="button"
        [attr.data-bs-target]="'#gym-carousel-' + gym.id"
        data-bs-slide="next"
      >
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
      <div
        *ngIf="gym.images && gym.images.length > 1"
        class="carousel-indicators"
      >
        <button
          *ngFor="let image of gym.images; let i = index"
          type="button"
          [attr.data-bs-target]="'#gym-carousel-' + gym.id"
          [attr.data-bs-slide-to]="i"
          [class.active]="i === 0"
          [attr.aria-current]="i === 0 ? 'true' : null"
          [attr.aria-label]="'Slide ' + (i + 1)"
        ></button>
      </div>
    </div>
    <div class="card-body">
      <h5 class="card-title">{{ gym.name }}</h5>
      <p class="card-text">
        <i class="bi bi-geo-alt me-2"></i>{{ gym.location }}
      </p>
      <p
        *ngIf="gym.images && gym.images.length > 0"
        class="image-count text-muted"
      >
        <i class="bi bi-images me-1"></i> {{ gym.images.length }} image{{
          gym.images.length > 1 ? 's' : ''
        }}
      </p>
    </div>
  `,
  styles: [
    `
      .card-img-container {
        height: 200px;
        overflow: hidden;
      }
      .card-img-top {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .card-title {
        font-weight: bold;
        margin-bottom: 0.5rem;
      }
      .card-text {
        color: #6c757d;
      }
      .carousel-control-prev,
      .carousel-control-next {
        background-color: rgba(0, 0, 0, 0.3);
        width: 30px;
        height: 30px;
        top: 50%;
        transform: translateY(-50%);
        border-radius: 50%;
        opacity: 0.7;
      }
      .carousel-control-prev {
        left: 10px;
      }
      .carousel-control-next {
        right: 10px;
      }
      .carousel-control-prev-icon,
      .carousel-control-next-icon {
        width: 20px;
        height: 20px;
      }
      .carousel-indicators {
        margin-bottom: 0;
        position: absolute;
        bottom: 5px;
      }
      .carousel-indicators button {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: #fff;
        opacity: 0.5;
        margin: 0 3px;
      }
      .carousel-indicators button.active {
        opacity: 1;
      }
      .image-count {
        font-size: 0.8rem;
        margin-top: -5px;
      }
    `,
  ],
})
export class GymComponent implements AfterViewInit {
  @Input() gym!: GymReadDTO;

  ngAfterViewInit() {
    // Initialize carousel after view is initialized
    setTimeout(() => {
      const carouselElement = document.getElementById(
        `gym-carousel-${this.gym.id}`
      );
      if (carouselElement && this.gym.images && this.gym.images.length > 0) {
        new bootstrap.Carousel(carouselElement, {
          interval: 5000,
          wrap: true,
        });
      }
    }, 100);
  }
}
