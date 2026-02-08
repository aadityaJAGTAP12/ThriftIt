import crypto from "crypto";
import { ValidationError } from "../../../../packages/error-handler";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validationRegistrationData = (data:any , userType:"user" |"seller")=>{
    const {name, email , password , phone_number , country}=data;
        if(!name||!email||!password||(userType === "seller" && !phone_number)){
            throw new ValidationError('missing required fields')

        }
        if(!emailRegex.test(email)){
            throw new ValidationError('invalid email format')
        }
    };

