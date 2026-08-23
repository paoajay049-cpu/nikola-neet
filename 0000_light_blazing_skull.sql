CREATE TABLE `content_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`course` text NOT NULL,
	`chapter` text NOT NULL,
	`title` text NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`content_type` text NOT NULL,
	`language` text DEFAULT 'Hindi + English' NOT NULL,
	`access_level` text DEFAULT 'free' NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`external_url` text,
	`object_key` text,
	`original_file_name` text,
	`file_size` integer,
	`created_by` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `content_course_idx` ON `content_items` (`course`);--> statement-breakpoint
CREATE INDEX `content_status_idx` ON `content_items` (`status`);--> statement-breakpoint
CREATE INDEX `content_type_idx` ON `content_items` (`content_type`);--> statement-breakpoint
CREATE TABLE `enrollments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`course` text NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`created_by` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `enrollment_email_course_idx` ON `enrollments` (`email`,`course`);--> statement-breakpoint
CREATE TABLE `student_progress` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`content_id` integer NOT NULL,
	`completed` integer DEFAULT false NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `progress_email_content_idx` ON `student_progress` (`email`,`content_id`);