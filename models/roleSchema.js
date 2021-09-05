const mongoose = require('mongoose')
const userSchema = mongoose.Schema({
    permissionList:{
      checkedKeys:[],
      halfCheckedKeys:[]
    },
    roleName:String,
    remark:String,
    createTime:{
      type:Date,
      default:Date.now()
    },
    updateTime:{
      type:Date,
      default:Date.now()
    }
})

module.exports = mongoose.model("roles",userSchema,"roles")