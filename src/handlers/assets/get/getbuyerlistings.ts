const pool = require("../../../database/dbconn");

export const getbuyer = async(callback: Function)=>{
    const connection = await pool.connection();
    try {
        const get_buyer = await connection.query(`SELECT * FROM trade_listing WHERE party='buyer'`)
        return callback({code:200, message:get_buyer})    
    } catch (error) {
        console.log(error)
        callback({code:400, message:'An error occurred!'})
    }
}