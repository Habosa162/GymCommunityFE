import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ExerciseModel } from '../../domain/models/TraingingPlansModels/exercise-model';
import { MuscleGroup } from '../../domain/models/TraingingPlansModels/muscle-group-model';
import { DailyPlanDto } from '../../services/Training Plans/dtos/daily-plan-dto';
import { MealDto } from '../../services/Training Plans/dtos/meal-dto';
import { ExerciseService } from '../../services/Training Plans/exercise.service';
import { MealService } from '../../services/Training Plans/meal.service';
import { TrainingPlansService } from '../../services/Training Plans/training-plan.service';
import { trainingPlan } from '../../domain/models/TraingingPlansModels/training-plan-model';

interface DailyPlanData {
  activity: string;
  trainer: string;
  type: string;
  day: string;
  timeSlot: string;
}

interface Exercise {
  exerciseId: number;
  exerciseName: string;
  sets: number;
  reps: number;
  duration: string;
}

interface Meal {
  mealId?: number;
  mealName?: string;
  mealType?: string;
  quantity?: string;
  mealNotes?: string;
}

interface DailyPlan {
  date: string;
  timeSlot: string;
  day: string;
  type: string;
  exercises: Exercise[];
  meals: Meal[];
}

@Component({
  selector: 'app-training-plans',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './training-plans.component.html',
  styleUrl: './training-plans.component.css',
})
export class TrainingPlansComponent implements OnInit {
  constructor(
    private trainingPlanService: TrainingPlansService,
    private exerciseService: ExerciseService,
    private mealService: MealService
  ) {}
  // Training Plans (mostafa)
  trainingPlan!: trainingPlan;

  // Muscle Groups and Exercises
  muscleGroups: MuscleGroup[] = [];
  selectedMuscleGroupId: number = 0;
  exercises: ExerciseModel[] = [];

  // Meals
  meals: MealDto[] = [];
  isSupplement: boolean = false;

  // Added items
  addedExercises: Exercise[] = [];
  addedMeals: Meal[] = [];

  // Daily plans and filters
  dailyPlans: DailyPlanDto[] = [];
  filterType: string = 'all';

  // Time slots and weeks
  timeSlots: { time: string; id: string }[] = [];
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
  currentWeekNumber: number = 1;
  newWeekName: string = '';

  // UI state
  showAddPlanPopup: boolean = false;
  showExerciseForm: boolean = false;
  showMealForm: boolean = false;
  isDayInfoSaved: boolean = false;

  // Selected values
  selectedTimeSlot: string = '';
  selectedDay: string = '';

  // Form data
  newPlan: any = {
    date: new Date().toISOString().split('T')[0],
    type: 'fitness',
    exerciseId: 0,
    exerciseName: '',
    sets: 0,
    reps: 0,
    duration: '',
    mealId: 0,
    mealName: '',
    mealType: 'breakfast',
    quantity: '',
    mealNotes: '',
  };

  dailyPlan: DailyPlan = {
    date: '',
    timeSlot: '',
    day: '',
    type: 'fitness',
    exercises: [],
    meals: [],
  };

  ngOnInit(): void {
    this.loadDailyPlans();
    this.loadMuscleGroups();
    this.loadMeals();
    //mostafa samir
    this.getTrainingPlanById(1);
  }

  loadMeals(): void {
    this.mealService
      .getMeals(this.isSupplement)
      .subscribe((meals: MealDto[]) => {
        this.meals = meals;
      });
  }

  onIsSupplementChange(event: Event): void {
    const selectedIsSupplement = (event.target as HTMLSelectElement).value;
    this.isSupplement = selectedIsSupplement === 'true';
    this.loadMeals();
  }

  loadMuscleGroups(): void {
    this.exerciseService
      .getAllMuscleGroups()
      .subscribe((muscleGroups: MuscleGroup[]) => {
        this.muscleGroups = muscleGroups;
      });
  }

  onMuscleGroupChange(event: Event): void {
    const selectedMuscleGroupId = (event.target as HTMLSelectElement).value;
    this.selectedMuscleGroupId = parseInt(selectedMuscleGroupId);
    this.loadExercises(this.selectedMuscleGroupId);
  }

  loadExercises(muscleGroupId: number): void {
    this.exerciseService
      .getExercises(muscleGroupId)
      .subscribe((exercises: ExerciseModel[]) => {
        this.exercises = exercises;
      });
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
    const planData = JSON.parse(plan.dailyPlanJson);
    const dayNumber = this.getDayNumber(planData.day);
    return `Day ${dayNumber}`;
  }

