CREATE TABLE `laws` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`summary` text NOT NULL,
	`purpose` text,
	`key_points` text,
	`related_laws` text,
	`official_url` text,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `laws_name_unique` ON `laws` (`name`);