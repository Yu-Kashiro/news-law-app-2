CREATE TABLE `news_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`article_id` text NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`link` text NOT NULL,
	`og_image` text,
	`laws` text,
	`keywords` text,
	`published_at` integer NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `news_items_article_id_unique` ON `news_items` (`article_id`);