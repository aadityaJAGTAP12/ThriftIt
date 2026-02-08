import {NextFunction , Request , Response} from "express";
import { validationRegistrationData } from "../utils/auth.helper";
import { Prisma } from "@prisma/client/extension";
export const userRegistration = async (req:Request, res:Response ) => {
    validationRegistrationData(req.body, "user");
    const{
        name , email 
    }= req.body;

    const existingUser = await Prisma

}