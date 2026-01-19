PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_laws` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`egov_law_id` text,
	`law_num` text,
	`promulgation_date` text,
	`official_url` text,
	`summary` text NOT NULL,
	`background` text,
	`pros` text,
	`cons` text,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_laws`("id", "name", "egov_law_id", "law_num", "promulgation_date", "official_url", "summary", "background", "pros", "cons", "created_at", "updated_at") SELECT "id", "name", "egov_law_id", "law_num", "promulgation_date", "official_url", "summary", "background", "pros", "cons", "created_at", "updated_at" FROM `laws`;--> statement-breakpoint
DROP TABLE `laws`;--> statement-breakpoint
ALTER TABLE `__new_laws` RENAME TO `laws`;--> statement-breakpoint
CREATE UNIQUE INDEX `laws_name_unique` ON `laws` (`name`);--> statement-breakpoint
PRAGMA foreign_keys=ON;
