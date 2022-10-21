const pool = require("../../../database/dbconn");

export const getlenders = async(callback: Function)=>{
    const connection = await pool.connection();
    try {
        const get_lenders = await connection.query(`SELECT * FROM loanListings WHERE party='lender'`)
        return callback({code:200, message:get_lenders})    
    } catch (error) {
        callback({code:400, message:'An error occurred!'})
    }
}