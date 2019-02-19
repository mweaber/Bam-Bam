DROP DATABASE IF EXISTS bamazonDB;

create database bamazonDB;

use bamazonDB;

create table products (
    id integer AUTO_INCREMENT NOT NULL,
    product_name varchar(20) NOT NULL,
    department_name varchar(20) NOT NULL,
    price integer(5) NOT NULL,
    stock_quantity integer(5) NOT NULL, 
    primary key (id)
);