-- Drop existing table if it exists (optional)
DROP TABLE IF EXISTS `panier`;

-- Create the cart table with the right structure
CREATE TABLE IF NOT EXISTS `panier` (
  `pannier_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `montre_id` int NOT NULL,
  `quantity` int NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`pannier_id`),
  UNIQUE KEY `user_montre_unique` (`user_id`, `montre_id`),
  KEY `user_id` (`user_id`),
  KEY `montre_id` (`montre_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_bin;