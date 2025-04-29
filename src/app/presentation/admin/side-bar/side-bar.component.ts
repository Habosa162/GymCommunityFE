import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
  // Removed 'imports' as it is not valid in the @Component decorator
@Component({
  selector: 'app-side-bar',
  imports: [MatSidenavModule,MatToolbarModule,MatIconModule,MatListModule,MatButtonModule,RouterModule],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css'
})
export class SideBarComponent {

}
