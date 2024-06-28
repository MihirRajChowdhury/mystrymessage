import { log } from "console";
import mongoose from "mongoose";

type ConnectsionObject = {
    isConnected?:number
}
const connection: ConnectionObject = {}

//here void means that we don't have any use of the type in which data is returened. It doesn't mean that there is no return type.
async function dbConnect():Promise<void>{ 
if(connection.isConnected){
    console.log("Already connected to database");
    return
}
try{
   const db =  await mongoose.connect(process.env.MONGODB_URI || "",{});
console.log(db);
console.log(db.connections)
connection.isConnected = db.connections[0].readyState;
console.log("DB connected successfully")
}
catch(err){
console.log("DB wasn't able to connect successfully",err);
process.exit(1);
}
}
export default dbConnect;