const pool = require("../../database/dbconn");
import { trades } from "../../interfaces/interfaces";
import { v4 as uuidv4 } from 'uuid'
import moment from "moment";
const current_time=moment().format('DD MMMM YYYY')

export const buy = async (details: trades,callback: Function)=>{
    const connection = await pool.connection();
    try { 
        await connection.query("START TRANSACTION");
        //get seller listing
        const get_listing = await connection.query(`SELECT * FROM trade_listing WHERE list_id='${details.list_id}'`)
        if(get_listing.length === 0){
            await connection.query("ROLLBACK");
            return callback({code:400, message:'Listing not found'})
        }
        if(get_listing[0].username === details.username){
            await connection.query("ROLLBACK");
            return callback({code:400, message:'Invalid request'})
        }
        if(get_listing[0].trade_status !== 'pending'){
            await connection.query("ROLLBACK");
            return callback({code:400, message:'Request already fulfilled'})
        }
        const price = get_listing[0].price
        // console.log(get_listing)

        //check account balance
        const check_balance = await connection.query(`SELECT * FROM accounts WHERE username='${details.username}'`)
        if(check_balance.length === 0){
            await connection.query("ROLLBACK");
            return callback({code:400, message:'Account not found'})
        }
        const total_cost = price * details.amount
        if(check_balance[0].balance < total_cost){
            await connection.query("ROLLBACK");
            return callback({code:400, message:'Insufficient balance'})
        }
        //update buyer balance
        const new_buyer_balance = check_balance[0].balance - total_cost
        await connection.query(`UPDATE accounts SET balance='${new_buyer_balance}' WHERE username='${details.username}'`)

        //update seller balance
        const get_seller = await connection.query(`SELECT * FROM accounts WHERE username='${get_listing[0].username}'`)
        if(get_seller.length === 0){
            await connection.query("ROLLBACK");
            return callback({code:400, message:'Account not found'})
        }
        const new_seller_balance = get_seller[0].balance + total_cost
        await connection.query(`UPDATE accounts SET balance='${new_seller_balance}' WHERE username='${get_listing[0].username}'`)
        
        //get asset from held_asset_portfolio
        const get_asset = await connection.query(`SELECT * FROM held_asset_portfolio WHERE asset_id='${details.asset_id}'`)
        if(get_asset.length === 0){
            await connection.query("ROLLBACK");
            return callback({code:400, message:'Held asset not found'})
        }
        //update buyer portfolio
        const get_portfolio = await connection.query(`SELECT * FROM portfolios WHERE username='${details.username}' AND asset_name='${details.asset_name}'`)
        if(get_portfolio.length === 0){
            // await connection.query("ROLLBACK");
            // return callback({code:400, message:'portfolio not found'})
            const portfolio_id = uuidv4()
            await connection.query(`INSERT INTO portfolios(portfolio_id,username,asset_name,amount,price)
             VALUES('${portfolio_id}','${details.username}','${details.asset_name}',${details.amount},${price})`)
        } else {
            const new_amount = get_portfolio[0].amount + get_asset[0].amount
            await connection.query(`UPDATE portfolios SET amount=${new_amount} WHERE username=${details.username} AND asset_name=${details.asset_name}`)
        }
        //delete from held_asset_portfolio
        await connection.query(`DELETE FROM held_asset_portfolio WHERE asset_id='${details.asset_id}'`)
        //insert to trades
        const trade_id = uuidv4()
        await connection.query(`INSERT INTO trades(trade_id,buyer,seller,asset_name,amount,price,trade_date) 
        VALUES('${trade_id}','${details.username}','${get_seller[0].username}', '${details.asset_name}', '${details.amount}','${price}','${current_time}')`)
        //update listing
        await connection.query(`UPDATE trade_listing SET trade_status='fulfilled' WHERE list_id='${details.list_id}'`)
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