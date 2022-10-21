const pool = require("../../../database/dbconn");

export const getloans = async (callback: Function)=>{
    const connection = await pool.connection();
    try {
        const get_lenders = await connection.query(`SELECT * FROM loans`)
        return callback({code:200, message:get_lenders})    
    } catch (error) {
        callback({code:400, message:'An error occurred!'})
    }
}