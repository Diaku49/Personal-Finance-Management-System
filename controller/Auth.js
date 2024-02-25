const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient({
    errorFormat:'pretty'
});
//packages
const {validationResult} = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { AuthUser } = require('../prisma/prisma');
require('../prisma/prisma');



exports.SignUp = async(req,res,next)=>{
try{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error('Validation Failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const {email,name,password} = req.body;
    //checking email
    const isEqual = await prisma.user.findUnique({
        where:{email:email}
    });
    if(isEqual){
        const error = new Error('Email already exist.');
        error.statusCode = 409;
        throw error;
    }
    const newPassword = await bcrypt.hash(password,12);
    await prisma.user.create({
        data:{
            name:name,
            password:newPassword,
            email:email
        }
    });
    res.status(201).json({
        message:'Signed up.',
        user:{
            email:email,
            name:name
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


exports.LogIn = async (req,res,next)=>{
try{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error('Validation Failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    };
    const {email,password} = req.body;
    //checking email and pass
    const existUser = await prisma.user.findUnique({
        where:{
            email:email
        }
    });
    if(!existUser){
        const error = new Error('User with the current Email dont exist.');
        error.statusCode = 404;
        throw error;
    }
    const isPassValid = await bcrypt.compare(password,existUser.password);
    if(!isPassValid){
        const error = new Error('Wrong password.');
        error.statusCode = 403;
        throw error;
    }
    //creating a token
    const token = jwt.sign({
        userId:existUser.id
    },process.env.JWT_SECRET,{expiresIn:'0.8h'});
    // set the AuthUser
    await AuthUser(true,existUser.id);
    //response
    res.status(200).json({
        message:'loged In.',
        token:token
    })
}
catch(err){
    if(!err.statusCode){
        err.statusCode = 500;
    }
    next(err);
}
}


exports.LogOut = async(req,res,next)=>{
try{
    await AuthUser(false,req.userId);
    res.statusCode(200).json({message:'Logged Out.'});
}
catch(err){
    if(!err.statusCode){
        err.statusCode = 500;
    }
    next(err);
}
}