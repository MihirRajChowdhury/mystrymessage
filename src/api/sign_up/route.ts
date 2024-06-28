import { ApiResponse } from '@/types/ApiResponse';
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import bcrypt from "bcryptjs"
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";


export async function POST(request:Request){
    await dbConnect()

    try{
        const {username,password,email} = await request.json()
        
    }catch(err){
        console.log("Error registering user");
        return  Response.json({success:false,message:"Failed to register user"},{
            status:500
        })
    }
}