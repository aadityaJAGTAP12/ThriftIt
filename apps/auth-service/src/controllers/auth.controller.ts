import {NextFunction , Request , Response} from "express";
import { sendOtp, validationRegistrationData } from "../utils/auth.helper.js";

import { cheakOtpRestriction } from "../utils/auth.helper.js";
import { trackOtpRequest } from "../utils/auth.helper.js";

import { PrismaClient } from "@prisma/client";
// instantiate Prisma client ahead of future use
// @ts-ignore: will be used later
const prisma = new PrismaClient();

// const prisma = new PrismaClient(); // unused variable removed
export const userRegistration = async (req:Request, res:Response , next:NextFunction ) => {
    try {
        validationRegistrationData(req.body, "user");
        const{
            name , email 
        }= req.body;

        
        
        await cheakOtpRestriction(email, next);
        await trackOtpRequest(email, next);
        await sendOtp(email, name , "user-activation-mail");
        res.status(200).json({
            message:"OTP sent to email , please verify your account",
        });

        
    } catch(error){
        return next(error);
    }



}