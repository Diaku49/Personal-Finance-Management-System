const express = require('express');
const {body} = require('express-validator');
const UserController = require('../controller/User')
const IsAuth = require('../MiddleWare/isAuth');


const Router = express.Router();


Router.get('/profile',IsAuth,UserController.GetProfile)

Router.put('/profile',IsAuth,[
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
],UserController.EditProfile)




module.exports = Router;