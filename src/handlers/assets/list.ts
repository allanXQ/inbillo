const pool = require("../../database/dbconn");
import { portfolios } from "../../interfaces/interfaces";
import { listing_fee } from "../../utils/constants";
import { v4 as uuidv4 } from 'uuid'


export const list = async (details: portfolios,callback: Function)=>{
    const connection = await pool.connection();
    try { 
        await connection.query("START TRANSACTION");
        //check if asset name is unique
        const check_name = await connection.query(`SELECT * FROM assets WHERE asset_name='${details.asset_name}'`)
        if(check_name.length > 0) return callback({code:400, message:'Asset name must be unique'})
        //check account balance 
        const get_balance = await connection.query(`SELECT * FROM accounts WHERE username='${details.username}'`)
        if(get_balance.length === 0) {
            await connection.query("ROLLBACK");
            return callback({code:400, message:'Account not found'})
        }
        if(get_balance[0].amount < listing_fee){
            await connection.query("ROLLBACK");
            return callback({code:400, message:'Insufficient account balance'})
        }
        //update account balance
        const new_balance = get_balance[0].balance - listing_fee
        await connection.query(`UPDATE accounts SET balance=${new_balance} WHERE username='${details.username}'`)
        //insert into listing_fees
        await connection.query(`INSERT INTO listing_fees(asset_name,amount) VALUES('${details.asset_name}',${listing_fee})`)
        //insert details to asset_table
        await connection.query(`INSERT INTO assets(asset_name,asset_owner,amount,price) 
        VALUES('${details.asset_name}','${details.username}','${details.amount}','${details.price}')`)
        //insert into owner's portfolio
        const portfolio_id = uuidv4()
        await connection.query(`INSERT INTO portfolios(portfolio_id, username,asset_name,amount,price)
        VALUES('${portfolio_id}','${details.username}','${details.asset_name}',${details.amount},${details.price})`)

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