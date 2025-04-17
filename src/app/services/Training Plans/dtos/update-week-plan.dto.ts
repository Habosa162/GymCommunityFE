export interface UpdateWeekPlanDto {
  id: number;
  weekName?: string; // Optional, as not marked [Required] in C#
  startDate?: string; // Optional, as not marked [Required] in C#
}
