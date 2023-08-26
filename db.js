import mongoose from 'mongoose';

export function dbconnection(){
    let params={
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
    try {
        mongoose.connect("mongodb+srv://rajesh:rajesh145@cluster0.563jw0h.mongodb.net/Dine_In?retryWrites=true&w=majority",params);
        console.log("Database connected Successfully")
    } catch (error) {
        console.log("Error connecting DB ---", error)
    }
}