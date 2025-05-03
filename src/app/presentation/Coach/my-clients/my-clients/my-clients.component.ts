import { Component, OnInit } from '@angular/core';
import { CoachCleintsService } from '../../../../services/Coachservice/coacclients.service';
import { CoachClientsDTO } from '../../../../domain/models/CoachModels/coachclient.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-my-clients',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './my-clients.component.html',
  styleUrl: './my-clients.component.css',
})
export class MyClientsComponent implements OnInit {
  clients: CoachClientsDTO[] = [];
  filteredClients: CoachClientsDTO[] = [];

  // Pagination properties
  currentPage: number = 1;
  pageSize: number = 9;
  totalPages: number = 0;
  totalCount: number = 0;

  // Filter properties
  searchTerm: string = '';
  isMaleChecked: boolean = false;
  isFemaleChecked: boolean = false;
  minAge: number = 18;
  maxAge: number = 60;

  constructor(private coachClientsService: CoachCleintsService) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.coachClientsService
      .getClientsByCoachId(this.currentPage, this.pageSize)
      .subscribe({
        next: (response: any) => {
          this.clients = response.data;
          this.filteredClients = [...this.clients];
          this.currentPage = response.currentPage;
          this.totalPages = response.totalPages;
          this.totalCount = response.totalCount;
          console.log('Loaded clients:', response);
        },
        error: (error) => {
          console.error('Error loading clients:', error);
        },
      });
  }

  // Calculate age from birth date
  calculateAge(birthDate: string | Date | undefined): number {
    if (!birthDate) return 0;

    const today = new Date();
    const birth = birthDate instanceof Date ? birthDate : new Date(birthDate);

    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age;
  }

  // Filter clients by search term, gender, and age
  applyFilters(): void {
    this.filteredClients = this.clients.filter((client) => {
      // Filter by name
      const nameMatch =
        !this.searchTerm ||
        `${client.client?.firstName} ${client.client?.lastName}`
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase());

      // Filter by gender
      const genderMatch =
        (!this.isMaleChecked && !this.isFemaleChecked) || // No gender filter applied
        (this.isMaleChecked && client.client?.gender === 'm') ||
        (this.isFemaleChecked && client.client?.gender === 'f');

      // Filter by age
      const age = this.calculateAge(client.client?.birthDate);
      const ageMatch = age >= this.minAge && age <= this.maxAge;

      return nameMatch && genderMatch && ageMatch;
    });
  }

  // Reset all filters
  resetFilters(): void {
    this.searchTerm = '';
    this.isMaleChecked = false;
    this.isFemaleChecked = false;
    this.minAge = 18;
    this.maxAge = 60;
    this.filteredClients = [...this.clients];
  }

  // Sort clients by different criteria
  sortClients(criteria: string): void {
    switch (criteria) {
      case 'name':
        this.filteredClients.sort((a, b) =>
          `${a.client?.firstName} ${a.client?.lastName}`.localeCompare(
            `${b.client?.firstName} ${b.client?.lastName}`
          )
        );
        break;
      case 'age':
        this.filteredClients.sort(
          (a, b) =>
            this.calculateAge(a.client?.birthDate) -
            this.calculateAge(b.client?.birthDate)
        );
        break;
    }
  }

  // Pagination methods
  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadClients();
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadClients();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadClients();
    }
  }
}
