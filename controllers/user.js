import User from '../models/User.js'
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'

const saltRounds = 10;

const signup = async(req, res) => {
    const { fullName, email, password} = req.body;
    const userFound = await  User.findOne({ email: email } );
    if(userFound){
        res.send({ message: "User already exists" })
    }else{
        // generate token
        const token = jwt.sign(
            { 
              name: fullName,
              email: email,
              password: password
            }, 
            'shhhhh'
           );
        // bcrypt password hash
        bcrypt.hash(password, saltRounds, function (err, hash) {
            const user = new User({
                fullName: fullName,
                email: email,
                password: hash
            });
            user.save();
            res.send({message: "User registered successfully", user: token})
        })
    }
    
}

const login = async(req, res) => {
    const { email, password } = req.body;
    //check for existing user
    const userFound = await User.findOne({ email: email });
    if(userFound){
        //generate token
        const token = jwt.sign(
        { 
          name: userFound.fullName,
          email: userFound.email,
          password: userFound.password
        }, 
        'shhhhh'
        );
        // compare hash password
        bcrypt.compare(password, userFound.password, function (err, result) {
          result
            ? 
            res.status(201).send({message: "User loggedin successfully",user: token,})
            : 
            res.status(400).send({ err: "password is incorrect" });
        })
      }else{ 
        // no user found
        res.status(400).send({ err: "User not found. Create a new account" })
      }
}

const getUser = async(req,res)=>{
    const {token} = req.body;
    if(token){
        const decode = jwt.decode(token)
        //check for user
        const user = await User.findOne({email:decode.email})
        if (user) {
            const posts = user?.posts?.reverse();
            const userObj = { ...user, posts };
            res?.status(200).json(userObj);
        }else{
            res?.status(400),send(err)
        }
    }

}

export {signup,login,getUser}