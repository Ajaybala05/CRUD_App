const product=require('./models/product');
const mongoose=require('mongoose');
mongoose.set('strictQuery', true)
mongoose.connect('mongodb://127.0.0.1:27017/FarmLand2')
.then(()=>{
    console.log("Mongo Connection open");
})
.catch(err =>{
    console.log("Oh no error")
    console.log(err)
})

const seedProduct =[
    {
        name:'Beetroot',
        price:20,
        category:'vegetable'
    },
    {
        name:'apple',
        price:150,
        category:'fruit'
    },
    {
        name:'avacado',
        price:30,
        category:'vegetable'
    }
]

product.insertMany(seedProduct)
.then(res=>{
    console.log(res)
})
.catch(err=>{
    console.log(err)
})