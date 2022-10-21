import { user } from "../../interfaces/interfaces"
const pool = require("../../database/dbconn");
const bcrypt = require('bcrypt')
import date from 'date-and-time'
import { v4 as uuidv4 } from 'uuid'

const now: Date = new Date();

export const user_register = async (user:user, callback: Function)=>{
    const username = user.username
    const email = user.email
    const firstname = user.firstname
    const lastname = user.lastname
    const phone = user.phone
    const password: string = user.passwd
    const current_time: string = date.format(now, 'YYYY/MM/DD HH:mm:ss').toString()
    const connection = await pool.connection();
    try {
        const hashed_password = await bcrypt.hash(password, 10)
        await connection.query(`INSERT INTO users(username, firstname, lastname, email, phone, passwd, reg_date)
        VALUES ('${username}', '${firstname}', '${lastname}', 
        '${email}', '${phone}', '${hashed_password}', '${current_time}')`)
        //create an account
        const account_number: String = uuidv4()
        await connection.query(`INSERT INTO accounts(account_number,username, balance)
        VALUES ('${account_number}', '${username}', 0)`)
        await connection.query("COMMIT");
        return callback({code:400, message:'Registration SUCCESSFUL'})

    } catch(error){
        console.log(error)
        await connection.query("ROLLBACK");
        callback({code:400, message:'Registration Failed!'})
    } finally {
    await connection.release();
    }
}