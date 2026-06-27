import { error } from "@sveltejs/kit";
import { asc, eq } from "drizzle-orm";

import { db } from "$lib/server/db";
import { ingredients, recipes, recipeTags, steps, tags } from "$lib/server/db/schema";
import type { RecipeDetailData } from "$lib/types";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
  const id = parseInt(params.id, 10);

  if (isNaN(id)) error(404, "Recipe not found. Maybe look under the stove?");

  const [rawRecipe, rawRecipeTags, rawIngredients, rawSteps] = await Promise.all([
    db.select().from(recipes).where(eq(recipes.id, id)),
    db
      .select({ recipeId: recipeTags.recipeId, tagId: tags.id, tagName: tags.name })
      .from(recipeTags)
      .innerJoin(tags, eq(recipeTags.tagId, tags.id))
      .where(eq(recipeTags.recipeId, id)),
    db.select().from(ingredients).where(eq(ingredients.recipeId, id)).orderBy(asc(ingredients.orderIndex)),
    db.select().from(steps).where(eq(steps.recipeId, id)).orderBy(asc(steps.orderIndex))
  ]);

  if (!rawRecipe[0]) error(404, "Recipe not found. Maybe it's stuck to another recipe card?");

  const newRecipe: RecipeDetailData = {
    ...rawRecipe[0],
    tags: rawRecipeTags.map(rt => ({ id: rt.tagId, name: rt.tagName })),
    ingredients: rawIngredients,
    steps: rawSteps
  };

  return { recipe: newRecipe };
};
