import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
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

interface Day {
  dayNumber: number;
  dayDate: Date;
}

interface Exercise {
  muscleGroup: string;
  exerciseName: string;
  sets: number;
  reps: number;
  duration: number;
  exerciseId?: number;
}

interface Meal {
  mealType: string;
  mealName: string;
  quantity: string;
  isSupplement: boolean;
  notes: string;
}

@Component({
  selector: 'app-client-plans',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './client-plans.component.html',
  styleUrl: './client-plans.component.css',
})
export class ClientPlansComponent implements OnInit {
  trainingPlan!: trainingPlan & { weekPlans?: WeekPlanDto[]; coach?: any };
  months: number[] = [];
  weeks: Week[] = [];
  selectedMonth: number = 1;
  hoveredDay: { weekNumber: number | null; dayNumber: number | null } = {
    weekNumber: null,
    dayNumber: null,
  };

  // Day names for reference
  dayNames = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  // View detailed plan modal
  showDayDetailsModal = false;
  selectedDayPlan: any = null;
  selectedDayOfWeek: string = '';

  constructor(
    private trainingPlanService: TrainingPlansService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const planId = this.route.snapshot.params['id'];
    console.log('Client Training Plan ID:', planId);
    this.getTrainingPlanById(planId);
  }

  getTrainingPlanById(planId: string | number): void {
    // Convert planId to string if it's a number
    const id = planId.toString();

    this.trainingPlanService.getTrainingPlanById(Number(id)).subscribe({
      next: (response) => {
        console.log('Training plan response:', response);
        this.trainingPlan = response;
        this.generateMonths(); // Generate months based on durationMonths
        this.initializeWeeks();

        // If the plan has week plans, map them to our weeks
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

  generateMonths(): void {
    if (this.trainingPlan && this.trainingPlan.durationMonths) {
      this.months = Array.from(
        { length: this.trainingPlan.durationMonths },
        (_, i) => i + 1
      );
      console.log(
        `Generated ${this.months.length} months for the training plan`
      );
    }
  }

  initializeWeeks(): void {
    if (!this.trainingPlan || !this.trainingPlan.startDate) return;

    this.weeks = [];
    const startDate = new Date(this.trainingPlan.startDate);

    // Set to the beginning of the day
    startDate.setHours(0, 0, 0, 0);

    console.log('Training plan start date:', startDate);

    // Calculate total number of weeks based on duration months (30 days per month)
    const daysPerMonth = 30;
    const totalDays = this.trainingPlan.durationMonths * daysPerMonth;
    const totalWeeks = Math.ceil(totalDays / 7);

    // Create weeks for the training plan
    for (let i = 1; i <= totalWeeks; i++) {
      const weekStartDate = new Date(startDate);

      // Add (i-1) weeks to the start date to get this week's start date
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
    }

    // Default to first month
    if (this.months.length > 0) {
      this.selectedMonth = this.months[0];
    }

    console.log('Weeks initialized:', this.weeks);
  }

  formatDate(date: Date): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  // Get the day of the week number (1-7, where 1 is Monday) from a date
  getDayOfWeekNumber(date: Date): number {
    // Convert from JS day (0-6, where 0 is Sunday) to our day (1-7, where 1 is Monday)
    const jsDay = date.getDay(); // 0-6, where 0 is Sunday
    return jsDay === 0 ? 7 : jsDay; // Convert Sunday (0) to 7, keep others as is
  }

  mapWeekPlansToWeeks(weekPlans: WeekPlanDto[]): void {
    console.log('Starting to map week plans to the table:', weekPlans);

    // First, reset all weeks to not have plans
    this.weeks.forEach((week) => {
      week.hasWeekPlan = false;
      week.weekPlanId = undefined;
      week.dailyPlans = {};
    });

    // Try to map week plans by week number or title
    for (const weekPlan of weekPlans) {
      // Extract week number from title if possible
      let matched = false;
      let weekNumber: number | null = null;

      if (weekPlan.title) {
        // Check if title contains a week number
        const titleMatch = weekPlan.title.match(/Week\s+(\d+)/i);
        if (titleMatch && titleMatch[1]) {
          weekNumber = parseInt(titleMatch[1], 10);
          console.log(
            `Extracted week number ${weekNumber} from title: ${weekPlan.title}`
          );

          // Find the week with this number
          const week = this.weeks.find((w) => w.weekNumber === weekNumber);
          if (week) {
            console.log(
              `Successfully mapped week plan to week ${weekNumber} by title`
            );
            week.hasWeekPlan = true;
            week.weekPlanId = weekPlan.id ? weekPlan.id.toString() : ''; // Convert to string with null check

            // Initialize daily plans object if not already done
            if (!week.dailyPlans) {
              week.dailyPlans = {};
            }
            matched = true;
          }
        }
      }

      // Method 2: If still not found, try to find by date
      if (!matched && (weekPlan as any).startDate) {
        const weekPlanDate = new Date((weekPlan as any).startDate);
        console.log(`Trying to map by date: ${this.formatDate(weekPlanDate)}`);

        // Find the week that contains this date
        const matchingWeek = this.weeks.find((week) => {
          return this.isDateInRange(weekPlanDate, week.startDate, week.endDate);
        });

        if (matchingWeek) {
          console.log(
            `Successfully mapped week plan to week ${matchingWeek.weekNumber} by date range`
          );
          matchingWeek.hasWeekPlan = true;
          matchingWeek.weekPlanId = weekPlan.id ? weekPlan.id.toString() : ''; // Convert to string with null check

          // Initialize daily plans object if not already done
          if (!matchingWeek.dailyPlans) {
            matchingWeek.dailyPlans = {};
          }

          // Map the workout days to daily plans
          this.mapWorkoutDaysToDailyPlans(matchingWeek, weekPlan);

          matched = true;
        } else {
          console.warn(
            `No week found containing date: ${this.formatDate(weekPlanDate)}`
          );
        }
      }

      // Method 3: If still not found, and if the weekPlan has an ID that might be related to the week number
      if (!matched && weekPlan.id !== undefined && weekPlan.id !== null) {
        const possibleWeek = this.weeks.find(
          (w) => w.weekNumber === Number(weekPlan.id)
        );
        if (possibleWeek) {
          console.log(`Mapped week plan to week ${weekPlan.id} by ID`);
          possibleWeek.hasWeekPlan = true;
          possibleWeek.weekPlanId = weekPlan.id ? weekPlan.id.toString() : ''; // Convert to string with null check

          // Initialize daily plans object
          if (!possibleWeek.dailyPlans) {
            possibleWeek.dailyPlans = {};
          }

          // Map the workout days to daily plans
          this.mapWorkoutDaysToDailyPlans(possibleWeek, weekPlan);

          matched = true;
        }
      }

      // If we couldn't map it by any method, log an error
      if (!matched) {
        console.error(`Failed to map week plan to any week:`, weekPlan);
      }
    }

    // Log the final state of weeks
    const mappedWeeks = this.weeks.filter((w) => w.hasWeekPlan);
    console.log(
      `Successfully mapped ${mappedWeeks.length} out of ${weekPlans.length} week plans`
    );
  }

  mapWorkoutDaysToDailyPlans(week: Week, weekPlan: WeekPlanDto): void {
    console.log('Mapping workout days to daily plans for week:', week);

    // Ensure dailyPlans exists
    if (!week.dailyPlans) {
      week.dailyPlans = {};
    }

    // Check if week plan has workout days
    if (
      weekPlan &&
      (weekPlan as any).workoutDays &&
      Array.isArray((weekPlan as any).workoutDays)
    ) {
      console.log(
        `Found ${
          (weekPlan as any).workoutDays.length
        } workout days for week plan ${weekPlan.id}`
      );

      (weekPlan as any).workoutDays.forEach((workoutDay: any) => {
        if (workoutDay && workoutDay.dayDate) {
          try {
            // Parse the day date
            const dayDate = new Date(workoutDay.dayDate);
            console.log(
              `Processing workout day for date: ${this.formatDate(dayDate)}`
            );

            // Check if this date falls within the week's range
            if (this.isDateInRange(dayDate, week.startDate, week.endDate)) {
              // Determine the day of the week (1-7, where 1 is Monday)
              const dayOfWeek = this.getDayOfWeekNumber(dayDate);
              console.log(`Workout day falls on day ${dayOfWeek} of the week`);

              // Ensure dailyPlans exists
              if (!week.dailyPlans) {
                week.dailyPlans = {};
              }

              // Add the workout day to the dailyPlans - convert dayOfWeek to string for the key
              week.dailyPlans[dayOfWeek.toString()] = {
                ...workoutDay,
                dayNumber: dayOfWeek,
                dayDate: dayDate,
                exercise:
                  workoutDay.exercise || workoutDay.exerciseName || 'Training',
              };

              console.log(
                `Mapped workout day to day ${dayOfWeek} in week ${week.weekNumber}`
              );
            } else {
              console.warn(
                `Workout day date ${this.formatDate(
                  dayDate
                )} is outside week range ${this.formatDate(
                  week.startDate
                )} - ${this.formatDate(week.endDate)}`
              );

              // Try to find the correct week for this workout day
              const correctWeek = this.weeks.find((w) =>
                this.isDateInRange(dayDate, w.startDate, w.endDate)
              );
              if (correctWeek) {
                // Determine the day of the week (1-7, where 1 is Monday)
                const dayOfWeek = this.getDayOfWeekNumber(dayDate);

                // Initialize dailyPlans if needed
                if (!correctWeek.dailyPlans) {
                  correctWeek.dailyPlans = {};
                }

                // Add the workout day to the correct week's dailyPlans
                correctWeek.dailyPlans[dayOfWeek.toString()] = {
                  ...workoutDay,
                  dayNumber: dayOfWeek,
                  dayDate: dayDate,
                  exercise:
                    workoutDay.exercise ||
                    workoutDay.exerciseName ||
                    'Training',
                };

                console.log(
                  `Remapped workout day to correct week ${correctWeek.weekNumber}, day ${dayOfWeek}`
                );
              } else {
                console.warn(
                  `Could not find a suitable week for workout day on ${this.formatDate(
                    dayDate
                  )}`
                );
              }
            }
          } catch (error) {
            console.error(
              `Error parsing workout day date: ${workoutDay.dayDate}`,
              error
            );
          }
        } else if (workoutDay && workoutDay.dayNumber !== undefined) {
          // If we have a day number but no date, use the day number directly
          const dayNumberValue = workoutDay.dayNumber;

          // Skip undefined or null day numbers
          if (dayNumberValue === undefined || dayNumberValue === null) {
            console.warn('Day number is undefined, skipping workout day');
            return;
          }

          // Convert to number safely
          let dayNum: number;
          if (typeof dayNumberValue === 'string') {
            dayNum = parseInt(dayNumberValue, 10);
          } else {
            dayNum = Number(dayNumberValue);
          }

          // Only process valid day numbers
          if (!isNaN(dayNum) && dayNum >= 1 && dayNum <= 7) {
            // Calculate the actual date based on the week's start date and the day number
            const dayDate = new Date(week.startDate);
            dayDate.setDate(
              dayDate.getDate() +
                (dayNum - this.getDayOfWeekNumber(week.startDate))
            );

            console.log(
              `Using day number ${dayNum} to calculate date: ${this.formatDate(
                dayDate
              )}`
            );

            // Ensure dailyPlans exists
            if (!week.dailyPlans) {
              week.dailyPlans = {};
            }

            // Add the workout day to the dailyPlans
            week.dailyPlans[dayNum.toString()] = {
              ...workoutDay,
              dayNumber: dayNum,
              dayDate: dayDate,
              exercise:
                workoutDay.exercise || workoutDay.exerciseName || 'Training',
            };

            console.log(
              `Mapped workout day to day ${dayNum} in week ${week.weekNumber}`
            );
          }
        }
      });
    } else {
      console.log(
        `No workout days found for week plan ${weekPlan?.id || 'unknown'}`
      );
    }
  }

  isDateInRange(date: Date, start: Date, end: Date): boolean {
    // Normalize all dates to midnight for comparison
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
    console.log(`Selected month: ${month}`);
  }

  getWeeksForSelectedMonth(): Week[] {
    // Calculate the start and end dates for the selected plan month
    const startDate = new Date(this.trainingPlan.startDate);
    const monthStartDate = new Date(startDate);
    monthStartDate.setDate(startDate.getDate() + (this.selectedMonth - 1) * 30); // 30 days per month

    const monthEndDate = new Date(monthStartDate);
    monthEndDate.setDate(monthStartDate.getDate() + 29); // 30 days per month

    console.log(`Plan Month ${this.selectedMonth} range:`, {
      start: this.formatDate(monthStartDate),
      end: this.formatDate(monthEndDate),
    });

    // Get weeks that fall within this plan month
    return this.weeks.filter((week) => {
      const weekStartInMonth = this.isDateInRange(
        week.startDate,
        monthStartDate,
        monthEndDate
      );
      const weekEndInMonth = this.isDateInRange(
        week.endDate,
        monthStartDate,
        monthEndDate
      );
      const weekSpansMonth =
        week.startDate <= monthStartDate && week.endDate >= monthEndDate;

      return weekStartInMonth || weekEndInMonth || weekSpansMonth;
    });
  }

  hasDayPlan(week: Week, dayNumber: number): boolean {
    return !!week.dailyPlans && !!week.dailyPlans[dayNumber.toString()];
  }

  getDayPlan(week: Week, dayNumber: number) {
    if (!week.hasWeekPlan || !week.dailyPlans) return null;

    // Return the daily plan for this day if it exists
    const plan = week.dailyPlans[dayNumber.toString()];

    // Try to parse the JSON data if it exists
    if (plan && plan.dailyPlanJson) {
      try {
        plan.parsedData = JSON.parse(plan.dailyPlanJson);
      } catch (e) {
        console.error('Error parsing daily plan JSON:', e);
      }
    }

    return plan;
  }

  // View day details methods
  viewDayDetails(week: Week, dayNumber: number): void {
    if (!week.hasWeekPlan || !this.hasDayPlan(week, dayNumber)) return;

    const dayPlan = this.getDayPlan(week, dayNumber);
    this.selectedDayPlan = dayPlan;
    this.selectedDayOfWeek = this.dayNames[dayNumber - 1];
    this.showDayDetailsModal = true;
  }

  closeDayDetailsModal(): void {
    this.showDayDetailsModal = false;
    this.selectedDayPlan = null;
  }

  capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  isDateCrossedOut(date: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const endDate = new Date(this.trainingPlan.endDate);
    endDate.setHours(0, 0, 0, 0);

    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);

    return checkDate < today || checkDate > endDate;
  }

  isDayCrossedOut(week: Week, dayNumber: number): boolean {
    const dayDate = new Date(week.startDate);
    dayDate.setDate(dayDate.getDate() + (dayNumber - 1));
    return this.isDateCrossedOut(dayDate);
  }

  markDailyPlan(id: number): void {
    this.trainingPlanService.markDailyPlanAsDone(id).subscribe({
      next: (res) => {
        console.log('Daily plan marked as done:', res);
        const planId = this.route.snapshot.params['id'];
        this.getTrainingPlanById(planId);
      },
      error: (error) => {
        console.error('Error marking daily plan as done:', error);
      },
    });
  }
}
