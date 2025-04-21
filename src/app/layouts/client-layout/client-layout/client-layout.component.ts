import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../core/shared/components/navbar/navbar.component';

@Component({
  selector: 'app-client-layout',
  imports: [RouterModule, NavbarComponent],
  templateUrl: './client-layout.component.html',
  styleUrl: './client-layout.component.css'
})
export class ClientLayoutComponent {

}
