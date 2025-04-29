import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SideBarComponent } from '../../../presentation/admin/side-bar/side-bar.component';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterModule,SideBarComponent],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent {

}
