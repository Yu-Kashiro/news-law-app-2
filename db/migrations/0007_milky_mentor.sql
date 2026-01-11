CREATE TABLE `law_articles` (
	`id` text PRIMARY KEY NOT NULL,
	`law_id` text NOT NULL,
	`article_num` text NOT NULL,
	`article_title` text,
	`article_text` text NOT NULL,
	`position` text,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	FOREIGN KEY (`law_id`) REFERENCES `laws`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
ALTER TABLE `news_items` ADD `related_articles` text;