import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

let userSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
            maxlength:30,
            trim:true,
        },
        email:{
            type:String,
            required:true,
            unique:true,
            trim:true,
        },
        password:{
            type:String,
            required:true,
        },
        contact:{
            type:Number,
            required:true,
        },
        orders:{
            type:Array,
            default:[],
        }
    }
)

let generateJwtToken = (id)=>{
    return jwt.sign({id},process.env.SECRET_KEY)
}

let User=mongoose.model("user",userSchema);
export {User, generateJwtToken}