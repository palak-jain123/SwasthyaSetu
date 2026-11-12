
const mongoose =require("mongoose");
const dbConnect= async()=>
{
    try{

         const connect =await mongoose.connect(process.env.CONNECTION_STRING); //using the connection string to connect
    console.log( `Database connected : ${connect.connection.host},${connect.connection.name}`); 

    }
    catch(err)
    {
        console.log(err);
        process.exit(1);
    }
  
};
module.exports=dbConnect;
//username : "archipriya220903_db_user"
//password :"IJsMj5gNn8RThBZY"