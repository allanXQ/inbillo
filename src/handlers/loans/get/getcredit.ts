import { username } from "../../../interfaces/interfaces";
const pool = require("../../../database/dbconn");

export const getcredit = async(details: username,callback: Function)=>{
    const connection = await pool.connection();
    try {
        const get_credits = await connection.query(`SELECT * FROM loans WHERE borrower='${details.username}'`)
        return callback({code:200, message:get_credits})    
    } catch (error) {
        callback({code:400, message:'An error occurred!'})
    }
}