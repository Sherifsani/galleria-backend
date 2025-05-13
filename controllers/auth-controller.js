const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const signupController = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const checkExistingUser = await User.findOne({
      $or: [{ username }, { email }],
    });
    if (checkExistingUser) {
      return res.status(400).json({
        status: "failed",
        message: "User already exists",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: role || "user",
    });

    newUser.save();
    if (newUser) {
      return res
        .status(201)
        .json({ success: true, message: "User created successfully" });
    } else {
      return res
        .status(500)
        .json({ success: false, message: "Error creating user" });
    }
  } catch (error) {
    console.log("Error registering user: ", error);
    res.status(500).json({ success: false, message: "Error registering user" });
  }
};

const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "user not found",
            });
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                success: false,
                message: "password is incorrect!",
            });
        }
        const accessToken = jwt.sign(
            {
                userId: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
            },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "1d" }
        );
        return res.status(200).json({
            success: true,
            message: "User logged in successfully",
            accessToken,
        })
    } catch (error) {
        console.log("Error registering user: ", error);
        res
          .status(500)
          .json({ success: false, message: "Error logging in user" });
    }
};

module.exports = {
  signupController,
  loginController,
};
