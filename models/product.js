const mongoose=require('mongoose');
const {Schema}=mongoose

const productSchema=new Schema({
    name:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
        default:0
    },
    category:{
        type:String,
        enum:['vegetable','fruit','diary']
    },
    farm:{
        type: Schema.Types.ObjectId,
        ref: 'Farm'
    }
})

const Product=mongoose.model('Product',productSchema);

module.exports =Product;
