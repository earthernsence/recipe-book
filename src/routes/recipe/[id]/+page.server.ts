import { error } from "@sveltejs/kit";
import { eq } from "drizzle-orm";

import { db } from "$lib/server/db";
import { recipes } from "$lib/server/db/schema";
import type { RecipeDetailData } from "$lib/types";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
  const id = parseInt(params.id, 10);

  if (isNaN(id)) error(404, "Recipe not found. Maybe look under the stove?");

  const raw = await db.query.recipes.findFirst({
    where: eq(recipes.id, id),
    with: {
      ingredients: {
        orderBy: (ingredients, { asc }) => [asc(ingredients.orderIndex)]
      },
      steps: {
        orderBy: (steps, { asc }) => [asc(steps.orderIndex)]
      },
      recipeTags: {
        with: { tag: true }
      }
    }
  });

  if (!raw) error(404, "Recipe not found. Maybe it's stuck to another recipe card?");

  const recipe: RecipeDetailData = {
    ...raw,
    tags: raw.recipeTags.map(rt => rt.tag)
  };

  return { recipe };
};
