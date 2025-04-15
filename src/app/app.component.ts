import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { TopNavComponent } from "./shared/components/top-nav/top-nav.component";

@Component({
  selector: 'app-root',
  imports: [RouterModule, CommonModule, TopNavComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'GymCommunity';
}
