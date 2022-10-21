import express, { Application} from "express";
import {Server} from 'http'
import * as bodyParser from 'body-parser'
import { loan_monitor } from "./utils/monitor";
const cors = require('cors')
const cron = require('node-cron')
const userroutes = require('./routes/user')
const app: Application = express()

app.use(cors({
  origin: '*'
}));

cron.schedule('0 0 * * *',()=>{
 loan_monitor()
})

app.use(bodyParser.json()) 
app.use('/', userroutes)

const PORT: Number = Number(process.env.PORT) || 5000
const server: Server =  app.listen(PORT, ()=>{
  console.log(`server started on port ${PORT}`)
})