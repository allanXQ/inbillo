done
register
login
createlisting

user schema - for user details(username, firstname, lastname, email, phone, passwd, reg_date)
accounts schema - for account balances(account_number,username, balance)
deposits schema - for deposits made(deposit_id, username, amount, deposit_date)
assets schema - for assets owned by users(asset_name,owner, amount,price,verification_status)
portfolios schema - for user portfolios(portfolio_id, username, asset_name, amount, price)
trades schema - for all asset trades(trade_id, buyer, seller, asset_name, amount, price, trade_date)
loanListings schema - list of prospective borrowers and lenders(listing_id,party, username, amount, collateral, collateral_value, payment_date, loan_status(pending,fulfilled))
//lenders schema - list of prospective lenders(username, amount,interest, collateral, collateral_value, payment_period)
loans schema - for all loans issued(loan_id, lender, borrower, amount,interest,collateral, payment_date,creation_date)
held_collateral - for all collateral held(coll_id,owner,collateral, amount)
held_funds - for all lenders' funds held by the platform(fund_id, name, amount).
loan_monitor - to monitor all loan for expiry(loan_id,payment_period)

listing_fees(asset_name, amount)
trading_fees(trade_id, amount)

Loan statuses - unpaid, paid, expired. On expired transfer collateral to lender

system functions
create user
generate balance sheet.

user functions
register
login
deposit cash
sell asset
buy asset
lend cash
borrow cash


user creates account and logs in
user deposits into account
user buys assets from admin / other users

how lending works
user creates a listing

create listing
-2 portfolio
+2 held coll
