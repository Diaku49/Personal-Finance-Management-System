const express = require('express');
const {body} = require('express-validator');
const CategoryController = require('../controller/Categories');
const IsAuth = require('../MiddleWare/isAuth');


const Router = express.Router();


Router.get('/categories',IsAuth,CategoryController.GetCategories);

Router.post('/create/Category',IsAuth,[
    body('name')
    .trim()
    .isLength({min:3})
    .withMessage('More character.'),
    body('type')
    .trim()
    .notEmpty()
    .withMessage('Empty')
],CategoryController.CreateCategory);

Router.put('/edit/Category/:categoryId',IsAuth,[
    body('name')
    .trim()
    .isLength({min:3})
    .withMessage('More character.'),
    body('type')
    .trim()
    .notEmpty()
    .withMessage('Empty')
],CategoryController.EditCategory);

Router.delete('/delete/Category/:categoryId',IsAuth,CategoryController.DeleteCategory)

module.exports = Router;