-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Apr 26, 2025 at 06:10 PM
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
-- Database: `fitdb`
--

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `id` int(11) NOT NULL,
  `sender_id` int(11) NOT NULL,
  `receiver_id` int(11) NOT NULL,
  `message` text DEFAULT NULL,
  `file_path` varchar(255) DEFAULT NULL,
  `file_type` varchar(50) DEFAULT NULL,
  `u_r_d` enum('sent','delivered','read') DEFAULT 'sent',
  `timestamp` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`id`, `sender_id`, `receiver_id`, `message`, `file_path`, `file_type`, `u_r_d`, `timestamp`) VALUES
(1, 2, 3, 'hello', NULL, 'text', 'sent', '2025-04-19 15:58:41'),
(2, 3, 2, 'hello', NULL, 'text', 'sent', '2025-04-19 15:59:26'),
(3, 2, 3, 'hey', NULL, 'text', 'sent', '2025-04-19 16:20:08'),
(4, 3, 2, 'hello', NULL, 'text', 'sent', '2025-04-19 16:20:52'),
(5, 2, 3, 'hii', NULL, 'text', 'sent', '2025-04-21 16:50:01'),
(6, 3, 2, 'hii', NULL, 'text', 'sent', '2025-04-22 00:25:59');

-- --------------------------------------------------------

--
-- Table structure for table `session_token`
--

CREATE TABLE `session_token` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `session_token` text NOT NULL,
  `ip_address` varchar(255) DEFAULT NULL,
  `device_info` text DEFAULT NULL,
  `status` varchar(250) NOT NULL DEFAULT 'Login',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `session_token`
--

INSERT INTO `session_token` (`id`, `user_id`, `session_token`, `ip_address`, `device_info`, `status`, `created_at`) VALUES
(23, 3, 'a41d3c4a4dc97a12fdb44c2901685658c9b214e550a62ff2ef2b592eb89a087d', '223.228.111.189', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', 'Login', '2025-04-24 07:14:42'),
(25, 3, 'c1882284ede2293cece6ad491ca2345e970d7da91b7f69d8ab64039f0bf16dd3', '157.48.189.41', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', 'Login', '2025-04-24 08:01:41'),
(26, 3, 'a3023c35b2ecbde8215c10dd7cb55cf7501d8fb2272120007ca68da319b2684f', '117.99.195.4', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', 'Login', '2025-04-24 13:53:36'),
(27, 3, '1f81573cad36bdeb6e8ec9647fa8d4114c720b089a1b7ba90cfb750f3e3528b8', '117.99.195.4', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', 'Login', '2025-04-24 14:14:09'),
(28, 3, '30d7b6fa1593c18553bc08dd664dd5c75c9ababbffe80ccbcc431d23c499c87e', '117.99.195.4', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', 'Login', '2025-04-24 14:14:55'),
(29, 3, '41c88c0a65b9b540bb4a57d1731199b9ef613666d39528dc14e62f1fc3b8ff51', '157.47.36.197', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', 'Login', '2025-04-26 05:44:07'),
(30, 2, '0fd74d91bdc87f806b94e8f09d1e2aa3a620c4f9e7d2efa833f2bd60dd60932b', '117.99.206.255', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', 'Login', '2025-04-26 08:40:37'),
(31, 3, 'aef613dd5ce59d74e1009e3c91b16edef4d11f005a625960fc2e3350165025f6', '117.99.206.255', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', 'Login', '2025-04-26 08:43:16'),
(32, 3, 'f9b19ce52e6c1206e9f6e714ec40759941de06dc608b1cae6185d727576d93f2', '117.99.206.255', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', 'Login', '2025-04-26 09:27:22'),
(33, 3, '3368904d6dd6bd244ad9320e74657c2ccc389138e7ea2b8b9def0e1334c62984', '117.99.206.255', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', 'Login', '2025-04-26 09:56:49'),
(34, 3, '27365bbbf7bcbad08afb6ae6041ef4478015cdc7012f6bbcb743fff5cbbbe9e9', '117.99.206.255', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', 'Login', '2025-04-26 09:57:13');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`) VALUES
(1, 'Hari', '', '$2b$10$EpINIDZg/Wwvf9d8gEGcjeB0VBay/w3pVmWvm7QqUm8qRglsC/Nve'),
(2, 'Devil', 'Devil@gmail.com', '$2b$10$vtvpYyJYNMDZJYoL6Q1Esem101Hza3uWP9nUbIBgZIuI130Tq9xlm'),
(3, 'Demo', 'Demo@gmail.com', '$2b$10$n5CWRXA9sorCugQSmgPYCeAT0RHpzYXLWOKRb0GYBvZRQ1WDpCwqO');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `session_token`
--
ALTER TABLE `session_token`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `session_token`
--
ALTER TABLE `session_token`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `session_token`
--
ALTER TABLE `session_token`
  ADD CONSTRAINT `session_token_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
