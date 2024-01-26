const User = require("../models/userModel");
const Bank = require("../models/bankModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

const {
  signupValidation,
  signinValidation,
  updateDetailsValidation,
} = require("../validation/userValidation");

async function signup(req, res) {
  try {
    let { username, password, firstName, lastName } = req.body;
    const { success, error } = signupValidation.safeParse({
      username,
      password,
      firstName,
      lastName,
    });

    if (!success) {
      return res.json({
        success: false,
        error: "incorrect input ",
      });
    }
    // if user already exist or not
    const userExist = await User.findOne({
      username,
    });
    if (userExist) {
      return res.json({
        success: false,
        error: `user already exist with the username ${username}`,
      });
    }
    password = await bcrypt.hash(password, 10);
    username = username.toLowerCase();
    const data = await User.create({
      username,
      password,
      firstName,
      lastName,
    });
    const token = jwt.sign({ userId: data._id }, process.env.SECRET_KEY);

    // depositing random number between 1 to 100000 in the bank
    const randomNumber = Math.floor(Math.random() * 10000) + 1;
    await Bank.create({
      userId: data._id,
      balance: randomNumber,
    });

    res.json({
      success: true,
      message: "user successfully signed up",
      token,
    });
  } catch (error) {
    res.json({
      error: error.message,
    });
  }
}

async function signin(req, res) {
  try {
    let { username, password } = req.body;
    username = username.toLowerCase();

    // input validation
    const { success, error } = signinValidation.safeParse({
      username,
      password,
    });
    if (!success) {
      return res.json({
        success: false,
        error: "incorrect credentials",
      });
    }

    // find the user
    let user = await User.findOne({ username });
    if (!user) {
      return res.json({
        success: false,
        error: "user does not exist",
      });
    }
    const hashedPassword = await bcrypt.compare(password, user.password);
    if (!hashedPassword) {
      return res.json({
        success: false,
        error: "invalid credentials",
      });
    }
    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY);
    res.json({
      success: true,
      message: "successfully signed in",
      token,
    });
  } catch (error) {
    res.json({
      success: false,
      error: error.message,
    });
  }
}

async function update(req, res) {
  try {
    const userId = req.userId;
    let details = req.body;

    // check if user exist or not in database

    const { success, error } = updateDetailsValidation.safeParse(details);
    if (!success) {
      return res.json({
        success: false,
        message: error.issues[0].message,
      });
    }
    if (Object.keys(details).includes("password")) {
      details.password = await bcrypt.hash(details.password, 10);
    }

    const user = await User.findByIdAndUpdate(userId, details, { new: true });
    if (!user) {
      return res.json({
        success: false,

        message: "user does not exist ",
      });
    }
    res.json({
      success: true,
      message: "details updated successfully",
      details,
    });
  } catch (error) {
    res.json({
      success: false,
      error: error.message,
    });
  }
}

async function filterUser(req, res) {
  try {
    const query = req.query;

    const user = await User.find({
      $or: [
        {
          firstName: {
            $regex: query.filter,
          },
        },
        {
          lastName: {
            $regex: query.filter,
          },
        },
      ],
    }).select("firstName lastName");

    if (user.length == 0) {
      return res.json({
        success: false,
        message: "user does not found",
      });
    }

    res.json({
      success: true,
      message: "successfully fetched the user",
      user,
    });
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
}

async function getUser(req, res) {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.json({
        success: false,
        message: "invalid userId",
      });
    }

    const user = await User.findOne({ _id: userId }).select("firstName");

    if (!user) {
      return res.json({
        success: false,
        message: "user does not found",
      });
    }

    return res.json({
      success: true,
      message: "successfully fetched the user",
      user,
    });
  } catch (error) {
    res.json({
      success: false,
      message: "server error",
    });
  }
}
module.exports = {
  signup,
  signin,
  update,
  filterUser,
  getUser,
};
