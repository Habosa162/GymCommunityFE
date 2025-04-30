import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TextSliderComponent } from '../../../shared/components/text-slider/text-slider/text-slider.component';

@Component({
  selector: 'app-home',
  imports: [TextSliderComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  standalone: true,
})
export class HomeComponent {}
