import { Request, Response, NextFunction } from "express";

export class AppError extends Error {
    public readonly statusCode: number;
    public readonly isOperational: boolean;
    public readonly details?: any;

    constructor(message: string,
        statuscode: number,
        isOperational = true,
        details?: any) {
        super(message);
        this.statusCode = statuscode;
        this.isOperational = isOperational;
        this.details = details;
        Error.captureStackTrace(this);
    }
}

export class NotFoundError extends AppError {
    constructor(message = "resource not found") {
        super(message, 404);
    }
}

export class ValidationError extends AppError {
    constructor(message = "Invalid request data", details?: any) {
        super(message, 400, true, details);
    }
}

// Authentication Error
export class AuthError extends AppError {
    constructor(message = "unauthorized access") {
        super(message, 401);
    }
}

// Forbidden Error
export class ForbiddenError extends AppError {
    constructor(message = "forbidden access") {
        super(message, 403);
    }
}

export { default as prisma } from "./libs/prisma/index.js";
export { default as redis } from "./libs/redis/index.js";

export const errorMiddleware = (err: Error,
    req: Request,
    res: Response,
    next: NextFunction) => {
    if (err instanceof AppError) {
        console.log(`Error ${req.method} ${req.url} - ${err.message}`);

        return res.status(err.statusCode).json({
            status: "error",
            message: err.message,
            ...(err.details && { details: err.details }),
        });
    }

    console.log("Unhandled error:", err);

    return res.status(500).json({
        error: "Something went wrong, please try again!",
    });
};
