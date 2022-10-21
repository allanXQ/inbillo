const pool = require("../../database/dbconn");
import { deposits } from "../../interfaces/interfaces";
import { v4 as uuidv4 } from 'uuid'
import moment from "moment";
const current_time=moment().format('DD MMMM YYYY')

export const deposit = async (details: deposits,callback: Function)=>{
    const connection = await pool.connection();
    try { 
        await connection.query("START TRANSACTION");
        const get_user = await connection.query(`SELECT * FROM accounts WHERE username='${details.username}'`)
          if(get_user.length === 0){
            await connection.query("ROLLBACK");
            return callback({code:400, message:'Account not found'})
          }
        //add balance to accounts
        const new_balance = get_user[0].balance + details.amount
        const account_number = get_user[0].account_number
        const deposit_id:string = uuidv4()
        await connection.query(`UPDATE accounts SET balance=${new_balance} where username='${details.username}'`)
        await connection.query(`INSERT INTO deposits(deposit_id,account_number,amount,deposit_date) 
        VALUES('${deposit_id}','${account_number}','${details.amount}','${current_time}')
        `)
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