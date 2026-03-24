import User from "../models/user.model.js";

export const signup = async (req , res) => {
    const { name , email , password } = req.body;
    const userExists = await User.findOne({ email });
    if(userExists){
        return res.status(400).json({ message: "User already exists" });
    }

    const user = await new User({ name , email , password });
    await user.save();
    res.status(201).json({user, message: "User created successfully" });
}

export const login = async (req , res) => {
    res.json("you hit the login endpoint");
}

export const logout = async (req , res) => {
    res.json("you hit the logout endpoint");
}
