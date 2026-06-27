import { asc } from "drizzle-orm";
import { redirect } from "@sveltejs/kit";

import { db } from "$lib/server/db";
import { tags } from "$lib/server/db/schema";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async event => {
  const session = await event.locals.auth();
  if (!session) redirect(303, "/");

  const allTags = await db.select().from(tags).orderBy(asc(tags.name));
  return { allTags };
};
