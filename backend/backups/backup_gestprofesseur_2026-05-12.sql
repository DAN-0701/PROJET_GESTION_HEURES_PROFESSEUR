/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: affectation
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `affectation` (
  `idaff` int NOT NULL AUTO_INCREMENT,
  `matproff` int NOT NULL,
  `idmat` int NOT NULL,
  `idfil` int NOT NULL,
  `idniv` int NOT NULL,
  `idanne` int NOT NULL,
  PRIMARY KEY (`idaff`),
  KEY `fk_affectation_professeur` (`matproff`),
  KEY `fk_affectation_matiere` (`idmat`),
  KEY `fk_affectation_filiere` (`idfil`),
  KEY `fk_affectation_niveau` (`idniv`),
  KEY `fk_affectation_anne` (`idanne`),
  CONSTRAINT `fk_affectation_anne` FOREIGN KEY (`idanne`) REFERENCES `annee` (`idanne`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_affectation_filiere` FOREIGN KEY (`idfil`) REFERENCES `filiere` (`idfil`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_affectation_matiere` FOREIGN KEY (`idmat`) REFERENCES `matiere` (`idmat`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_affectation_niveau` FOREIGN KEY (`idniv`) REFERENCES `niveau` (`idniv`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_affectation_professeur` FOREIGN KEY (`matproff`) REFERENCES `professeur` (`matprof`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 11 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: annee
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `annee` (
  `idanne` int NOT NULL AUTO_INCREMENT,
  `libeanne` varchar(10) COLLATE utf8mb4_general_ci NOT NULL,
  `date_debut` date NOT NULL,
  `date_fin` date NOT NULL,
  PRIMARY KEY (`idanne`)
) ENGINE = InnoDB AUTO_INCREMENT = 8 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: departement
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `departement` (
  `iddep` int NOT NULL AUTO_INCREMENT,
  `libdep` text COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`iddep`)
) ENGINE = InnoDB AUTO_INCREMENT = 5 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: filiere
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `filiere` (
  `idfil` int NOT NULL AUTO_INCREMENT,
  `libfil` text COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`idfil`)
) ENGINE = InnoDB AUTO_INCREMENT = 6 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: heure_realise
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `heure_realise` (
  `idheure` int NOT NULL AUTO_INCREMENT,
  `libheure` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `idanne` int NOT NULL,
  `nbheure` int NOT NULL DEFAULT '1',
  `statut` enum('valide', 'en_attente', 'refuse') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'en_attente',
  `motif_refus` text COLLATE utf8mb4_general_ci,
  `createat` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `datecours` date NOT NULL,
  `salle` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `idaff` int NOT NULL,
  PRIMARY KEY (`idheure`),
  KEY `fk_heurerealise_annee` (`idanne`),
  KEY `fk_heurerealise_affectation` (`idaff`),
  KEY `fk_heure_realise_parametrage` (`libheure`),
  CONSTRAINT `fk_heure_realise_parametrage` FOREIGN KEY (`libheure`) REFERENCES `parametrage` (`type_heure`) ON UPDATE CASCADE,
  CONSTRAINT `fk_heurerealise_affectation` FOREIGN KEY (`idaff`) REFERENCES `affectation` (`idaff`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_heurerealise_annee` FOREIGN KEY (`idanne`) REFERENCES `annee` (`idanne`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 23 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: journallog
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `journallog` (
  `idlog` int NOT NULL AUTO_INCREMENT,
  `action` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  `temps` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `iduser` int NOT NULL,
  PRIMARY KEY (`idlog`),
  KEY `fk_utilisateur_journallog` (`iduser`),
  CONSTRAINT `fk_utilisateur_journallog` FOREIGN KEY (`iduser`) REFERENCES `utilisateur` (`iduser`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 110 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: matiere
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `matiere` (
  `idmat` int NOT NULL AUTO_INCREMENT,
  `libmat` text COLLATE utf8mb4_general_ci NOT NULL,
  `volmat` int NOT NULL,
  PRIMARY KEY (`idmat`)
) ENGINE = InnoDB AUTO_INCREMENT = 5 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: niveau
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `niveau` (
  `idniv` int NOT NULL AUTO_INCREMENT,
  `libniv` text COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`idniv`)
) ENGINE = InnoDB AUTO_INCREMENT = 6 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: parametrage
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `parametrage` (
  `type_heure` varchar(10) COLLATE utf8mb4_general_ci NOT NULL,
  `coefficient` float NOT NULL DEFAULT '1',
  PRIMARY KEY (`type_heure`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: professeur
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `professeur` (
  `matprof` int NOT NULL AUTO_INCREMENT,
  `nomprof` text COLLATE utf8mb4_general_ci NOT NULL,
  `prenprof` text COLLATE utf8mb4_general_ci NOT NULL,
  `grade` enum('assistant', 'maitre assistant', 'professeur') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `statut` enum('Permanent', 'Vacataire') COLLATE utf8mb4_general_ci NOT NULL,
  `iddep` int DEFAULT NULL,
  `iduser` int NOT NULL,
  `idth` int DEFAULT NULL,
  `volume_statutaire` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`matprof`),
  KEY `fk_professeur_departement` (`iddep`),
  KEY `fk_professeur_user` (`iduser`),
  KEY `fk_professeur_thoraire` (`idth`),
  CONSTRAINT `fk_professeur_departement` FOREIGN KEY (`iddep`) REFERENCES `departement` (`iddep`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_professeur_thoraire` FOREIGN KEY (`idth`) REFERENCES `thoraire` (`idth`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_professeur_user` FOREIGN KEY (`iduser`) REFERENCES `utilisateur` (`iduser`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 10 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: thoraire
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `thoraire` (
  `idth` int NOT NULL AUTO_INCREMENT,
  `libth` enum('assistant', 'maitre assistant', 'professeur') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `montantth` int NOT NULL,
  PRIMARY KEY (`idth`)
) ENGINE = InnoDB AUTO_INCREMENT = 5 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: utilisateur
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `utilisateur` (
  `iduser` int NOT NULL AUTO_INCREMENT,
  `nomuser` text COLLATE utf8mb4_general_ci NOT NULL,
  `prenuser` text COLLATE utf8mb4_general_ci NOT NULL,
  `emailuser` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  `passuser` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `roleuser` enum(
  'administrateur',
  'ressource humaine',
  'professeur'
  ) COLLATE utf8mb4_general_ci NOT NULL,
  `first_login` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`iduser`),
  UNIQUE KEY `emailuser` (`emailuser`)
) ENGINE = InnoDB AUTO_INCREMENT = 27 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: affectation
# ------------------------------------------------------------

INSERT INTO
  `affectation` (
    `idaff`,
    `matproff`,
    `idmat`,
    `idfil`,
    `idniv`,
    `idanne`
  )
VALUES
  (2, 2, 2, 1, 2, 2);
INSERT INTO
  `affectation` (
    `idaff`,
    `matproff`,
    `idmat`,
    `idfil`,
    `idniv`,
    `idanne`
  )
VALUES
  (4, 2, 2, 1, 3, 2);
INSERT INTO
  `affectation` (
    `idaff`,
    `matproff`,
    `idmat`,
    `idfil`,
    `idniv`,
    `idanne`
  )
VALUES
  (5, 2, 2, 2, 1, 4);
INSERT INTO
  `affectation` (
    `idaff`,
    `matproff`,
    `idmat`,
    `idfil`,
    `idniv`,
    `idanne`
  )
VALUES
  (6, 3, 2, 3, 1, 4);
INSERT INTO
  `affectation` (
    `idaff`,
    `matproff`,
    `idmat`,
    `idfil`,
    `idniv`,
    `idanne`
  )
VALUES
  (7, 3, 2, 1, 4, 4);
INSERT INTO
  `affectation` (
    `idaff`,
    `matproff`,
    `idmat`,
    `idfil`,
    `idniv`,
    `idanne`
  )
VALUES
  (8, 5, 3, 1, 1, 4);
INSERT INTO
  `affectation` (
    `idaff`,
    `matproff`,
    `idmat`,
    `idfil`,
    `idniv`,
    `idanne`
  )
VALUES
  (9, 5, 2, 4, 5, 4);
INSERT INTO
  `affectation` (
    `idaff`,
    `matproff`,
    `idmat`,
    `idfil`,
    `idniv`,
    `idanne`
  )
VALUES
  (10, 4, 4, 5, 4, 4);

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: annee
# ------------------------------------------------------------

INSERT INTO
  `annee` (`idanne`, `libeanne`, `date_debut`, `date_fin`)
VALUES
  (2, '2026-2027', '2026-04-30', '2026-05-01');
INSERT INTO
  `annee` (`idanne`, `libeanne`, `date_debut`, `date_fin`)
VALUES
  (4, 'mois', '2026-05-01', '2026-05-31');
INSERT INTO
  `annee` (`idanne`, `libeanne`, `date_debut`, `date_fin`)
VALUES
  (6, 'ANNEE 2026', '2027-01-01', '2027-12-31');

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: departement
# ------------------------------------------------------------

INSERT INTO
  `departement` (`iddep`, `libdep`)
VALUES
  (1, 'informatique');
INSERT INTO
  `departement` (`iddep`, `libdep`)
VALUES
  (3, 'comptabilite');
INSERT INTO
  `departement` (`iddep`, `libdep`)
VALUES
  (4, 'mathemathique');

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: filiere
# ------------------------------------------------------------

INSERT INTO
  `filiere` (`idfil`, `libfil`)
VALUES
  (1, 'developpement');
INSERT INTO
  `filiere` (`idfil`, `libfil`)
VALUES
  (2, 'web');
INSERT INTO
  `filiere` (`idfil`, `libfil`)
VALUES
  (3, 'devops');
INSERT INTO
  `filiere` (`idfil`, `libfil`)
VALUES
  (4, 'marketing');
INSERT INTO
  `filiere` (`idfil`, `libfil`)
VALUES
  (5, 'mathématiques ');

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: heure_realise
# ------------------------------------------------------------

INSERT INTO
  `heure_realise` (
    `idheure`,
    `libheure`,
    `idanne`,
    `nbheure`,
    `statut`,
    `motif_refus`,
    `createat`,
    `datecours`,
    `salle`,
    `idaff`
  )
VALUES
  (
    15,
    'CM',
    4,
    1,
    'valide',
    NULL,
    '2026-05-09 18:36:30',
    '2026-05-10',
    '4',
    2
  );
INSERT INTO
  `heure_realise` (
    `idheure`,
    `libheure`,
    `idanne`,
    `nbheure`,
    `statut`,
    `motif_refus`,
    `createat`,
    `datecours`,
    `salle`,
    `idaff`
  )
VALUES
  (
    16,
    'CM',
    4,
    1,
    'valide',
    NULL,
    '2026-05-09 19:03:39',
    '2026-05-10',
    '14',
    2
  );
INSERT INTO
  `heure_realise` (
    `idheure`,
    `libheure`,
    `idanne`,
    `nbheure`,
    `statut`,
    `motif_refus`,
    `createat`,
    `datecours`,
    `salle`,
    `idaff`
  )
VALUES
  (
    17,
    'TD',
    4,
    4,
    'valide',
    NULL,
    '2026-05-10 17:47:15',
    '2026-05-17',
    'info 4',
    7
  );
INSERT INTO
  `heure_realise` (
    `idheure`,
    `libheure`,
    `idanne`,
    `nbheure`,
    `statut`,
    `motif_refus`,
    `createat`,
    `datecours`,
    `salle`,
    `idaff`
  )
VALUES
  (
    19,
    'TD',
    4,
    1,
    'valide',
    NULL,
    '2026-05-10 18:30:47',
    '2026-05-17',
    '5',
    7
  );
INSERT INTO
  `heure_realise` (
    `idheure`,
    `libheure`,
    `idanne`,
    `nbheure`,
    `statut`,
    `motif_refus`,
    `createat`,
    `datecours`,
    `salle`,
    `idaff`
  )
VALUES
  (
    20,
    'TP',
    4,
    4,
    'valide',
    NULL,
    '2026-05-10 22:37:41',
    '2026-05-17',
    'info',
    8
  );
INSERT INTO
  `heure_realise` (
    `idheure`,
    `libheure`,
    `idanne`,
    `nbheure`,
    `statut`,
    `motif_refus`,
    `createat`,
    `datecours`,
    `salle`,
    `idaff`
  )
VALUES
  (
    21,
    'TD',
    4,
    1,
    'valide',
    NULL,
    '2026-05-12 19:17:31',
    '2026-05-21',
    '24',
    10
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: journallog
# ------------------------------------------------------------

INSERT INTO
  `journallog` (`idlog`, `action`, `temps`, `iduser`)
VALUES
  (
    1,
    'Modification taux horaire',
    '2026-05-02 23:57:05',
    1
  );
INSERT INTO
  `journallog` (`idlog`, `action`, `temps`, `iduser`)
VALUES
  (
    2,
    'Modification taux horaire',
    '2026-05-02 23:57:05',
    1
  );
INSERT INTO
  `journallog` (`idlog`, `action`, `temps`, `iduser`)
VALUES
  (3, 'Modification matiere', '2026-05-03 00:35:53', 1);
INSERT INTO
  `journallog` (`idlog`, `action`, `temps`, `iduser`)
VALUES
  (4, 'Modification matiere', '2026-05-03 00:36:50', 1);
INSERT INTO
  `journallog` (`idlog`, `action`, `temps`, `iduser`)
VALUES
  (5, 'Création affectation', '2026-05-07 13:39:19', 1);
INSERT INTO
  `journallog` (`idlog`, `action`, `temps`, `iduser`)
VALUES
  (
    6,
    'Modification administrateur',
    '2026-05-08 20:58:47',
    1
  );
INSERT INTO
  `journallog` (`idlog`, `action`, `temps`, `iduser`)
VALUES
  (
    7,
    'Modification administrateur',
    '2026-05-08 20:59:20',
    1
  );
INSERT INTO
  `journallog` (`idlog`, `action`, `temps`, `iduser`)
VALUES
  (
    8,
    'changement de mot de passe',
    '2026-05-08 21:46:35',
    4
  );
INSERT INTO
  `journallog` (`idlog`, `action`, `temps`, `iduser`)
VALUES
  (
    9,
    'changement de mot de passe',
    '2026-05-08 21:57:27',
    10
  );
INSERT INTO
  `journallog` (`idlog`, `action`, `temps`, `iduser`)
VALUES
  (10, 'saisie des heures', '2026-05-09 18:36:30', 4);
INSERT INTO
  `journallog` (`idlog`, `action`, `temps`, `iduser`)
VALUES
  (
    11,
    'validation des heures',
    '2026-05-09 18:42:27',
    4
  );
INSERT INTO
  `journallog` (`idlog`, `action`, `temps`, `iduser`)
VALUES
  (12, 'saisie des heures', '2026-05-09 19:03:39', 4);
INSERT INTO
  `journallog` (`idlog`, `action`, `temps`, `iduser`)
VALUES
  (
    13,
    'validation des heures',
    '2026-05-09 19:03:42',
    4
  );
INSERT INTO
  `journallog` (`idlog`, `action`, `temps`, `iduser`)
VALUES
  (
    14,
    'Suppression affectation',
    '2026-05-10 01:11:40',
    1
  );
INSERT INTO
  `journallog` (`idlog`, `action`, `temps`, `iduser`)
VALUES
  (
    15,
    'Sauvegarde Base de Données',
    '2026-05-10 10:36:30',
    1
  );
INSERT INTO
  `journallog` (`idlog`, `action`, `temps`, `iduser`)
VALUES
  (
    16,
    'Création administrateur',
    '2026-05-10 16:03:09',
    1
  );
INSERT INTO
  `journallog` (`idlog`, `action`, `temps`, `iduser`)
VALUES
  (
    18,
    'Création administrateur',
    '2026-05-10 17:25:08',
    1
  );
INSERT INTO
  `journallog` (`idlog`, `action`, `temps`, `iduser`)
VALUES
  (
    19,
    'changement de mot de passe',
    '2026-05-10 17:27:04',
    12
  );
INSERT INTO
  `journallog` (`idlog`, `action`, `temps`, `iduser`)
VALUES
  (
    20,
    'changement de mot de passe',
    '2026-05-10 17:27:07',
    12
  );
INSERT INTO
  `journallog` (`idlog`, `action`, `temps`, `iduser`)
VALUES
  (
    21,
    'Suppression administrateur',
    '2026-05-10 17:28:33',
    12
  );
INSERT INTO
  `journallog` (`idlog`, `action`, `temps`, `iduser`)
VALUES
  (
    22,
    'Création administrateur',
    '2026-05-10 17:29:09',
    12
  );
INSERT INTO
  `journallog` (`idlog`, `action`, `temps`, `iduser`)
VALUES
  (
    23,
    'Modification administrateur',
    '2026-05-10 17:29:43',
    12
  );
INSERT INTO
  `journallog` (`idlog`, `action`, `temps`, `iduser`)
VALUES
  (24, 'creation RH', '2026-05-10 17:30:32', 12);
INSERT INTO
  `journallog` (`idlog`, `action`, `temps`, `iduser`)
VALUES
  (
    25,
    'creation professeur',
    '2026-05-10 17:32:26',
    12
  );
INSERT INTO
  `journallog` (`idlog`, `action`, `temps`, `iduser`)
VALUES
  (
    26,
    'Creation de filiere',
    '2026-05-10 17:33:54',
    12
  );
INSERT INTO
  `journallog` (`idlog`, `action`, `temps`, `iduser`)
VALUES
  (
    27,
    'Création affectation',
    '2026-05-10 17:34:36',
    12
  );
INSERT INTO
  `journallog` (`idlog`, `action`, `temps`, `iduser`)
VALUES
  (
    28,
    'Création affectation',
    '2026-05-10 17:35:59',
    12
  );
INSERT INTO
  `journallog` (`idlog`, `action`, `temps`, `iduser`)
VALUES
  (29, 'Creation de niveau', '2026-05-10 17:36:36', 12);
INSERT INTO
  `journallog` (`idlog`, `action`, `temps`, `iduser`)
VALUES
  (
    30,
    'Modification affectation',
    '2026-05-10 17:36:44',
    12
  );
INSERT INTO
  `journallog` (`idlog`, `action`, `temps`, `iduser`)
VALUES
  (
    31,
    'creation d\'une annee',
    '2026-05-10 17:39:16',
    12
  );
INSERT INTO
  `journallog` (`idlog`, `action`, `temps`, `iduser`)
VALUES
  (
    32,
    'Creation taux horaire',
    '2026-05-10 17:40:30',
    12
  );
INSERT INTO
  `journallog` (`idlog`, `action`, `temps`, `iduser`)
VALUES
  (
    33,
    'Modification équivalence CM',
    '2026-05-10 17:41:32',
    12
  );
INSERT INTO
  `journallog` (`idlog`, `action`, `temps`, `iduser`)
VALUES
  (
    34,
    'Modification équivalence TD',
    '2026-05-10 17:41:32',
    12
  );
INSERT INTO
  `journallog` (`idlog`, `action`, `temps`, `iduser`)
VALUES
  (
    35,
    'Modification équivalence TP',
    '2026-05-10 17:41:32',
    12
  );
INSERT INTO
  `journallog` (`idlog`, `action`, `temps`, `iduser`)
VALUES
  (
    36,
    'Modification équivalence CM',
    '2026-05-10 17:41:41',
    12
  );
INSERT INTO
  `journallog` (`idlog`, `action`, `temps`, `iduser`)
VALUES
  (
    37,
    'Modification équivalence TD',
    '2026-05-10 17:41:41',
    12
  );
INSERT INTO
  `journallog` (`idlog`, `action`, `temps`, `iduser`)
VALUES
  (
    38,
    'Modification équivalence TP',
    '2026-05-10 17:41:41',
    12
  );
INSERT INTO
  `journallog` (`idlog`, `action`, `temps`, `iduser`)
VALUES
  (39, 'Creation matiere', '2026-05-10 17:42:21', 12);
INSERT INTO
  `journallog` (`idlog`, `action`, `temps`, `iduser`)
VALUES
  (40, 'saisie des heures', '2026-05-10 17:47:16', 4);
INSERT INTO
  `journallog` (`idlog`, `action`, `temps`, `iduser`)
VALUES
  (
    41,
    'validation des heures',
    '2026-05-10 17:47:46',
    4
  );
INSERT INTO
  `journallog` (`idlog`, `action`, `temps`, `iduser`)
VALUES
  (42, 'saisie des heures', '2026-05-10 17:51:17', 4);
INSERT INTO
  `journallog` (`idlog`, `action`, `temps`, `iduser`)
VALUES
  (
    43,
    'validation des heures',
    '2026-05-10 17:51:32',
    4
  );
INSERT INTO
  `journallog` (`idlog`, `action`, `temps`, `iduser`)
VALUES
  (44, 'creation professeur', '2026-05-10 18:24:45', 1);
INSERT INTO
  `journallog` (`idlog`, `action`, `temps`, `iduser`)
VALUES
  (45, 'saisie des heures', '2026-05-10 18:30:47', 4);
INSERT INTO
  `journallog` (`idlog`, `action`, `temps`, `iduser`)
VALUES
  (
    46,
    'validation des heures',
    '2026-05-10 18:36:59',
    4
  );
INSERT INTO
  `journallog` (`idlog`, `action`, `temps`, `iduser`)
VALUES
  (
    47,
    'Modification professeur',
    '2026-05-10 18:50:46',
    1
  );
INSERT INTO
  `journallog` (`idlog`, `action`, `temps`, `iduser`)
VALUES
  (
    48,
    'changement de mot de passe',
    '2026-05-10 18:57:24',
    15
  );
INSERT INTO
  `journallog` (`idlog`, `action`, `temps`, `iduser`)
VALUES
  (
    49,
    'Création administrateur',
    '2026-05-10 19:59:07',
    1
  );
INSERT INTO
  `journallog` (`idlog`, `action`, `temps`, `iduser`)
VALUES
  (
    51,
    'Création administrateur',
    '2026-05-10 22:21:35',
    1
  );
INSERT INTO
  `journallog` (`idlog`, `action`, `temps`, `iduser`)
VALUES
  (
    52,
    'Modification administrateur',
    '2026-05-10 22:22:20',
    1
  );
INSERT INTO
  `journallog` (`idlog`, `action`, `temps`, `iduser`)
VALUES
  (53, 'creation RH', '2026-05-10 22:23:50', 1);
INSERT INTO
  `journallog` (`idlog`, `action`, `temps`, `iduser`)
VALUES
  (54, 'Modification RH', '2026-05-10 22:24:18', 1);
INSERT INTO
  `journallog` (`idlog`, `action`, `temps`, `iduser`)
VALUES
  (55, 'creation professeur', '2026-05-10 22:25:59', 1);
INSERT INTO
  `journallog` (`idlog`, `action`, `temps`, `iduser`)
VALUES
  (
    56,
    'Modification professeur',
    '2026-05-10 22:26:43',
    1
  );
INSERT INTO
  `journallog` (`idlog`, `action`, `temps`, `iduser`)
VALUES
  (
    57,
    'Création affectation',
    '2026-05-10 22:27:49',
    1
  );
INSERT INTO
  `journallog` (`idlog`, `action`, `temps`, `iduser`)
VALUES
  (58, 'Creation de filiere', '2026-05-10 22:28:42', 1);
INSERT INTO
  `journallog` (`idlog`, `action`, `temps`, `iduser`)
VALUES
  (59, 'Creation de niveau', '2026-05-10 22:29:13', 1);
INSERT INTO
  `journallog` (`idlog`, `action`, `temps`, `iduser`)
VALUES
  (
    60,
    'Création affectation',
    '2026-05-10 22:29:38',
    1
  );
INSERT INTO
  `journallog` (`idlog`, `action`, `temps`, `iduser`)
VALUES
  (
    61,
    'creation d\'une annee',
    '2026-05-10 22:31:03',
    1
  );
INSERT INTO
  `journallog` (`idlog`, `action`, `temps`, `iduser`)
VALUES
  (
    62,
    'suppression d\'annee',
    '2026-05-10 22:31:40',
    1
  );
INSERT INTO
  `journallog` (`idlog`, `action`, `temps`, `iduser`)
VALUES
  (
    63,
    'Creation taux horaire',
    '2026-05-10 22:32:07',
    1
  );
INSERT INTO
  `journallog` (`idlog`, `action`, `temps`, `iduser`)
VALUES
  (
    64,
    'Modification taux horaire',
    '2026-05-10 22:32:30',
    1
  );
INSERT INTO
  `journallog` (`idlog`, `action`, `temps`, `iduser`)
VALUES
  (
    65,
    'Modification taux horaire',
    '2026-05-10 22:32:30',
    1
  );
INSERT INTO
  `journallog` (`idlog`, `action`, `temps`, `iduser`)
VALUES
  (
    66,
    'Modification équivalence CM',
    '2026-05-10 22:33:38',
    1
  );
INSERT INTO
  `journallog` (`idlog`, `action`, `temps`, `iduser`)
VALUES
  (
    67,
    'Modification équivalence TD',
    '2026-05-10 22:33:38',
    1
  );
INSERT INTO
  `journallog` (`idlog`, `action`, `temps`, `iduser`)
VALUES
  (
    68,
    'Modification équivalence TP',
    '2026-05-10 22:33:38',
    1
  );
INSERT INTO
  `journallog` (`idlog`, `action`, `temps`, `iduser`)
VALUES
  (69, 'Creation matiere', '2026-05-10 22:34:12', 1);
INSERT INTO
  `journallog` (`idlog`, `action`, `temps`, `iduser`)
VALUES
  (70, 'saisie des heures', '2026-05-10 22:37:41', 4);
INSERT INTO
  `journallog` (`idlog`, `action`, `temps`, `iduser`)
VALUES
  (
    71,
    'validation des heures',
    '2026-05-10 22:37:56',
    4
  );
INSERT INTO
  `journallog` (`idlog`, `action`, `temps`, `iduser`)
VALUES
  (
    72,
    'Modification équivalence CM',
    '2026-05-11 09:36:16',
    1
  );
INSERT INTO
  `journallog` (`idlog`, `action`, `temps`, `iduser`)
VALUES
  (
    73,
    'Modification équivalence TD',
    '2026-05-11 09:36:21',
    1
  );
INSERT INTO
  `journallog` (`idlog`, `action`, `temps`, `iduser`)
VALUES
  (
    74,
    'Modification équivalence TP',
    '2026-05-11 09:36:26',
    1
  );
INSERT INTO
  `journallog` (`idlog`, `action`, `temps`, `iduser`)
VALUES
  (
    75,
    'Sauvegarde Base de Données',
    '2026-05-11 10:58:34',
    1
  );
INSERT INTO
  `journallog` (`idlog`, `action`, `temps`, `iduser`)
VALUES
  (
    76,
    'Importation de 2 professeurs',
    '2026-05-12 17:27:35',
    1
  );
INSERT INTO
  `journallog` (`idlog`, `action`, `temps`, `iduser`)
VALUES
  (
    77,
    'refus d\'heure par le prof (ID: 18)',
    '2026-05-12 18:40:39',
    10
  );
INSERT INTO
  `journallog` (`idlog`, `action`, `temps`, `iduser`)
VALUES
  (
    78,
    'suppression des heures',
    '2026-05-12 18:47:12',
    4
  );
INSERT INTO
  `journallog` (`idlog`, `action`, `temps`, `iduser`)
VALUES
  (
    79,
    'Création administrateur',
    '2026-05-12 19:01:51',
    1
  );
INSERT INTO
  `journallog` (`idlog`, `action`, `temps`, `iduser`)
VALUES
  (
    80,
    'changement de mot de passe',
    '2026-05-12 19:03:22',
    23
  );
INSERT INTO
  `journallog` (`idlog`, `action`, `temps`, `iduser`)
VALUES
  (
    81,
    'Modification administrateur',
    '2026-05-12 19:04:23',
    23
  );
INSERT INTO
  `journallog` (`idlog`, `action`, `temps`, `iduser`)
VALUES
  (
    82,
    'Suppression administrateur',
    '2026-05-12 19:04:52',
    23
  );
INSERT INTO
  `journallog` (`idlog`, `action`, `temps`, `iduser`)
VALUES
  (83, 'creation RH', '2026-05-12 19:05:32', 23);
INSERT INTO
  `journallog` (`idlog`, `action`, `temps`, `iduser`)
VALUES
  (84, 'Modification RH', '2026-05-12 19:05:58', 23);
INSERT INTO
  `journallog` (`idlog`, `action`, `temps`, `iduser`)
VALUES
  (85, 'Suppression RH', '2026-05-12 19:06:15', 23);
INSERT INTO
  `journallog` (`idlog`, `action`, `temps`, `iduser`)
VALUES
  (
    86,
    'creation professeur',
    '2026-05-12 19:08:05',
    23
  );
INSERT INTO
  `journallog` (`idlog`, `action`, `temps`, `iduser`)
VALUES
  (
    87,
    'Modification professeur',
    '2026-05-12 19:08:36',
    23
  );
INSERT INTO
  `journallog` (`idlog`, `action`, `temps`, `iduser`)
VALUES
  (
    88,
    'Suppression professeur',
    '2026-05-12 19:08:58',
    23
  );
INSERT INTO
  `journallog` (`idlog`, `action`, `temps`, `iduser`)
VALUES
  (
    89,
    'Importation de 1 professeurs',
    '2026-05-12 19:09:38',
    23
  );
INSERT INTO
  `journallog` (`idlog`, `action`, `temps`, `iduser`)
VALUES
  (
    90,
    'Creation de filiere',
    '2026-05-12 19:11:31',
    23
  );
INSERT INTO
  `journallog` (`idlog`, `action`, `temps`, `iduser`)
VALUES
  (
    91,
    'Creation de departement',
    '2026-05-12 19:11:58',
    23
  );
INSERT INTO
  `journallog` (`idlog`, `action`, `temps`, `iduser`)
VALUES
  (
    92,
    'Création affectation',
    '2026-05-12 19:12:03',
    23
  );
INSERT INTO
  `journallog` (`idlog`, `action`, `temps`, `iduser`)
VALUES
  (
    93,
    'creation d\'une annee',
    '2026-05-12 19:13:49',
    23
  );
INSERT INTO
  `journallog` (`idlog`, `action`, `temps`, `iduser`)
VALUES
  (
    94,
    'suppression d\'annee',
    '2026-05-12 19:14:24',
    23
  );
INSERT INTO
  `journallog` (`idlog`, `action`, `temps`, `iduser`)
VALUES
  (
    95,
    'Creation taux horaire',
    '2026-05-12 19:14:42',
    23
  );
INSERT INTO
  `journallog` (`idlog`, `action`, `temps`, `iduser`)
VALUES
  (
    96,
    'Modification équivalence CM',
    '2026-05-12 19:15:27',
    23
  );
INSERT INTO
  `journallog` (`idlog`, `action`, `temps`, `iduser`)
VALUES
  (
    97,
    'Modification équivalence TD',
    '2026-05-12 19:15:27',
    23
  );
INSERT INTO
  `journallog` (`idlog`, `action`, `temps`, `iduser`)
VALUES
  (
    98,
    'Modification équivalence TP',
    '2026-05-12 19:15:28',
    23
  );
INSERT INTO
  `journallog` (`idlog`, `action`, `temps`, `iduser`)
VALUES
  (99, 'saisie des heures', '2026-05-12 19:17:31', 4);
INSERT INTO
  `journallog` (`idlog`, `action`, `temps`, `iduser`)
VALUES
  (
    100,
    'validation des heures',
    '2026-05-12 19:17:59',
    4
  );
INSERT INTO
  `journallog` (`idlog`, `action`, `temps`, `iduser`)
VALUES
  (101, 'saisie des heures', '2026-05-12 19:19:32', 4);
INSERT INTO
  `journallog` (`idlog`, `action`, `temps`, `iduser`)
VALUES
  (
    102,
    'validation des heures',
    '2026-05-12 19:19:41',
    4
  );
INSERT INTO
  `journallog` (`idlog`, `action`, `temps`, `iduser`)
VALUES
  (
    103,
    'refus d\'heure par le prof (ID: 22)',
    '2026-05-12 19:22:12',
    10
  );
INSERT INTO
  `journallog` (`idlog`, `action`, `temps`, `iduser`)
VALUES
  (
    104,
    'modification des heures',
    '2026-05-12 20:01:43',
    4
  );
INSERT INTO
  `journallog` (`idlog`, `action`, `temps`, `iduser`)
VALUES
  (
    105,
    'modification des heures',
    '2026-05-12 20:01:51',
    4
  );
INSERT INTO
  `journallog` (`idlog`, `action`, `temps`, `iduser`)
VALUES
  (
    106,
    'suppression des heures',
    '2026-05-12 20:01:59',
    4
  );
INSERT INTO
  `journallog` (`idlog`, `action`, `temps`, `iduser`)
VALUES
  (
    107,
    'refus d\'heure par le prof (ID: 15)',
    '2026-05-12 20:17:01',
    10
  );
INSERT INTO
  `journallog` (`idlog`, `action`, `temps`, `iduser`)
VALUES
  (
    108,
    'réinitialisation de l\'heure (ID: 15)',
    '2026-05-12 20:17:34',
    4
  );
INSERT INTO
  `journallog` (`idlog`, `action`, `temps`, `iduser`)
VALUES
  (
    109,
    'validation des heures',
    '2026-05-12 20:17:37',
    4
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: matiere
# ------------------------------------------------------------

INSERT INTO
  `matiere` (`idmat`, `libmat`, `volmat`)
VALUES
  (2, 'info', 63);
INSERT INTO
  `matiere` (`idmat`, `libmat`, `volmat`)
VALUES
  (3, 'devopemment mobile', 60);
INSERT INTO
  `matiere` (`idmat`, `libmat`, `volmat`)
VALUES
  (4, 'ANALASE MATH', 30);

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: niveau
# ------------------------------------------------------------

INSERT INTO
  `niveau` (`idniv`, `libniv`)
VALUES
  (1, 'licence3');
INSERT INTO
  `niveau` (`idniv`, `libniv`)
VALUES
  (2, 'licence 2');
INSERT INTO
  `niveau` (`idniv`, `libniv`)
VALUES
  (3, 'Master1');
INSERT INTO
  `niveau` (`idniv`, `libniv`)
VALUES
  (4, 'licence 1');
INSERT INTO
  `niveau` (`idniv`, `libniv`)
VALUES
  (5, 'MASTER 2');

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: parametrage
# ------------------------------------------------------------

INSERT INTO
  `parametrage` (`type_heure`, `coefficient`)
VALUES
  ('CM', 1.52);
INSERT INTO
  `parametrage` (`type_heure`, `coefficient`)
VALUES
  ('TD', 1);
INSERT INTO
  `parametrage` (`type_heure`, `coefficient`)
VALUES
  ('TP', 0.75);

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: professeur
# ------------------------------------------------------------

INSERT INTO
  `professeur` (
    `matprof`,
    `nomprof`,
    `prenprof`,
    `grade`,
    `statut`,
    `iddep`,
    `iduser`,
    `idth`,
    `volume_statutaire`
  )
VALUES
  (
    2,
    'amael',
    'grif',
    'assistant',
    'Permanent',
    1,
    10,
    1,
    192
  );
INSERT INTO
  `professeur` (
    `matprof`,
    `nomprof`,
    `prenprof`,
    `grade`,
    `statut`,
    `iddep`,
    `iduser`,
    `idth`,
    `volume_statutaire`
  )
VALUES
  (
    3,
    'natsu',
    'dragnir',
    'assistant',
    'Permanent',
    1,
    15,
    1,
    192
  );
INSERT INTO
  `professeur` (
    `matprof`,
    `nomprof`,
    `prenprof`,
    `grade`,
    `statut`,
    `iddep`,
    `iduser`,
    `idth`,
    `volume_statutaire`
  )
VALUES
  (4, 'blue', 'once', 'assistant', 'Vacataire', 4, 16, 1, 0);
INSERT INTO
  `professeur` (
    `matprof`,
    `nomprof`,
    `prenprof`,
    `grade`,
    `statut`,
    `iddep`,
    `iduser`,
    `idth`,
    `volume_statutaire`
  )
VALUES
  (
    5,
    'miguel',
    'ines',
    'maitre assistant',
    'Permanent',
    1,
    20,
    2,
    105
  );
INSERT INTO
  `professeur` (
    `matprof`,
    `nomprof`,
    `prenprof`,
    `grade`,
    `statut`,
    `iddep`,
    `iduser`,
    `idth`,
    `volume_statutaire`
  )
VALUES
  (
    7,
    'jule',
    'norman',
    'maitre assistant',
    'Permanent',
    NULL,
    22,
    2,
    105
  );
INSERT INTO
  `professeur` (
    `matprof`,
    `nomprof`,
    `prenprof`,
    `grade`,
    `statut`,
    `iddep`,
    `iduser`,
    `idth`,
    `volume_statutaire`
  )
VALUES
  (
    8,
    'jonh',
    'france',
    'maitre assistant',
    'Permanent',
    NULL,
    25,
    2,
    143
  );
INSERT INTO
  `professeur` (
    `matprof`,
    `nomprof`,
    `prenprof`,
    `grade`,
    `statut`,
    `iddep`,
    `iduser`,
    `idth`,
    `volume_statutaire`
  )
VALUES
  (
    9,
    'laurent',
    'christian',
    'assistant',
    'Vacataire',
    NULL,
    26,
    1,
    0
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: thoraire
# ------------------------------------------------------------

INSERT INTO
  `thoraire` (`idth`, `libth`, `montantth`)
VALUES
  (1, 'assistant', 6000);
INSERT INTO
  `thoraire` (`idth`, `libth`, `montantth`)
VALUES
  (2, 'maitre assistant', 15000);
INSERT INTO
  `thoraire` (`idth`, `libth`, `montantth`)
VALUES
  (3, 'professeur', 20000);
INSERT INTO
  `thoraire` (`idth`, `libth`, `montantth`)
VALUES
  (4, 'maitre assistant', 52000);

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: utilisateur
# ------------------------------------------------------------

INSERT INTO
  `utilisateur` (
    `iduser`,
    `nomuser`,
    `prenuser`,
    `emailuser`,
    `passuser`,
    `roleuser`,
    `first_login`
  )
VALUES
  (
    1,
    'NDAM',
    'andy',
    'daniel@gmail.com',
    '$2b$10$6f91Nbij1pEiWNeeA1i7cO17dyC2x6HKdGkCFQEsgQzSmMuk/4Mri',
    'administrateur',
    0
  );
INSERT INTO
  `utilisateur` (
    `iduser`,
    `nomuser`,
    `prenuser`,
    `emailuser`,
    `passuser`,
    `roleuser`,
    `first_login`
  )
VALUES
  (
    3,
    'kyrie',
    'irvin1',
    'irvin@gmail.com',
    '$2b$10$4WOTLrgGagzbwX0bMoZ7wenRavJ0aSsanRj9D9bFvJqEseCqdpTzG',
    'administrateur',
    1
  );
INSERT INTO
  `utilisateur` (
    `iduser`,
    `nomuser`,
    `prenuser`,
    `emailuser`,
    `passuser`,
    `roleuser`,
    `first_login`
  )
VALUES
  (
    4,
    'jin',
    'mori',
    'mori@gmail.com',
    '$2b$10$Q3rhm5WWnFYYNUsIoivoDO3Vu1cR7hSPcJGsinnZ6SnlmS5w/WF6a',
    'ressource humaine',
    0
  );
INSERT INTO
  `utilisateur` (
    `iduser`,
    `nomuser`,
    `prenuser`,
    `emailuser`,
    `passuser`,
    `roleuser`,
    `first_login`
  )
VALUES
  (
    6,
    'park',
    'mubon',
    'mubon@gmail.com',
    '1234567',
    'professeur',
    1
  );
INSERT INTO
  `utilisateur` (
    `iduser`,
    `nomuser`,
    `prenuser`,
    `emailuser`,
    `passuser`,
    `roleuser`,
    `first_login`
  )
VALUES
  (
    7,
    'armin',
    'arlet',
    'arlet@gmail.com',
    '$2b$10$jF7Tdy12A0UprPyBXkChu.CttrkdIw5SxSxkrbQH9NxDbocXz1SFy',
    'professeur',
    1
  );
INSERT INTO
  `utilisateur` (
    `iduser`,
    `nomuser`,
    `prenuser`,
    `emailuser`,
    `passuser`,
    `roleuser`,
    `first_login`
  )
VALUES
  (
    9,
    'natsu',
    'dragnir',
    'natsu@gmail.com',
    '$2b$10$trSUVhr2QVnrfTVucC1FG.2h.zUAso0RRDvg/3ddaps66ewGiCc7G',
    'professeur',
    1
  );
INSERT INTO
  `utilisateur` (
    `iduser`,
    `nomuser`,
    `prenuser`,
    `emailuser`,
    `passuser`,
    `roleuser`,
    `first_login`
  )
VALUES
  (
    10,
    'amael',
    'grif',
    'amael@gmail.com',
    '$2b$10$5xBlJB/6GMaOVNwa8klgWO4jz0e3jhYj52Jn5PSwRBRC.Lji9J0sy',
    'professeur',
    0
  );
INSERT INTO
  `utilisateur` (
    `iduser`,
    `nomuser`,
    `prenuser`,
    `emailuser`,
    `passuser`,
    `roleuser`,
    `first_login`
  )
VALUES
  (
    12,
    'youki',
    'franck',
    'youki@gmail.com',
    '$2b$10$bwVXbUJRzCimS.oCMZxsdul2AkBesF2Do9YbDG7YU//ULoAPgzG2e',
    'administrateur',
    0
  );
INSERT INTO
  `utilisateur` (
    `iduser`,
    `nomuser`,
    `prenuser`,
    `emailuser`,
    `passuser`,
    `roleuser`,
    `first_login`
  )
VALUES
  (
    13,
    'paul',
    'jean',
    'paul@gmail.com',
    '$2b$10$tYP9JhfDeGET8LS3rfc6yeifDkmuHFLWJgVz.PCa/EUQUGW50DKvG',
    'administrateur',
    1
  );
INSERT INTO
  `utilisateur` (
    `iduser`,
    `nomuser`,
    `prenuser`,
    `emailuser`,
    `passuser`,
    `roleuser`,
    `first_login`
  )
VALUES
  (
    15,
    'natsu',
    'dragnir',
    'dragnir@gmail.com',
    '$2b$10$Fst0ORbnct8nxgYdWAe06Ol3BAfdOpMhKi.cprlbVLmgN2zeIv0SW',
    'professeur',
    0
  );
INSERT INTO
  `utilisateur` (
    `iduser`,
    `nomuser`,
    `prenuser`,
    `emailuser`,
    `passuser`,
    `roleuser`,
    `first_login`
  )
VALUES
  (
    16,
    'blue ',
    'once',
    '',
    '$2b$10$3MCRaRGxZAnSMTXeKYtml.kc3beDZ6i5rv6JHLt8Z.AvyWQ2rECSW',
    'professeur',
    1
  );
INSERT INTO
  `utilisateur` (
    `iduser`,
    `nomuser`,
    `prenuser`,
    `emailuser`,
    `passuser`,
    `roleuser`,
    `first_login`
  )
VALUES
  (
    18,
    'eren',
    'arlet',
    'eren@gmail.com',
    '$2b$10$jZbEdwDfvdE0ywJhrG6Yg.UnZezu6.ntVVw5Ae7NV2WbEnO3O4JK2',
    'administrateur',
    1
  );
INSERT INTO
  `utilisateur` (
    `iduser`,
    `nomuser`,
    `prenuser`,
    `emailuser`,
    `passuser`,
    `roleuser`,
    `first_login`
  )
VALUES
  (
    19,
    'jeanne',
    'michelline',
    'michellin@gmail.com',
    '$2b$10$6jV1cduiDUElqdnzedQtOebK68oxvQglSuKqAZw3B7wJXMW1xCap2',
    'ressource humaine',
    1
  );
INSERT INTO
  `utilisateur` (
    `iduser`,
    `nomuser`,
    `prenuser`,
    `emailuser`,
    `passuser`,
    `roleuser`,
    `first_login`
  )
VALUES
  (
    20,
    'miguel',
    'ines',
    'ines@gmail.com',
    '$2b$10$U.FxCGSVImjg6l8u0GHJGu8IHMk1hNk6/jjyjC70OWD/bI.ibd1/2',
    'professeur',
    1
  );
INSERT INTO
  `utilisateur` (
    `iduser`,
    `nomuser`,
    `prenuser`,
    `emailuser`,
    `passuser`,
    `roleuser`,
    `first_login`
  )
VALUES
  (
    22,
    'jule',
    'norman',
    'jule@gmail,com',
    '$2b$10$q1/KIBHfywfj0T82kYxoD.XLDXqL8rBS0vlPB2wa2C868zRQC6Ize',
    'professeur',
    1
  );
INSERT INTO
  `utilisateur` (
    `iduser`,
    `nomuser`,
    `prenuser`,
    `emailuser`,
    `passuser`,
    `roleuser`,
    `first_login`
  )
VALUES
  (
    23,
    'blaise ',
    'pascal',
    'blaise@gmail.com',
    '$2b$10$al35B.ZjqaI.rfJ/JqvV7eAQvrVLAyh3yMlzghAZg4kVpXiRNp0Ki',
    'administrateur',
    0
  );
INSERT INTO
  `utilisateur` (
    `iduser`,
    `nomuser`,
    `prenuser`,
    `emailuser`,
    `passuser`,
    `roleuser`,
    `first_login`
  )
VALUES
  (
    24,
    'de',
    'lafois',
    'de@gmail.com',
    '$2b$10$ma9b/gpXonSd/QRPBCVJUu8Aj.IViAMVGPY3uEi8hNTByXnebD4PS',
    'ressource humaine',
    1
  );
INSERT INTO
  `utilisateur` (
    `iduser`,
    `nomuser`,
    `prenuser`,
    `emailuser`,
    `passuser`,
    `roleuser`,
    `first_login`
  )
VALUES
  (
    25,
    'jonh',
    'francois',
    'john@gmail.com',
    '$2b$10$AnJwpxdKd68gGR3XrMvhXOO.R4MeY1hjRYVZnjVyWmW47ZpyBV5Tm',
    'professeur',
    1
  );
INSERT INTO
  `utilisateur` (
    `iduser`,
    `nomuser`,
    `prenuser`,
    `emailuser`,
    `passuser`,
    `roleuser`,
    `first_login`
  )
VALUES
  (
    26,
    'laurent',
    'christian',
    'laurent@gmail,com',
    '$2b$10$ctKb.vf.UvM.DY0oGVMCqOzMEzSk3/6a85QZf.nhsGbgflHgaqL2a',
    'professeur',
    1
  );

/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
