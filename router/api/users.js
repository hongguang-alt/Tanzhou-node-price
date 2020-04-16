const express = require('express')
const users = express.Router()
const User = require('../../model/User')
const bcrypt = require('bcryptjs')
const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');
const passport = require('passport')

users.get('/',(req,res)=>{
    res.send('这是api界面')
})

//登陆功能实现
users.post('/login', async (req,res)=>{
    let result = await User.findOne({email:req.body.email})
    if(result){
        let isEqual = await bcrypt.compare(req.body.password,result.password)
        if(isEqual){
            
            const rule = {
                id:result.id,
                name:result.name,
                identity:result.identity,
                avater:result.avatar,
                email:result.email
            }

            //参数：规则，加密名字，对象：{如过期时间}，回调函数
            jwt.sign(rule,'secret',{ expiresIn:60*60*1000 },(err,token)=>{
                if(err){ throw err }
                res.json({
                    status:200,
                    message:'登陆成功！',
                    data:{
                        token:'Bearer '+token,
                        role:result
                    }
                })
            })
        }else{
            res.json({
                status:201,
                message:'密码错误！'
            })
        }
    }else{
        res.json({
            status:201,
            message:'账号错误！'
        })
    }
})

//注册功能实现
users.post('/register',async (req,res)=>{    
    if(req.body){
        let result =await User.findOne({email:req.body.email})
        if(result){
           return res.json({
                status:201,
                message:'账号已经被注册了！'
            })
        }
        let salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password,salt)
        req.body.avatar = gravatar.url('emerleite@gmail.com', {s: '200', r: 'pg', d: '404'});
        result = await User.create(req.body)
        if(result){
            res.json({
                status:200,
                message:'账号注册成功！'
            })
        }
    }else{
        res.json({
            status:201,
            message:'传入数据不能为空！'
        })
    }
})

//token的测试接口
users.get('/current',passport.authenticate('jwt', { session: false }),(req,res)=>{
    res.json({
        user:req.user
    })
})


module.exports = users