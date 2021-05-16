/*
 Navicat Premium Data Transfer

 Source Server         : aliyun
 Source Server Type    : MySQL
 Source Server Version : 80018
 Source Host           : rm-bp1vx095wt77a964q5o.mysql.rds.aliyuncs.com:3306
 Source Schema         : game

 Target Server Type    : MySQL
 Target Server Version : 80018
 File Encoding         : 65001

 Date: 01/03/2021 10:10:21
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for area_info
-- ----------------------------
DROP TABLE IF EXISTS `area_info`;
CREATE TABLE `area_info`  (
  `aid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `ismaintenance` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否维护',
  `paid` int(11) NULL DEFAULT NULL COMMENT '合服父ID',
  `create_time` int(11) NOT NULL,
  PRIMARY KEY (`aid`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of area_info
-- ----------------------------
INSERT INTO `area_info` VALUES (1, '游戏区服1', 0, NULL, 1613899304);
INSERT INTO `area_info` VALUES (2, '游戏区服2', 1, NULL, 1613899314);
INSERT INTO `area_info` VALUES (3, '游戏区服3', 0, NULL, 1613899324);
INSERT INTO `area_info` VALUES (4, '游戏区服4', 0, NULL, 1613899334);

-- ----------------------------
-- Table structure for player_currency
-- ----------------------------
DROP TABLE IF EXISTS `player_currency`;
CREATE TABLE `player_currency`  (
  `pid` int(11) NOT NULL,
  `gold1` int(11) NOT NULL DEFAULT 0,
  `gold2` int(11) NOT NULL DEFAULT 0,
  `gold3` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`pid`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of player_currency
-- ----------------------------
INSERT INTO `player_currency` VALUES (1, 0, 500, 0);

-- ----------------------------
-- Table structure for player_info
-- ----------------------------
DROP TABLE IF EXISTS `player_info`;
CREATE TABLE `player_info`  (
  `pid` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) NOT NULL,
  `aid` int(11) NOT NULL,
  `rid` int(11) NULL DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `lv` int(11) NOT NULL,
  `exp` int(11) NOT NULL,
  `pos` mediumblob NULL,
  `phone` varchar(11) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `create_time` int(11) NOT NULL DEFAULT 0,
  `login_time` int(11) NULL DEFAULT NULL,
  `logout_time` int(11) NULL DEFAULT NULL,
  `online` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`pid`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of player_info
-- ----------------------------
INSERT INTO `player_info` VALUES (1, 74, 4, 1, '千里风行', 999, 4234, 0x7B226D6964223A312C2278223A3233342C2279223A3536317D, NULL, 1614251201, NULL, NULL, 0);
INSERT INTO `player_info` VALUES (2, 74, 4, 1, '千里风行111', 999, 4234, 0x7B226D6964223A312C2278223A3233342C2279223A3536317D, NULL, 1614251201, NULL, NULL, 0);

-- ----------------------------
-- Table structure for user_info
-- ----------------------------
DROP TABLE IF EXISTS `user_info`;
CREATE TABLE `user_info`  (
  `uid` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `aid` int(11) NULL DEFAULT NULL,
  `register_time` int(11) NOT NULL,
  `login_time` int(11) NOT NULL,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 75 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user_info
-- ----------------------------
INSERT INTO `user_info` VALUES (74, 'a', '0cc175b9c0f1b6a831c399e269772661', 4, 1613838465, 1614513402);

-- ----------------------------
-- Procedure structure for create_user
-- ----------------------------
DROP PROCEDURE IF EXISTS `create_user`;
delimiter ;;
CREATE PROCEDURE `create_user`(iusername varchar(255),ipassword varchar(255),itime int)
e:BEGIN
	DECLARE iuid INT;
	
	DECLARE t_username varchar(255);
	SELECT username INTO t_username FROM user_info WHERE username = iusername GROUP BY username;
	IF t_username != '' THEN
		LEAVE e;
	END IF;

	INSERT INTO user_info(username,password,register_time,login_time) VALUES(iusername,ipassword,itime,itime);
	SET iuid = last_insert_id();
	
	SELECT * FROM user_info WHERE uid = iuid;
END
;;
delimiter ;

SET FOREIGN_KEY_CHECKS = 1;
