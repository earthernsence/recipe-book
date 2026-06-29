import type { MealType } from "$lib/types";

export const MEAL_TYPE_BACKGROUND: Record<MealType, string> = {
  breakfast: "bg-accent",
  lunch: "bg-lunch",
  dinner: "bg-primary",
  dessert: "bg-dessert",
  snack: "bg-snack",
  other: "bg-muted"
};

export const MEAL_TYPE_TEXT: Record<MealType, string> = {
  breakfast: "text-foreground",
  lunch: "text-card",
  dinner: "text-primary-foreground",
  dessert: "text-card",
  snack: "text-card",
  other: "text-muted-foreground"
};

export const MEAL_TYPE_BORDER: Record<MealType, string> = {
  breakfast: "border-accent",
  lunch: "border-lunch",
  dinner: "border-primary",
  dessert: "border-dessert",
  snack: "border-snack",
  other: "border-muted"
};

export function getMealTypeBackground(mealType: string | null | undefined): string {
  return MEAL_TYPE_BACKGROUND[mealType as MealType] ?? "bg-muted";
}

export function getMealTypeText(mealType: string | null | undefined): string {
  return MEAL_TYPE_TEXT[mealType as MealType] ?? "text-muted-foreground";
}

export function getMealTypeBorder(mealType: string | null | undefined): string {
  return MEAL_TYPE_BORDER[mealType as MealType] ?? "border-muted-foreground";
}

export function getMealTypeStyles(mealType: string | null | undefined): string {
  return `${getMealTypeBackground(mealType)} ${getMealTypeText(mealType)}`;
}
