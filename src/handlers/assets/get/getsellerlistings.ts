const pool = require("../../../database/dbconn");

export const getseller = async(callback: Function)=>{
    const connection = await pool.connection();
    try {
        const get_seller = await connection.query(`SELECT * FROM trade_listing WHERE party='seller'`)
        return callback({code:200, message:get_seller})    
    } catch (error) {
        callback({code:400, message:'An error occurred!'})
    }
}