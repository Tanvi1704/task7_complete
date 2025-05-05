CREATE database nodeReact;
use nodeReact;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

ALTER TABLE users
ADD COLUMN is_active BOOLEAN DEFAULT 1,
ADD COLUMN is_deleted BOOLEAN DEFAULT 0;

ALTER TABLE users
ADD COLUMN role ENUM('admin', 'user') DEFAULT 'user';

ALTER TABLE users
ADD COLUMN is_login TINYINT(1) DEFAULT 0,
ADD COLUMN last_login DATETIME;


CREATE TABLE tbl_device (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    device_token VARCHAR(255),
    user_token VARCHAR(255),
    time_zone VARCHAR(50),
    device_type VARCHAR(50),
    app_version VARCHAR(50),
    os_version VARCHAR(50),
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    is_deleted TINYINT(1) NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

create table tbl_category(
	id INT AUTO_INCREMENT PRIMARY KEY,
    name varchar(128),
    is_active boolean DEFAULT 1,
    is_deleted boolean DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

create table tbl_product(
	id INT AUTO_INCREMENT PRIMARY KEY,
    name varchar(128),
    image varchar(128),
    description varchar(128),
    price decimal(7,2) ,
    category_id int ,
    is_active boolean DEFAULT 1,
    is_deleted boolean DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP ,
    foreign key (category_id) references tbl_category(id)
);

select * from users;
select * from tbl_device;
select * from tbl_category;
select * from tbl_product;

drop table users;
drop table tbl_device;
