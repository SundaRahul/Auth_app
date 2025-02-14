const User=require("../models/user");
const bcrypt=require("bcryptjs");

const Joi = require("joi");
const jwt=require("jsonwebtoken");


const register = async (req, res) => {
    try {
        // Schema validation
        const schema = Joi.object({
            username: Joi.string().min(5).required(),
            name: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().min(6).required(),
            gender: Joi.string().valid("Male", "Female", "Other"),
            DOB: Joi.date(),
            country: Joi.string()
        });

        const { error } = schema.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        // Check if user already exists
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) return res.status(400).json({ message: "Email already exists" });

        // Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // Create new user
        const newUser = new User({ ...req.body, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ message: "Server error", error });
    }
};

const login = async (req, res) => {
    try {
        // Schema validation
        const schema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().required()
        });

        const { error } = schema.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        // Check if user exists
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(400).json({ message: "Invalid email or password" });

        // Validate password
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ token, message: "Login successful" });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server error", error });
    }
};


module.exports={register,login};