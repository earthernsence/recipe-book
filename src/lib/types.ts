import type { Recipe, Tag, Step, Ingredient } from "./server/db/schema";

export type RecipeCardData = Recipe & {
  tags: Array<Tag>;
  ingredientCount: number;
};

export type RecipeDetailData = Recipe & {
  tags: Array<Tag>;
  ingredients: Array<Ingredient>;
  steps: Array<Step>;
};

export type MealType = "breakfast" | "lunch" | "dinner" | "dessert" | "snack" | "other";

export const MEAL_TYPES: Array<{ value: MealType; label: string }> = [
  { value: "breakfast", label: "Breakfast" },
  { value: "lunch", label: "Lunch" },
  { value: "dinner", label: "Dinner" },
  { value: "dessert", label: "Dessert" },
  { value: "snack", label: "Snack" },
  { value: "other", label: "Other" }
] as const;

export type DraftIngredient = {
  tempId: string;
  name: string;
  amount: number;
  unit: string | null;
};

export type DraftStep = {
  tempId: string;
  content: string;
};

export type Difficulty = "easy" | "intermediate" | "hard";
