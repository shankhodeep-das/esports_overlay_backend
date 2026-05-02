import mongoose from "mongoose";
import bcrypt from "bcrypt";


const authorisedUserSchema = new mongoose.Schema({
    email:{
        type: String,
        required: [true, "Email is required"],
        trim: true,
        lowercase: true,
        match: [/.+@.+\..+/, 'Please enter a valid email address'],
        unique: [true, 'Email already exists...']
    },
    password:{
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password length will be 6 minimum"],
        select: false
    },
    name:{
        type: String,
        required: [true,"Name is required"],
        trim: true
    },
    status:{
        type:String,
        enum:["APPROVED","PENDING","REJECTED"],
        default:"PENDING"
    },
    role:{
        type:String,
        enum:["DEVELOPER","ADMIN","MANAGER","EDITER","VIEWER"],
        default:"VIEWER"
    },
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AuthorisedUser' // Tracks which Super Admin added this new member
    },
    createdAt:{
        type: Date,
        default: Date.now()
    },
    isVerified:{
        type: Boolean,
        default: false
    },
    otp: { 
        type: String 
    },
    otpExpires: { 
        type: Date 
    }
},{
    timestamps: true
});


export const userModel = mongoose.model("AuthorisedUser",authorisedUserSchema);