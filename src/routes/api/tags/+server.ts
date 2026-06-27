import { error, json } from "@sveltejs/kit";
import { eq } from "drizzle-orm";

import { db } from "$lib/server/db";
import { tags } from "$lib/server/db/schema";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async event => {
  const session = await event.locals.auth();

  if (!session) error(401, "Unauthorised");

  const body = await event.request.json();
  const name = body.name?.trim().toLowerCase();

  if (!name) error(400, "Tag name is required");

  // Check for an existing tag first, this way if the user specifies
  // an already-existing tag, it'll just select that tag instead.
  // This flow also ensures that anything inserted into the table has
  // consistent formatting (with trimming & toLowerCase), so this
  // comparison doesn't need any additional qualifiers or function calls
  // to ensure that it works the way we want it to.
  let tag = await db.query.tags.findFirst({
    where: eq(tags.name, name)
  });

  if (!tag) {
    [tag] = await db.insert(tags).values({ name }).returning();
  }

  return json(tag);
};
