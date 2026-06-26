DROP INDEX "tags_name_unique";--> statement-breakpoint
ALTER TABLE `recipes` ALTER COLUMN "meal_type" TO "meal_type" text NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `tags_name_unique` ON `tags` (`name`);