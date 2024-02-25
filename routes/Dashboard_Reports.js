const express = require('express');
const {body} = require('express-validator');
const Dash_ReportsController = require('../controller/Dashboard_Report');
const IsAuth = require('../MiddleWare/isAuth');


const Router = express.Router();

Router.get('/In_Ex_Save',IsAuth,Dash_ReportsController.GetSummary);

module.exports = Router;