const mongoose=require('mongoose');
const Product=require('./product');
const {Schema} =mongoose;

const farmSchema=new Schema({
    name:{
        type:String,
        required:[true,'farm must have a name']
    },
    city:{
        type:String,
        required:true
    },
    email:{
        type:String,
        reuired:true
    },
    products:[
        {
            type:Schema.Types.ObjectId,
            ref:'Product'
        }
    ]
})

const Farm=mongoose.model('Farm',farmSchema);

module.exports=Farm;