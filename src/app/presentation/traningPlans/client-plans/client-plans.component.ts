import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { trainingPlan } from '../../../domain/models/TraingingPlansModels/training-plan-model';
import { WeekPlanDto } from '../../../services/Training Plans/dtos/weekly-plan-dto';
import { TrainingPlansService } from '../../../services/Training Plans/training-plan.service';

interface Week {
  weekNumber: number;
  startDate: Date;
  endDate: Date;
  hasWeekPlan: boolean;
  weekPlanId?: string;
  dailyPlans?: { [key: string]: any };
}

@Component({
  selector: 'app-client-plans',
  imports: [CommonModule],
  templateUrl: './client-plans.component.html',
  styleUrls: ['./client-plans.component.css'],
})
export class ClientPlansComponent implements OnInit {
  trainingPlan!: trainingPlan & { weekPlans?: WeekPlanDto[] };
  months: number[] = [];
  weeks: Week[] = [];
  selectedMonth: number = 1;
  showDayPlanModal: boolean = false;
  selectedDayPlan: any = null;
  selectedWeek: Week | null = null;

  constructor(
    private trainingPlanService: TrainingPlansService,
    private router: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const planId = this.router.snapshot.params['id'];
    console.log('Training Plan ID:', planId);
    this.getTrainingPlanById(planId);
  }

  getTrainingPlanById(planId: string | number): void {
    const id = planId.toString();

    this.trainingPlanService.getTrainingPlanById(Number(id)).subscribe({
      next: (response) => {
        this.trainingPlan = response;
        this.initializeWeeks();

        if (
          this.trainingPlan.weekPlans &&
          this.trainingPlan.weekPlans.length > 0
        ) {
          this.mapWeekPlansToWeeks(this.trainingPlan.weekPlans);
        }
      },
      error: (error) => {
        console.error('Error fetching training plan:', error);
      },
    });
  }

  initializeWeeks(): void {
    if (!this.trainingPlan || !this.trainingPlan.startDate) return;

    this.weeks = [];
    const startDate = new Date(this.trainingPlan.startDate);
    startDate.setHours(0, 0, 0, 0);

    for (let i = 1; i <= 12; i++) {
      const weekStartDate = new Date(startDate);
      weekStartDate.setDate(weekStartDate.getDate() + (i - 1) * 7);

      const weekEndDate = new Date(weekStartDate);
      weekEndDate.setDate(weekEndDate.getDate() + 6);

      this.weeks.push({
        weekNumber: i,
        startDate: weekStartDate,
        endDate: weekEndDate,
        hasWeekPlan: false,
        dailyPlans: {},
      });

      const month = weekStartDate.getMonth() + 1;
      if (!this.months.includes(month)) {
        this.months.push(month);
      }
    }

    const currentMonth = new Date().getMonth() + 1;
    if (this.months.includes(currentMonth)) {
      this.selectedMonth = currentMonth;
    } else if (this.months.length > 0) {
      this.selectedMonth = this.months[0];
    }
  }

  formatDate(date: Date): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  getDayOfWeekNumber(date: Date): number {
    const jsDay = date.getDay();
    return jsDay === 0 ? 7 : jsDay;
  }

  mapWeekPlansToWeeks(weekPlans: WeekPlanDto[]): void {
    this.weeks.forEach((week) => {
      week.hasWeekPlan = false;
      week.weekPlanId = undefined;
      week.dailyPlans = {};
    });

    for (const weekPlan of weekPlans) {
      let matched = false;
      let weekNumber: number | null = null;

      if (weekPlan.title) {
        const titleMatch = weekPlan.title.match(/Week\s+(\d+)/i);
        if (titleMatch && titleMatch[1]) {
          weekNumber = parseInt(titleMatch[1], 10);
          const week = this.weeks.find((w) => w.weekNumber === weekNumber);
          if (week) {
            week.hasWeekPlan = true;
            week.weekPlanId = weekPlan.id ? weekPlan.id.toString() : '';
            if (!week.dailyPlans) {
              week.dailyPlans = {};
            }
            matched = true;
          }
        }
      }

      if (!matched && (weekPlan as any).startDate) {
        const weekPlanDate = new Date((weekPlan as any).startDate);
        const matchingWeek = this.weeks.find((week) => {
          return this.isDateInRange(weekPlanDate, week.startDate, week.endDate);
        });

        if (matchingWeek) {
          matchingWeek.hasWeekPlan = true;
          matchingWeek.weekPlanId = weekPlan.id ? weekPlan.id.toString() : '';
          if (!matchingWeek.dailyPlans) {
            matchingWeek.dailyPlans = {};
          }
          this.mapWorkoutDaysToDailyPlans(matchingWeek, weekPlan);
          matched = true;
        }
      }
    }
  }

  mapWorkoutDaysToDailyPlans(week: Week, weekPlan: WeekPlanDto): void {
    if (!week.dailyPlans) {
      week.dailyPlans = {};
    }

    if (
      weekPlan &&
      (weekPlan as any).workoutDays &&
      Array.isArray((weekPlan as any).workoutDays)
    ) {
      (weekPlan as any).workoutDays.forEach((workoutDay: any) => {
        if (workoutDay && workoutDay.dayDate) {
          try {
            const dayDate = new Date(workoutDay.dayDate);
            if (this.isDateInRange(dayDate, week.startDate, week.endDate)) {
              const dayOfWeek = this.getDayOfWeekNumber(dayDate);
              if (week.dailyPlans) {
                week.dailyPlans[dayOfWeek.toString()] = {
                  ...workoutDay,
                  dayNumber: dayOfWeek,
                  dayDate: dayDate,
                  exercise:
                    workoutDay.exercise ||
                    workoutDay.exerciseName ||
                    'Training',
                };
              }
            }
          } catch (error) {
            console.error(
              `Error parsing workout day date: ${workoutDay.dayDate}`,
              error
            );
          }
        }
      });
    }
  }

  isDateInRange(date: Date, start: Date, end: Date): boolean {
    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);

    const normalizedStart = new Date(start);
    normalizedStart.setHours(0, 0, 0, 0);

    const normalizedEnd = new Date(end);
    normalizedEnd.setHours(0, 0, 0, 0);

    return normalizedDate >= normalizedStart && normalizedDate <= normalizedEnd;
  }

  selectMonth(month: number): void {
    this.selectedMonth = month;
  }

  getWeeksForSelectedMonth(): Week[] {
    return this.weeks.filter((week) => {
      const weekMonth = week.startDate.getMonth() + 1;
      return weekMonth === this.selectedMonth;
    });
  }

  hasDayPlan(week: Week, dayNumber: number): boolean {
    return !!week.dailyPlans && !!week.dailyPlans[dayNumber.toString()];
  }

  getDayPlan(week: Week, dayNumber: number) {
    if (!week.hasWeekPlan || !week.dailyPlans) return null;

    const plan = week.dailyPlans[dayNumber.toString()];

    if (plan && plan.dailyPlanJson) {
      try {
        plan.parsedData = JSON.parse(plan.dailyPlanJson);
      } catch (e) {
        console.error('Error parsing daily plan JSON:', e);
      }
    }

    return plan;
  }

  viewDayPlan(week: Week, dayNumber: number): void {
    const plan = this.getDayPlan(week, dayNumber);
    if (plan) {
      this.selectedDayPlan = plan;
      this.selectedWeek = week;
      this.showDayPlanModal = true;
    }
  }

  closeDayPlanModal(): void {
    this.showDayPlanModal = false;
    this.selectedDayPlan = null;
    this.selectedWeek = null;
  }
}
