const pool = require("../../database/dbconn");
import { loanListing } from "../../interfaces/interfaces";
import { v4 as uuidv4 } from 'uuid'

export const createLenderListing = async (details: loanListing,callback: Function)=>{
    const connection = await pool.connection();
    try {
        await connection.query("START TRANSACTION");
        if(details.amount <= 0) return callback({code:400, message:'Amount must be greater than zero'})
        //check for available balance
        const check_balance = await connection.query(`SELECT * FROM accounts WHERE username='${details.username}'`)
        if(check_balance.length === 0){
            await connection.query("ROLLBACK");
            return callback({code:400, message:'Invalid Account'})
        } 
        //check if balance is >= or < than amount
        const balance = check_balance[0].balance
        if(balance < details.amount){
            await connection.query("ROLLBACK");
            return callback({code:400, message:'Insufficient account balance'})
        }
        if(balance >= details.amount){
            //subtract details.amount from lender balance
            const new_balance = balance - details.amount
            await connection.query(`UPDATE accounts SET balance=${new_balance} WHERE username='${details.username}'`)
            //insert into held_funds
            const fund_id: String = uuidv4()
            await connection.query(`INSERT INTO held_funds(fund_id,username,amount)
            VALUES('${fund_id}','${details.username}',${details.amount})`)
            //create loan listing
            const listing_id: String = uuidv4()
            await connection.query(`INSERT INTO loanListings(list_id, party, username, amount,interest, collateral, collateral_value,collateral_id,fund_id payment_date,loan_status)
            VALUES('${listing_id}','${details.party}','${details.username}','${details.amount}','${details.interest}',
            '${details.collateral}','${details.collateral_value}','','${fund_id}','${details.payment_period}','pending')`)
        }
       
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