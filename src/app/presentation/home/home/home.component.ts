import { Component } from '@angular/core';
import { TextSliderComponent } from '../../../shared/components/text-slider/text-slider/text-slider.component';

@Component({
  selector: 'app-home',
  imports: [TextSliderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {}
