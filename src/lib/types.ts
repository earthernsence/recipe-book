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
