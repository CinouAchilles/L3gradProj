import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { redis } from "../lib/redis.js";

const generateTokens = (userId) => {
    // Implement your token generation logic here 
    const accessToken = jwt.sign({ userId } , process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '15m' // Access token expires in 15 minutes
    })
    const refreshToken = jwt.sign({ userId} , process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: '7d' // Refresh token expires in 7 days
    })
    return { accessToken, refreshToken };
}

const storeRefreshToken = async (userId, refreshToken) => {
    // Implement your logic to store the refresh token in Redis here
    await redis.set(`refreshToken:${userId}`, refreshToken ,{
        ex: 7 * 24 * 60 * 60, // Expire in 7 days
    }) 

}

const setCookies = (res, accessToken, refreshToken) => {
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000, // 15 minutes
    });
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
}


export const signup = async (req, res) => {
  if (!req.body) {
    return res.status(400).json({
      message: "Request body is missing",
    });
  }
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({
      message: "Name, email, and password are required",
    });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const user = new User({ name, email, password });
    await user.save();

    //authentication logic 
    const {accessToken, refreshToken} = generateTokens(user._id);
    await storeRefreshToken(user._id, refreshToken);

    setCookies(res, accessToken, refreshToken);


    // const { password: _password, ...sanitizedUser } = user.toObject();

    return res.status(201).json({
      user: {
        userId: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      message: "User created successfully",
    });
  } catch (error) {
    console.error("Error creating user:", error);

    return res.status(500).json({
      message: "Error creating user",
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
    if(!req.body){
        return res.status(400).json({
            message: "Request body is missing",
        })
    }
    const {email , password} = req.body;
    if(!email || !password){
        return res.status(400).json({
            message: "Email and password are required",
        })
    }
    try {
        const user = await User.findOne({ email });
        if(!user){
            return res.status(400).json({
                message: "Invalid email or password",
            })
        }
        const isMatch = await user.comparePassword(password);
        if(!isMatch){
            return res.status(400).json({
                message: "Invalid email or password",
            })
        }
        const { accessToken, refreshToken } = generateTokens(user._id);
        await storeRefreshToken(user._id, refreshToken);
        setCookies(res, accessToken, refreshToken);
        // const { password: _password, ...sanitizedUser } = user.toObject();
        return res.json({
            user: {
                userId: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            message: "Logged in successfully",
        })
    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({
            message: "Error during login",
        });
    }
};

export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if(refreshToken){
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        await redis.del(`refreshToken:${decoded.userId}`);
    }
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ message: "Error during logout" });
  }
};

// token refresh logic

export const refreshToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken){
        return res.status(401).json({ message: "Refresh token is missing" });
    }
    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const storedRefreshToken = await redis.get(`refreshToken:${decoded.userId}`);
        if(storedRefreshToken !== refreshToken){
            return res.status(401).json({ message: "Invalid refresh token" });
        }

        const accessToken = jwt.sign({ userId: decoded.userId }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '15m',
        });
        setCookies(res, accessToken, refreshToken);
        res.json({ message: "Access token refreshed successfully" });
        

    } catch (error) {
        return res.status(401).json({ message: "Invalid refresh token" });
    }
}

// TODO: implement getProfile controller logic
export const getProfile = async (req, res) => {
    // const { email } = req.body;
    // try {
    //     const user = await User.findOne({ email });
    //     if (!user) {
    //         return res.status(404).json({ message: "User not found" });
    //     }
    //     return res.json({
    //         user: {
    //             userId: user._id,
    //             name: user.name,
    //             email: user.email,
    //             role: user.role,
    //         }
    //     });
    // } catch (error) {
    //     console.error("Error fetching profile:", error);
    //     return res.status(500).json({ message: "Error fetching profile" });
    // }
}