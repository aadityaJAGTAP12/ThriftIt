import {NextFunction , Request , Response} from "express";
import { sendOtp, validationRegistrationData } from "../utils/auth.helper";
import { PrismaClient } from "@prisma/client";
import { ValidationError } from "../../../../packages/error-handler";
import { cheakOtpRestriction } from "../utils/auth.helper";
import { trackOtpRequest } from "../utils/auth.helper";

const prisma = new PrismaClient();
export const userRegistration = async (req:Request, res:Response , next:NextFunction ) => {
    try {
        validationRegistrationData(req.body, "user");
        const{
            name , email 
        }= req.body;

        const existingUser = await prisma.users.findUnique({where:{email}});
        if(existingUser){
            return next(new ValidationError("user already exist with this email!"));
            
        };

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