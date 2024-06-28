import mongoose, {Schema,Document} from "mongoose";

export interface Message extends Document{
content : string;
createdAt:Date
}

const MessageSchema:Schema<Message> = new Schema({
    content:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        required:true,
        default:Date.now
    }
})

export interface User extends Document{
    username : string;
    email : string;
    password : string;
    verifyCode : string;
    verifyCodeExpiry:Date;
    isVerified:boolean;
    isAcceptingMessage:boolean;
    message: Message[];
    }
    const UserSchema:Schema<User> = new Schema({
        username:{
            type:String,
            required:[true,"Username is required"],
            trim:true,
            unique:true
        },
        email:{
            type:String,
            required:[true,"Email is required"],
            match:[/.+\@.+\..+/,"please use a valid email address"],
            unique:true
        },
        password:{
            type:String,
            required:[true,"Password is required"],
        },
        verifyCode:{
            type:String,
            required:[true,"Verify code is required"],
        },
        verifyCodeExpiry:{
            type:Date,
            required:[true,"Verify code expiry is required"],
        },
        isVerified:{
            type:Boolean,
            default:false
        },
        isAcceptingMessage:{
            type:Boolean,
            default:true
        },
        message:{
            type:[MessageSchema],
            ref:"Message"
            
        },
        
    })

//  we are checking if the app is already running then use that model and if not the create a new one 

const UserModel = 
(mongoose.models.User as mongoose.Model<User>) //checks if there is already a model and calls it 
|| 
(mongoose.model<User>("User",UserSchema))// if there is not then creates one 

export default UserModel;