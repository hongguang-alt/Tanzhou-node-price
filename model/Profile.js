const mongoose =require('mongoose')
const profileSchema =new mongoose.Schema({
    author:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'users'
    },
    type:{
        type:String
    },
    descript:{
        type:String
    },
    income:{
        type:String,
        required:true
    },
    expend:{
        type:String,
        // required:true
        required:true      
    },
    cash:{
        type:String,
        required:true    
    },
    remark:{
        type:String
    },
    date:{
        type:Date,
        default:Date.now()        
    }
})
let Profile = mongoose.model('profiles',profileSchema)

module.exports = Profile