import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { GymComponent } from '../../Gym/gym/gym.component';
import { GymManagementComponent } from './gym-management.component';
import { UpdateGymComponent } from './update-gym/update-gym.component';

@NgModule({
  declarations: [], // Empty because we're using standalone components
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    GymManagementComponent,
    UpdateGymComponent,
    GymComponent,
  ],
  exports: [GymManagementComponent, UpdateGymComponent],
})
export class GymManagementModule {}
