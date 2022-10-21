import { user } from "../../interfaces/interfaces"
const pool = require("../../database/dbconn");
const bcrypt = require('bcrypt')
import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import * as dotenv from "dotenv";
dotenv.config();
import date from 'date-and-time'

const now: Date = new Date();
const authtoken = (user:user)=>{
    const jwt_secret: Secret = '1b8a0aca9ce168c5e06dedb45f280a95'//process.env.JWT_SECRET
    const token = jwt.sign({username:user.username,email:user.email}, jwt_secret)
    return (token)
// return res.json({status:'200', message:'Successful login', access_token:token})
}

export const user_login = async (user:user, callback: Function)=>{
    const username = user.username
    const password = user.passwd
    const connection = await pool.connection();
    console.log(username,password)
    try {
    const login_user = await connection.query(`SELECT * FROM users WHERE username='${username}' AND passwd='${password}'`)
    if(login_user.length > 0){
        const bcompare = await bcrypt.compare(password, login_user.password)
        if(bcompare){
            return callback({code:200, message:{token:authtoken(user),message:'Login successful'}})
        } else {
            callback({code:400, message:'Login Failed!'})
        }
        
    }
    else return callback({code:400, message:'INVALID CREDENTIALS!'})
    } catch(error){
        console.log(error)
        await connection.query("ROLLBACK");
        callback({code:400, message:'Login Failed!'})
    } finally {
    await connection.release();
    }
}