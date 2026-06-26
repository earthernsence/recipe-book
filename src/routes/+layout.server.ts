import { asc } from "drizzle-orm";

import { db } from "$lib/server/db";
import { tags } from "$lib/server/db/schema";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async event => {
  const session = await event.locals.auth();
  const allTags = await db.select().from(tags).orderBy(asc(tags.name));

  return { session, allTags };
};
