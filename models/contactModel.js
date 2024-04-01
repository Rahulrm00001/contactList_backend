const mongoose = require('mongoose')

const contactSchema = mongoose.Schema({
    name:{
        type:String,
        required: [true,"Please enter contact name"]
    },
    email:{
        type:String,
        required:[true, 'Please enter contact email']
    },
    phone:{
        type:String,
        required:[true, "please enter phone number"]
    },
},{
     timestamps:true
})

module.exports = new mongoose.model('Contact',contactSchema)