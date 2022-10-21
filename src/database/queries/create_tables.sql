-- CREATE DATABASE inbillo;

CREATE TABLE users (
    username VARCHAR(50) PRIMARY KEY,
    firstname VARCHAR(50) NOT NULL,
    lastname VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE,
    phone VARCHAR(50) NOT NULL UNIQUE,
    passwd VARCHAR(500) NOT NULL,
    reg_date VARCHAR(50) NOT NULL
);

CREATE TABLE accounts (
    account_number VARCHAR(50) PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    balance INT NOT NULL
);

CREATE TABLE deposits(
    deposit_id VARCHAR(50) PRIMARY KEY,
    account_number VARCHAR(50) NOT NULL,
    amount INT NOT NULL,
    deposit_date VARCHAR(50) NOT NULL
);


CREATE TABLE portfolios(
    portfolio_id VARCHAR(50) PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    asset_name VARCHAR(50) NOT NULL,
    amount INT NOT NULL,
    price INT NOT NULL
);

CREATE TABLE loanListings(
    list_id VARCHAR(50) PRIMARY KEY,
    party VARCHAR(50) NOT NULL,
    username VARCHAR(50),
    amount INTEGER NOT NULL,
    interest INTEGER NOT NULL,
    collateral VARCHAR(50) NOT NULL,
    collateral_value INTEGER NOT NULL,
    collateral_id VARCHAR(50) NOT NULL,
    fund_id VARCHAR(50) NOT NULL,
    payment_date VARCHAR(50) NOT NULL,
    loan_status VARCHAR(50) NOT NULL
);

CREATE TABLE held_funds(
    fund_id VARCHAR(50) PRIMARY KEY,
    username VARCHAR(50), 
    amount INTEGER NOT NULL
);

CREATE TABLE held_collateral(
    coll_id VARCHAR(50) PRIMARY KEY,
    username VARCHAR(50),
    collateral VARCHAR(50) NOT NULL, 
    amount INTEGER NOT NULL
);

CREATE TABLE loans(
    loan_id VARCHAR(50) PRIMARY KEY,
    lender VARCHAR(50) NOT NULL,
    borrower VARCHAR(50) NOT NULL,
    amount INT NOT NULL,
    interest INT NOT NULL,
    collateral VARCHAR(50) NOT NULL,
    collateral_value VARCHAR(50) NOT NULL,
    collateral_id VARCHAR(50) NOT NULL,
    payment_date VARCHAR(50) NOT NULL,
    loan_status VARCHAR(50) NOT NULL,
    creation_date VARCHAR(50) NOT NULL
);

CREATE TABLE monitor(
    loan_id VARCHAR(50) PRIMARY KEY,
    lender VARCHAR(50) NOT NULL,
    borrower VARCHAR(50) NOT NULL,
    collateral_id VARCHAR(50) NOT NULL,
    payment_date VARCHAR(50) NOT NULL 
);

CREATE TABLE assets(
    asset_name VARCHAR(50) PRIMARY KEY,
    asset_owner VARCHAR(50) NOT NULL,
    amount INT NOT NULL,
    price INT NOT NULL
);

CREATE TABLE trades(
    trade_id VARCHAR(50) PRIMARY KEY,
    buyer VARCHAR(50) NOT NULL,
    seller VARCHAR(50) NOT NULL,
    asset_name VARCHAR(50) NOT NULL, 
    amount INT NOT NULL, 
    price INT NOT NULL, 
    trade_date VARCHAR(50) NOT NULL
);

CREATE TABLE trade_listing(
    list_id VARCHAR(50) PRIMARY KEY,
    party VARCHAR(50) NOT NULL,
    username VARCHAR(50),
    asset VARCHAR(50) NOT NULL,
    amount INTEGER NOT NULL,
    price INTEGER NOT NULL,
    asset_id VARCHAR(50) NOT NULL,
    fund_id VARCHAR(50) NOT NULL,
    trade_status VARCHAR(50) NOT NULL
);

CREATE TABLE listing_fees(
    asset_name VARCHAR(50) PRIMARY KEY,
    amount INT NOT NULL
);

CREATE TABLE  held_asset_funds(
    fund_id VARCHAR(50) PRIMARY KEY,
    username VARCHAR(50), 
    amount INTEGER NOT NULL
);

CREATE TABLE held_asset_portfolio(
    asset_id VARCHAR(50) PRIMARY KEY,
    username VARCHAR(50),
    asset VARCHAR(50) NOT NULL, 
    amount INTEGER NOT NULL
);