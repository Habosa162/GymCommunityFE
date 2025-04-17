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
  // Exercise Plan
  sets: number;
  reps: number;
  exerciseNotes: string;
  // Meal Plan
  mealType: string;
  mealDescription: string;
  calories: number;
  mealNotes: string;
}

interface Exercise {
  activity: string;
  trainer: string;
  sets: number;
  reps: number;
  exerciseNotes: string;
}

interface Meal {
  mealType: string;
  mealDescription: string;
  calories: number;
  mealNotes: string;
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
    // Exercise Plan
    sets: 0,
    reps: 0,
    exerciseNotes: '',
    // Meal Plan
    mealType: 'breakfast',
    mealDescription: '',
    calories: 0,
    mealNotes: '',
  };
  currentWeekNumber: number = 1;
  newWeekName: string = '';
  addedExercises: Exercise[] = [];
  addedMeals: Meal[] = [];
  showExerciseForm: boolean = false;
  showMealForm: boolean = false;
  dayInfo: any = {
    date: '',
    timeSlot: '',
    day: '',
    type: 'fitness',
  };
  dailyPlan: DailyPlan = {
    date: '',
    timeSlot: '',
    day: '',
    type: 'fitness',
    exercises: [],
    meals: [],
  };
  isDayInfoSaved: boolean = false;

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
    const planData = JSON.parse(plan.dailyPlanJson);
    const dayNumber = this.getDayNumber(planData.day);
    return `Day ${dayNumber}`;
  }

  getPlanTrainer(plan: DailyPlanDto): string {
    const planData = JSON.parse(plan.dailyPlanJson);
    if (planData.exercises && planData.exercises.length > 0) {
      return planData.exercises[0].trainer;
    }
    return '';
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

  saveDailyPlan(): void {
    if (!this.newPlan.date || !this.selectedTimeSlot || !this.selectedDay) {
      alert('Please fill in all required day information');
      return;
    }

    this.dailyPlan = {
      date: this.newPlan.date,
      timeSlot: this.selectedTimeSlot,
      day: this.selectedDay,
      type: this.newPlan.type,
      exercises: [...this.addedExercises],
      meals: [...this.addedMeals],
    };

    this.isDayInfoSaved = true;
  }

  submitExercise(): void {
    if (this.newPlan.activity) {
      this.addedExercises.push({
        activity: this.newPlan.activity,
        trainer: this.newPlan.trainer,
        sets: this.newPlan.sets,
        reps: this.newPlan.reps,
        exerciseNotes: this.newPlan.exerciseNotes,
      });
      this.resetExerciseForm();
    }
    this.showExerciseForm = false;
  }

  submitMeal(): void {
    if (this.newPlan.mealDescription) {
      this.addedMeals.push({
        mealType: this.newPlan.mealType,
        mealDescription: this.newPlan.mealDescription,
        calories: this.newPlan.calories,
        mealNotes: this.newPlan.mealNotes,
      });
      this.resetMealForm();
    }
    this.showMealForm = false;
  }

  resetExerciseForm(): void {
    this.newPlan.activity = '';
    this.newPlan.trainer = '';
    this.newPlan.sets = 0;
    this.newPlan.reps = 0;
    this.newPlan.exerciseNotes = '';
  }

  resetMealForm(): void {
    this.newPlan.mealType = 'breakfast';
    this.newPlan.mealDescription = '';
    this.newPlan.calories = 0;
    this.newPlan.mealNotes = '';
  }

  removeExercise(exercise: Exercise): void {
    this.addedExercises = this.addedExercises.filter((e) => e !== exercise);
  }

  removeMeal(meal: Meal): void {
    this.addedMeals = this.addedMeals.filter((m) => m !== meal);
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

  savePlan() {
    // Validate required day info directly here
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
        meals: this.addedMeals
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
      activity: '',
      trainer: '',
      type: 'fitness',
      date: new Date().toISOString().split('T')[0],
      sets: 0,
      reps: 0,
      exerciseNotes: '',
      mealType: 'breakfast',
      mealDescription: '',
      calories: 0,
      mealNotes: '',
    };
  }

  saveDayInfo(): void {
    this.dayInfo = {
      date: this.newPlan.date,
      timeSlot: this.selectedTimeSlot,
      day: this.selectedDay,
      type: this.newPlan.type,
    };
  }
}
