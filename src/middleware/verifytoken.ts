import express, {Request, Response, NextFunction} from "express";
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv').config()

export const verifyjwt = (req: Request,res: Response, next: NextFunction)=>{
    try {
        const {token} = req.body
        if(!token){
            return res.json({status:403, message:'forbidden'})
        }
        const verify = jwt.verify(token, process.env.JWT_SECRET)
        if(!verify){
            return res.json({status:403, message:'forbidden'})
        }
        // res.locals.id = verify.id
        //console.log(verify)
    } catch (error) {
        return res.json({status:403, message:'forbidden'})
    }


    next()
}
