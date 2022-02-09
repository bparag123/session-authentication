import MyError from '../myError.js';
import User from '../models/userModel.js';

const signUp = async (req, res, next) => {

    try {
        let user = await User(req.body)
        user = await user.save()
        res.json(user)
    } catch (error) {
        next(error)
    }
}

// This is Login Controller
const login = async (req, res, next) => {

    const { username, password } = req.body;
    let user = await User.findOne({ username })
    
    if (!user) {
        return next(MyError.invalidCreadentials(400, "User not Found"))
    }

    let valid = await user.checkPassword(password)

    if (!valid) {
        return next(MyError.invalidCreadentials(400, "Invalid Password"))
    }
    //Setting Up the session for the User
    req.session.isLoggedIn = true
    req.session.user = user
 
    res.send("LoggedIn")
}

export {
    login, signUp
}