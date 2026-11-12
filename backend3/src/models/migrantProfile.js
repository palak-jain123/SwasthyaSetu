const mongoose = require("mongoose");

const migrantProfileSchema = new mongoose.Schema({

  userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"user",
    required:true
  },

  name:{
    type:String,
    required:true
  },

  gender:{
    type:String
  },

  dob:{
    type:String
  },

  age:{
    type:Number
  },

  aadhaar:{
    type:String,
    unique:true
},
  bloodGroup:{
    type:String
  },

  disorder:{
    type:String
  },

  domicile:{
    type:String
  },

  currentAddress:{
    type:String
  },
 qrCode:{
    type:String  
  }

});

module.exports = mongoose.model("MigrantProfile", migrantProfileSchema);