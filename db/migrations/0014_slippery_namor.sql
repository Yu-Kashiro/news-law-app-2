PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_law_articles` (
	`id` text PRIMARY KEY NOT NULL,
	`law_id` text NOT NULL,
	`article_num` text NOT NULL,
	`article_text` text NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	FOREIGN KEY (`law_id`) REFERENCES `laws`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_law_articles`("id", "law_id", "article_num", "article_text", "created_at", "updated_at") SELECT "id", "law_id", "article_num", "article_text", "created_at", "updated_at" FROM `law_articles`;--> statement-breakpoint
DROP TABLE `law_articles`;--> statement-breakpoint
ALTER TABLE `__new_law_articles` RENAME TO `law_articles`;--> statement-breakpoint
PRAGMA foreign_keys=ON;