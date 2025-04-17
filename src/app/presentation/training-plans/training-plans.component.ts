import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CreateDailyPlanDto } from '../../services/Training Plans/dtos/create-daily-plan.dto';
import { DailyPlanDto } from '../../services/Training Plans/dtos/daily-plan-dto';
import { WeekPlanDto } from '../../services/Training Plans/dtos/weekly-plan-dto';
import { TrainingPlansService } from '../../services/Training Plans/training-plan.service';

interface DailyPlanData {
  activity: string;
  trainer: string;
  type: string;
  day: string;
  timeSlot: string;
}

interface NewPlan {
  activity: string;
  trainer: string;
  type: string;
  date: string;
}

@Component({
  selector: 'app-training-plans',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './training-plans.component.html',
  styleUrl: './training-plans.component.css',
})
export class TrainingPlansComponent implements OnInit {
  dailyPlans: DailyPlanDto[] = [];
  filterType: string = 'all';
  timeSlots = [{ time: 'Week 1 (Cardio Week)', id: 'week1' }];
  weekNames = [
    'Cardio Week',
    'Strength Week',
    'Flexibility Week',
    'Endurance Week',
    'Recovery Week',
    'HIIT Week',
    'Balance Week',
    'Core Week',
  ];
  showAddPlanPopup: boolean = false;
  selectedTimeSlot: string = '';
  selectedDay: string = '';
  newPlan: NewPlan = {
    activity: '',
    trainer: '',
    type: 'fitness',
    date: new Date().toISOString().split('T')[0],
  };
  currentWeekNumber: number = 1;
  newWeekName: string = '';

  constructor(private trainingPlanService: TrainingPlansService) {}

  ngOnInit(): void {
    this.loadDailyPlans();
  }

  loadDailyPlans(): void {
    this.trainingPlanService
      .getDailyPlansByWeekPlan(this.currentWeekNumber)
      .subscribe({
        next: (plans) => {
          this.dailyPlans = plans;
        },
        error: (error) => {
          console.error('Error loading daily plans:', error);
        },
      });
  }

  setFilter(type: string): void {
    this.filterType = type;
  }

  getFilteredPlans(timeSlot: string, day: string): DailyPlanDto[] {
    return this.dailyPlans.filter((plan: DailyPlanDto) => {
      const planData = this.getPlanData(plan);
      const matchesTime = planData.timeSlot === timeSlot;
      const matchesDay = planData.day === day;
      const matchesFilter =
        this.filterType === 'all' || planData.type === this.filterType;
      return matchesTime && matchesDay && matchesFilter;
    });
  }

  getPlanData(plan: DailyPlanDto): DailyPlanData {
    return JSON.parse(plan.dailyPlanJson);
  }

  getPlanType(plan: DailyPlanDto): string {
    return this.getPlanData(plan).type;
  }

  getPlanActivity(plan: DailyPlanDto): string {
    return this.getPlanData(plan).activity;
  }

  getPlanTrainer(plan: DailyPlanDto): string {
    return this.getPlanData(plan).trainer;
  }

  addDailyPlan(timeSlot: string, day: string): void {
    const planData = {
      activity: 'New Activity',
      trainer: 'Trainer Name',
      type: 'fitness',
      day: day,
      timeSlot: timeSlot,
    };

    const mockWeekPlan: WeekPlanDto = {
      id: 1,
      title: 'Week 1',
      trainingPlanId: 1,
      coachId: '1',
    };

    const newPlan: CreateDailyPlanDto = {
      weekPlanId: 1,
      weekPlan: mockWeekPlan,
      dayDate: new Date().toISOString().split('T')[0],
      dayNumber: this.getDayNumber(day),
      dailyPlanJson: JSON.stringify(planData),
    };

    // In a real application, you would call the service here
    // this.trainingPlanService.createDailyPlan(newPlan).subscribe(...)
  }

  deleteDailyPlan(plan: DailyPlanDto): void {
    // In a real application, you would call the service here
    // this.trainingPlanService.deleteDailyPlan(plan.id).subscribe(...)
    this.dailyPlans = this.dailyPlans.filter((p) => p.id !== plan.id);
  }

  private getDayNumber(day: string): number {
    const days = [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ];
    return days.indexOf(day) + 1;
  }

  openAddPlanModal(timeSlotId: string, day: string): void {
    this.selectedTimeSlot = timeSlotId;
    this.selectedDay = day;
    this.showAddPlanPopup = true;
  }

  closeAddPlanPopup(): void {
    this.showAddPlanPopup = false;
    this.newPlan = {
      activity: '',
      trainer: '',
      type: 'fitness',
      date: new Date().toISOString().split('T')[0],
    };
  }

  submitDailyPlan(): void {
    const planData = {
      activity: this.newPlan.activity,
      trainer: this.newPlan.trainer,
      type: this.newPlan.type,
      day: this.selectedDay,
      timeSlot: this.selectedTimeSlot,
      date: this.newPlan.date,
    };

    const newPlan: DailyPlanDto = {
      id: this.dailyPlans.length + 1,
      weekPlanId: 1,
      weekPlan: {
        id: 1,
        title: 'Week 1',
        trainingPlanId: 1,
        coachId: '1',
      },
      dayDate: this.newPlan.date,
      dayNumber: this.getDayNumber(this.selectedDay),
      dailyPlanJson: JSON.stringify(planData),
    };

    // Add to local array
    this.dailyPlans.push(newPlan);
    this.closeAddPlanPopup();
  }

  addNewTimeSlot(): void {
    this.currentWeekNumber++;
    const weekName =
      this.newWeekName.trim() || `Week ${this.currentWeekNumber}`;
    const newWeekSlot = {
      time: `Week ${this.currentWeekNumber} (${weekName})`,
      id: `week${this.currentWeekNumber}`,
    };

    this.timeSlots.push(newWeekSlot);
    this.newWeekName = ''; // Clear the input after adding
  }
}
