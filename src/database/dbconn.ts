var mysql = require('mysql');
import * as dotenv from "dotenv";
dotenv.config();

const dbConfig = {
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    database: process.env.DBNAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    insecureAuth : true
}

export const pool = mysql.createPool('mysql://<username>:<password> @<location>/<db name>?charset=utf8_general_ci&timezone=-0700');
export const connection = () => {
  return new Promise((resolve, reject) => {
  pool.getConnection((err:any, connection:any) => {
    if (err) reject(err);
    const query = (sql:any, binding:any) => {
      return new Promise((resolve, reject) => {
         connection.query(sql, binding, (err:any, result:any) => {
           if (err) reject(err);
           resolve(result);
           });
         });
       };
       const release = () => {
         return new Promise((resolve, reject) => {
           if (err) reject(err);
           resolve(connection.release());
         });
       };
       resolve({ query, release });
     });
   });
 };
 export const query = (sql:any, binding:any) => {
  return new Promise((resolve, reject) => {
    pool.query(sql, binding, (err:any, result:any, fields:any) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};

// pool.getConnection((err:any,connection:any)=> {
//     if(err)
//     throw err;
//     console.log('Database connected successfully');
//     connection.release();
//   });
  
//   module.exports = pool;
