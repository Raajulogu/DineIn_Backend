import express from 'express';
import bcrypt from 'bcrypt';
import { User, generateJwtToken } from '../models/user.js';
import jwt from "jsonwebtoken";

let router = express.Router();

router.post("/signup", async(req,res)=>{
    try {
        //Find user is already available
        let user = await User.findOne({email:req.body.email});
        if(user) return res.status(400).json({message:"Email already exist"})

        //generate hashed password
        let salt = await bcrypt.genSalt(10);
        let hashedPassword = await bcrypt.hash(req.body.password,salt);

        //new user updation
        user= await new User({
            name:req.body.name,
            email:req.body.email,
            contact:req.body.contact,
            password:hashedPassword
        }).save();
        //generating token
        let token = generateJwtToken(user._id);
        res.status(201).json({message:"SignUp Successfully",token})
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal server error"})
    }
})

router.post("/login", async(req,res)=>{
    try {
        //Find user is available
        let user = await User.findOne({email:req.body.email});
        if(!user) return res.status(400).json({message:"Invalid Credentials"})

        //Validate password
        let validatePassword = await bcrypt.compare(
            req.body.password,
            user.password
        )
        if(!validatePassword) return res.status(400).json({message:"Invalid Credentials"})
        //generating token
        let token = generateJwtToken(user._id);
        res.status(201).json({message:"Logged in Successfully",token})
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal server error"})
    }
})

router.get("/orders",async(req,res)=>{
    try {
        //decode token
        let decode = jwt.verify(req.headers['x-auth'], process.env.SECRET_KEY)
        let foods = await User.find({_id:decode.id});
        if(!foods) return res.status(400).json({message:"Data unavailable"});
        res.status(200).json({foods:foods[0].orders});
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal Server Error"})
    }
})

router.put("/foods",async(req,res)=>{
    try {
        //decode token
        let decode = jwt.verify(req.headers['x-auth'], process.env.SECRET_KEY)
        let val = await User.find({_id:decode.id});
        let foods=val[0].orders
        let postedDate = new Date().toJSON().slice(0, 10);
        let order ={
            date:postedDate,
            foods:req.body.order.foods,
            total:req.body.order.total
        }
        foods.push(order);
        //Adding Cart list to orders
        let result=await User.findOneAndUpdate(
            {_id:decode.id},
            {$set:{orders:foods}}
        );
        res.status(200).json({message:"Ordered Successfully"});
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal Server Error"})
    }
})


export const userRouter= router;