import { username } from "../../../interfaces/interfaces";
const pool = require("../../../database/dbconn");

export const gettrades = async(details: username,callback: Function)=>{
    const connection = await pool.connection();
    try {
        const get_trades = await connection.query(`SELECT * FROM trades WHERE buyer='${details.username}' OR seller='${details.username}'`)
        return callback({code:200, message:get_trades})    
    } catch (error) {
        callback({code:400, message:'An error occurred!'})
    }
}