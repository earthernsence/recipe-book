import { sql } from "drizzle-orm";
import { integer, real, sqliteTable, text, primaryKey } from "drizzle-orm/sqlite-core";

// Recipe schema

export const recipes = sqliteTable("recipes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description"),
  cuisineType: text("cuisine_type"),
  mealType: text("meal_type"), // like breakfast, lunch, dinner, etc...
  prepTimeMinutes: integer("prep_time_minutes"),
  cookTimeMinutes: integer("cook_time_minutes"),
  notes: text("notes"), // stored as md, rendered properly on the site
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`)
});

// Ingredients schema

export const ingredients = sqliteTable("ingredients", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  recipeId: integer("recipe_id")
    .notNull()
    .references(() => recipes.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  amount: real("amount").notNull(), // real number works better here for portion sizes
  unit: text("unit"),
  orderIndex: integer("order_index").notNull()
});

// Recipe steps schema

export const steps = sqliteTable("steps", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  recipeId: integer("recipe_id")
    .notNull()
    .references(() => recipes.id, { onDelete: "cascade" }),
  orderIndex: integer("order_index").notNull(),
  content: text("content").notNull() // also stored as md
});

// Recipe tagging-related schema

export const tags = sqliteTable("tags", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique()
});

export const recipeTags = sqliteTable(
  "recipe_tags",
  {
    recipeId: integer("recipe_id")
      .notNull()
      .references(() => recipes.id, { onDelete: "cascade" }),
    tagId: integer("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" })
  },
  table => [primaryKey({ columns: [table.recipeId, table.tagId] })]
);

// Initialise inferred types

export type Recipe = typeof recipes.$inferSelect;
export type Ingredient = typeof ingredients.$inferSelect;
export type Step = typeof steps.$inferSelect;
export type Tag = typeof tags.$inferSelect;
