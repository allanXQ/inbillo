import { username } from "../../../interfaces/interfaces";
const pool = require("../../../database/dbconn");

export const getassets = async(details: username,callback: Function)=>{
    const connection = await pool.connection();
    try {
        const get_assets = await connection.query(`SELECT * FROM portfolios WHERE username='${details.username}'`)
        return callback({code:200, message:get_assets})    
    } catch (error) {
        callback({code:400, message:'An error occurred!'})
    }
}