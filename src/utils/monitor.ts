const pool = require("../database/dbconn");
import { monitor } from '../interfaces/interfaces';
import moment from "moment";
let today=moment().format('DD MMMM YYYY')

export const loan_monitor = async ()=>{
    const connection = await pool.connection();
    // const time_difference =
    try {
        const get_loans = await connection.query(`SELECT * FROM monitor WHERE payment_date='${today}'`)
        if(get_loans.length === 0) {
        } else {
            const lender = get_loans[0].lender
            const collateral_id = get_loans[0].collateral_id
            const loan_id = get_loans[0].loan_id
            get_loans.map(async (row:monitor)=>{
                await connection.query(`UPDATE loans SET loan_status='expired' WHERE loan_id='${loan_id}'`)
                //get collateral
                const get_collateral =  await connection.query(`SELECT * FROM held_collateral WHERE coll_id='${collateral_id}'`)
                const collateral = get_collateral[0].collateral
                const amount = get_collateral[0].amount
                //get lender portfolio
                const get_portfolio = await connection.query(`SELECT * FROM portfolios WHERE username='${lender}' AND asset_name='${collateral}'`)
                const asset_amount = get_portfolio[0].amount
                const new_amount = asset_amount + amount
                //update lender portfolio
                await connection.query(`UPDATE portfolios SET amount=${new_amount} WHERE username='${lender}' AND asset_name='${collateral}'`)
                //delete from collateral
                await connection.query(`DELETE FROM held_collateral WHERE coll_id='${collateral_id}'`)                                                                                                                               
            })
            await connection.query("COMMIT");
        }
    } catch(error){
        console.log(error)
        await connection.query("ROLLBACK");
    } finally {
      await connection.release();
    }
}