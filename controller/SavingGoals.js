const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient({
    errorFormat:'pretty'
});
//packages
const {validationResult} = require('express-validator');
require('../prisma/prisma');



exports.GetSavingG = async(req,res,next)=>{
try{
    let empty
    const SavingG = await prisma.savingGoal.findMany({
        where:{userId:req.userId},
    });
    if(!SavingG){
        empty = 'no transaction'
        return res.status(200).json({
            message:'fetched.',
            empty:empty
        })
    };
    res.status(200).json({
        message:'fetched.',
        TRs:SavingG
    })
}
catch(err){
    if(!err.statusCode){
        err.statusCode = 500;
    }
    next(err);
}
}

exports.CreateSavingG = async(req,res,next)=>{
try{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error('Validation Failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const {name,targetAmount,currentAmount,targetDate} = req.body;
    const newSavingGoal = prisma.savingGoal.create({
        data:{
            name:name,
            targetAmount:targetAmount,
            currentAmount:currentAmount,
            targetDate:targetDate,
            userId:req.userId
        }
    });
    res.status(201).json({
        message:'SavingGoal created.',
        savingGoal:newSavingGoal
    })
}
catch(err){
    if(!err.statusCode){
        err.statusCode = 500;
    }
    next(err);
}
}


exports.EditSavingG = async(req,res,next)=>{
try{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error('Validation Failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const savingGoalId = req.params.savingGoalId
    const isOwnes = prisma.user.findFirst({
        where:{savingGoals:{
            some:savingGoalId
        }}
    })
    if(!isOwnes){
        const error = new Error('Not the creater.');
        error.statusCode = 403;
        throw error;
    }
    const {name,targetAmount,currentAmount,targetDate} = req.body;
    const updatedSavingGoal = prisma.savingGoal.update({
        data:{
            name:name,
            targetAmount:targetAmount,
            currentAmount:currentAmount,
            targetDate:targetDate,
            userId:req.userId
        }
    });
    res.status(201).json({
        message:'SavingGoal Updated.',
        savingGoal:updatedSavingGoal
    })
}
catch(err){
    if(!err.statusCode){
        err.statusCode = 500;
    }
    next(err);
}
}


exports.DeleteSavingG = async(req,res,next)=>{
try{
    const savingGoalId = req.params.savingGoalId
    const isOwnes = prisma.user.findFirst({
        where:{savingGoals:{
            some:savingGoalId
        }}
    })
    if(!isOwnes){
        const error = new Error('Not the creater.');
        error.statusCode = 403;
        throw error;
    }
    await prisma.savingGoal.delete({
        where:{id:savingGoalId}
    });
    res.status(204).json({
        message:'savingGoal deleted.'
    })
}
catch(err){
    if(!err.statusCode){
        err.statusCode = 500;
    }
    next(err);
}
}