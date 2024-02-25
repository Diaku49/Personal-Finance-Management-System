const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const compression = require('compression');
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient({
    errorFormat:'pretty'
});
const {SIO,initializeServerAndSocketIO} = require('./socket-io');










const AuthRoute = require('./routes/Auth');
const UserRoute = require('./routes/User');
const TRRoute = require('./routes/Transaction');
const CategoryRoute = require('./routes/Categories');
const SavingGRoute = require('./routes/SavingGoals');
const Dash_ReportsRoute = require('./routes/Dashboard_Reports');

const app = express();

app.use(helmet());
app.use(compression({threshold:'2kb'}));
app.use(bodyParser.json());


app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*') // just an dummy server
    res.setHeader('Access-Control-Allow-Methods','PUT,GET,POST,DELETE')
    res.setHeader('Access-Control-Allow-Headers','Origin Content-Type, Accept, Authorization')
    if(req.method === 'OPTIONS'){
        return res.sendStatus(200);
    }
    next();
})



app.use('/Auth',AuthRoute);
app.use('/User',UserRoute);
app.use('/TR',TRRoute);
app.use('/Categ',CategoryRoute);
app.use('/SGoals',SavingGRoute);
app.use('/Rahsboard_Report',Dash_ReportsRoute);





app.use((error,req,res,next)=>{
    console.log(error);
    const errorStatusCode = error.statusCode || 500;
    const errorData = error.data;
    const message = error.message;
    res.sendStatus(errorStatusCode).json({
        message:message,data:errorData
    })
})


const server = app.listen(process.env.PORT)


initializeServerAndSocketIO(server)