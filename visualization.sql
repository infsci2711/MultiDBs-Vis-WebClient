-- phpMyAdmin SQL Dump
-- version 4.2.10
-- http://www.phpmyadmin.net
--
-- Host: localhost:3306
-- Generation Time: Feb 08, 2015 at 04:50 AM
-- Server version: 5.5.38
-- PHP Version: 5.6.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Database: `visualization`
--

-- --------------------------------------------------------

--
-- Table structure for table `canvases`
--

CREATE TABLE `canvases` (
  `vid` int(20) NOT NULL,
  `name` varchar(50) CHARACTER SET utf8 DEFAULT NULL,
  `user_id` int(20) NOT NULL,
  `note` varchar(500) CHARACTER SET utf8 DEFAULT NULL,
  `mdate` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  `cdate` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `privilege` int(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `canvases`
--

INSERT INTO `canvases` (`vid`, `name`, `user_id`, `note`, `mdate`, `cdate`, `privilege`) VALUES
(1, 'test', 1, NULL, '2015-01-07 19:16:10', '2015-01-07 19:16:10', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(20) NOT NULL,
  `user_names` varchar(128) CHARACTER SET utf8 DEFAULT NULL,
  `user_email` varchar(128) CHARACTER SET utf8 DEFAULT NULL,
  `user_modification` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `user_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `user_lastlogin` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `user_names`, `user_email`, `user_modification`, `user_date`, `user_lastlogin`) VALUES
(1, 'dataverse', 'epk8@pitt.edu', '2015-02-01 23:32:57', '2012-10-22 13:14:18', '2015-02-01 23:32:57');
