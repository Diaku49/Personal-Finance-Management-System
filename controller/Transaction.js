const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient({
    errorFormat:'pretty'
});
//packages
const {validationResult} = require('express-validator');
const { UpdatingTR } = require('../prisma/prisma');
require('../prisma/prisma');


exports.GetTransactions = async(req,res,next)=>{
try{
    let empty
    const TRs = await prisma.transaction.findMany({
        where:{userId:req.userId},
        include:{
            category:true
        }
    });
    if(!TRs){
        empty = 'no transaction'
        return res.status(200).json({
            message:'fetched.',
            empty:empty
        })
    };
    res.status(200).json({
        message:'fetched.',
        TRs:TRs
    })
}
catch(err){
    if(!err.statusCode){
        err.statusCode = 500;
    }
    next(err)
}
}

exports.CreateTR = async(req,res,next)=>{
try{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error('Validation Failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const {description,amount,type,date,} = req.body;
    //checking type
    if(type !=='INCOME' && type !== 'EXPENSE'){
        const error = new Error('Type not valid.');
        error.statusCode = 422;
        throw error;
    }
    //checking category
    const category = req.query.categoryId;
    const isCategory = await prisma.category.findFirst({
        where:{id:category}
    })
    if(!isCategory){
        const error = new Error('Category not valid.');
        error.statusCode = 422;
        throw error;
    }
    //create
    const newTR = await prisma.transaction.create({
        data:{
            description:description,
            date:date,
            type:type,
            amount:amount,
            categoryId:category,
            userId:req.userId
        }
    });
    res.status(201).json({
        message:'Created TR.',
        TR:newTR
    })
}
catch(err){
    if(!err.statusCode){
        err.statusCode = 500;
    }
    next(err)
}
}

exports.GetTransac = async(req,res,next)=>{
try{
    const transactionId = req.params.TrId;
    const TR = await prisma.transaction.findFirst({
        where:{id:transactionId},
        include:{category:true}
    });
    if(!TR){
        const error = new Error('Transaction didnt Exist.');
        error.statusCode = 404;
        throw error;
    }
    res.status(200).json({
        message:'TR Fetched.',
        TR:TR
    })
}
catch(err){
    if(!err.statusCode){
        err.statusCode = 500;
    }
    next(err)
}
}

exports.EditTR = async(req,res,next)=>{
try{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error('Validation Failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const transactionId = req.params.TrId;
    const isOwns = await prisma.user.findFirst({
        where:{
            id:req.userId,
            transactions:{
                some:transactionId
            }
        }
    })
    if(!isOwns){
        const error = new Error('You are not the creater.')
        error.statusCode = 403
        throw error;
    }
    const {description,amount,type,date,} = req.body;
    //checking type
    if(type !=='INCOME' && type !== 'EXPENSE'){
        const error = new Error('Type not valid.');
        error.statusCode = 422;
        throw error;
    }
    //checking category
    const category = req.query.categoryId
    const isCategory = await prisma.category.findFirst({
        where:{id:category}
    })
    if(!isCategory){
        const error = new Error('Category not valid.');
        error.statusCode = 422;
        throw error;
    };
    //edit
    const newTR = await UpdatingTR(transactionId,req.userId,description,amount,type,date,category)
    //response
    res.status(201).json({
        message:'Created TR.',
        TR:newTR
    })
}
catch(err){
    if(!err.statusCode){
        err.statusCode = 500;
    }
    next(err)
}
}


exports.DeleteTR = async(req,res,next)=>{
try{
    const transactionId = req.params.TrId;
    const isOwns = await prisma.user.findFirst({
        where:{
            id:req.userId,
            transactions:{
                some:transactionId
            }
        }
    })
    if(!isOwns){
        const error = new Error('You are not the creater.')
        error.statusCode = 403
        throw error;
    }
    await prisma.transaction.delete({
        where:{id:transactionId}
    });
    res.status(204).json({
        message:'Transaction deleted.'
    })
}
catch(err){
    if(!err.statusCode){
        err.statusCode = 500;
    }
    next(err)
}
}