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
