import { asc, eq } from "drizzle-orm";

import { db } from "$lib/server/db";
import { ingredients, recipes, recipeTags, tags } from "$lib/server/db/schema";
import type { RecipeCardData } from "$lib/types";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  const [rawRecipes, rawRecipeTags, rawIngredients] = await Promise.all([
    db.select().from(recipes).orderBy(asc(recipes.title)),
    db
      .select({ recipeId: recipeTags.recipeId, tagId: tags.id, tagName: tags.name })
      .from(recipeTags)
      .innerJoin(tags, eq(recipeTags.tagId, tags.id)),
    db.select({ recipeId: ingredients.recipeId }).from(ingredients)
  ]);

  const recipeList: Array<RecipeCardData> = rawRecipes.map(recipe => ({
    ...recipe,
    tags: rawRecipeTags.filter(rt => rt.recipeId === recipe.id).map(rt => ({ id: rt.tagId, name: rt.tagName })),
    ingredientCount: rawIngredients.filter(i => i.recipeId === recipe.id).length
  }));

  return { recipes: recipeList };
};
