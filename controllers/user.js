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
        return next(MyError.invalidCreadentials(404, "User not Found"))
    }

    let valid = await user.checkPassword(password)

    if (!valid) {
        return next(MyError.invalidCreadentials(401, "Invalid Password"))
    }
    //Setting Up the session for the User
    req.session.isLoggedIn = true
    req.session.user = user
 
    res.send("LoggedIn")
}


const logout = (req, res) => {
    //Destroy the Session from store
    req.session.destroy()
    res.json({
        message: "logout successfull"
    })
}

const getLogin = (req, res)=>{
    res.json({
        csrf : req.csrfToken()
    })
}
export {
    login, signUp, logout , getLogin
}