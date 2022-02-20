import MyError from "../myError.js"

export default (req, res, next)=>{

    let session = req.session
    if(!session || !session.isLoggedIn){
        return next(MyError.invalidCreadentials(401, "Please Login to visit this end-point"))
    }
    next()
}