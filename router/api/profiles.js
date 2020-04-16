const express = require('express')
const profiles = express.Router()
const Profile = require('../../model/Profile')
const passport = require('passport')

//增加
profiles.post('/add',passport.authenticate('jwt', { session: false }),async (req,res)=>{
    req.body.author = req.user.id
    let result = await Profile.create(req.body)
    if(result){
        res.json({
            status:200,
            message:'添加成功'
        })
    }
})
//编辑
profiles.post('/edit/:id',passport.authenticate('jwt', { session: false }),async(req,res)=>{
    let result = await Profile.updateOne({_id:req.params.id},req.body)
    console.log(result)
    if(result.ok==1){
        res.json({
            status:200,
            message:'修改成功'
        })
    }
})

//查找,按照分页来查询
profiles.get('/find',passport.authenticate('jwt', { session: false }) ,async(req,res)=>{
    //根据id来查询
    if(req.query.id){
        let result = await Profile.findById({_id:req.query.id})
        if(result){
            res.json({
                status:200,
                message:'查询成功',
                data:result
            })
        }else{
            res.json({
                status:201,
                message:'暂无数据'
            })
        }
    }
    //分页查询
    if(req.query.currentPage && req.query.pageSize){
        let currentPage =req.query.currentPage
        let pageSize = req.query.pageSize
        let result = await Profile.find({author:req.user.id})
        let total = result.length
        let skip = (total/pageSize)*(currentPage-1)
        let islimit = (skip % pageSize) == 0 ? pageSize : (total % pageSize)
        let pageResult;
        if(req.query.start && req.query.end ){
            pageResult = await Profile.find({date:{$gt:req.query.start,$lt:req.query.end}}).find({author:req.user.id}).skip(parseInt(skip)).limit(parseInt(islimit))
        }else{
            pageResult = await Profile.find({author:req.user.id}).skip(parseInt(skip)).limit(parseInt(islimit))
        }
        if(pageResult){
            res.json({
                status:200,
                message:'查询成功',
                data:pageResult,
                total:total
            })
        }else{
            res.json({
                status:201,
                message:'暂无数据'
            })
        }
    }
})

//查找时间戳
// profiles.get('/find/time',passport.authenticate('jwt', { session: false }) ,async(req,res)=>{
//     if(req.query.start && req.query.end ){
//         let start = req.query.start
//         let end = req.query.end
//         let result = await Profile.find({date:{$gt:start,$lt:end}}).find({author:req.user.id})
//         if(result){
//             res.json({
//                 status:200,
//                 message:'查询成功',
//                 data:result
//             })
//         }else{
//             res.json({
//                 status:201,
//                 message:'暂无数据'
//             })
//         }
//     }
// })

//删除
profiles.get('/delete',passport.authenticate('jwt', { session: false }),async (req,res)=>{
   let result=await Profile.findOneAndDelete({_id:req.query.id})
   if(result){
       res.json({
           status:200,
           message:"删除成功"
       })
   }else{
    res.json({
        status:201,
        message:"删除失败"
    })
   }
})





module.exports = profiles