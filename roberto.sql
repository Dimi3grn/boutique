-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : ven. 02 mai 2025 à 10:24
-- Version du serveur : 9.1.0
-- Version de PHP : 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `roberto`
--

-- --------------------------------------------------------

--
-- Structure de la table `be_inside`
--

DROP TABLE IF EXISTS `be_inside`;
CREATE TABLE IF NOT EXISTS `be_inside` (
  `montre_id` int NOT NULL AUTO_INCREMENT,
  `pannier_id` int NOT NULL,
  PRIMARY KEY (`montre_id`,`pannier_id`),
  KEY `pannier_id` (`pannier_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_bin;

-- --------------------------------------------------------

--
-- Structure de la table `categories`
--

DROP TABLE IF EXISTS `categories`;
CREATE TABLE IF NOT EXISTS `categories` (
  `categories_id` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(50) COLLATE latin1_bin DEFAULT NULL,
  `description` varchar(50) CHARACTER SET latin1 COLLATE latin1_bin DEFAULT NULL,
  PRIMARY KEY (`categories_id`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=latin1 COLLATE=latin1_bin;

--
-- Déchargement des données de la table `categories`
--

INSERT INTO `categories` (`categories_id`, `nom`, `description`) VALUES
(1, 'Diving', 'Montres adaptées à la plongée et aux activités aqu'),
(2, 'Dress', 'Montres élégantes pour les occasions formelles'),
(3, 'Sport', 'Montres robustes pour un style de vie actif'),
(4, 'Luxury', 'Montres de luxe haut de gamme');

-- --------------------------------------------------------

--
-- Structure de la table `client`
--

DROP TABLE IF EXISTS `client`;
CREATE TABLE IF NOT EXISTS `client` (
  `client_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) COLLATE latin1_bin DEFAULT NULL,
  `password` varchar(50) COLLATE latin1_bin DEFAULT NULL,
  `email` varchar(100) COLLATE latin1_bin NOT NULL,
  `favorit_id` int NOT NULL,
  `pannier_id` int NOT NULL,
  PRIMARY KEY (`client_id`),
  UNIQUE KEY `favorit_id` (`favorit_id`),
  UNIQUE KEY `pannier_id` (`pannier_id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1 COLLATE=latin1_bin;

-- --------------------------------------------------------

--
-- Structure de la table `colors`
--

DROP TABLE IF EXISTS `colors`;
CREATE TABLE IF NOT EXISTS `colors` (
  `color_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE latin1_bin NOT NULL,
  `hex_code` varchar(7) COLLATE latin1_bin NOT NULL,
  PRIMARY KEY (`color_id`)
) ENGINE=MyISAM AUTO_INCREMENT=10 DEFAULT CHARSET=latin1 COLLATE=latin1_bin;

--
-- Déchargement des données de la table `colors`
--

INSERT INTO `colors` (`color_id`, `name`, `hex_code`) VALUES
(1, 'Or', '#FFD700'),
(2, 'Argent', '#C0C0C0'),
(3, 'Noir', '#000000'),
(4, 'Bleu', '#0000FF'),
(5, 'Blanc', '#FFFFFF'),
(6, 'Vert', '#008000'),
(7, 'Rouge', '#FF0000'),
(8, 'Rose Gold', '#B76E79'),
(9, 'Bronze', '#CD7F32');

-- --------------------------------------------------------

--
-- Structure de la table `commande`
--

DROP TABLE IF EXISTS `commande`;
CREATE TABLE IF NOT EXISTS `commande` (
  `commande_id` varchar(50) COLLATE latin1_bin NOT NULL,
  `client_id` int NOT NULL,
  PRIMARY KEY (`commande_id`),
  KEY `client_id` (`client_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_bin;

-- --------------------------------------------------------

--
-- Structure de la table `favorit`
--

DROP TABLE IF EXISTS `favorit`;
CREATE TABLE IF NOT EXISTS `favorit` (
  `favorit_id` int NOT NULL AUTO_INCREMENT,
  `priority` varchar(50) COLLATE latin1_bin DEFAULT NULL,
  PRIMARY KEY (`favorit_id`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=latin1 COLLATE=latin1_bin;

-- --------------------------------------------------------

--
-- Structure de la table `favorited`
--

DROP TABLE IF EXISTS `favorited`;
CREATE TABLE IF NOT EXISTS `favorited` (
  `fav_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `montre_id` int NOT NULL,
  PRIMARY KEY (`fav_id`),
  UNIQUE KEY `user_montre_unique` (`user_id`,`montre_id`),
  KEY `user_id` (`user_id`),
  KEY `montre_id` (`montre_id`)
) ENGINE=MyISAM AUTO_INCREMENT=20 DEFAULT CHARSET=latin1 COLLATE=latin1_bin;

--
-- Déchargement des données de la table `favorited`
--

INSERT INTO `favorited` (`fav_id`, `user_id`, `montre_id`) VALUES
(18, 1, 16),
(19, 1, 17);

-- --------------------------------------------------------

--
-- Structure de la table `have`
--

DROP TABLE IF EXISTS `have`;
CREATE TABLE IF NOT EXISTS `have` (
  `montre_id` int NOT NULL AUTO_INCREMENT,
  `categories_id` int NOT NULL,
  PRIMARY KEY (`montre_id`,`categories_id`),
  KEY `categories_id` (`categories_id`)
) ENGINE=MyISAM AUTO_INCREMENT=22 DEFAULT CHARSET=latin1 COLLATE=latin1_bin;

--
-- Déchargement des données de la table `have`
--

INSERT INTO `have` (`montre_id`, `categories_id`) VALUES
(1, 2),
(1, 4),
(2, 1),
(3, 3),
(4, 4),
(5, 4),
(6, 4),
(7, 4),
(8, 2),
(9, 3),
(10, 3),
(11, 3),
(12, 2),
(13, 3),
(14, 1),
(15, 2),
(15, 4),
(16, 3),
(17, 1),
(18, 1),
(19, 1),
(20, 2),
(21, 2),
(21, 4);

-- --------------------------------------------------------

--
-- Structure de la table `have_colors`
--

DROP TABLE IF EXISTS `have_colors`;
CREATE TABLE IF NOT EXISTS `have_colors` (
  `montre_id` int NOT NULL,
  `color_id` int NOT NULL,
  PRIMARY KEY (`montre_id`,`color_id`),
  KEY `color_id` (`color_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_bin;

--
-- Déchargement des données de la table `have_colors`
--

INSERT INTO `have_colors` (`montre_id`, `color_id`) VALUES
(1, 1),
(2, 2),
(2, 4),
(2, 6),
(3, 2),
(3, 3),
(4, 1),
(4, 8),
(5, 4),
(6, 1),
(6, 8),
(7, 2),
(8, 3),
(8, 5),
(9, 3),
(9, 7),
(10, 3),
(11, 3),
(11, 4),
(12, 2),
(12, 5),
(13, 2),
(14, 3),
(14, 9),
(15, 2),
(15, 5),
(16, 3),
(16, 6),
(16, 7),
(17, 3),
(17, 4),
(17, 9),
(18, 9),
(19, 2),
(19, 4),
(20, 1),
(20, 2),
(20, 8),
(21, 1),
(21, 5);

-- --------------------------------------------------------

--
-- Structure de la table `have_matieres`
--

DROP TABLE IF EXISTS `have_matieres`;
CREATE TABLE IF NOT EXISTS `have_matieres` (
  `montre_id` int NOT NULL,
  `matiere_id` int NOT NULL,
  PRIMARY KEY (`montre_id`,`matiere_id`),
  KEY `matiere_id` (`matiere_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_bin;

--
-- Déchargement des données de la table `have_matieres`
--

INSERT INTO `have_matieres` (`montre_id`, `matiere_id`) VALUES
(1, 1),
(1, 5),
(2, 2),
(2, 4),
(3, 2),
(4, 4),
(4, 6),
(4, 7),
(5, 2),
(5, 7),
(6, 6),
(7, 2),
(8, 6),
(9, 2),
(10, 2),
(10, 3),
(10, 9),
(11, 2),
(11, 4),
(12, 2),
(13, 2),
(14, 2),
(14, 3),
(15, 5),
(15, 7),
(16, 4),
(16, 9),
(17, 8),
(18, 2),
(18, 8),
(19, 2),
(19, 3),
(20, 2),
(20, 6),
(21, 1),
(21, 5);

-- --------------------------------------------------------

--
-- Structure de la table `matieres`
--

DROP TABLE IF EXISTS `matieres`;
CREATE TABLE IF NOT EXISTS `matieres` (
  `matiere_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE latin1_bin NOT NULL,
  `description` varchar(255) COLLATE latin1_bin DEFAULT NULL,
  PRIMARY KEY (`matiere_id`)
) ENGINE=MyISAM AUTO_INCREMENT=10 DEFAULT CHARSET=latin1 COLLATE=latin1_bin;

--
-- Déchargement des données de la table `matieres`
--

INSERT INTO `matieres` (`matiere_id`, `name`, `description`) VALUES
(1, 'Or jaune 18 carats', 'Alliage d\'or, d\'argent et de cuivre offrant une teinte jaune riche'),
(2, 'Acier inoxydable', 'Alliage robuste et résistant à la corrosion'),
(3, 'Titane', 'Métal léger et résistant, hypoallergénique'),
(4, 'Céramique', 'Matériau moderne résistant aux rayures et à la décoloration'),
(5, 'Platine', 'Métal précieux dense et durable, plus rare que l\'or'),
(6, 'Or rose 18 carats', 'Alliage d\'or et de cuivre donnant une teinte rosée élégante'),
(7, 'Or blanc 18 carats', 'Alliage d\'or, de palladium et d\'argent offrant une teinte blanche'),
(8, 'Bronze', 'Alliage de cuivre et d\'étain à la patine évolutive'),
(9, 'Carbone', 'Matériau léger et moderne utilisé pour les montres sportives');

-- --------------------------------------------------------

--
-- Structure de la table `montre`
--

DROP TABLE IF EXISTS `montre`;
CREATE TABLE IF NOT EXISTS `montre` (
  `montre_id` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(50) COLLATE latin1_bin DEFAULT NULL,
  `marque` varchar(50) COLLATE latin1_bin DEFAULT NULL,
  `description` varchar(200) COLLATE latin1_bin DEFAULT NULL,
  `stock` int DEFAULT NULL,
  `prix` decimal(15,2) DEFAULT NULL,
  `reduction` int DEFAULT NULL,
  `devise` varchar(50) COLLATE latin1_bin DEFAULT NULL,
  `image1` varchar(50) COLLATE latin1_bin DEFAULT NULL,
  `image2` varchar(50) COLLATE latin1_bin DEFAULT NULL,
  PRIMARY KEY (`montre_id`)
) ENGINE=MyISAM AUTO_INCREMENT=22 DEFAULT CHARSET=latin1 COLLATE=latin1_bin;

--
-- Déchargement des données de la table `montre`
--

INSERT INTO `montre` (`montre_id`, `nom`, `marque`, `description`, `stock`, `prix`, `reduction`, `devise`, `image1`, `image2`) VALUES
(1, 'Day-Date', 'Rolex', 'Montre de prestige avec affichage du jour et de la date, reconnue comme le symbole ultime du statut et de l\'élégance', 3, 34999.99, 0, 'EUR', '/static/images/watches/daydate.jpg', '/static/images/watches/daydate2.jpg'),
(2, 'Submariner', 'Rolex', 'Montre de plongée iconique avec lunette rotative unidirectionnelle et étanchéité jusqu\'à 300 mètres', 5, 8999.99, 0, 'EUR', '/static/images/watches/submariner.jpg', '/static/images/watches/submariner2.jpg'),
(3, 'Speedmaster Professional', 'Omega', 'Première montre portée sur la Lune. Chronographe mécanique avec mouvement manufacture', 8, 6500.00, 5, 'EUR', '/static/images/watches/speedmaster.jpg', '/static/images/watches/speedmaster2.jpg'),
(4, 'Royal Oak', 'Audemars Piguet', 'Montre sport de luxe avec boîtier octogonal et bracelet intégré. Finitions exceptionnelles', 3, 25000.00, 0, 'EUR', '/static/images/watches/royaloak.jpg', '/static/images/watches/royaloak2.jpg'),
(5, 'Nautilus', 'Patek Philippe', 'Montre sport-chic au design iconique inspiré des hublots de navire. Mouvement ultra-fin', 2, 35000.00, 0, 'EUR', '/static/images/watches/nautilus.jpg', '/static/images/watches/nautilus2.jpg'),
(6, 'Santos', 'Cartier', 'Première montre-bracelet moderne, créée pour l\'aviateur Alberto Santos-Dumont en 1904', 7, 7200.00, 0, 'EUR', '/static/images/watches/santos.jpg', '/static/images/watches/santos2.jpg'),
(7, 'Portugieser Chronograph', 'IWC', 'Montre élégante aux proportions parfaites avec affichage chronographe classique', 6, 8500.00, 7, 'EUR', '/static/images/watches/portugieser.jpg', '/static/images/watches/portugieser2.jpg'),
(8, 'Reverso Classic', 'Jaeger-LeCoultre', 'Montre rectangulaire emblématique à boîtier réversible créée pour les joueurs de polo', 4, 7900.00, 0, 'EUR', '/static/images/watches/reverso.jpg', '/static/images/watches/reverso2.jpg'),
(9, 'Monaco', 'TAG Heuer', 'Montre carrée légendaire rendue célèbre par Steve McQueen. Premier chronographe automatique étanche', 8, 5950.00, 10, 'EUR', '/static/images/watches/monaco.jpg', '/static/images/watches/monaco2.jpg'),
(10, 'Luminor Marina', 'Panerai', 'Montre militaire d\'origine italienne avec pont protège-couronne breveté. Grande lisibilité', 6, 7900.00, 0, 'EUR', '/static/images/watches/luminor.jpg', '/static/images/watches/luminor2.jpg'),
(11, 'Navitimer B01', 'Breitling', 'Montre d\'aviation avec règle à calcul circulaire intégrée. Chronographe de précision', 5, 8500.00, 5, 'EUR', '/static/images/watches/navitimer.jpg', '/static/images/watches/navitimer2.jpg'),
(12, 'Snowflake', 'Grand Seiko', 'Montre japonaise avec cadran texturé inspiré de la neige fraîche. Mouvement Spring Drive', 9, 5800.00, 0, 'EUR', '/static/images/watches/snowflake.jpg', '/static/images/watches/snowflake2.jpg'),
(13, 'El Primero Chronomaster', 'Zenith', 'Premier chronographe automatique intégré à haute fréquence (36,000 alt/h)', 4, 9600.00, 8, 'EUR', '/static/images/watches/elprimero.jpg', '/static/images/watches/elprimero2.jpg'),
(14, 'Fifty Fathoms', 'Blancpain', 'Première montre de plongée moderne créée pour les nageurs de combat français', 3, 14300.00, 0, 'EUR', '/static/images/watches/fiftyfathoms.jpg', '/static/images/watches/fiftyfathoms2.jpg'),
(15, 'Patrimony', 'Vacheron Constantin', 'Montre ultra-fine d\'une élégance minimaliste. Finitions haute horlogerie', 2, 20500.00, 0, 'EUR', '/static/images/watches/patrimony.jpg', '/static/images/watches/patrimony2.jpg'),
(16, 'Big Bang', 'Hublot', 'Montre contemporaine qui fusionne matériaux traditionnels et modernes', 0, 19500.00, 12, 'EUR', '/static/images/watches/bigbang.jpg', '/static/images/watches/bigbang2.jpg'),
(17, 'Black Bay', 'Tudor', 'Montre de plongée vintage inspirée des modèles historiques Tudor des années 50', 10, 3750.00, 0, 'EUR', '/static/images/watches/blackbay.jpg', '/static/images/watches/blackbay2.jpg'),
(18, 'Legend Diver', 'Longines', 'Réédition fidèle d\'une montre de plongée des années 1960 avec lunette interne', 8, 2400.00, 5, 'EUR', '/static/images/watches/legenddiver.jpg', '/static/images/watches/legenddiver2.jpg'),
(19, 'Seamaster 300', 'Omega', 'Montre de plongée professionnelle rendue célèbre par James Bond', 12, 5200.00, 0, 'EUR', '/static/images/watches/seamaster300.jpg', '/static/images/watches/seamaster300_2.jpg'),
(20, 'Datejust 41', 'Rolex', 'Montre classique avec date à agrandissement et bracelet jubilé. Symbole d\'élégance', 9, 7900.00, 0, 'EUR', '/static/images/watches/datejust.jpg', '/static/images/watches/datejust2.jpg'),
(21, 'Lange 1', 'A. Lange & Söhne', 'Chef-d\'œuvre de haute horlogerie allemande avec affichage asymétrique et grande date', 2, 33000.00, 0, 'EUR', '/static/images/watches/lange1.jpg', '/static/images/watches/lange1_2.jpg');

-- --------------------------------------------------------

--
-- Structure de la table `panier`
--

DROP TABLE IF EXISTS `panier`;
CREATE TABLE IF NOT EXISTS `panier` (
  `pannier_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `montre_id` int NOT NULL,
  `quantity` int NOT NULL,
  PRIMARY KEY (`pannier_id`)
) ENGINE=MyISAM AUTO_INCREMENT=14 DEFAULT CHARSET=latin1 COLLATE=latin1_bin;

-- --------------------------------------------------------

--
-- Structure de la table `posseder`
--

DROP TABLE IF EXISTS `posseder`;
CREATE TABLE IF NOT EXISTS `posseder` (
  `montre_id` varchar(50) COLLATE latin1_bin NOT NULL,
  `commande_id` varchar(50) COLLATE latin1_bin NOT NULL,
  PRIMARY KEY (`montre_id`,`commande_id`),
  KEY `commande_id` (`commande_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_bin;

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) CHARACTER SET latin1 COLLATE latin1_bin NOT NULL,
  `email` varchar(100) CHARACTER SET latin1 COLLATE latin1_bin NOT NULL,
  `password` varchar(255) CHARACTER SET latin1 COLLATE latin1_bin NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `username` (`username`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=latin1 COLLATE=latin1_bin;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`user_id`, `username`, `email`, `password`, `created_at`, `updated_at`) VALUES
(1, 'Dimi3', 'itishypdimi3@gmail.com', '$2b$10$H3ERCUe9HZUP8/Fv0tYaDeklLCtFQqWSUNh9NJm/xnV2CuVo5OV1q', '2025-04-20 15:06:51', NULL);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