  getPlanTrainer(plan: DailyPlanDto): string {
    const planData = JSON.parse(plan.dailyPlanJson);
    if (planData.exercises && planData.exercises.length > 0) {
      return planData.exercises[0].trainer || '';
    }
    return '';
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

  submitExercise(): void {
    const selectedExercise = this.exercises.find(
      (e) => e.name === this.newPlan.exerciseName
    );

    this.addedExercises.push({
      exerciseId: selectedExercise?.id || 0,
      exerciseName: selectedExercise?.name || this.newPlan.exerciseName,
      sets: this.newPlan.sets,
      reps: this.newPlan.reps,
      duration: this.newPlan.duration,
    });

    this.resetExerciseForm();
    this.showExerciseForm = false;
  }

  submitMeal(): void {
    const selectedMeal = this.meals.find((m) => m.id == this.newPlan.mealId);

    this.addedMeals.push({
      mealId: selectedMeal?.id || 0,
      mealName: selectedMeal?.name || this.newPlan.mealName,
      mealType: this.newPlan.mealType,
      quantity: this.newPlan.quantity,
      mealNotes: this.newPlan.mealNotes,
    });
    console.log(this.addedMeals);
    this.resetMealForm();
    this.showMealForm = false;
    console.log(this.newPlan);
  }

  resetExerciseForm(): void {
    this.newPlan.exerciseId = 0;
    this.newPlan.exerciseName = '';
    this.newPlan.sets = 0;
    this.newPlan.reps = 0;
    this.newPlan.duration = '';
  }

  resetMealForm(): void {
    this.newPlan.mealId = 0;
    this.newPlan.mealName = '';
    this.newPlan.mealType = 'breakfast';
    this.newPlan.quantity = '';
    this.newPlan.mealNotes = '';
  }

  removeExercise(exercise: Exercise): void {
    this.addedExercises = this.addedExercises.filter((e) => e !== exercise);
  }

  removeMeal(meal: Meal): void {
    this.addedMeals = this.addedMeals.filter((m) => m !== meal);
  }

  addNewTimeSlot(): void {
    const weekName =
      this.newWeekName.trim() || `Week ${this.currentWeekNumber}`;
    const newWeekSlot = {
      time: `Week ${this.currentWeekNumber} (${weekName})`,
      id: `week${this.currentWeekNumber}`,
    };

    this.timeSlots.push(newWeekSlot);
    this.currentWeekNumber++;
    this.newWeekName = '';
  }

  savePlan(): void {
    if (!this.newPlan.date || !this.selectedTimeSlot || !this.selectedDay) {
      alert('Please fill in all required day information');
      return;
    }

    if (this.addedExercises.length === 0 && this.addedMeals.length === 0) {
      alert('Please add at least one exercise or meal before saving');
      return;
    }

    const planData = {
      date: this.newPlan.date,
      timeSlot: this.selectedTimeSlot,
      day: this.selectedDay,
      type: this.newPlan.type,
      exercises: this.addedExercises,
      meals: this.addedMeals,
    };

    const newPlan: DailyPlanDto = {
      id: this.dailyPlans.length + 1,
      weekPlanId: this.currentWeekNumber,
      weekPlan: {
        id: this.currentWeekNumber,
        title: `Week ${this.currentWeekNumber}`,
        trainingPlanId: 1,
        coachId: '1',
      },
      dayDate: this.newPlan.date,
      dayNumber: this.getDayNumber(this.selectedDay),
      dailyPlanJson: JSON.stringify(planData),
    };

    this.dailyPlans.push(newPlan);
    this.closeAddPlanPopup();
  }

  closeAddPlanPopup(): void {
    this.showAddPlanPopup = false;
    this.showExerciseForm = false;
    this.showMealForm = false;
    this.addedExercises = [];
    this.addedMeals = [];
    this.isDayInfoSaved = false;

    this.dailyPlan = {
      date: '',
      timeSlot: '',
      day: '',
      type: 'fitness',
      exercises: [],
      meals: [],
    };

    this.newPlan = {
      date: new Date().toISOString().split('T')[0],
      type: 'fitness',
      exerciseId: 0,
      exerciseName: '',
      sets: 0,
      reps: 0,
      duration: '',
      mealId: 0,
      mealName: '',
      mealType: 'breakfast',
      quantity: '',
      mealNotes: '',
    };
  }

  //#region mostafa samir
  getTrainingPlanById(Id: number): void {
    this.trainingPlanService.getTrainingPlanById(Id).subscribe({
      next: (plan) => {
        this.trainingPlan = plan;
        console.log('Training Plan:', this.trainingPlan);
      },
      error: (error) => {
        console.error('Error loading training plan:', error);
      },
    });
  }

  //#endregion
}
