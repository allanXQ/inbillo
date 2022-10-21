const pool = require("../../database/dbconn");
import { loanListing } from "../../interfaces/interfaces";
import { v4 as uuidv4 } from 'uuid'

export const createBorrowerListing = async (details: loanListing,callback: Function)=>{
    const connection = await pool.connection();
    try {
        await connection.query("START TRANSACTION");
        if(details.amount <= 0) return callback({code:400, message:'Amount must be greater than zero'})
        //check borrower portfolio
        const check_collateral = await connection.query(`SELECT * FROM portfolios WHERE username='${details.username}' AND asset_name='${details.collateral}'`)
        // console.log(check_collateral)
        if(check_collateral.length === 0){
        await connection.query("ROLLBACK");
        return callback({code:400, message:'Asset not found'})
        } 
        //check if collateral value is sufficient
        const units = check_collateral[0].amount
        const price = check_collateral[0].price
        if(units * price < details.collateral_value){
        await connection.query("ROLLBACK");
        callback({code:400, message:'Insufficient collateral value'})
        }
        console.log(units,price,details.collateral_value)
        if(units * price >= details.collateral_value){
            //subtract the required collateral units from borrower portfolio
            const collateral_amount =  (details.collateral_value/price)
            const new_amount = units - collateral_amount
            await connection.query(`UPDATE portfolios SET amount=${new_amount} WHERE username='${details.username}' AND asset_name='${details.collateral}'`)
            //insert into held_collateral
            const coll_id: String = uuidv4()
            await connection.query(`INSERT INTO held_collateral(coll_id,username,collateral,amount)
            VALUES('${coll_id}','${details.username}','${details.collateral}',${collateral_amount})`)
            //create loan listing
            const listing_id: String = uuidv4()
            await connection.query(`INSERT INTO loanListings(list_id,party, username, amount,interest, collateral, collateral_value,collateral_id, payment_date,loan_status)
            VALUES('${listing_id}','${details.party}','${details.username}','${details.amount}','${details.interest}',
            '${details.collateral}','${details.collateral_value}','${coll_id}','${details.payment_period}','pending')`)        
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