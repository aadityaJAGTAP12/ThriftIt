import crypto from "crypto";
import { ValidationError } from "../../../../packages/error-handler";
import redis from "../../../../packages/error-handler/libs/redis";
import { sendEmail } from "./sendMail/index";
import { nextTick } from "process";
import { NextFunction } from "express";
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validationRegistrationData = (data: any, userType: "user" | "seller") => {
    const { name, email, password, phone_number, country } = data;
    if (!name || !email || !password || (userType === "seller" && !phone_number)) {
        throw new ValidationError('missing required fields')

    }
    if (!emailRegex.test(email)) {
        throw new ValidationError('invalid email format')
    }
};

export const cheakOtpRestriction = async (email: string,
    next: NextFunction
) => {
    if (await redis.get(`otp_lock:${email}`)) {
        return next(new ValidationError("Account locked due to multiple failed attempts!!"))
    }
    if(await redis.get(`otp_spam_lock:${email}`)){
        return next(new ValidationError("Too many OTP requests! Please try again later."))
    }
    if(await redis.get(`otp_cooldown:${email}`)){
        return next(new ValidationError("Too many OTP requests! wait a minute beofre requesting a new OTP"))
    }



}

export const trackOtpRequest = async (email: string, 
    next: NextFunction) => {
    const otpRequestKey = `otp_requests_count:${email}`;
    const count = await redis.incr(otpRequestKey);
    if(count > 2){
        await redis.set(`otp_lock:${email}`, "locked", "EX", 3600);
        return next(new ValidationError("Too many OTP requests! Account locked for 5 minutes."));
    }
    await redis.expire(otpRequestKey, 300); //expire after 5 minutes
};

export const sendOtp = async (name: string, email: string, template: string) => {
    const otp = crypto.randomInt(1000, 9999).toString();
    await sendEmail(email, "Verify Your Email", template, { name, otp });
    await redis.set(`otp:${email}`, otp, "EX", 300);
    await redis.set(`otp_cooldown:${email}`, "true", "EX", 60);

};
