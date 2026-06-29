import { error } from "@sveltejs/kit";
import { asc, eq } from "drizzle-orm";

import { db } from "$lib/server/db";
import { ingredients, recipes, recipeTags, steps, tags } from "$lib/server/db/schema";

import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async event => {
  const session = await event.locals.auth();
  if (!session) error(401, "Unauthorised");

  const [allRecipes, allRecipeTags, allIngredients, allSteps] = await Promise.all([
    db.select().from(recipes).orderBy(asc(recipes.title)),
    db
      .select({ recipeId: recipeTags.recipeId, tagId: tags.id, tagName: tags.name })
      .from(recipeTags)
      .innerJoin(tags, eq(recipeTags.tagId, tags.id)),
    db.select().from(ingredients).orderBy(asc(ingredients.orderIndex)),
    db.select().from(steps).orderBy(asc(steps.orderIndex))
  ]);

  const assembled = allRecipes.map(recipe => ({
    ...recipe,
    tags: allRecipeTags.filter(rt => rt.recipeId === recipe.id).map(rt => ({ id: rt.tagId, name: rt.tagName })),
    ingredients: allIngredients.filter(i => i.recipeId === recipe.id),
    steps: allSteps.filter(s => s.recipeId === recipe.id)
  }));

  const payload = JSON.stringify(
    {
      exportedAt: new Date().toISOString(),
      version: 1,
      recipeCount: assembled.length,
      recipes: assembled
    },
    null,
    2
  );

  const date = new Date().toISOString().slice(0, 10).replaceAll("-", "");

  return new Response(payload, {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="${date}_recipes_export.json"`
    }
  });
};
