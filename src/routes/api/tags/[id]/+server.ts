import { error, json } from "@sveltejs/kit";
import { eq } from "drizzle-orm";

import { db } from "$lib/server/db";
import { tags } from "$lib/server/db/schema";
import type { RequestHandler } from "./$types";

export const PATCH: RequestHandler = async event => {
  const session = await event.locals.auth();
  if (!session) error(401, "Unauthorised");

  const id = parseInt(event.params.id, 10);
  if (isNaN(id)) error(400, "Invalid ID");

  const body = await event.request.json();
  const name = body.name?.trim().toLowerCase();
  if (!name) error(400, "Name is required");

  const [updated] = await db.update(tags).set({ name }).where(eq(tags.id, id)).returning();

  if (!updated) error(404, "Tag not found");
  return json(updated);
};

export const DELETE: RequestHandler = async event => {
  const session = await event.locals.auth();
  if (!session) error(401, "Unauthorised");

  const id = parseInt(event.params.id, 10);
  if (isNaN(id)) error(400, "Invalid ID");

  await db.delete(tags).where(eq(tags.id, id));
  return json({ success: true });
};
