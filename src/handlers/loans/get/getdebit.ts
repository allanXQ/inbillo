const pool = require("../../../database/dbconn");
import { username } from "../../../interfaces/interfaces";

export const getdebit = async(details: username,callback: Function)=>{
    const connection = await pool.connection();
    try {
        const get_debits = await connection.query(`SELECT * FROM loans WHERE lender='${details.username}'`)
        return callback({code:200, message:get_debits})    
    } catch (error) {
        callback({code:400, message:'An error occurred!'})
    }
}