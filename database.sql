-- ICE (ყინული) Database Schema

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('admin','user') NOT NULL DEFAULT 'user',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `user_data` (
  `user_id` int(11) NOT NULL,
  `board_json` longtext,
  `bg_gradient` varchar(50) DEFAULT 'ice',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  CONSTRAINT `fk_user_data_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default admin user if not exists (username: admin, password: nimda)
-- Password hash generated using PHP password_hash('nimda', PASSWORD_DEFAULT)
INSERT INTO `users` (`username`, `password_hash`, `role`)
SELECT 'admin', '$2y$10$wTfGEwXp8vM/Jc10IHT0UeF/kLh5RQKvWlI44GjZhW3sHwP0YqXvC', 'admin'
WHERE NOT EXISTS (SELECT 1 FROM `users` WHERE `username` = 'admin');

-- Initialize empty data for admin
INSERT INTO `user_data` (`user_id`, `board_json`, `bg_gradient`) 
SELECT id, '{"projects":[{"id":"proj-1","name":"პროექტი 1","lists":[],"cards":{},"listOrder":[]}],"activeProjectId":"proj-1"}', 'ice'
FROM `users` WHERE `username` = 'admin'
ON DUPLICATE KEY UPDATE `user_id` = VALUES(`user_id`);
