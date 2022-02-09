import MyError from "../myError.js"

export default (error, req, res, next) => {

    if (error instanceof MyError) {
        return res.status(error.statusCode).json({
            message: error.errMsg
        })
    }

    return res.status(400).json({
        message: error.message
    })

}