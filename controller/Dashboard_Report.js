const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient({
    errorFormat:'pretty'
});
//packages
const {validationResult} = require('express-validator');
require('../prisma/prisma');


exports.GetSummary = async(req,res,next)=>{
try{
    const user = await prisma.user.findFirst({
        where:{
            id:req.userId,
        },
        include:{
            transactions:true,
            savingGoals:true
        }
    });
    // seting time
    const now = new Date()
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    //Expense and Income
    let TotalExpense = 0, TotalIncome = 0;
    user.transactions.forEach(transc => {
            if (transc.date > oneMonthAgo && transc.date <= now) {
                const amount = parseFloat(transc.amount);
                if (transc.type === 'EXPENSE') {
                    TotalExpense += amount;
                } else if (transc.type === 'INCOME') {
                    TotalIncome += amount;
                }
            }
        });
    //getting total saving
    const TotalSaving = user.savingGoals.reduce((sum,saving)=>{
        if(saving.targetDate>oneMonthAgo && saving.targetDate <= now){
            return sum + parseFloat(saving.currentAmount);
        }
        return sum;
    },0);
    res.status(200).json({
        Message:'data fetched.',
        summary:{
            Income:TotalIncome,
            Expense:TotalExpense,
            Saving:TotalSaving
        }
    })
}
catch(err){
    if(!err.statusCode){
        err.statusCode = 500;
    }
    next(err);
}
}