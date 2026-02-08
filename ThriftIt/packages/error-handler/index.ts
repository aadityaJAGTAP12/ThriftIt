export * from "./index";
export class AppError extends Error{
    public readonly statusCode: number;
    public readonly isOperational: boolean;
    public readonly details?: any;

    constructor(message:string,
        statuscode:number, 
        isOperational=true ,
         details?:any){
        super(message);
        this.statusCode=statuscode;
        this.isOperational=isOperational;
        this.details=details;
        Error.captureStackTrace(this);
    }

}

export class NotFoundError extends AppError{
    constructor(message="resource not found"){
        super(message , 404);
    }
}

export class ValidationError extends AppError{
    constructor(message="Invalid request data", details?:any){
        super(message, 400, true, details);
    }
}

// Authentication Error
export class AuthError extends AppError{
    constructor(message="unauthorized access"){
        super(message, 401);
        
    }
}

// Forbidden Error
export class ForbiddenError extends AppError{
    constructor(message="forbidden access"){
        super(message, 403);
    }
}

//DataBase Error
export class DatabaseError extends AppError{
    constructor(message="Database error",details?:any){
        super(message, 500, true, details);

    }
}  

//Rate Limit Error
export class RateLimitError extends AppError{
    constructor(message="Too many requests, please try again later."){
        super(message, 429);
    }
}
