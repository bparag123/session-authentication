//This is a Simple Custom Error Class which is used to Throw user defined Errors
class MyError extends Error{
    constructor(statusCode, errMsg){
        super()
        this.statusCode = statusCode;
        this.errMsg = errMsg;
    }
    
    static invalidCreadentials(statusCode, errMsg){
        return new MyError(statusCode, errMsg)
    }

    static duplicateData(statusCode, errMsg){
        return new MyError(statusCode, errMsg)
    }

    static dataValidationError(statusCode, errMsg){
        return new MyError(statusCode, errMsg)
    }
}

export default MyError