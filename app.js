const express = require('express')
const app = express()
const bodyParser = require('body-parser')
require('./model/connection')
const users = require('./router/api/users')
const profiles = require('./router/api/profiles')
const passport = require('passport')


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

//passport
app.use(passport.initialize());
//验证的操作：结合passport与passport-jwt两模块结合使用；
require('./config/passport')(passport)

//配置有关用户的api
app.use('/api',users)
app.use('/api/profiles',profiles)

app.listen(3000,()=>{
    console.log('服务器启动成功！请访问3000端口！')
})