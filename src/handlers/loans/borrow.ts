const pool = require("../../database/dbconn");
import { borrow } from "../../interfaces/interfaces";
import { v4 as uuidv4 } from 'uuid'
import moment from "moment";
const current_time: string = moment().format('DD MMMM YYYY')


export const borrow_loan = async (details: borrow,callback: Function)=>{
    const connection = await pool.connection();
    try {
      if(details.username === details.lender) callback({code:400, message:'Invalid request'})
      else{
        await connection.query("START TRANSACTION");
          //check listing existance
          const check_lender = await connection.query(`SELECT * FROM loanListings WHERE list_id='${details.list_id}'`)
          // console.log(check_lender)
          if(check_lender.length === 0){
            await connection.query("ROLLBACK");
            return callback({code:400, message:'Lender not found'})
          } 
          //check borrower portfolio
          const check_collateral = await connection.query(`SELECT * FROM portfolios WHERE username='${details.username}' AND asset_name='${details.collateral}'`)
          if(check_collateral.length === 0){
            await connection.query("ROLLBACK");
            return callback({code:400, message:'Asset not found'})
          } 
          const dbcollateral_units = check_collateral[0].amount
          const price = check_collateral[0].price
          const collateral_units = (details.collateral_value/price)
          const new_units = dbcollateral_units - collateral_units
          await connection.query(`UPDATE portfolios set amount=${new_units} WHERE username='${details.username}' AND asset_name='${details.collateral}'`)
          const coll_id = uuidv4()
          await connection.query(`INSERT INTO held_collateral(coll_id,username,collateral, amount) VALUES('${coll_id}','${details.username}','${details.collateral}',${collateral_units})`)
          const get_funds = await connection.query(`SELECT * FROM held_funds WHERE fund_id='${details.fund_id}' AND amount='${details.amount}'`)
          if(get_funds.length === 0){
            await connection.query("ROLLBACK");
            return callback({code:400, message:'Funds not found'})
          }
          const fund_amount = get_funds[0].amount
          //remove record from funds
          await connection.query(`DELETE FROM held_funds WHERE fund_id='${details.fund_id}'`)
          //get borrower account
          const get_user = await connection.query(`SELECT * FROM accounts WHERE username='${details.username}'`)
          if(get_user.length === 0){
            await connection.query("ROLLBACK");
            return callback({code:400, message:'Account not found'})
          }
          //update borrower balance
          const new_balance = get_user[0].balance + fund_amount
          console.log(get_user[0])
          await connection.query(`UPDATE accounts SET balance=${new_balance} where username='${details.username}'`)
          //update lender listing
          await connection.query(`UPDATE loanListings SET loan_status='fulfilled' WHERE list_id='${details.list_id}'`)
          //insert to loans table
          const loan_id:string = uuidv4()                                                          
          await connection.query(`INSERT INTO loans(loan_id, lender, borrower, amount,interest,collateral,collateral_value,collateral_id, payment_date,loan_status, creation_date) 
          VALUES('${loan_id}','${details.lender}','${details.username}','${details.amount}','${details.interest}',
          '${details.collateral}','${details.collateral_value}','${coll_id}','${details.payment_period}','unpaid','${current_time}')`)
          //insert loan to monitor
          var startDate = new Date();
          var endDateMoment = moment(startDate); 
          const payment_date = endDateMoment.add(details.payment_period, 'months');
          await connection.query(`INSERT INTO monitor(loan_id,lender, borrower,collateral_id,payment_date) 
          VALUES ('${loan_id}','${details.lender}','${details.username}','${coll_id}','${payment_date}')`)                                                       
          await connection.query("COMMIT");
        }
        return callback({code:200, message:'Request SUCCESSFUL!'})
      } catch(error){
        console.log(error)
        callback({code:400, message:'Request failed'})
        await connection.query("ROLLBACK");
    } finally {
      await connection.release();
    }
}