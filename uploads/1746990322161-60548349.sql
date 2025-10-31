-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 11, 2025 at 07:09 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `fitness_platform`
--

-- --------------------------------------------------------

--
-- Table structure for table `tf_userprogram`
--

CREATE TABLE `tf_userprogram` (
  `id` int(11) NOT NULL,
  `tdate` datetime NOT NULL DEFAULT current_timestamp(),
  `Cust_ID` int(11) NOT NULL,
  `forprogram` varchar(60) NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'RUNNING',
  `diettype` varchar(25) DEFAULT NULL,
  `programstartday` date NOT NULL,
  `total_program_days` varchar(250) NOT NULL DEFAULT '48',
  `dayofprogram` int(11) NOT NULL DEFAULT 0,
  `weight` float DEFAULT NULL,
  `targetweight` float DEFAULT NULL,
  `cycletargetweight` float DEFAULT NULL,
  `noofcycle` int(11) NOT NULL DEFAULT 1,
  `sos_history` varchar(256) DEFAULT NULL,
  `reschedule_history` varchar(256) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `tf_userprogram`
--

INSERT INTO `tf_userprogram` (`id`, `tdate`, `Cust_ID`, `forprogram`, `status`, `diettype`, `programstartday`, `total_program_days`, `dayofprogram`, `weight`, `targetweight`, `cycletargetweight`, `noofcycle`, `sos_history`, `reschedule_history`) VALUES
(1, '2025-05-01 18:00:00', 1, 'weightloss', 'RUNNING', 'Vegetarian', '2025-05-01', '48', 3, 85, 75, 80, 1, NULL, NULL),
(2, '2025-05-02 19:00:00', 2, 'weightloss', 'RUNNING', 'Non-Vegetarian', '2025-05-02', '48', 2, 65, 55, 60, 1, NULL, NULL);

--
-- Triggers `tf_userprogram`
--
DELIMITER $$
CREATE TRIGGER `tf_userprogram_before_delete` BEFORE DELETE ON `tf_userprogram` FOR EACH ROW BEGIN
  INSERT INTO `tf_userprogram_history` (
    `id`, `tdate`, `Cust_ID`, `forprogram`, `status`, `diettype`, `programstartday`, `dayofprogram`, `weight`,
    `targetweight`, `cycletargetweight`, `noofcycle`, `sos_history`, `reschedule_history`, `history_action`, `history_timestamp`
  ) VALUES (
    OLD.`id`, OLD.`tdate`, OLD.`Cust_ID`, OLD.`forprogram`, OLD.`status`, OLD.`diettype`, OLD.`programstartday`,
    OLD.`dayofprogram`, OLD.`weight`, OLD.`targetweight`, OLD.`cycletargetweight`, OLD.`noofcycle`, OLD.`sos_history`,
    OLD.`reschedule_history`, 'DELETE', NOW()
  );
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `tf_userprogram_before_update` BEFORE UPDATE ON `tf_userprogram` FOR EACH ROW BEGIN
  INSERT INTO `tf_userprogram_history` (
    `id`, `tdate`, `Cust_ID`, `forprogram`, `status`, `diettype`, `programstartday`, `dayofprogram`, `weight`,
    `targetweight`, `cycletargetweight`, `noofcycle`, `sos_history`, `reschedule_history`, `history_action`, `history_timestamp`
  ) VALUES (
    OLD.`id`, OLD.`tdate`, OLD.`Cust_ID`, OLD.`forprogram`, OLD.`status`, OLD.`diettype`, OLD.`programstartday`,
    OLD.`dayofprogram`, OLD.`weight`, OLD.`targetweight`, OLD.`cycletargetweight`, OLD.`noofcycle`, OLD.`sos_history`,
    OLD.`reschedule_history`, 'UPDATE', NOW()
  );
END
$$
DELIMITER ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tf_userprogram`
--
ALTER TABLE `tf_userprogram`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_tf_userprogram_cust_id` (`Cust_ID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tf_userprogram`
--
ALTER TABLE `tf_userprogram`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `tf_userprogram`
--
ALTER TABLE `tf_userprogram`
  ADD CONSTRAINT `fk_tf_userprogram_cust_id` FOREIGN KEY (`Cust_ID`) REFERENCES `tf_users` (`Cust_ID`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
