PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_news_items` (
	`id` text PRIMARY KEY NOT NULL,
	`article_id` text NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`link` text NOT NULL,
	`og_image` text,
	`laws` text,
	`law_column_title` text,
	`law_column` text,
	`keywords` text,
	`published_at` integer NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_news_items`("id", "article_id", "title", "description", "link", "og_image", "laws", "law_column_title", "law_column", "keywords", "published_at", "created_at", "updated_at") SELECT "id", "article_id", "title", "description", "link", "og_image", "laws", "law_column_title", "law_column", "keywords", "published_at", "created_at", "updated_at" FROM `news_items`;--> statement-breakpoint
DROP TABLE `news_items`;--> statement-breakpoint
ALTER TABLE `__new_news_items` RENAME TO `news_items`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `news_items_article_id_unique` ON `news_items` (`article_id`);