const express=require('express');
const app=express();
const path=require('path');
const method=require('method-override'); 
const product=require('./models/product');
const AppError=require("./AppError.js");
const ObjectID = require('mongoose').Types.ObjectId;
const Farm=require('./models/farm');
const categories = ['fruit', 'vegetable', 'dairy'];


const mongoose=require('mongoose');
mongoose.set('strictQuery', true)
mongoose.connect('mongodb://127.0.0.1:27017/FarmLand3')
.then(()=>{
    console.log("Mongo Connection open");
})
.catch(err =>{
    console.log("Oh no error")
    console.log(err)
})

app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');
app.use(express.urlencoded({extended:true}))
app.use(method('_method'))
app.get('/dogs',(req,res)=>{
    res.send("Woof")
})

app.get('/farms',async(req,res)=>{
    const farms=await Farm.find({});
    res.render('farms/index',{farms})
})
app.get('/farms/new',async(req,res)=>{
    res.render('farms/new')
})
app.get('/farms/:id',async(req,res)=>{
    const {id}=req.params;
    const fdFarm=await Farm.findById(id).populate('products');
    res.render('farms/show',{fdFarm})
})
app.post('/farms',async(req,res)=>{
    const farm=await new Farm(req.body);
    await farm.save();
    res.redirect('/farms')
})

app.get('/farms/:id/product/new',async(req,res)=>{
    const {id}=req.params;
    res.render('products/new',{categories,id})
})
app.post('/farms/:id/product',async(req,res)=>{
    const {id}=req.params;
    const farm=await Farm.findById(id);
    const {name,price,category}=req.body;
    const product1=new product({name,price,category})
    farm.products.push(product1);
    product1.farm=farm;
    await farm.save();
    await product1.save();
    res.redirect(`/farms/${id}`)
})




// Product routes
function wrapAsync(fn){
    return function(req,res,next){
        fn(req,res,next).catch(e => next(e))
    }
}
app.get('/product',wrapAsync(async (req,res)=>{
    const {category}=req.query;
    if(category){
        const products= await product.find({category});
        res.render('products/index',{products,category})
    }
    else{
        const products= await product.find({});
        res.render('products/index',{products,category:"All"})
    }
    
}))
app.get('/product/new',(req,res)=>{
    res.render('products/new')
})

app.post('/product',wrapAsync(async(req,res)=>{
    const updateProd =new product(req.body);
    await updateProd.save();
    res.redirect(`/product/${updateProd._id}`);
    // console.log(req.body);
    // res.send("it worked")
}))
app.get('/product/:id',wrapAsync(async(req,res,next)=>{
    const {id}=req.params;
    if (!ObjectID.isValid(id)) {
        return next(new AppError('Invalid Id', 400));
    }
    const Foundprod=await product.findById(id).populate('farm','name');
    if(!Foundprod){
        return next(new AppError("not found",404));
    }
    res.render('products/show',{Foundprod})
}))
app.get('/product/:id/edit',wrapAsync(async(req,res)=>{
    const {id}=req.params;
    const fdproduct=await product.findById(id);
    res.render('products/edit',{fdproduct})
}))
app.put('/product/:id',wrapAsync(async(req,res)=>{
    // res.send("Put!!!")
    const {id}=req.params;
    const NewProduct=await product.findByIdAndUpdate(id,req.body,{runValidators:true,new:true});
    res.redirect(`/product/${NewProduct._id}`)
}))
app.delete('/product/:id',wrapAsync(async(req,res)=>{
    const {id}=req.params;
    await product.findByIdAndDelete(id);
    res.redirect('/product')
}))

app.use((err,req,res,next)=>{
    const {status=500,message="Something went wrong"}=err;
    res.status(status).send(message)
})
app.listen(3000,(req,res)=>{
    console.log("Listening on port 3000")
})