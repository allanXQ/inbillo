interface login{
    token:string,
    message:string
}
export interface response_message{
    code: number,
    message: login
}

export interface username{username: string}
export interface user extends username{
    firstname: string,
    lastname: string,
    email: string,
    phone: number,
    passwd: string,
    reg_date: string
}

export interface account_number{account_number: string}
export interface accounts {
    username: string, 
    balance: number
}

export interface loan{
    list_id:string,
    username: string,
    amount: number,
    collateral: string,
    collateral_value: number,
    payment_period: string,
    interest: number
}

export interface loanListing extends loan{
    party: string, 
}

export interface lend extends loan{
    borrower:string,
    coll_id:string
}

export interface borrow extends loan{
    lender: string,
    fund_id: string
}

export interface loans extends loan{
    list_id: string, 
    lender: string, 
    borrower: string, 
    creation_date: string
}

export interface pay{
    loan_id: string,
    coll_id:string,
    username:string,
}

export interface monitor{
    loan_id:string,
    payment_period: number,
    collateral_id:string
}

export interface deposits{
    deposit_id: string,
    username: string, 
    amount: number, 
    deposit_date: string
}

export interface asset_name{asset_name: string, }
export interface assets extends asset_name{
    amount: number
}

export interface portfolios {
    username: string, 
    asset_name: string, 
    amount: number,
    price: number
}

export interface trades {
    list_id: string, 
    username: string, 
    asset_name: string, 
    asset_id:string,
    amount: number,
}


