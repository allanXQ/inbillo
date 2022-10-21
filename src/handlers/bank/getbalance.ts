const pool = require("../../database/dbconn");
import { deposits, username } from "../../interfaces/interfaces";
import { v4 as uuidv4 } from 'uuid'
import date from 'date-and-time'
import moment from "moment";
const now: Date = new Date();
const current_time: string = date.format(now, 'YYYY/MM/DD HH:mm:ss').toString()


export const getbalance = async (details:username,callback: Function)=>{
    const connection = await pool.connection();
    try { 
        await connection.query("START TRANSACTION");
        const get_user = await connection.query(`SELECT * FROM accounts WHERE username='${details.username}'`)
          if(get_user.length === 0){
            await connection.query("ROLLBACK");
            return callback({code:400, message:'Account not found'})
          }
        await connection.query("COMMIT");
        return callback({code:200, message:get_user})
    } catch(error){
    console.log(error)
    callback({code:400, message:'Request failed'})
    await connection.query("ROLLBACK");
    } finally {
    await connection.release();
}
}