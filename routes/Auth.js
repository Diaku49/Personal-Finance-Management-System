const express = require('express');
const {body} = require('express-validator');
const AuthController = require('../controller/Auth')
const IsAuth = require('../MiddleWare/isAuth');



const Router = express.Router();

Router.post('/SignUp',[
    body('name')
    .trim()
    .isLength({min:3})
    .withMessage('Not enough characters.'),
    body('email')
    .normalizeEmail()
    .isEmail()
    .withMessage('Invalid Email.'),
    body('password')
    .trim()
    .isLength({min:8})
    .withMessage('Weak password.'),
    body('confirmPassword')
    .custom((value,{req})=>{
        if(value !== req.body.password){
            const error = new Error('Mismatched password')
            error.statusCode = 422;
            throw error;
        }
        return true
    })
],AuthController.SignUp);


Router.post('/LogIn',[
    body('email')
    .normalizeEmail()
    .isEmail()
    .withMessage('Invalid Email.'),
    body('password')
    .trim()
    .isLength({min:8})
    .withMessage('Weak password.')
],AuthController.LogIn);


Router.put('/logOut',IsAuth,AuthController.LogOut)









module.exports = Router;