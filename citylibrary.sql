/*
 Navicat Premium Dump SQL

 Source Server         : C盘Mysql
 Source Server Type    : MySQL
 Source Server Version : 80045 (8.0.45)
 Source Host           : localhost:3306
 Source Schema         : citylibrary

 Target Server Type    : MySQL
 Target Server Version : 80045 (8.0.45)
 File Encoding         : 65001

 Date: 25/04/2026 22:23:54
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for acquisition_task
-- ----------------------------
DROP TABLE IF EXISTS `acquisition_task`;
CREATE TABLE `acquisition_task`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `book_id` bigint NULL DEFAULT NULL COMMENT '图书ID',
  `book_title` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '图书标题',
  `book_isbn` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '图书ISBN',
  `type` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '任务类型',
  `source` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '来源',
  `assignee` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '负责人',
  `status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'pending' COMMENT '状态:pending-待处理,processing-处理中,completed-已完成,cancelled-已取消',
  `operator_id` bigint NULL DEFAULT NULL COMMENT '操作人ID',
  `operator_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '操作人姓名',
  `remark` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '备注',
  `deleted` tinyint NOT NULL DEFAULT 0 COMMENT '逻辑删除:0-未删除,1-已删除',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_book_id`(`book_id` ASC) USING BTREE,
  INDEX `idx_type`(`type` ASC) USING BTREE,
  INDEX `idx_status`(`status` ASC) USING BTREE,
  INDEX `idx_operator_id`(`operator_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '采购任务表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for announcement
-- ----------------------------
DROP TABLE IF EXISTS `announcement`;
CREATE TABLE `announcement`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `title` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '公告标题',
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '公告内容',
  `type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '公告类型',
  `priority` int NOT NULL DEFAULT 0 COMMENT '优先级',
  `status` tinyint NOT NULL DEFAULT 1 COMMENT '状态:0-草稿,1-已发布',
  `publisher_id` bigint NULL DEFAULT NULL COMMENT '发布人ID',
  `publisher_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '发布人姓名',
  `publish_time` datetime NULL DEFAULT NULL COMMENT '发布时间',
  `expire_time` datetime NULL DEFAULT NULL COMMENT '过期时间',
  `view_count` int NOT NULL DEFAULT 0 COMMENT '浏览次数',
  `deleted` tinyint NOT NULL DEFAULT 0 COMMENT '逻辑删除:0-未删除,1-已删除',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_status`(`status` ASC) USING BTREE,
  INDEX `idx_publish_time`(`publish_time` ASC) USING BTREE,
  INDEX `idx_type`(`type` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '公告表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for book
-- ----------------------------
DROP TABLE IF EXISTS `book`;
CREATE TABLE `book`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `isbn` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT 'ISBN编号',
  `title` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '书名',
  `subtitle` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '副标题',
  `title_en` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '英文书名',
  `author` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '作者',
  `author_en` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '英文作者名',
  `translator` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '译者',
  `publisher` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '出版社',
  `publish_year` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '出版年份',
  `edition` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '版次',
  `category` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '分类代码',
  `category_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '分类名称',
  `language` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'zh-CN' COMMENT '语言',
  `pages` int NULL DEFAULT NULL COMMENT '页数',
  `price` decimal(10, 2) NULL DEFAULT NULL COMMENT '价格',
  `tags` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '标签',
  `cover_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '封面图片URL',
  `summary` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '简介',
  `summary_en` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '英文简介',
  `status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'available' COMMENT '状态:available-可借,borrowed-已借出,reserved-已预约,maintenance-维护中',
  `total_copies` int NOT NULL DEFAULT 1 COMMENT '总副本数',
  `available_copies` int NOT NULL DEFAULT 1 COMMENT '可借副本数',
  `location` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '存放位置',
  `shelf_no` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '书架号',
  `deleted` tinyint NOT NULL DEFAULT 0 COMMENT '逻辑删除:0-未删除,1-已删除',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_title`(`title` ASC) USING BTREE,
  INDEX `idx_author`(`author` ASC) USING BTREE,
  INDEX `idx_category`(`category` ASC) USING BTREE,
  INDEX `idx_status`(`status` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 100 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '图书表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for book_import_batch
-- ----------------------------
DROP TABLE IF EXISTS `book_import_batch`;
CREATE TABLE `book_import_batch`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `batch_no` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '批次号',
  `operator_id` bigint NOT NULL COMMENT '操作人ID',
  `total_count` int NOT NULL DEFAULT 0 COMMENT '总数量',
  `success_count` int NOT NULL DEFAULT 0 COMMENT '成功数量',
  `fail_count` int NOT NULL DEFAULT 0 COMMENT '失败数量',
  `status` tinyint NOT NULL DEFAULT 0 COMMENT '状态:0-处理中,1-已完成,2-失败',
  `deleted` tinyint NOT NULL DEFAULT 0 COMMENT '逻辑删除:0-未删除,1-已删除',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_batch_no`(`batch_no` ASC) USING BTREE,
  INDEX `idx_operator_id`(`operator_id` ASC) USING BTREE,
  CONSTRAINT `fk_batch_user` FOREIGN KEY (`operator_id`) REFERENCES `user_account` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '图书导入批次表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for book_import_detail
-- ----------------------------
DROP TABLE IF EXISTS `book_import_detail`;
CREATE TABLE `book_import_detail`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `batch_id` bigint NOT NULL COMMENT '批次ID',
  `row_number` int NOT NULL COMMENT 'Excel行号',
  `isbn` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT 'ISBN',
  `title` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '书名',
  `author` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '作者',
  `status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '状态:SUCCESS-成功,FAILED-失败,SKIPPED-跳过',
  `error_message` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '错误信息',
  `book_id` bigint NULL DEFAULT NULL COMMENT '关联图书ID(成功时)',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_batch_id`(`batch_id` ASC) USING BTREE,
  INDEX `idx_batch_status`(`batch_id` ASC, `status` ASC) USING BTREE,
  INDEX `idx_book_id`(`book_id` ASC) USING BTREE,
  INDEX `idx_isbn`(`isbn` ASC) USING BTREE,
  CONSTRAINT `fk_import_detail_batch` FOREIGN KEY (`batch_id`) REFERENCES `book_import_batch` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `fk_import_detail_book` FOREIGN KEY (`book_id`) REFERENCES `book` (`id`) ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '图书导入明细表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for book_recommendation
-- ----------------------------
DROP TABLE IF EXISTS `book_recommendation`;
CREATE TABLE `book_recommendation`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `user_id` bigint NOT NULL COMMENT '用户ID',
  `book_id` bigint NOT NULL COMMENT '图书ID',
  `score` decimal(5, 2) NULL DEFAULT NULL COMMENT '推荐分数',
  `reason` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '推荐理由',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_user_id`(`user_id` ASC) USING BTREE,
  INDEX `idx_book_id`(`book_id` ASC) USING BTREE,
  CONSTRAINT `fk_recommendation_book` FOREIGN KEY (`book_id`) REFERENCES `book` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `fk_recommendation_user` FOREIGN KEY (`user_id`) REFERENCES `user_account` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '图书推荐表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for book_review
-- ----------------------------
DROP TABLE IF EXISTS `book_review`;
CREATE TABLE `book_review`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `book_id` bigint NOT NULL COMMENT '图书ID',
  `user_id` bigint NOT NULL COMMENT '用户ID',
  `rating` tinyint NOT NULL COMMENT '评分1-5星',
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '评价内容',
  `status` tinyint NOT NULL DEFAULT 1 COMMENT '状态:0-隐藏,1-显示',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_book_user`(`book_id` ASC, `user_id` ASC) USING BTREE,
  INDEX `idx_book_id`(`book_id` ASC) USING BTREE,
  INDEX `idx_user_id`(`user_id` ASC) USING BTREE,
  INDEX `idx_rating`(`rating` ASC) USING BTREE,
  CONSTRAINT `fk_review_book` FOREIGN KEY (`book_id`) REFERENCES `book` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `fk_review_user` FOREIGN KEY (`user_id`) REFERENCES `user_account` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `chk_rating` CHECK ((`rating` >= 1) and (`rating` <= 5))
) ENGINE = InnoDB AUTO_INCREMENT = 9 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '图书评价表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for borrow_record
-- ----------------------------
DROP TABLE IF EXISTS `borrow_record`;
CREATE TABLE `borrow_record`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `user_id` bigint NOT NULL COMMENT '用户ID',
  `book_id` bigint NOT NULL COMMENT '图书ID',
  `book_barcode` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '图书条形码',
  `borrow_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '借阅日期',
  `due_date` datetime NOT NULL COMMENT '应还日期',
  `return_date` datetime NULL DEFAULT NULL COMMENT '实际归还日期',
  `renew_count` int NOT NULL DEFAULT 0 COMMENT '续借次数',
  `status` tinyint NOT NULL DEFAULT 0 COMMENT '状态:0-借阅中,1-已归还,2-已逾期,3-已丢失',
  `operator_id` bigint NULL DEFAULT NULL COMMENT '操作人ID',
  `remarks` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '备注',
  `deleted` tinyint NOT NULL DEFAULT 0 COMMENT '逻辑删除:0-未删除,1-已删除',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_user_id`(`user_id` ASC) USING BTREE,
  INDEX `idx_book_id`(`book_id` ASC) USING BTREE,
  INDEX `idx_status`(`status` ASC) USING BTREE,
  INDEX `idx_borrow_date`(`borrow_date` ASC) USING BTREE,
  CONSTRAINT `fk_borrow_book` FOREIGN KEY (`book_id`) REFERENCES `book` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `fk_borrow_user` FOREIGN KEY (`user_id`) REFERENCES `user_account` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 18 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '借阅记录表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for category
-- ----------------------------
DROP TABLE IF EXISTS `category`;
CREATE TABLE `category`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '分类名称',
  `code` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '分类代码',
  `parent_id` bigint NULL DEFAULT NULL COMMENT '父分类ID',
  `sort_order` int NOT NULL DEFAULT 0 COMMENT '排序值',
  `description` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '描述',
  `deleted` tinyint NOT NULL DEFAULT 0 COMMENT '逻辑删除:0-未删除,1-已删除',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_code`(`code` ASC) USING BTREE,
  INDEX `idx_parent_id`(`parent_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 112 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '分类表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for export_task
-- ----------------------------
DROP TABLE IF EXISTS `export_task`;
CREATE TABLE `export_task`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `user_id` bigint NOT NULL COMMENT '用户ID',
  `type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '导出类型',
  `file_name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '文件名',
  `file_path` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '文件路径',
  `file_size` bigint NULL DEFAULT NULL COMMENT '文件大小(字节)',
  `format` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'XLSX' COMMENT '格式:XLSX/PDF/CSV',
  `query_params` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '查询参数JSON',
  `status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'PENDING' COMMENT '状态:PENDING-待处理,PROCESSING-处理中,COMPLETED-已完成,FAILED-失败',
  `error_message` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '错误信息',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `complete_time` datetime NULL DEFAULT NULL COMMENT '完成时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_user_id`(`user_id` ASC) USING BTREE,
  INDEX `idx_status`(`status` ASC) USING BTREE,
  INDEX `idx_create_time`(`create_time` ASC) USING BTREE,
  CONSTRAINT `fk_export_user` FOREIGN KEY (`user_id`) REFERENCES `user_account` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '导出任务表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for faq
-- ----------------------------
DROP TABLE IF EXISTS `faq`;
CREATE TABLE `faq`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `question` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '问题',
  `answer` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '答案',
  `category` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '分类',
  `sort_order` int NOT NULL DEFAULT 0 COMMENT '排序值',
  `view_count` int NOT NULL DEFAULT 0 COMMENT '浏览次数',
  `status` tinyint NOT NULL DEFAULT 1 COMMENT '状态:0-禁用,1-启用',
  `deleted` tinyint NOT NULL DEFAULT 0 COMMENT '逻辑删除:0-未删除,1-已删除',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_category`(`category` ASC) USING BTREE,
  INDEX `idx_status`(`status` ASC) USING BTREE,
  INDEX `idx_sort_order`(`sort_order` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '常见问题表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for favorite
-- ----------------------------
DROP TABLE IF EXISTS `favorite`;
CREATE TABLE `favorite`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `user_id` bigint NOT NULL COMMENT '用户ID',
  `book_id` bigint NOT NULL COMMENT '图书ID',
  `deleted` tinyint NOT NULL DEFAULT 0 COMMENT '逻辑删除:0-未删除,1-已删除',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_user_id`(`user_id` ASC) USING BTREE,
  INDEX `idx_book_id`(`book_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '收藏表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for fine_record
-- ----------------------------
DROP TABLE IF EXISTS `fine_record`;
CREATE TABLE `fine_record`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `user_id` bigint NOT NULL COMMENT '用户ID',
  `borrow_record_id` bigint NULL DEFAULT NULL COMMENT '借阅记录ID',
  `fine_type` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '罚款类型:OVERDUE-逾期,LOST-丢失,DAMAGE-损坏',
  `amount` decimal(10, 2) NOT NULL COMMENT '罚款金额',
  `paid_status` tinyint NOT NULL DEFAULT 0 COMMENT '支付状态:0-未支付,1-已支付',
  `paid_date` datetime NULL DEFAULT NULL COMMENT '支付日期',
  `operator_id` bigint NULL DEFAULT NULL COMMENT '操作人ID',
  `remarks` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '备注',
  `deleted` tinyint NOT NULL DEFAULT 0 COMMENT '逻辑删除:0-未删除,1-已删除',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_user_id`(`user_id` ASC) USING BTREE,
  INDEX `idx_borrow_record_id`(`borrow_record_id` ASC) USING BTREE,
  CONSTRAINT `fk_fine_borrow` FOREIGN KEY (`borrow_record_id`) REFERENCES `borrow_record` (`id`) ON DELETE SET NULL ON UPDATE RESTRICT,
  CONSTRAINT `fk_fine_user` FOREIGN KEY (`user_id`) REFERENCES `user_account` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '罚款记录表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for inquiry
-- ----------------------------
DROP TABLE IF EXISTS `inquiry`;
CREATE TABLE `inquiry`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `user_id` bigint NOT NULL COMMENT '用户ID',
  `title` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '咨询标题',
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '咨询内容',
  `category` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '分类',
  `status` tinyint NOT NULL DEFAULT 0 COMMENT '状态:0-待回复,1-已回复',
  `reply_content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '回复内容',
  `replier_id` bigint NULL DEFAULT NULL COMMENT '回复人ID',
  `reply_date` datetime NULL DEFAULT NULL COMMENT '回复时间',
  `deleted` tinyint NOT NULL DEFAULT 0 COMMENT '逻辑删除:0-未删除,1-已删除',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_user_id`(`user_id` ASC) USING BTREE,
  INDEX `idx_status`(`status` ASC) USING BTREE,
  CONSTRAINT `fk_inquiry_user` FOREIGN KEY (`user_id`) REFERENCES `user_account` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '咨询表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for library_location
-- ----------------------------
DROP TABLE IF EXISTS `library_location`;
CREATE TABLE `library_location`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `floor` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '楼层',
  `area` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '区域',
  `zone` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '分区',
  `shelf_range` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '书架范围',
  `category_range` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '分类范围',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '描述',
  `image_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '图片URL',
  `sort_order` int NOT NULL DEFAULT 0 COMMENT '排序值',
  `status` tinyint NOT NULL DEFAULT 1 COMMENT '状态:0-禁用,1-启用',
  `deleted` tinyint NOT NULL DEFAULT 0 COMMENT '逻辑删除:0-未删除,1-已删除',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_floor`(`floor` ASC) USING BTREE,
  INDEX `idx_area`(`area` ASC) USING BTREE,
  INDEX `idx_status`(`status` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '图书馆位置表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for notification
-- ----------------------------
DROP TABLE IF EXISTS `notification`;
CREATE TABLE `notification`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `user_id` bigint NOT NULL COMMENT '用户ID',
  `title` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '通知标题',
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '通知内容',
  `type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '通知类型',
  `is_read` tinyint NOT NULL DEFAULT 0 COMMENT '是否已读:0-未读,1-已读',
  `channel` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'IN_APP' COMMENT '渠道:IN_APP/SMS/EMAIL',
  `related_id` bigint NULL DEFAULT NULL COMMENT '关联业务ID',
  `related_type` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '关联业务类型',
  `read_time` datetime NULL DEFAULT NULL COMMENT '阅读时间',
  `deleted` tinyint NOT NULL DEFAULT 0 COMMENT '逻辑删除:0-未删除,1-已删除',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_user_id`(`user_id` ASC) USING BTREE,
  INDEX `idx_type`(`type` ASC) USING BTREE,
  INDEX `idx_is_read`(`is_read` ASC) USING BTREE,
  INDEX `idx_user_status`(`user_id` ASC, `is_read` ASC) USING BTREE,
  INDEX `idx_create_time`(`create_time` ASC) USING BTREE,
  CONSTRAINT `fk_notification_user` FOREIGN KEY (`user_id`) REFERENCES `user_account` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 19 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '通知表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for notification_template
-- ----------------------------
DROP TABLE IF EXISTS `notification_template`;
CREATE TABLE `notification_template`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '模板代码',
  `channel` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'IN_APP' COMMENT '渠道:IN_APP/SMS/EMAIL',
  `title` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '模板标题',
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '模板内容',
  `variables` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '模板变量说明',
  `status` tinyint NOT NULL DEFAULT 1 COMMENT '状态:0-禁用,1-启用',
  `type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '通知类型',
  `deleted` tinyint NOT NULL DEFAULT 0 COMMENT '逻辑删除:0-未删除,1-已删除',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_code`(`code` ASC) USING BTREE,
  INDEX `idx_channel`(`channel` ASC) USING BTREE,
  INDEX `idx_status`(`status` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 13 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '通知模板表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for operation_log
-- ----------------------------
DROP TABLE IF EXISTS `operation_log`;
CREATE TABLE `operation_log`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `user_id` bigint NULL DEFAULT NULL COMMENT '用户ID',
  `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '用户名',
  `operation` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '操作名称',
  `module` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '模块名称',
  `method` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '方法名',
  `params` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '请求参数',
  `result` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '返回结果',
  `ip_address` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT 'IP地址',
  `user_agent` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '用户代理',
  `status` tinyint NULL DEFAULT NULL COMMENT '状态:0-失败,1-成功',
  `error_message` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '错误信息',
  `execute_time` bigint NULL DEFAULT NULL COMMENT '执行时间(毫秒)',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_user_id`(`user_id` ASC) USING BTREE,
  INDEX `idx_create_time`(`create_time` ASC) USING BTREE,
  INDEX `idx_operation`(`operation` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 16 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '操作日志表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for purchase_request
-- ----------------------------
DROP TABLE IF EXISTS `purchase_request`;
CREATE TABLE `purchase_request`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `requester_id` bigint NOT NULL COMMENT '申请人ID',
  `book_title` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '书名',
  `author` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '作者',
  `isbn` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT 'ISBN',
  `quantity` int NOT NULL DEFAULT 1 COMMENT '数量',
  `publisher` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '出版社',
  `reason` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '申请理由',
  `status` tinyint NOT NULL DEFAULT 0 COMMENT '状态:0-待审核,1-已通过,2-已拒绝',
  `approve_time` datetime NULL DEFAULT NULL COMMENT '审批时间',
  `reject_reason` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '拒绝理由',
  `remarks` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '备注',
  `reviewer_id` bigint NULL DEFAULT NULL COMMENT '审核人ID',
  `review_comment` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '审核意见',
  `deleted` tinyint NOT NULL DEFAULT 0 COMMENT '逻辑删除:0-未删除,1-已删除',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_requester_id`(`requester_id` ASC) USING BTREE,
  INDEX `idx_status`(`status` ASC) USING BTREE,
  INDEX `idx_isbn`(`isbn` ASC) USING BTREE,
  INDEX `idx_create_time`(`create_time` ASC) USING BTREE,
  CONSTRAINT `fk_purchase_user` FOREIGN KEY (`requester_id`) REFERENCES `user_account` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '采购申请表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for reading_room
-- ----------------------------
DROP TABLE IF EXISTS `reading_room`;
CREATE TABLE `reading_room`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '阅览室名称',
  `location` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '位置',
  `capacity` int NOT NULL DEFAULT 0 COMMENT '容量',
  `open_time` time NULL DEFAULT NULL COMMENT '开放时间',
  `close_time` time NULL DEFAULT NULL COMMENT '关闭时间',
  `status` tinyint NOT NULL DEFAULT 1 COMMENT '状态:0-关闭,1-开放',
  `total_seats` int NOT NULL DEFAULT 0 COMMENT '总座位数',
  `available_seats` int NOT NULL DEFAULT 0 COMMENT '可用座位数',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '描述',
  `image_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '图片URL',
  `deleted` tinyint NOT NULL DEFAULT 0 COMMENT '逻辑删除:0-未删除,1-已删除',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 16 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '阅览室表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for refresh_token
-- ----------------------------
DROP TABLE IF EXISTS `refresh_token`;
CREATE TABLE `refresh_token`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `user_id` bigint NOT NULL COMMENT '用户ID',
  `token` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '刷新令牌',
  `expiry_date` datetime NOT NULL COMMENT '过期时间',
  `create_time` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `revoked` int NULL DEFAULT 0 COMMENT '是否撤销:0-未撤销,1-已撤销',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_user_id`(`user_id` ASC) USING BTREE,
  INDEX `idx_token`(`token`(255) ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 8 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '刷新令牌表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for reservation
-- ----------------------------
DROP TABLE IF EXISTS `reservation`;
CREATE TABLE `reservation`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `user_id` bigint NOT NULL COMMENT '用户ID',
  `book_id` bigint NOT NULL COMMENT '图书ID',
  `reserve_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '预约日期',
  `expire_date` datetime NOT NULL COMMENT '预约过期日期',
  `status` tinyint NOT NULL DEFAULT 0 COMMENT '状态:0-等待中,1-已通知,2-已取书,3-已取消,4-已过期',
  `notify_date` datetime NULL DEFAULT NULL COMMENT '通知日期',
  `deleted` tinyint NOT NULL DEFAULT 0 COMMENT '逻辑删除:0-未删除,1-已删除',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_user_id`(`user_id` ASC) USING BTREE,
  INDEX `idx_book_id`(`book_id` ASC) USING BTREE,
  INDEX `idx_status`(`status` ASC) USING BTREE,
  CONSTRAINT `fk_reserve_book` FOREIGN KEY (`book_id`) REFERENCES `book` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `fk_reserve_user` FOREIGN KEY (`user_id`) REFERENCES `user_account` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '图书预约表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for seat
-- ----------------------------
DROP TABLE IF EXISTS `seat`;
CREATE TABLE `seat`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `room_id` bigint NOT NULL COMMENT '阅览室ID',
  `seat_number` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '座位号',
  `seat_type` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'NORMAL' COMMENT '座位类型:NORMAL-普通,POWER-有电源,QUIET-静音,GROUP-小组',
  `has_power` tinyint NOT NULL DEFAULT 0 COMMENT '是否有电源:0-无,1-有',
  `has_lamp` tinyint NOT NULL DEFAULT 0 COMMENT '是否有台灯:0-无,1-有',
  `row_num` int NULL DEFAULT NULL COMMENT '行号',
  `col_num` int NULL DEFAULT NULL COMMENT '列号',
  `status` tinyint NOT NULL DEFAULT 0 COMMENT '状态:0-可用,1-占用,2-维护中',
  `deleted` tinyint NOT NULL DEFAULT 0 COMMENT '逻辑删除:0-未删除,1-已删除',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_room_seat`(`room_id` ASC, `seat_number` ASC) USING BTREE,
  INDEX `idx_room_id`(`room_id` ASC) USING BTREE,
  INDEX `idx_seat_type`(`seat_type` ASC) USING BTREE,
  INDEX `idx_status`(`status` ASC) USING BTREE,
  CONSTRAINT `fk_seat_room` FOREIGN KEY (`room_id`) REFERENCES `reading_room` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 87 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '座位表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for seat_reservation
-- ----------------------------
DROP TABLE IF EXISTS `seat_reservation`;
CREATE TABLE `seat_reservation`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `user_id` bigint NOT NULL COMMENT '用户ID',
  `seat_id` bigint NOT NULL COMMENT '座位ID',
  `room_id` bigint NOT NULL COMMENT '阅览室ID',
  `reserve_date` date NOT NULL COMMENT '预约日期',
  `start_time` time NOT NULL COMMENT '开始时间',
  `end_time` time NOT NULL COMMENT '结束时间',
  `status` tinyint NOT NULL DEFAULT 0 COMMENT '状态:0-已预约,1-已签到,2-已签退,3-已取消,4-违约',
  `check_in_time` datetime NULL DEFAULT NULL COMMENT '签到时间',
  `check_out_time` datetime NULL DEFAULT NULL COMMENT '签退时间',
  `deleted` tinyint NOT NULL DEFAULT 0 COMMENT '逻辑删除:0-未删除,1-已删除',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_user_id`(`user_id` ASC) USING BTREE,
  INDEX `idx_seat_id`(`seat_id` ASC) USING BTREE,
  INDEX `idx_reserve_date`(`reserve_date` ASC) USING BTREE,
  INDEX `idx_status`(`status` ASC) USING BTREE,
  INDEX `idx_room_date`(`room_id` ASC, `reserve_date` ASC) USING BTREE,
  CONSTRAINT `fk_seat_res_seat` FOREIGN KEY (`seat_id`) REFERENCES `seat` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `fk_seat_res_user` FOREIGN KEY (`user_id`) REFERENCES `user_account` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `fk_seat_reservation_room` FOREIGN KEY (`room_id`) REFERENCES `reading_room` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '座位预约表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for system_config
-- ----------------------------
DROP TABLE IF EXISTS `system_config`;
CREATE TABLE `system_config`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `config_key` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '配置键',
  `config_value` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '配置值',
  `config_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '配置类型',
  `description` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '描述',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_config_key`(`config_key` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 16 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '系统配置表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for user_account
-- ----------------------------
DROP TABLE IF EXISTS `user_account`;
CREATE TABLE `user_account`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '用户名',
  `password` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '密码',
  `user_type` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'READER' COMMENT '用户类型:READER-读者,ADMIN-管理员,LIBRARIAN-图书管理员',
  `real_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '真实姓名',
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '手机号',
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '邮箱',
  `id_card` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '身份证号',
  `student_id` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '学生学号',
  `faculty_id` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '教职工号',
  `user_code` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '用户编号',
  `institution` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '所属机构',
  `campus` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '校区',
  `college` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '院系',
  `grade` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '年级',
  `class_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '班级',
  `counselor` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '辅导员',
  `role` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'ROLE_READER' COMMENT '系统角色:ROLE_READER-读者,ROLE_ADMIN-管理员,ROLE_LIBRARIAN-图书管理员',
  `language` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'zh-CN' COMMENT '语言偏好',
  `status` tinyint NOT NULL DEFAULT 1 COMMENT '状态:0-禁用,1-启用',
  `deleted` tinyint NOT NULL DEFAULT 0 COMMENT '逻辑删除:0-未删除,1-已删除',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `violation_count` int NULL DEFAULT 0 COMMENT '违规次数',
  `last_violation_time` datetime NULL DEFAULT NULL COMMENT '最后违规时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_username`(`username` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 107 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '用户账户表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for user_behavior
-- ----------------------------
DROP TABLE IF EXISTS `user_behavior`;
CREATE TABLE `user_behavior`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `user_id` bigint NOT NULL COMMENT '用户ID',
  `book_id` bigint NULL DEFAULT NULL COMMENT '图书ID',
  `action_type` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '行为类型:VIEW-浏览,BORROW-借阅,RETURN-归还,SEARCH-搜索,FAVORITE-收藏',
  `action_detail` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '行为详情',
  `ip_address` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT 'IP地址',
  `user_agent` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '用户代理',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_user_action`(`user_id` ASC, `action_type` ASC) USING BTREE,
  INDEX `idx_book_id`(`book_id` ASC) USING BTREE,
  INDEX `idx_create_time`(`create_time` ASC) USING BTREE,
  CONSTRAINT `fk_behavior_book` FOREIGN KEY (`book_id`) REFERENCES `book` (`id`) ON DELETE SET NULL ON UPDATE RESTRICT,
  CONSTRAINT `fk_behavior_user` FOREIGN KEY (`user_id`) REFERENCES `user_account` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '用户行为表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for user_favorite
-- ----------------------------
DROP TABLE IF EXISTS `user_favorite`;
CREATE TABLE `user_favorite`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `user_id` bigint NOT NULL COMMENT '用户ID',
  `book_id` bigint NOT NULL COMMENT '图书ID',
  `deleted` tinyint NOT NULL DEFAULT 0 COMMENT '逻辑删除:0-未删除,1-已删除',
  `create_time` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_user_book`(`user_id` ASC, `book_id` ASC) USING BTREE,
  INDEX `idx_user_id`(`user_id` ASC) USING BTREE,
  INDEX `idx_book_id`(`book_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '用户收藏表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Procedure structure for add_column_if_not_exists
-- ----------------------------
DROP PROCEDURE IF EXISTS `add_column_if_not_exists`;
delimiter ;;
CREATE PROCEDURE `add_column_if_not_exists`(IN table_name_param VARCHAR(100),
    IN column_name_param VARCHAR(100),
    IN column_definition VARCHAR(500))
BEGIN
    DECLARE column_exists INT DEFAULT 0;
    
    SELECT COUNT(*) INTO column_exists
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = table_name_param
      AND COLUMN_NAME = column_name_param;
    
    IF column_exists = 0 THEN
        SET @sql = CONCAT('ALTER TABLE ', table_name_param, ' ADD COLUMN ', column_name_param, ' ', column_definition);
        PREPARE stmt FROM @sql;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END IF;
END
;;
delimiter ;

SET FOREIGN_KEY_CHECKS = 1;
