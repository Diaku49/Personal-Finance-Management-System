const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient({
    errorFormat:'pretty'
});
//packages
const {validationResult} = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('../prisma/prisma');



exports.GetProfile = async(req,res,next)=>{
try{
    const userId = req.userId;
    const user = await prisma.user.findFirst({
        where:{
            id:userId
        }
    });
    res.status(200).json({
        message:'user fetched.',
        user:user
    })
}
catch(err){
    if(!err.statusCode){
        err.statusCode = 500;
    }
    next(err)
}
}


exports.EditProfile = async(req,res,next)=>{
try{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error('Validation Failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const {name,email,password} = req.body;
    const newpassword = await bcrypt.hash(password,12);
    const user = await prisma.user.update({
        where:{id:req.userId},
        data:{
            name:name,
            email:email,
            password:newpassword,
            updatedAt:new Date()
        }
    });
    res.status(200).json({
        message:'user Updated.',
        user:{name:name,email:email}
    })
}
catch(err){
    if(!err.statusCode){
        err.statusCode = 500;
    }
    next(err)
}
}