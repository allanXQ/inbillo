const pool = require("../../database/dbconn");
import { pay } from "../../interfaces/interfaces";

export const pay_loan = async (details: pay,callback: Function)=>{
    const connection = await pool.connection();
    try { 
        await connection.query("START TRANSACTION");
        //check if loan is paid || expired
        const check_loan = await connection.query(`SELECT * FROM loans WHERE loan_id='${details.loan_id}'`)
        if(check_loan.length === 0) {
            await connection.query("ROLLBACK");
            return callback({code:400, message:'Invalid loan_id'})
        }
        const lender = check_loan[0].lender
        if(check_loan[0].loan_status !== 'unpaid'){
            await connection.query("ROLLBACK");
            return callback({code:400, message:'Loan is expired or already paid'})
        }
        //check borrower balance >= loan amount + interest
        const interest = check_loan[0].amount * (check_loan[0].interest/100) * check_loan[0].payment_date
        const total_pay = interest + check_loan[0].amount
        const check_balance = await connection.query(`SELECT * FROM accounts WHERE username='${details.username}'`)
        if(check_balance.length === 0) {
            await connection.query("ROLLBACK");
            return callback({code:400, message:'Account not found'})
        }
        if(check_balance[0].amount < total_pay) {
            await connection.query("ROLLBACK");
            return callback({code:400, message:'Insufficient balance to make payment'})
        }
        //update user balance
        const new_balance = check_balance[0].balance - total_pay
        await connection.query(`UPDATE accounts SET balance=${new_balance} WHERE username='${details.username}'`)
        //update lender balance
        const get_lender = await connection.query(`SELECT * FROM accounts WHERE username='${lender}'`)
        if(get_lender.length === 0) {
            await connection.query("ROLLBACK");
            return callback({code:400, message:'Account not found'})
        }        
        const new_lender_balance = get_lender[0].balance + total_pay
        await connection.query(`UPDATE accounts SET balance=${new_lender_balance} WHERE username='${lender}'`)
        //update loan status
        await connection.query(`UPDATE loans SET loan_status='paid' WHERE loan_id='${details.loan_id}'`)
        //transfer collateral
        const select_collateral = await connection.query(`SELECT * FROM held_collateral WHERE coll_id='${details.coll_id}'`)
        if(select_collateral.length === 0) {
            await connection.query("ROLLBACK");
            return callback({code:400, message:'Request failed'})
        } 
        const collateral_amount = select_collateral[0].amount
        const collateral = select_collateral[0].collateral
        //return to borrower
        const get_portfolio = await connection.query(`SELECT * FROM portfolios WHERE username='${details.username}' AND asset_name='${collateral}'`)
        if(get_portfolio.length === 0) {
            await connection.query("ROLLBACK");
            return callback({code:400, message:'Request failed'})
        }      
        const new_amount = get_portfolio[0].amount + collateral_amount
        await connection.query(`UPDATE portfolios SET amount='${new_amount}' WHERE username='${details.username}' AND asset_name='${collateral}'`)
        //delete coll_held
        await connection.query(`DELETE FROM held_collateral WHERE coll_id='${details.coll_id}'`)
        await connection.query("COMMIT");
        return callback({code:200, message:'Request SUCCESSFUL!'})
    } catch(error){
    console.log(error)
    callback({code:400, message:'Request failed'})
    await connection.query("ROLLBACK");
    } finally {
    await connection.release();
}
}