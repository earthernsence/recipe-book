import { error, json } from "@sveltejs/kit";
import { eq } from "drizzle-orm";

import { db } from "$lib/server/db";
import { ingredients as ingredientsTable, recipes, recipeTags, steps as stepsTable } from "$lib/server/db/schema";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async event => {
  const session = await event.locals.auth();
  if (!session) error(401, "Unauthorised");

  const body = await event.request.json();
  const {
    title,
    description,
    cuisineType,
    mealType,
    prepTimeMinutes,
    cookTimeMinutes,
    servings,
    ingredients,
    steps,
    tagIds,
    notes
  } = body;

  if (!title?.trim()) error(400, "Title is required");
  if (!mealType) error(400, "Meal type is required");

  const recipeId = await db.transaction(async tx => {
    const [recipe] = await tx
      .insert(recipes)
      .values({
        title: title.trim(),
        description: description?.trim() || null,
        cuisineType: cuisineType?.trim() || null,
        mealType,
        prepTimeMinutes: prepTimeMinutes || null,
        cookTimeMinutes: cookTimeMinutes || null,
        servings: servings || null,
        notes: notes?.trim() || null
      })
      .returning({ id: recipes.id });

    if (ingredients?.length > 0) {
      await tx.insert(ingredientsTable).values(
        ingredients.map((ing: any, i: number) => ({
          recipeId: recipe.id,
          name: ing.name.trim(),
          amount: ing.amount,
          unit: ing.unit || null,
          orderIndex: i
        }))
      );
    }

    if (steps?.length > 0) {
      await tx.insert(stepsTable).values(
        steps.map((step: any, i: number) => ({
          recipeId: recipe.id,
          content: step.content.trim(),
          orderIndex: i
        }))
      );
    }

    if (tagIds?.length > 0) {
      await tx.insert(recipeTags).values(
        tagIds.map((tagId: number) => ({
          recipeId: recipe.id,
          tagId: Number(tagId)
        }))
      );
    }

    return recipe.id;
  });

  return json({ id: recipeId });
};
