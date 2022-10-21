import { verify } from "crypto";
import express, {Request, Response, NextFunction} from "express";
import { buy } from "../handlers/assets/buy";
import { createbuyerlisting } from "../handlers/assets/buyerlisting";
import { getassets } from "../handlers/assets/get/getassets";
import { getbuyer } from "../handlers/assets/get/getbuyerlistings";
import { getseller } from "../handlers/assets/get/getsellerlistings";
import { gettrades } from "../handlers/assets/get/gettrades";
import { list } from "../handlers/assets/list";
import { sell } from "../handlers/assets/sell";
import { createsellerlisting } from "../handlers/assets/sellerlisting";
import { user_login } from "../handlers/auth/login";
import { user_register } from "../handlers/auth/register";
import { balancesheet } from "../handlers/bank/balancesheet";
import { deposit } from "../handlers/bank/deposit";
import { getbalance } from "../handlers/bank/getbalance";
import { borrow_loan } from "../handlers/loans/borrow";
import { createBorrowerListing } from "../handlers/loans/createBorrowerListing";
import { createLenderListing } from "../handlers/loans/createLenderListing";
import { getborrowers } from "../handlers/loans/get/getborrowers";
import { getcredit } from "../handlers/loans/get/getcredit";
import { getdebit } from "../handlers/loans/get/getdebit";
import { getlenders } from "../handlers/loans/get/getlenders";
import { give_loan } from "../handlers/loans/lend";
import { pay_loan } from "../handlers/loans/pay";
import { response_message } from "../interfaces/interfaces";
import { verifyjwt } from "../middleware/verifytoken";

const router = express.Router()
// router.use(verifyjwt)

// register user
router.post('/register', (req: Request,res: Response)=>{
    const callback = (message: response_message)=>{
        res.status(message.code).send(message.message)
    }
    user_register(req.body,callback)
})

//user login
router.post('/login', (req: Request,res: Response)=>{
    const callback = (message: response_message)=>{
        res.writeHead
        res.status(message.code).send(message.message)
    }
    user_login(req.body,callback)
})

//deposit cash
router.post('/deposit',verifyjwt, (req: Request,res: Response)=>{
    const callback = (message: response_message)=>{
        res.status(message.code).send(message.message)
    }
    deposit(req.body,callback)
})

// create lend listing
router.post('/createlenderlisting',verifyjwt, (req: Request,res: Response)=>{
    const callback = (message: response_message)=>{
        res.status(message.code).send(message.message)
    }
    createLenderListing(req.body,callback)
})

// create borrow listing
router.post('/createborrowerlisting',verifyjwt, (req: Request,res: Response)=>{
    const callback = (message: response_message)=>{
        res.status(message.code).send(message.message)
    }
    createBorrowerListing(req.body,callback)
})

//borrow cash
router.post('/borrow',verifyjwt, (req: Request,res: Response)=>{
    const callback = (message: response_message)=>{
        res.status(message.code).send(message.message)
    }
    borrow_loan(req.body,callback)
})

// lend cash
router.post('/lend',verifyjwt, (req: Request,res: Response)=>{
    const callback = (message: response_message)=>{
        res.status(message.code).send(message.message)
    }
    give_loan(req.body,callback)
})

//pay loan
router.post('/pay',verifyjwt, (req: Request,res: Response)=>{
    const callback = (message: response_message)=>{
        res.status(message.code).send(message.message)
    }
    pay_loan(req.body,callback)
})

// get loans taken by current user
router.get('/loans_taken',verifyjwt, (req: Request,res: Response)=>{
    const callback = (message: response_message)=>{
        res.status(message.code).send(message.message)
    }
    getcredit(req.body,callback)
})

//get loans given by current user
router.get('/loans_given',verifyjwt, (req: Request,res: Response)=>{
    const callback = (message: response_message)=>{
        res.status(message.code).send(message.message)
    }
    getdebit(req.body,callback)
})

//get list of all lenders
router.get('/lenders',verifyjwt, (req: Request,res: Response,next:NextFunction)=>{
    const callback = (message: response_message)=>{
        res.status(message.code).send(message.message)
    }
    getlenders(callback)
})

//get list of all borrowers
router.get('/borrowers',verifyjwt, (req: Request,res: Response)=>{
    const callback = (message: response_message)=>{
        res.status(message.code).send(message.message)
    }
    getborrowers(callback)
})

router.get('/balance',verifyjwt, (req: Request,res: Response)=>{
    const callback = (message: response_message)=>{
        res.status(message.code).send(message.message)
    }
    getbalance(req.body,callback)
})

//list an asset
router.post('/list',verifyjwt, (req: Request,res: Response)=>{
    const callback = (message: response_message)=>{
        res.status(message.code).send(message.message)
    }
    list(req.body,callback)
})

//create seller listing
router.post('/createsellerlisting',verifyjwt, (req: Request,res: Response)=>{
    const callback = (message: response_message)=>{
        res.status(message.code).send(message.message)
    }
    createsellerlisting(req.body,callback)
})

//create buyer listing
router.post('/createbuyerlisting',verifyjwt, (req: Request,res: Response)=>{
    const callback = (message: response_message)=>{
        res.status(message.code).send(message.message)
    }
    createbuyerlisting(req.body,callback)
})

//buy
router.post('/buy',verifyjwt, (req: Request,res: Response)=>{
    const callback = (message: response_message)=>{
        res.status(message.code).send(message.message)
    }
    buy(req.body,callback)
})

//sell
router.post('/sell',verifyjwt, (req: Request,res: Response)=>{
    const callback = (message: response_message)=>{
        res.status(message.code).send(message.message)
    }
    sell(req.body,callback)
})

//get trades made by user
router.get('/trades',verifyjwt, (req: Request,res: Response)=>{
    const callback = (message: response_message)=>{
        res.status(message.code).send(message.message)
    }
    gettrades(req.body,callback)
})

//get buyer listings
router.get('/buyers',verifyjwt, (req: Request,res: Response)=>{
    const callback = (message: response_message)=>{
        res.status(message.code).send(message.message)
    }
    getbuyer(callback)
})

router.get('/sellers',verifyjwt, (req: Request,res: Response)=>{
    const callback = (message: response_message)=>{
        res.status(message.code).send(message.message)
    }
    getseller(callback)
})

router.get('/portfolio',verifyjwt, (req: Request,res: Response)=>{
    const callback = (message: response_message)=>{
        res.status(message.code).send(message.message)
    }
    getassets(req.body,callback)
})


router.get('/balancesheet',verifyjwt, (req: Request,res: Response)=>{
    const callback = (message: response_message)=>{
        res.status(message.code).send(message.message)
    }
    balancesheet(req.body,callback)
})

module.exports = router