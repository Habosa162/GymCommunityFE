import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TextSliderComponent } from '../../../shared/components/text-slider/text-slider/text-slider.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [TextSliderComponent, CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  standalone: true,
})
export class HomeComponent {}
