const pool = require("../../database/dbconn");
import { lend } from "../../interfaces/interfaces";
import { v4 as uuidv4 } from 'uuid'
import moment from "moment";
const current_time=moment().format('DD MMMM YYYY')

export const give_loan = async (details: lend,callback: Function)=>{
    const connection = await pool.connection();
    try {
        if(details.username === details.borrower) return callback({code:400, message:'Invalid request'})
        else{
            await connection.query("START TRANSACTION");
            //check borrower listing
            const check_borrower = await connection.query(`SELECT * FROM loanListings WHERE list_id='${details.list_id}'`)
            if(check_borrower.length === 0){
                await connection.query("ROLLBACK");
                return callback({code:400, message:'Borrower not found'})
            } 
            if(check_borrower[0].loan_status === 'fulfilled') return callback({code:400, message:'Loan request is already fulfilled'})
            //check if balance is sufficient
            const check_balance = await connection.query(`SELECT * FROM accounts WHERE username='${details.username}'`)
            if(check_balance.length === 0){
                await connection.query("ROLLBACK");
                return callback({code:400, message:'Account not found'})
            } 

            const balance = check_balance[0].balance
            if(balance<details.amount){
                await connection.query("ROLLBACK");
                return callback({code:400, message:'Insufficient balance'})
            }
            //deduct balance
            const new_balance = balance-details.amount
            console.log(balance,details.amount,new_balance)
            await connection.query(`UPDATE accounts SET balance=${new_balance} WHERE username='${details.username}'`)
            //add balance to borrower account
            const find_borrower_account = await connection.query(`SELECT * FROM accounts WHERE username='${details.borrower}'`)
            if(find_borrower_account.length === 0){
                await connection.query("ROLLBACK");
                return callback({code:400, message:'Borrower not found'})
            }
            //update borrower account
            const new_borrower_balance = find_borrower_account[0].balance + details.amount
            // console.log(new_borrower_balance[0],details)
            await connection.query(`UPDATE accounts SET balance=${new_borrower_balance} WHERE username='${details.borrower}'`)
            //update borrower listing
            await connection.query(`UPDATE loanListings SET loan_status='fulfilled' WHERE list_id='${details.list_id}'`)
            //insert to loans table
            const loan_id:string = uuidv4()                           
            await connection.query(`INSERT INTO loans(loan_id, lender, borrower, amount,interest,collateral,collateral_value,collateral_id, payment_date,loan_status, creation_date) 
            VALUES('${loan_id}','${details.username}','${details.borrower}','${details.amount}','${details.interest}',
            '${details.collateral}','${details.collateral_value}','','${details.payment_period}','unpaid','${current_time}')`)
            //get collateral units
            const get_units = await connection.query(`SELECT * FROM portfolios WHERE username='${details.borrower}' AND asset_name='${details.collateral}'`)
            if(get_units.length === 0){
                await connection.query("ROLLBACK");
                return callback({code:400, message:'Invalid portfolio'})
            } 
            const col_price = get_units[0].price
            const collateral_amount = details.collateral_value/col_price
            //get coll_id
            const get_coll = await connection.query(`SELECT * FROM held_collateral WHERE username='${details.borrower}' AND collateral='${details.collateral}' AND amount=${collateral_amount}`)
            if(get_coll.length === 0){
                await connection.query("ROLLBACK");
                return callback({code:400, message:'Request failed'})
            }
            //insert loan to monitor
            var startDate = new Date();
            var endDateMoment = moment(startDate); 
            const payment_date = endDateMoment.add(details.payment_period, 'months');
            const coll_id = get_coll[0].coll_id
            await connection.query(`INSERT INTO monitor(loan_id,lender, borrower,collateral_id,payment_date) 
            VALUES ('${loan_id}','${details.borrower}','${details.username}','${coll_id}','${payment_date}')`)
            await connection.query("COMMIT");
        }           
        return callback({code:200, message:'Request SUCCESSFUL!'})
    } catch(error){
        console.log(error)
        await connection.query("ROLLBACK");
    } finally {
      await connection.release();
    }
}
