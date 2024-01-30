import User from "../models/userModel";
import Bank from "../models/bankModel";
import jwt, { Secret } from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

const SECRET: Secret = "NO_SECRET_KEY";

import { Request, Response } from "express";

import {
  signupValidation,
  signinValidation,
  updateDetailsValidation,
} from "../validation/userValidation";

export async function signup(req: Request, res: Response) {
  try {
    let { username, password, firstName, lastName } = req.body;
    const { success } = signupValidation.safeParse({
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
    const token = jwt.sign({ userId: data._id }, SECRET);

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
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.json({
        error: error.message,
      });
    }
  }
}

export async function signin(req: Request, res: Response) {
  try {
    let { username, password } = req.body;
    username = username.toLowerCase();

    // input validation
    const { success } = signinValidation.safeParse({
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
    const token = jwt.sign({ userId: user._id }, SECRET);
    res.json({
      success: true,
      message: "successfully signed in",
      token,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.json({
        success: false,
        error: error.message,
      });
    }
  }
}

export async function update(req: Request, res: Response) {
  try {
    const userId = req.headers["userId"];
    let details = req.body;

    // check if user exist or not in database

    const { success } = updateDetailsValidation.safeParse(details);
    if (!success) {
      return res.json({
        success: false,
        message: "error while updating ",
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
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.json({
        success: false,
        error: error.message,
      });
    }
  }
}

export async function filterUser(req: Request, res: Response) {
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
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.json({
        message: error.message,
      });
    }
  }
}

export async function getUser(req: Request, res: Response) {
  try {
    const userId = req.headers["userId"];
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
