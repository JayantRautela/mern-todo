const User = require("../models/user.models.js");
const jwt = require("jsonwebtoken");
const sendMail = require("../config/nodemailer.js");
const generateOtp = require("../utils/generateOtp.js");

const signupUser = ( async (req, res) => {
    const { username, fullName, password, email, phoneNumber } = req.body;

    if ([username, password, email, fullName, phoneNumber].some(field => field === undefined || field.trim() === "")) {
        return res.status(400).json({
            message: "All fields are required!"
        });
    }

    try {
        const existedUser = await User.findOne({
            $or: [{ username }, { email }, { phoneNumber }]
        });
    
        if (existedUser) {
            return res.status(409).json({
                message: "User Already Exists!!"
            });
        }

        const otp = generateOtp();
    
        const user = await User.create({
            username,
            fullName,
            email: email.toLowerCase(),
            password,
            phoneNumber,
            otp
        });
    
        const createdUser = await User.findById(user._id).select(
            "-password"
        );
    
        if (!createdUser) {
            return res.status(500).json({
                message: "Something went wrong while signing up the user"
            })
        }


        try {
            await sendMail(email, otp);
        } catch (error) {
            res.status(500).json({ 
                message: 'User Signed in Successfully but, Error sending welcome email', 
            });
        }
    
        res.status(201).json({
            message: "User Signed Up Successfully and Email sent",
            user: user
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
});

const verifyOtp = ( async (req, res) => {
    const { otp } = req.body;

    if (otp === "") {
        res.status(400).json({message: "please enter the code."})
    }

    try {
        const user = await User.findOne({ otp });

        if (!user) {
            res.status(409).json({message: "User does not exists"});
        }

        user.isVerified = true;
        user.otp = undefined;
        await user.save();

        res.status(200).json({
            message: "Email verified successfully"
        })
    } catch (error) {
        res.status(500).json({
            message: "internal server error",
            error: error.message
        })
    }
})

const signinUser = ( async (req, res) => {
    const { username, password } = req.body;

    if (username === "" || password === "") {
        return res.status(400).json({
            message: "Both the fields are required"
        });
    }

    try {
        const user = await User.findOne({
            username
        })

        if (!user) {
            return res.status(404).json({
                message: "User does not exists"
            });
        }

        const validPassword = await user.isPasswordCorrect(password);

        if (!validPassword) {
            return res.status(401).json({
                message: "Incorrect Password"
            });
        }

        const token = jwt.sign({ 
            username: user.username 
            }, 
            process.env.JWT_SECRET,    
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: "User Signed In Successfully",
            token: token
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
});

module.exports = {
    signupUser,
    signinUser,
    verifyOtp
}