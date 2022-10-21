const pool = require("../../database/dbconn");
import { portfolios } from "../../interfaces/interfaces";
import { v4 as uuidv4 } from 'uuid'


export const createbuyerlisting = async (details: portfolios,callback: Function)=>{
    const connection = await pool.connection();
    try { 
        await connection.query("START TRANSACTION");
        //check account balance
        const check_balance = await connection.query(`SELECT * FROM accounts WHERE username='${details.username}'`)
        if(check_balance.length === 0){
            await connection.query("ROLLBACK");
            return callback({code:400, message:'Account not found'})
        }
        if(check_balance[0].balance < details.amount){
            await connection.query("ROLLBACK");
            return callback({code:400, message:'Insufficient balance'})
        }
        //get price
        const get_price = await connection.query(`SELECT * FROM assets WHERE asset_name='${details.asset_name}'`)
        if(get_price.length === 0){
            await connection.query("ROLLBACK");
            return callback({code:400, message:'Asset not found'})
        }
        const price = get_price[0].price
        //update account
        const new_balance = check_balance[0].balance - (details.amount*price)
        await connection.query(`UPDATE accounts SET balance=${new_balance} WHERE username='${details.username}'`)
        //insert into held_funds_account
        const fund_id = uuidv4()
        await connection.query(`INSERT INTO held_asset_funds(fund_id,username,amount) 
        VALUES('${fund_id}','${details.username}','${details.amount*price}')`)
        //insert into trade_listing
        const list_id = uuidv4()
        await connection.query(`INSERT INTO trade_listing(list_id,party,username,asset,amount,price,asset_id,fund_id,trade_status) 
        VALUES('${list_id}','buyer','${details.username}','${details.asset_name}','${details.amount}',${price},'','${fund_id}','pending')`)       
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