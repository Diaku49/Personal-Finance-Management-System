const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient({
    errorFormat:'pretty'
});
const jwt = require('jsonwebtoken');


const IsAuth = async(req,res,next)=>{
try{
    const authorization = req.get('Athorization');
    if(!authorization){
        const error = new Error('Not authorized.');
        error.statusCode = 401;
        throw error
    };
    const token = req.headers.authorization.split(' ')[1];
    const decodeToken = jwt.verify(token,process.env.JWT_SECRET)
    if(!decodeToken){
        const error = new Error('Invalid Token.');
        error.statusCode = 401;
        throw error
    };
    const user = await prisma.user.findFirst({
        where:{id:decodeToken.userId}
    })
    if(!user.authDate){
        const error = new Error('Not authorized.');
        error.statusCode = 401;
        throw error
    }
    req.userId = user.id;
    req.email = user.email;
    next()
}
catch(err){
    if (!err.statusCode) {
        err.statusCode = 500;
    }
    next(err);
}
}

module.exports = IsAuth