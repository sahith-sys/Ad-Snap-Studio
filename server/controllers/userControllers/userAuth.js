const User = require("../../models/user.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.json({ success: false, message: "Please fill all the fields" });
  }
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "User already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
    return res.json({
      success: true,
      token: token,
      user: { name: newUser.name },
      message: "User registered successfully",
    });
  } catch (error) {
    console.log("Error in signup:", error);
    return res.json({ success: false, message: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json({ success: false, message: "Please fill all the fields" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    return res.json({
      success: true,
      token: token,
      user: { name: user.name },
      message: "User logged in successfully",
    });
  } catch (error) {
    console.log("Error in login", error);
    return res.json({ success: false, message: error.message });
  }
};
const credits = async (req,res) => {
    const  userId  = req.userId;
    if (!userId) {
        return res.json({ success: false, message: "User token is required" });
    }
    const user = await User.findById(userId);
    if (!user) {
        return res.json({ success: false, message: "User not found" });
    }
    return res.json({ success: true, credits: user.credits, user: { id: user._id, name: user.name } });
}


module.exports = {
    signup,
    login,
    credits
}