const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient({
    errorFormat:'pretty'
});


//User
exports.AuthUser = async(bool,userId)=>{
try{
    if(bool){
        const now = new Date().getTime()
        await prisma.user.update({
            where:{id:userId},
            data:{authDate:new Date(now+(60*60*1000))}
        })
        return;
    };
    await prisma.user.update({
        where:{id:userId},
        data:{authDate:null}
    })
    return;
}
catch(err){
    console.log(err)
    err.statusCode = 500;
    throw err;
}
}
//Transaction
exports.UpdatingTR = async(TransactionId,userId,description,amount,type,date,category)=>{
try{
    const existT = await prisma.transaction.findFirst({
        where:{id:TransactionId}
    })
    if(!existT){
        const error = new Error('Transaction dont exist.')
        err.statusCode = 404;
        throw error;
    }
    return await prisma.transaction.update({
        where:{id:TransactionId},
        data:{
            description:description,
            date:date,
            type:type,
            amount:amount,
            categoryId:category,
            userId:userId
        }
    });
}
catch(err){
    console.log(err)
    if(!err.statusCode){
        err.statusCode = 500;
    }
    throw err;
}
}


//Category
exports.UpdatingCategory = async(categoryId,name,type)=>{
try{
    const existCatg = await prisma.category.findFirst({
        where:{id:categoryId}
    })
    if(!existCatg){
        const error = new Error('Category dont exist.')
        err.statusCode = 404;
        throw error;
    }
    return await prisma.category.update({
        where:{id:categoryId},
        data:{
            name:name,
            type:type
        }
    });
}
catch(err){
    console.log(err)
    if(!err.statusCode){
        err.statusCode = 500;
    }
    throw err;
}
}