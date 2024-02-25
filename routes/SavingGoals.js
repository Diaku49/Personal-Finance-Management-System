const express = require('express');
const {body} = require('express-validator');
const SavingGoalsController = require('../controller/SavingGoals');
const IsAuth = require('../MiddleWare/isAuth');


const Router = express.Router();

Router.get('/getSavingG',IsAuth,SavingGoalsController.GetSavingG);

Router.post('/create/SavingG',IsAuth,[
    body('name')
    .trim()
    .isLength({min:3})
    .withMessage('short'),
    body('targetAmount')
    .isFloat({min:10})
    .withMessage('little.'),
    body('currentAmount')
    .isFloat({min:0})
    .withMessage('not valid.'),
    body("targetDate")
    .isDate()
    .withMessage('not a Date.')
],SavingGoalsController.CreateSavingG)

Router.put('/edit/SavingG/:savingGoalId',IsAuth,[
    body('name')
    .trim()
    .isLength({min:3})
    .withMessage('short'),
    body('targetAmount')
    .isFloat({min:10})
    .withMessage('little.'),
    body('currentAmount')
    .isFloat({min:0})
    .withMessage('not valid.'),
    body("targetDate")
    .isDate()
    .withMessage('not a Date.')
],SavingGoalsController.EditSavingG);

Router.delete('/delete/SavingG/:savingGaolId',IsAuth,SavingGoalsController.DeleteSavingG)


module.exports = Router