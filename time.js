// import { username } from "./src/interfaces/interfaces";

// import { username } from "./src/interfaces/interfaces";

const pool = require("./src/database/dbconn");

const balancesheet = async (details)=>{
    const connection = await pool.connection();
    try {
        const get_balance = await connection.query(`SELECT * FROM accounts WHERE username='${details.username}'`)
        const account_balance = get_balance[0].balance

        const get_assets = await connection.query(`SELECT * FROM portfolios WHERE username='${details.username}'`)
        let all_assets = []
        let asset_value = 0
        get_assets.map((asset)=>{
            let value = asset.amount*asset.price
            all_assets.push({name:asset.asset_name, value})
            asset_value=asset_value+value
        })

        const get_loans_taken = await connection.query(`SELECT * FROM loans where borrower='${details.username}' AND loan_status='unpaid'`)
        let total_loans_taken = 0
        get_loans_taken.map((loan)=>{
            total_loans_taken = total_loans_taken + loan.amount
        })
        const get_loans_given = await connection.query(`SELECT * FROM loans where lender='${details.username}' AND loan_status='unpaid'`)
        let total_loans_given = 0
        get_loans_given.map((loan)=>{
            total_loans_given = total_loans_given + loan.amount
        })
        const net_worth = account_balance+asset_value + total_loans_given-total_loans_taken
        console.log(account_balance,asset_value,total_loans_given,total_loans_taken,net_worth)
    } catch(error){
        console.log(error)
    }
}

balancesheet({username:'allan'})