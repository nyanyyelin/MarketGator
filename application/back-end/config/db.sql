-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema csc648db
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `csc648db` ;

-- -----------------------------------------------------
-- Schema csc648db
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `csc648db` DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
USE `csc648db` ;

-- -----------------------------------------------------
-- Table `csc648db`.`categories`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `csc648db`.`categories` ;

CREATE TABLE IF NOT EXISTS `csc648db`.`categories` (
  `idcategories` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`idcategories`))
ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;


-- -----------------------------------------------------
-- Table `csc648db`.`users`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `csc648db`.`users` ;

CREATE TABLE IF NOT EXISTS `csc648db`.`users` (
  `user_id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(80) NOT NULL,
  `email` VARCHAR(80) NOT NULL,
  `password` VARCHAR(60) NOT NULL,
  UNIQUE INDEX `username` (`username` ASC) VISIBLE,
  UNIQUE INDEX `email` (`email` ASC) VISIBLE,
  UNIQUE INDEX `password` (`password` ASC) VISIBLE,
  PRIMARY KEY (`user_id`))
ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;


-- -----------------------------------------------------
-- Table `csc648db`.`listing`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `csc648db`.`listing` ;

CREATE TABLE IF NOT EXISTS `csc648db`.`listing` (
  `idlisting` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(400) NOT NULL,
  `price` INT NOT NULL DEFAULT 0,
  `description` MEDIUMTEXT NOT NULL,
  `photopath` VARCHAR(2048) NOT NULL,
  `live` TINYINT NULL DEFAULT 1,
  `created` DATETIME NOT NULL,
  `user_user_id` INT NOT NULL,
  PRIMARY KEY (`idlisting`),
  INDEX `fk_listing_user_idx` (`user_user_id` ASC) VISIBLE,
  CONSTRAINT `fk_listing_user`
    FOREIGN KEY (`user_user_id`)
    REFERENCES `csc648db`.`users` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;


-- -----------------------------------------------------
-- Table `csc648db`.`listingcategories`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `csc648db`.`listingcategories` ;

CREATE TABLE IF NOT EXISTS `csc648db`.`listingcategories` (
  `idlistingcategories` INT NOT NULL AUTO_INCREMENT,
  `categories_idcategories` INT NOT NULL,
  `listing_idlisting` INT NOT NULL,
  PRIMARY KEY (`idlistingcategories`),
  INDEX `fk_itemcategories_categories1_idx` (`categories_idcategories` ASC) VISIBLE,
  INDEX `fk_listingcategories_listing1_idx` (`listing_idlisting` ASC) VISIBLE,
  CONSTRAINT `fk_itemcategories_categories1`
    FOREIGN KEY (`categories_idcategories`)
    REFERENCES `csc648db`.`categories` (`idcategories`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_listingcategories_listing1`
    FOREIGN KEY (`listing_idlisting`)
    REFERENCES `csc648db`.`listing` (`idlisting`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;


-- -----------------------------------------------------
-- Table `csc648db`.`message`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `csc648db`.`message` ;

CREATE TABLE IF NOT EXISTS `csc648db`.`message` (
  `idmessage` INT NOT NULL AUTO_INCREMENT,
  `message` MEDIUMTEXT NOT NULL,
  `created` DATETIME NOT NULL,
  `sender` VARCHAR(16) NOT NULL,
  `reciever` VARCHAR(16) NOT NULL,
  `listing_idlisting` INT NOT NULL,
  PRIMARY KEY (`idmessage`),
  INDEX `fk_message_users1_idx` (`sender` ASC) VISIBLE,
  INDEX `fk_message_listing1_idx` (`listing_idlisting` ASC) VISIBLE,
  CONSTRAINT `fk_message_users1`
    FOREIGN KEY (`sender`)
    REFERENCES `csc648db`.`users` (`username`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_message_users2`
    FOREIGN KEY (`reciever`)
    REFERENCES `csc648db`.`users` (`username`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_message_listing1`
    FOREIGN KEY (`listing_idlisting`)
    REFERENCES `csc648db`.`listing` (`idlisting`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;


-- -----------------------------------------------------
-- Table `csc648db`.`report`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `csc648db`.`report` ;

CREATE TABLE IF NOT EXISTS `csc648db`.`report` (
  `idreport` INT NOT NULL AUTO_INCREMENT,
  `report` MEDIUMTEXT NOT NULL,
  `created` DATETIME NOT NULL,
  `listing_idlisting` INT NOT NULL,
  PRIMARY KEY (`idreport`),
  INDEX `fk_report_listing1_idx` (`listing_idlisting` ASC) VISIBLE,
  CONSTRAINT `fk_report_listing1`
    FOREIGN KEY (`listing_idlisting`)
    REFERENCES `csc648db`.`listing` (`idlisting`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;



SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

INSERT INTO `users` VALUES (1,'username','email','password');

INSERT INTO listing VALUES (NULL,'Bamboo Cork Jar',20,'Bamboo Cork Jar','/images/products/ikea-365-jar-with-lid-glass-bamboo__0650353_pe706148_s5.png',0,NOW(),1);
INSERT INTO listing VALUES (NULL,'Pitcher with Cork',25,'Pitcher with Cork','/images/products/ikea-365-pitcher-with-lid-clear-glass-cork__0711276_pe728114_s5.png',0,NOW(),1);
INSERT INTO listing VALUES (NULL,'Metal Scoops',22,'Metal Scoops','/images/products/ikea-365-scoop-set-of-2-metal__0789442_pe763984_s5.png',0,NOW(),1);
INSERT INTO listing VALUES (NULL,'Clear Glass Bottle',30,'Clear Glass Bottle','/images/products/korken-bottle-with-stopper-clear-glass__0711275_pe728113_s5.png',0,NOW(),1);
INSERT INTO listing VALUES (NULL,'Frother',22,'Frother','/images/products/mattlig-milk-frothing-jug-stainless-steel__0713349_pe729455_s5.png',0,NOW(),1);
INSERT INTO listing VALUES (NULL,'A Thing',8,'A Thing','/images/products/utrusta-partition-silver-color__0176726_pe329539_s5.png',0,NOW(),1);
INSERT INTO listing VALUES (NULL,'Cup',33,'Cup','/images/products/vardagen-coffee-cup-and-saucer-off-white__0711051_pe727947_s5.png',0,NOW(),1);
INSERT INTO listing VALUES (NULL,'Lid Organizer',14,'Lid Organizer','/images/products/variera-pot-lid-organizer-stainless-steel__0626878_pe693056_s5.png',0,NOW(),1);

INSERT INTO categories VALUES (NULL,'Kitchen');
INSERT INTO categories VALUES (NULL,'Decor');
INSERT INTO categories VALUES (NULL,'Metal');
INSERT INTO categories VALUES (NULL,'Cups');

INSERT INTO listingcategories VALUES (NULL ,1,2);
INSERT INTO listingcategories VALUES (NULL,1,3);
INSERT INTO listingcategories VALUES (NULL,1,4);
INSERT INTO listingcategories VALUES (NULL,1,5);
INSERT INTO listingcategories VALUES (NULL,1,7);
INSERT INTO listingcategories VALUES (NULL,1,8);
INSERT INTO listingcategories VALUES (NULL,2,4);
INSERT INTO listingcategories VALUES (NULL,2,6);
INSERT INTO listingcategories VALUES (NULL,2,8);
INSERT INTO listingcategories VALUES (NULL,3,3);
INSERT INTO listingcategories VALUES (NULL,3,4);
INSERT INTO listingcategories VALUES (NULL,3,5);
INSERT INTO listingcategories VALUES (NULL,3,6);
INSERT INTO listingcategories VALUES (NULL,3,8);
INSERT INTO listingcategories VALUES (NULL,4,7);