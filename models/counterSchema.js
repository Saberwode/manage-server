/**
 * 用户自动增长
 */
const mongoose = require('mongoose')
const userSchema = mongoose.Schema({
  _id:String,
  sequence_value:Number
})

// 参数为第一个是别名，后面对数据库进行操作的时候会使用到它，第二个是模型，第三个是数据库名字
module.exports = mongoose.model("counter", userSchema, "counters")