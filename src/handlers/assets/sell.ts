const pool = require("../../database/dbconn");
import { trades } from "../../interfaces/interfaces";
import { v4 as uuidv4 } from 'uuid'
import moment from "moment";
const current_time=moment().format('DD MMMM YYYY')

export const sell = async (details: trades,callback: Function)=>{
    const connection = await pool.connection();
    try { 
        await connection.query("START TRANSACTION");
        //get buyer listing 
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
        //update seller portfolio
        const new_amount = check_portfolio[0].amount-details.amount
        await connection.query(`UPDATE portfolios SET amount=${new_amount} WHERE username='${details.username}' AND asset_name='${details.asset_name}'`)
        //update seller account
        //get seller
        const get_seller = await connection.query(`SELECT * FROM accounts WHERE username='${details.username}'`)
        const new_seller_balance = get_seller[0].balance + details.amount *price
        await connection.query(`UPDATE accounts SET balance='${new_seller_balance}' WHERE username='${details.username}'`)
        
        //update buyer portfolio
        const get_buyer = await connection.query(`SELECT * FROM portfolios WHERE username='${get_listing[0].buyer}' AND asset_name='${details.asset_name}'`)
        console.log(get_buyer)
        if(get_buyer.length === 0){
            const portfolio_id = uuidv4()
            await connection.query(`INSERT INTO portfolios(portfolio_id,username,asset_name,amount,price)
             VALUES('${portfolio_id}','${get_listing[0].username}','${details.asset_name}',${details.amount},${price})`)
        
        } else {
            const buyer_amount = get_buyer[0].amount + details.amount
            await connection.query(`UPDATE portfolios SET amount=${buyer_amount} WHERE username='${get_buyer[0].username}' `)
        }
        //add details to trades
        //insert to trades
        const trade_id = uuidv4()
        await connection.query(`INSERT INTO trades(trade_id,buyer,seller,asset_name,amount,price,trade_date) 
        VALUES('${trade_id}','${get_listing[0].username}','${details.username}', '${details.asset_name}', '${details.amount}','${price}','${current_time}')`)
        //update listing
        await connection.query(`UPDATE trade_listing SET trade_status='fulfilled' WHERE list_id='${details.list_id}'`)
        
        //delete held funds
        await connection.query(`DELETE FROM held_asset_funds WHERE fund_id='${get_listing[0].fund_id}'`)
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