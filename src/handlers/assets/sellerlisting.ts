const pool = require("../../database/dbconn");
import { portfolios } from "../../interfaces/interfaces";
import { v4 as uuidv4 } from 'uuid'


export const createsellerlisting = async (details: portfolios,callback: Function)=>{
    const connection = await pool.connection();
    try { 
        await connection.query("START TRANSACTION");
        //check portfolio balance
        const check_portfolio = await connection.query(`SELECT * FROM portfolios WHERE username='${details.username}' AND asset_name='${details.asset_name}'`)
        if(check_portfolio.length === 0){
            await connection.query("ROLLBACK");
            return callback({code:400, message:'Asset not found'})
        }
        if(check_portfolio.amount < details.amount){
            await connection.query("ROLLBACK");
            return callback({code:400, message:'Insufficient asset amount'})
        }
        //update portfolio
        const new_amount = check_portfolio[0].amount-details.amount
        await connection.query(`UPDATE portfolios SET amount=${new_amount} WHERE username='${details.username}' AND asset_name='${details.asset_name}'`)
        //insert into held_asset_portfolio
        const asset_id = uuidv4()
        await connection.query(`INSERT INTO held_asset_portfolio(asset_id,username,asset,amount)
        VALUES('${asset_id}','${details.username}','${details.asset_name}',${details.amount})
        `)
        //insert into trade_listing
        const list_id = uuidv4()
        const price = check_portfolio[0].price
        await connection.query(`INSERT INTO trade_listing(list_id,party,username,asset,amount,price,asset_id,fund_id,trade_status) 
        VALUES('${list_id}','buyer','${details.username}','${details.asset_name}','${details.amount}',${price},'${asset_id}','','pending')`)       
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