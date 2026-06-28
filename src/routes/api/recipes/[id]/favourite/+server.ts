import { error, json } from "@sveltejs/kit";
import { eq } from "drizzle-orm";

import { db } from "$lib/server/db";
import { recipes } from "$lib/server/db/schema";
import type { RequestHandler } from "./$types";

export const PATCH: RequestHandler = async event => {
  const session = await event.locals.auth();
  if (!session) error(401, "Unauthorised");

  const id = parseInt(event.params.id, 10);
  if (isNaN(id)) error(400, "Invalid ID");

  const { favourite } = await event.request.json();

  const [updated] = await db
    .update(recipes)
    .set({ favourite: Boolean(favourite) })
    .where(eq(recipes.id, id))
    .returning({ favourite: recipes.favourite });

  if (!updated) error(404, "Recipe not found");
  return json(updated);
};
