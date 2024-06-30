import { ApiResponse } from '@/types/ApiResponse';
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import bcrypt from "bcryptjs"
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";


export async function POST(request:Request){
    await dbConnect()

    try{
        const {username,password,email} = await request.json()

        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified:true
        })

        if(existingUserVerifiedByUsername){
            return Response.json({success:false,message:"Username is already taken" },{status:400})
        }
        const existingUserByEmail = await UserModel.findOne({email})
        const verifyCode = Math.floor(1000000 + Math.random() *900000).toString();

        if(existingUserByEmail){
            if(existingUserByEmail.isVerified){
                return Response.json({
                    success:false,
                    message:"User already exist with this email",
                },{status:400})
            }
            else{
                const hashedPassword = await bcrypt.hash(password,10);
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)
                await existingUserByEmail.save();

                return Response.json({
                    success:false,
                    message:"Verify the user ",
                },{status:500})
            }
        }
        else{
            const hashedPassword = await bcrypt.hash(password,10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours()+1);
            
            const newUser = new UserModel({
                username,
                email,
                password : hashedPassword,
                verifyCode,
                verifyCodeExpiry:expiryDate,
                isVerified:false,
                isAcceptingMessage:true,
                message: [],
            })

            await newUser.save();

        }
        // send verification email
        const emailResponse = await sendVerificationEmail(
            email,
            username,
            verifyCode
        )
        if(!emailResponse.success){
            return Response.json({
                success:false,
                message:email.message,
            },{status:500})
        }
        return Response.json({
            success:true,
            message:"User registered Successfully.Please verify your email",
        },{status:201})

    }catch(err){
        console.log("Error registering user");
        return  Response.json({success:false,message:"Failed to register user"},{
            status:500
        })
    }
}