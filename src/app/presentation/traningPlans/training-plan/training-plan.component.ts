import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { trainingPlan } from '../../../domain/models/TraingingPlansModels/training-plan-model';
import { CreateDailyPlanDto } from '../../../services/Training Plans/dtos/create-daily-plan.dto';
import { CreateWeekPlanDto } from '../../../services/Training Plans/dtos/create-week-plan.dto';
import { ExerciseDto } from '../../../services/Training Plans/dtos/exercise-dto';
import { MealDto } from '../../../services/Training Plans/dtos/meal-dto';
import { MuscleGroupDto } from '../../../services/Training Plans/dtos/muscle-group.dto';
import { WeekPlanDto } from '../../../services/Training Plans/dtos/weekly-plan-dto';
import { ExerciseService } from '../../../services/Training Plans/exercise.service';
import { MealService } from '../../../services/Training Plans/meal.service';
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

interface DayPlanData {
  exercises: Exercise[];
  meals: Meal[];
}

@Component({
  selector: 'app-training-plan',
  imports: [CommonModule, FormsModule],
  templateUrl: './training-plan.component.html',
  styleUrl: './training-plan.component.css',
})
export class TrainingPlanComponent implements OnInit {
  trainingPlan!: trainingPlan & { weekPlans?: WeekPlanDto[] };
  months: number[] = [];
  weeks: Week[] = [];
  selectedMonth: number = 1;
  hoveredWeek: number | null = null;
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

  // Popup related properties
  showWeekPopup = false;
  showDayPopup = false;

  newWeekPlan: CreateWeekPlanDto = {
    trainingPlanId: 0,
    weekName: '',
    startDate: '',
  };

  newDayPlan: CreateDailyPlanDto = {
    weekPlanId: 0,
    dayNumber: 0,
    dayDate: '',
    extraTips: '',
    dailyPlanJson: '{}',
  };

  selectedWeek: Week | null = null;
  selectedDay: number | null = null;

  activeSection: 'exercises' | 'meals' = 'exercises';
  dayPlanData: DayPlanData = {
    exercises: [],
    meals: [],
  };
  isSupplement: boolean = false;
  availableMeals: MealDto[] = [];
  selectedMeal: any | null = null;
  muscleGroups: MuscleGroupDto[] = [];
  selectedMuscleGroupId: number = 0;
  availableExercises: ExerciseDto[] = [];
  selectedExercise: ExerciseDto | null = null;

  // Temporary objects for adding individual items
  tempExercise: Exercise = {
    muscleGroup: '',
    exerciseName: '',
    sets: 3,
    reps: 12,
    duration: 0,
    exerciseId: 0,
  };

  tempMeal: Meal = {
    mealType: 'breakfast',
    mealName: '',
    quantity: '',
    isSupplement: false,
    notes: '',
  };

  constructor(
    private trainingPlanService: TrainingPlansService,
    private router: ActivatedRoute,
    private mealService: MealService,
    private exerciseService: ExerciseService
  ) {}

  ngOnInit(): void {
    const planId = this.router.snapshot.params['id'];
    console.log('Training Plan ID:', planId);
    this.getTrainingPlanById(planId);
    this.isSupplement = false;
    this.getAvailableMeals();
    this.getAvailableMuscleGroups();
  }

  getAvailableMuscleGroups(): void {
    this.exerciseService.getAllMuscleGroups().subscribe({
      next: (muscleGroups) => {
        this.muscleGroups = muscleGroups;
        if (muscleGroups.length > 0) {
          this.selectedMuscleGroupId = muscleGroups[0].id;
          this.getAvailableExercises(this.selectedMuscleGroupId);
        }
      },
      error: (error) => {
        console.error('Error fetching muscle groups:', error);
      },
    });
  }

  getAvailableExercises(muscleGroupId: number): void {
    this.exerciseService.getExercises(muscleGroupId).subscribe({
      next: (exercises) => {
        this.availableExercises = exercises;
      },
      error: (error) => {
        console.error('Error fetching exercises:', error);
      },
    });
  }

  onMuscleGroupChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const muscleGroupId = Number(selectElement.value);
    this.selectedMuscleGroupId = muscleGroupId;
    this.getAvailableExercises(muscleGroupId);
  }

  onExerciseSelect(exercise: ExerciseDto): void {
    if (exercise) {
      this.tempExercise.exerciseName = exercise.name;
      this.tempExercise.muscleGroup = exercise.muscleGroupName;
      this.tempExercise.exerciseId = exercise.id;
    }
  }

  getAvailableMeals(): void {
    this.mealService.getMeals(this.isSupplement).subscribe((meals) => {
      this.availableMeals = meals;
    });
  }

  onSupplementChange(): void {
    this.getAvailableMeals();
  }

  onMealSelect(meal: MealDto, index: number): void {
    if (meal) {
      const currentMeal = this.dayPlanData.meals[index];
      currentMeal.mealName = meal.name;
      currentMeal.isSupplement = meal.isSupplement;
      currentMeal.notes = meal.description || '';
      currentMeal.quantity = '';
      this.selectedMeal = null; // Reset selection after applying
    }
  }

  getTrainingPlanById(planId: string | number): void {
    // Convert planId to string if it's a number
    const id = planId.toString();

    this.trainingPlanService.getTrainingPlanById(Number(id)).subscribe({
      next: (response) => {
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

  createWeekPlan(weekPlan: CreateWeekPlanDto): void {
    console.log('Sending week plan to server:', weekPlan);

    this.trainingPlanService.createWeekPlan(weekPlan).subscribe({
      next: (newWeekPlan) => {
        console.log('Week Plan created:', newWeekPlan);

        // Find the correct week by extracting week number from the name
        const currentWeekNumber = parseInt(
          this.newWeekPlan.weekName.split(' ')[1]
        );
        console.log('Target week number:', currentWeekNumber);

        // Find the week in our array
        const weekIndex = this.weeks.findIndex(
          (w) => w.weekNumber === currentWeekNumber
        );

        if (weekIndex !== -1) {
          // Update the week in our array
          this.weeks[weekIndex].hasWeekPlan = true;
          this.weeks[weekIndex].weekPlanId = newWeekPlan.id.toString();

          // Initialize the daily plans object
          this.weeks[weekIndex].dailyPlans = {};

          // Also update the training plan's week plans array if it exists
          if (!this.trainingPlan.weekPlans) {
            this.trainingPlan.weekPlans = [];
          }

          // Add the new week plan to the training plan's week plans array
          this.trainingPlan.weekPlans.push(newWeekPlan);
          console.log('Updated weeks array:', this.weeks);
        } else {
          console.error('Could not find week with number:', currentWeekNumber);
        }

        this.closeWeekPopup();

        // Refresh the training plan data from server to ensure everything is in sync
        this.getTrainingPlanById(this.trainingPlan.id);
      },
      error: (error) => {
        console.error('Error creating week plan:', error);
      },
    });
  }

  createDayPlan(dayPlan: CreateDailyPlanDto): void {
    this.trainingPlanService.createDailyPlan(dayPlan).subscribe({
      next: (newDayPlan) => {
        console.log('Day Plan created:', newDayPlan);

        // Find the corresponding week
        const week = this.weeks.find(
          (w) =>
            w.weekPlanId &&
            w.weekPlanId.toString() === dayPlan.weekPlanId.toString()
        );
        if (week) {
          // Initialize dailyPlans if it doesn't exist
          if (!week.dailyPlans) {
            week.dailyPlans = {};
          }

          // Store the daily plan by day number
          const dayNumberStr = dayPlan.dayNumber.toString();
          week.dailyPlans[dayNumberStr] = newDayPlan;
          console.log(
            `Added day plan for week ${week.weekNumber}, day ${dayPlan.dayNumber}`
          );
          console.log('Updated week:', week);
        }

        this.closeDayPopup();

        // Refresh the training plan data to ensure everything is in sync
        this.getTrainingPlanById(this.trainingPlan.id);
      },
      error: (error) => {
        console.error('Error creating day plan:', error);
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
    console.log('Months:', this.months);
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
    mappedWeeks.forEach((week) => {
      console.log(
        `Week ${week.weekNumber} (${this.formatDate(
          week.startDate
        )} - ${this.formatDate(week.endDate)}) has plan: ${week.weekPlanId}`
      );
      console.log(`Daily plans for week ${week.weekNumber}:`, week.dailyPlans);
    });
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

  loadDailyPlansForWeek(week: Week): void {
    // This method would call the API to get daily plans for a specific week plan
    // For now, we'll just log that we would load daily plans for this week
    console.log(
      `Would load daily plans for week ${week.weekNumber} with week plan ID ${week.weekPlanId}`
    );

    // If you have an API endpoint to get daily plans for a week plan, you would call it here
    // For example:
    /*
    if (week.weekPlanId) {
      this.trainingPlanService.getDailyPlansForWeek(week.weekPlanId).subscribe({
        next: (dailyPlans) => {
          console.log(`Loaded ${dailyPlans.length} daily plans for week ${week.weekNumber}`);
          
          // Map daily plans by day number
          dailyPlans.forEach(plan => {
            week.dailyPlans[plan.dayNumber] = plan;
          });
        },
        error: (error) => {
          console.error(`Error loading daily plans for week ${week.weekNumber}:`, error);
        }
      });
    }
    */
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

  openAddWeekPopup(week: Week): void {
    if (week.hasWeekPlan) return; // Don't open if week already has a plan

    console.log('Opening popup for week:', week);
    console.log(
      `Week dates: ${this.formatDate(week.startDate)} - ${this.formatDate(
        week.endDate
      )}`
    );

    // Create a new date for the day after the week's start date
    const dayAfterStart = new Date(week.startDate.getTime());
    dayAfterStart.setDate(week.startDate.getDate() + 1);
    console.log(
      `Setting start date to day after week start: ${this.formatDate(
        dayAfterStart
      )}`
    );

    // Ensure the date is properly formatted and doesn't have time zone issues
    const formattedDate = dayAfterStart.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    console.log('Formatted start date for API:', formattedDate);

    this.newWeekPlan = {
      trainingPlanId: this.trainingPlan.id,
      weekName: `Week ${week.weekNumber}`,
      startDate: formattedDate,
    };

    console.log('New week plan data:', this.newWeekPlan);
    this.showWeekPopup = true;
  }

  openAddDayPopup(week: Week, dayNumber: number): void {
    if (
      !week.hasWeekPlan ||
      (week.dailyPlans && week.dailyPlans[dayNumber.toString()])
    )
      return; // Don't open if no week plan or day already has a plan

    this.showDayPopup = true;
    this.selectedWeek = week;
    this.selectedDay = dayNumber;

    // Calculate date for this day based on week's start date
    const dayDate = new Date(week.startDate);
    dayDate.setDate(dayDate.getDate() + (dayNumber - 1)); // Adjust the date based on the day number

    // Reset and prefill the form
    this.newDayPlan = {
      weekPlanId: week.weekPlanId ? parseInt(week.weekPlanId, 10) : 0,
      dayNumber: dayNumber,
      dayDate: this.formatDate(dayDate),
      extraTips: '',
      dailyPlanJson: '{}',
    };

    // Reset day plan data
    this.dayPlanData = {
      exercises: [],
      meals: [],
    };

    // Default to exercises tab
    this.activeSection = 'exercises';
  }

  closeWeekPopup(): void {
    this.showWeekPopup = false;
    this.selectedWeek = null;
  }

  closeDayPopup(): void {
    this.showDayPopup = false;
    this.selectedWeek = null;
    this.selectedDay = null;
    this.dayPlanData = {
      exercises: [],
      meals: [],
    };
  }

  submitWeekPlan(): void {
    if (!this.newWeekPlan.weekName) return;

    // Extract week number from the week name (e.g., "Week 1" -> 1)
    const weekNumber = parseInt(this.newWeekPlan.weekName.split(' ')[1]);
    if (isNaN(weekNumber)) {
      console.error(
        'Invalid week number in week name:',
        this.newWeekPlan.weekName
      );
      return;
    }

    // Find the week in our array
    const weekIndex = this.weeks.findIndex((w) => w.weekNumber === weekNumber);
    if (weekIndex === -1) {
      console.error('Could not find week with number:', weekNumber);
      return;
    }

    console.log('Creating week plan for week:', weekNumber);
    console.log('Week plan data:', this.newWeekPlan);

    // Call the service to create a new week plan
    this.trainingPlanService.createWeekPlan(this.newWeekPlan).subscribe({
      next: (newWeekPlan) => {
        console.log('Week plan created successfully:', newWeekPlan);

        // Update the week in our array
        this.weeks[weekIndex].hasWeekPlan = true;
        if (newWeekPlan.id) {
          this.weeks[weekIndex].weekPlanId = newWeekPlan.id.toString();
        }

        // Initialize the daily plans object
        if (!this.weeks[weekIndex].dailyPlans) {
          this.weeks[weekIndex].dailyPlans = {};
        }

        // Also update the training plan's week plans array if it exists
        if (!this.trainingPlan.weekPlans) {
          this.trainingPlan.weekPlans = [];
        }
        this.trainingPlan.weekPlans.push(newWeekPlan);

        this.closeWeekPopup();

        // Refresh the training plan data to ensure everything is in sync
        this.getTrainingPlanById(this.trainingPlan.id);
      },
      error: (error) => {
        console.error('Error creating week plan:', error);
      },
    });
  }

  submitDayPlan(): void {
    // Convert dayPlanData to JSON string
    this.newDayPlan.dailyPlanJson = JSON.stringify(this.dayPlanData);
    console.log('Submitting day plan:', this.newDayPlan);
    console.log('Day plan data:', this.dayPlanData);
    this.createDayPlan(this.newDayPlan);
  }

  isWeekHovered(weekNumber: number): boolean {
    return this.hoveredWeek === weekNumber;
  }

  isDayHovered(weekNumber: number, dayNumber: number): boolean {
    return (
      this.hoveredDay.weekNumber === weekNumber &&
      this.hoveredDay.dayNumber === dayNumber
    );
  }

  setHoveredWeek(weekNumber: number | null): void {
    this.hoveredWeek = weekNumber;
  }

  setHoveredDay(weekNumber: number | null, dayNumber: number | null): void {
    this.hoveredDay = { weekNumber, dayNumber };
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

  processNewDayPlan(dayPlan: any): void {
    console.log('Processing new day plan:', dayPlan);

    if (!dayPlan || !dayPlan.weekPlanId) {
      console.error(
        'Cannot process day plan: invalid data or missing weekPlanId'
      );
      return;
    }

    // Find the corresponding week
    const week = this.weeks.find(
      (w) => w.weekPlanId && w.weekPlanId === dayPlan.weekPlanId.toString()
    );
    if (week) {
      // Initialize dailyPlans if it doesn't exist
      if (!week.dailyPlans) {
        week.dailyPlans = {};
      }

      // Store the daily plan by day number
      const dayNumber =
        typeof dayPlan.dayNumber === 'string'
          ? parseInt(dayPlan.dayNumber, 10)
          : dayPlan.dayNumber;
      if (week.dailyPlans) {
        week.dailyPlans[dayNumber.toString()] = dayPlan;
        console.log(
          `Added day plan for week ${week.weekNumber}, day ${dayNumber}`
        );
        console.log('Updated week:', week);
      }
    }

    this.closeDayPopup();

    // Refresh the training plan data to ensure everything is in sync
    if (this.trainingPlan && this.trainingPlan.id) {
      this.getTrainingPlanById(this.trainingPlan.id);
    }
  }

  setDayPlanForDay(
    weekIndex: number,
    day: Day,
    dailyPlanId: string | undefined
  ): void {
    const week = this.weeks[weekIndex];
    if (!week) return;

    if (!week.dailyPlans) {
      week.dailyPlans = {};
    }

    // Convert day number to string for object key
    const dayNumberStr = day.dayNumber.toString();

    // Store daily plan ID for this day (if exists)
    if (dailyPlanId) {
      week.dailyPlans[dayNumberStr] = dailyPlanId;
    }
  }

  // Methods to handle exercises and meals
  setActiveSection(section: 'exercises' | 'meals'): void {
    this.activeSection = section;
  }

  addExercise(): void {
    this.dayPlanData.exercises.push({
      muscleGroup: '',
      exerciseName: '',
      sets: 3,
      reps: 12,
      duration: 0,
      exerciseId: 0,
    });
  }

  removeExercise(index: number): void {
    this.dayPlanData.exercises.splice(index, 1);
  }

  addMeal(): void {
    this.dayPlanData.meals.push({
      mealType: 'breakfast',
      mealName: '',
      quantity: '',
      isSupplement: this.isSupplement,
      notes: '',
    });
  }

  removeMeal(index: number): void {
    this.dayPlanData.meals.splice(index, 1);
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

  isWeekCrossedOut(week: Week): boolean {
    return (
      this.isDateCrossedOut(week.startDate) ||
      this.isDateCrossedOut(week.endDate)
    );
  }

  isDayCrossedOut(week: Week, dayNumber: number): boolean {
    const dayDate = new Date(week.startDate);
    dayDate.setDate(dayDate.getDate() + (dayNumber - 1));
    return this.isDateCrossedOut(dayDate);
  }

  addSingleExercise(): void {
    if (!this.selectedExercise) {
      console.error('No exercise selected');
      return;
    }

    // Create a new exercise object based on the temp values
    const newExercise: Exercise = {
      muscleGroup: this.selectedExercise.muscleGroupName,
      exerciseName: this.selectedExercise.name,
      sets: this.tempExercise.sets,
      reps: this.tempExercise.reps,
      duration: this.tempExercise.duration,
      exerciseId: this.selectedExercise.id,
    };

    // Add to the exercises list
    this.dayPlanData.exercises.push(newExercise);

    // Reset the temp exercise
    this.tempExercise = {
      muscleGroup: '',
      exerciseName: '',
      sets: 3,
      reps: 12,
      duration: 0,
      exerciseId: 0,
    };

    // Reset the selection
    this.selectedExercise = null;
  }

  addSingleMeal(): void {
    if (!this.selectedMeal) {
      console.error('No meal selected');
      return;
    }

    // Create a new meal object based on the temp values
    const newMeal: Meal = {
      mealType: this.tempMeal.mealType,
      mealName: this.selectedMeal.name,
      quantity: this.tempMeal.quantity,
      isSupplement: this.selectedMeal.isSupplement,
      notes: this.selectedMeal.description || '',
    };

    // Add to the meals list
    this.dayPlanData.meals.push(newMeal);

    // Reset the temp meal
    this.tempMeal = {
      mealType: 'breakfast',
      mealName: '',
      quantity: '',
      isSupplement: false,
      notes: '',
    };

    // Reset the selection
    this.selectedMeal = null;
  }
}
