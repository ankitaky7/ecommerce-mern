const user = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const signupUser = async (req, res) => {
    try {
        const {
            name,
            email,
            password
        } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const userExists = await user.findOne({ email });
        if (userExists) {
            return res.status(409).json({ message: "Email is already registered" })
        }

        // hash password
        const saltRounds = 10;
        const hasedPassword = await bcrypt.hash(password, saltRounds);

        // create the new User to the database
        const newUser = await user.create({
            name,
            email,
            password: hasedPassword
        });

        res.json({ message: "User registered successfully" });

    } catch (error) {
        console.log("Signup error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

const loginUser = async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body;
        
        const User = await user.findOne({email});
        if(!User){
            return res.status(400).json({ message: "User Not Found"});
        } 
        
        const match = await bcrypt.compare(password, User.password);
        if(!match){
            return res.status(400).json({message: "Invalid Credentials"});
        }

        // generate jwt token
        const token = jwt.sign(
            {id: User._id},
            process.env.JWT_SECRET,
            { expiresIn: "1d"}
        );
        res.json({
            message: "Login Successfull",
            token,
            User: {
                id: User._id,
                name: User.name,
                email: User.email
            }
        })
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports = {
    signupUser,
    loginUser
}