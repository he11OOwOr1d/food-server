const mongoose = require('mongoose')
const connect = mongoose.connect("mongodb+srv://4321nikhilraj:pYOqv1yvQ1cpCmQf@cluster0.4bhxm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")

connect.then(()=>{
  console.log("DB connected")
})
.catch(()=>{
  console.log("DB not connected")
})

const LoginSchema = new mongoose.Schema({
  name:{
    type: String,
    required: true
  },
  password:{
    type: String,
    required: true 
  }
})

const collection = new mongoose.model("users", LoginSchema)

module.exports = collection 