import { Component, OnInit } from '@angular/core';
import { UsersChartComponent } from '../users-chart/users-chart.component';
import { AdminService } from '../../../services/Admin/admin.service';
import { ToastrService } from 'ngx-toastr';  // Assuming you use Toastr for notifications
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users-management',
  imports: [UsersChartComponent,FormsModule,CommonModule],
  templateUrl: './users-management.component.html',
  styleUrls: ['./users-management.component.css']
})
export class UsersManagementComponent implements OnInit {
  isLoading = true ;
  role: string = 'Client';
  query: string = '';
  isActive: boolean = true;
  isPremium: any = false;
  gender: string = 'all';
  pageNumber: number = 1;
  pageSize: number = 10;
  activeUsersCount: number = 0;
  premiumUsersCount: number = 0;

  systemUsers: any[] = [];
  totalUsers: number = 0;

  constructor(
    private adminService: AdminService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.loadSystemUsers();
  }

  loadSystemUsers() {
    this.adminService.getAllUsers(
      this.pageNumber,
      this.pageSize,
      this.role,
      this.query,
      this.isActive,
      this.isPremium,
      this.gender
    ).subscribe(
      (res) => {
        // console.log(res) ;
        this.systemUsers = res.items;
        this.totalUsers = res.totalCount;
        this.isLoading = false;
        this.toastr.success("Users Loaded Successfully","Success") ;
        // this.updateCounts();
      },
      (err) => {
        console.error('Error loading users:', err);
        this.toastr.error('Failed to load users, please try again later.', 'Error');
      }
    );
  }
  onImgError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = 'assets/imgs/OIP.jpeg';
  }

  onPageChange(newPage: number) {
    this.pageNumber = newPage;
    this.loadSystemUsers();
  }
  get totalPages(): number {
    return Math.ceil(this.totalUsers / this.pageSize);
  }
  // updateCounts() {
  //   this.activeUsersCount = this.systemUsers.filter(u => u.isActive).length;
  //   this.premiumUsersCount = this.systemUsers.filter(u => u.isPremium).length;
  // }

  //to Chnage Later
  editUser(user:any){
    console.log(user);
  }
  toggleUserStatus(user: any): void {
    // const newStatus = !user.isActive;
    // const confirmationMessage = `Are you sure you want to ${newStatus ? 'activate' : 'deactivate'} ${user.firstName} ${user.lastName}?`;

    // if (confirm(confirmationMessage)) {
    //   this.adminService.updateUserStatus(user.id, newStatus).subscribe({
    //     next: () => {
    //       user.isActive = newStatus;
    //       this.toastr.success(`User ${newStatus ? 'activated' : 'deactivated'} successfully`);
    //       this.updateCounts(); // Update the active users count
    //     },
    //     error: (error) => {
    //       console.error('Error updating user status:', error);
    //       this.toastr.error(`Failed to ${newStatus ? 'activate' : 'deactivate'} user`);
    //     }
    //   });
    // }
  }
}
