const mongoose = require('mongoose')
const { MongoUrl } = require('../config/keys')
 mongoose.connect(MongoUrl,{ useNewUrlParser: true ,useUnifiedTopology: true})
    .then( ()=>{
        console.log('数据库连接成功!')
    } )
    .catch((err)=>{
        console.log(err.message)
        console.log('数据库连接失败!')
    })
