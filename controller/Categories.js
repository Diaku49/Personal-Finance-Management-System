const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient({
    errorFormat:'pretty'
});
//packages
const {validationResult} = require('express-validator');
const { UpdatingCategory } = require('../prisma/prisma');
require('../prisma/prisma');



exports.GetCategories = async(req,res,next)=>{
try{
    let empty
    const userId = req.userId
    const Categories = await prisma.category.findMany({
        where:{userId:userId}
    });
    if(!Categories){
        empty = 'No Category.'
        return res.status(200).json({
            message:'fetched.',
            empty:empty
        })
    };
    res.status(200).json({
        message:'categories Fetched.',
        Categories:Categories
    });
}
catch(err){
    if(!err.statusCode){
        err.statusCode = 500;
    }
    next(err)
}
}

exports.CreateCategory = async(req,res,next)=>{
try{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error('Validation Failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const {name,type} = req.body;
    if(type !=='INCOME' && type !== 'EXPENSE'){
        const error = new Error('Type not valid.');
        error.statusCode = 422;
        throw error;
    }
    const newCategory = await prisma.category.create({
        data:{
            name:name,
            type:type,
            userId:req.userId
        }
    })
    res.status(201).json({
        message:'category created.',
        newCategory:newCategory
    })
}
catch(err){
    if(!err.statusCode){
        err.statusCode = 500;
    }
    next(err)
}
}


exports.EditCategory = async(req,res,next)=>{
try{
    const categoryId = req.params.categoryId;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error('Validation Failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const {name,type} = req.body;
    if(type !=='INCOME' && type !== 'EXPENSE'){
        const error = new Error('Type not valid.');
        error.statusCode = 422;
        throw error;
    }
    const isOwned = await prisma.user.findFirst({
        where:{id:req.userId,categories:categoryId}
    });
    if(!isOwned){
        const error = new Error('Type not valid.');
        error.statusCode = 403;
        throw error;
    }
    const updatedCategory = await UpdatingCategory(categoryId,name,type);
    res.status(200).json({
        message:'updated category.',
        updatedCategory:updatedCategory
    })
}
catch(err){
    if(!err.statusCode){
        err.statusCode = 500;
    }
    next(err)
}
}


exports.DeleteCategory = async(req,res,next)=>{
try{
    const categoryId = req.params.categoryId;
    const isOwned = await prisma.user.findFirst({
        where:{id:req.userId,categories:categoryId}
    });
    if(!isOwned){
        const error = new Error('Type not valid.');
        error.statusCode = 403;
        throw error;
    }
    await prisma.category.delete({
        where:{id:categoryId}
    });
    res.status(204).json({
        message:'Category Deleted.'
    })
}
catch(err){
    if(!err.statusCode){
        err.statusCode = 500;
    }
    next(err)
}
}