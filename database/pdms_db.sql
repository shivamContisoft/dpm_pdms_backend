-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Aug 22, 2021 at 03:14 PM
-- Server version: 5.7.26
-- PHP Version: 7.3.5

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `pdms_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `pdms_deliveries`
--

DROP TABLE IF EXISTS `pdms_deliveries`;
CREATE TABLE IF NOT EXISTS `pdms_deliveries` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `member_id` int(11) NOT NULL,
  `sms_status` int(11) NOT NULL COMMENT '1 for delivered, 0 for undelivered',
  `wapp_status` int(11) NOT NULL COMMENT '1 for delivered, 0 for undelivered',
  `email_status` int(11) NOT NULL COMMENT '1 for delivered, 0 for undelivered',
  `created_at` timestamp NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `pdms_deliveries`
--

INSERT INTO `pdms_deliveries` (`id`, `member_id`, `sms_status`, `wapp_status`, `email_status`, `created_at`) VALUES
(1, 1, 0, 0, 0, '2021-08-22 04:16:43'),
(2, 2, 0, 0, 0, '2021-08-22 04:16:43'),
(3, 3, 0, 0, 0, '2021-08-22 04:18:19'),
(4, 4, 0, 0, 0, '2021-08-22 04:18:19');

-- --------------------------------------------------------

--
-- Table structure for table `pdms_documents`
--

DROP TABLE IF EXISTS `pdms_documents`;
CREATE TABLE IF NOT EXISTS `pdms_documents` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `policy_no` varchar(199) NOT NULL,
  `document_name` varchar(199) NOT NULL,
  `document_directory` varchar(199) NOT NULL,
  `document_path` varchar(199) NOT NULL,
  `document_size` int(11) NOT NULL,
  `document_type` varchar(199) NOT NULL,
  `created_at` timestamp NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `pdms_documents`
--

INSERT INTO `pdms_documents` (`id`, `policy_no`, `document_name`, `document_directory`, `document_path`, `document_size`, `document_type`, `created_at`) VALUES
(5, 'TrackPayoutTallyAPI', 'TrackPayoutTallyAPI.postman_collection.json', '1629612083017', '/uploads/1629612083017/TrackPayoutTallyAPI.postman_collection.json', 104944, 'postman_collection', '2021-08-22 06:01:23'),
(4, 'trackpayout_tally_db(3)', 'trackpayout_tally_db(3).sql', '1629612083017', '/uploads/1629612083017/trackpayout_tally_db(3).sql', 618122, 'sql', '2021-08-22 06:01:23'),
(6, 'Bajaj Vendor List Credentials', 'Bajaj Vendor List Credentials.xlsx', '1629612083017', '/uploads/1629612083017/Bajaj Vendor List Credentials.xlsx', 19902, 'xlsx', '2021-08-22 06:01:23');

-- --------------------------------------------------------

--
-- Table structure for table `pdms_members`
--

DROP TABLE IF EXISTS `pdms_members`;
CREATE TABLE IF NOT EXISTS `pdms_members` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `policy_no` varchar(199) NOT NULL,
  `member_name` varchar(199) NOT NULL,
  `member_email` varchar(199) DEFAULT NULL,
  `member_sms_contact` varchar(199) DEFAULT NULL,
  `member_wapp_contact` varchar(199) DEFAULT NULL,
  `member_address` varchar(199) DEFAULT NULL,
  `member_city` varchar(199) DEFAULT NULL,
  `delivery_status` int(11) NOT NULL DEFAULT '0' COMMENT '1for delvered all, 0 for pending all',
  `created_at` timestamp NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `pdms_members`
--

INSERT INTO `pdms_members` (`id`, `policy_no`, `member_name`, `member_email`, `member_sms_contact`, `member_wapp_contact`, `member_address`, `member_city`, `delivery_status`, `created_at`, `updated_at`) VALUES
(1, 'POLI986789', 'Deepak Shinde', 'deepak.shinde0007@gmail.com', '9096016308', '9096016308', 'Kothrud, Pune', 'Pune', 0, '2021-08-22 04:16:43', '2021-08-22 04:16:43'),
(2, 'POLI897568', 'Pankaj Takale', 'pankajtakale15@gmail.com', '9096016308', '9096016308', 'Degaon, Naigaon', 'Nanded', 0, '2021-08-22 04:16:43', '2021-08-22 04:16:43'),
(3, 'POLI986789', 'Deepak Shinde', 'deepak.shinde0007@gmail.com', '9096016308', '9096016308', 'Kothrud, Pune', 'Pune', 0, '2021-08-22 04:18:19', '2021-08-22 04:18:19'),
(4, 'POLI897568', 'Pankaj Takale', 'pankajtakale15@gmail.com', '9096016308', '9096016308', 'Degaon, Naigaon', 'Nanded', 0, '2021-08-22 04:18:19', '2021-08-22 04:18:19');

-- --------------------------------------------------------

--
-- Table structure for table `pdms_users`
--

DROP TABLE IF EXISTS `pdms_users`;
CREATE TABLE IF NOT EXISTS `pdms_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(199) NOT NULL,
  `last_name` varchar(199) NOT NULL,
  `designation` varchar(199) DEFAULT NULL,
  `email_id` varchar(199) NOT NULL,
  `password` varchar(199) NOT NULL,
  `contact` varchar(199) NOT NULL,
  `created_at` timestamp NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `pdms_users`
--

INSERT INTO `pdms_users` (`id`, `first_name`, `last_name`, `designation`, `email_id`, `password`, `contact`, `created_at`, `updated_at`) VALUES
(1, 'PanKaj', 'TaKale', 'Technical Lead', 'Pankaj@contisofttechno.com', 'Admin@123', '9096016307', '2021-08-22 03:56:07', '2021-08-22 03:59:56');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
