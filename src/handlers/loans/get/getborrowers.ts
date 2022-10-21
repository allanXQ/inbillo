const pool = require("../../../database/dbconn");

export const getborrowers = async (callback: Function)=>{
    const connection = await pool.connection();
    try {
        const get_credits = await connection.query(`SELECT * FROM loanListings WHERE party='borrower'`)
        return callback({code:200, message:get_credits})    
    } catch (error) {
        callback({code:400, message:'An error occurred!'})
    }
}