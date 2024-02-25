const express = require('express');
const {body} = require('express-validator');
const TRController = require('../controller/Transaction')
const IsAuth = require('../MiddleWare/isAuth');


const Router = express.Router();

Router.get('/transactions',IsAuth,TRController.GetTransactions);

Router.post('/transactions/create',IsAuth,[
    body('description')
    .isString()
    .withMessage('Invalid.'),
    body('amount')
    .isFloat({min:1})
    .withMessage('Not enough/Not float.'),
    body('date')
    .trim()
    .isDate()
    .withMessage("not a Date"),
    body('type')
    .trim()
    .notEmpty()
    .withMessage('Empty')
],TRController.CreateTR)

Router.get('/transactoin/:TrId',IsAuth,TRController.GetTransac);

Router.put('/transaction/edit/:TrId',IsAuth,[
    body('description')
    .isString()
    .withMessage('Invalid.'),
    body('amount')
    .isFloat({min:1})
    .withMessage('Not enough/Not float.'),
    body('date')
    .trim()
    .isDate()
    .withMessage("not a Date"),
    body('type')
    .trim()
    .notEmpty()
    .withMessage('Empty')
],TRController.EditTR)

Router.delete('/transaction/delete/:TrId',IsAuth,TRController.DeleteTR);


module.exports = Router;