import UserModel from "../Models/userModels.js";
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"



dotenv.config()


export const registerUser = async (req, res) => {
  try {
    const password = req.body.password;
    const salt = await bcryptjs.genSaltSync(10);
    const hashedPassword = await bcryptjs.hashSync(password, salt);
    req.body.password = hashedPassword;
    const user = new UserModel(req.body);
    const existingUser = await UserModel.findOne({ email: req.body.email });
    if (existingUser) {
      return res
        .status(200)
        .send({ message: "User already exists", success: false });
    } else {
      await user.save();
      return res
        .status(200)
        .send({ message: "User registered successfully", success: true });
    }
  } catch (error) {
    return res.status(500).send({ message: error.message, success: false });
  }
};

export const loginUser = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(200)
        .send({ message: "User does not exist", success: false });
    }
    const passwordsMatched = await bcryptjs.compareSync(
      req.body.password,
      user.password
    );
    if (passwordsMatched) {
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: "5d",
      });
      return res.status(200).send({
        message: "User logged in successfully",
        success: true,
        data: token,
      });
    } else {
      return res
        .status(200)
        .send({ message: "Password is incorrect", success: false });
    }
  } catch (error) {
    return res.status(500).send({ message: error.message, success: false });
  }
};

  // export const getUserData = async (req, res) => {
  //   try {
  //     const user = await UserModel.findById(req.params.userId);
  
  //     // Check if user exists
  //     if (!user) {
  //       return res.status(404).json({
  //         message: "User not found",
  //         success: false
  //       });
  //     }
  
  //     // Manipulate user properties (example: omitting password)
  //     user.password = undefined;
  
  //     return res.status(200).json({
  //       message: "User data fetched successfully",
  //       success: true,
  //       data: user
  //     });
  //   } catch (error) {
  //     return res.status(500).json({
  //       message: error.message,
  //       success: false
  //     });
  //   }
  // };

  export const getUserData = async (req, res) => {
    try {
      // Get the token from request headers
      const token = req.headers.authorization.split(" ")[1];
  
      // Verify the token
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
  
      // Extract user ID from decoded token
      const userId = decodedToken.userId;
  
      // Find user by ID in database
      const user = await UserModel.findById(userId);
  
      if (!user) {
        return res
          .status(404)
          .send({ message: "User not found", success: false });
      }
  
      // Return user data
      return res.status(200).send({
        message: "User data retrieved successfully",
        success: true,
        data: user,
      });
  
    } catch (error) {
      return res.status(500).send({ message: error.message, success: false });
    }
  };