import UserModel from "../models/userModel.js";
import jwt from "jsonwebtoken";

export const handleRegister = async (req, res) => {
  const { username, email, password, address } = req.body;
  if (!username || !email || !password || !address) {
    return res.json({
      message: "all fields required please !!!",
      success: false,
    });
  }
  try {
    const existing_email = await UserModel.findOne({ email: email });
    if (existing_email) {
      return res.json({
        message: "user already exists!!!",
      });
    }
    const data = new UserModel({
      username: username,
      email: email,
      password: password,
      address: address,
    });
    const saved_data = await data.save();
    if (saved_data) {
      return res.status(200).json({
        success: true,
        message: "user registered successfully in the system",
        status: 200,
      });
    }
  } catch (error) {
    return res.json({
      success: false,
      error: error.message,
    });
  }
};

export const handleLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json({
      message: "all fields required please !!!",
      success: false,
    });
  }

  try {
    const existing_email = await UserModel.findOne({ email: email });
    if (existing_email) {
      //   generate the password
      const payload = {
        username: existing_email.username,
        email: existing_email.email,
        address: existing_email.address,
      };
      const token = jwt.sign( payload , process.env.JWT_SECRET, {
        expiresIn: "3d",
      });

      if (existing_email.password == password) {
        //   if (existing_email.isLoggedIn) {
        //       return res.json({
        //           message : "user already logged in"
        //       })
        //   }
        existing_email.isLoggedIn = true;
        existing_email.token = token;

        const updated_user = await existing_email.save();
        if (updated_user) {
          return res.status(200).json({
            success: true,
            message: "user logged in successfully",
            token: token,
          });
        }
      }
    } else {
      return res.json({
        message: "user does not exist in the system !!!",
        status: 404,
      });
    }
  } catch (error) {
    return res.json({
      success: false,
      error: error.message,
    });
  }
};


export const handleLogout = async (req, res) => {
  const { email, token } = req.body;

  if (!email || !token) {
    return res.status(400).json({ message: "Missing email or token" });
  }

  try {
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res
        .status(401)
        .json({ message: "Token expired or invalid", error: err.message });
    }

    if (decoded.email !== email) {
      return res.status(403).json({ message: "Email mismatch" });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Optional: check if token matches what's in the DB
    if (user.token !== token) {
      return res.status(403).json({ message: "Token mismatch in DB" });
    }

    user.isLoggedIn = false;
    user.token = "";
    await user.save();

    return res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};