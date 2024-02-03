import jwt, { Secret } from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { client } from "../db";
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
    const userExist = await client.query(
      "SELECT * FROM user_details WHERE username=$1;",
      [username]
    );

    if (userExist.rows.length > 0) {
      return res.json({
        success: false,
        error: `user already exist with the username ${username}`,
      });
    }
    password = await bcrypt.hash(password, 10);
    username = username.toLowerCase();
    const data = await client.query(
      "INSERT INTO user_details(username,password,first_name,last_name) VALUES($1,$2,$3,$4) RETURNING *;",
      [username, password, firstName, lastName]
    );
    const token = jwt.sign({ userId: data.rows[0].id }, SECRET);

    // // depositing random number between 1 to 100000 in the bank
    const randomNumber = Math.floor(Math.random() * 10000) + 1;
    await client.query(
      `
    INSERT INTO account(userId,balance) VALUES($1,$2);
    `,
      [data.rows[0].id, randomNumber]
    );

    res.json({
      success: true,
      message: "user successfully signed up",
      token,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error);
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
    let user = await client.query(
      "SELECT username,password,id FROM user_details WHERE username = $1;",
      [username]
    );
    if (user.rows.length == 0) {
      return res.json({
        success: false,
        error: "user does not exist",
      });
    }
    const hashedPassword = await bcrypt.compare(
      password,
      user.rows[0].password
    );
    if (!hashedPassword) {
      return res.json({
        success: false,
        error: "invalid credentials",
      });
    }
    const token = jwt.sign({ userId: user.rows[0].id }, SECRET);
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

    const valuesArray = Object.entries(details).map(([key, value]) => value);

    const user = await client.query(
      `UPDATE user_details
       SET
       ${Object.entries(details)
         .map((entry, index) => {
           return `${entry[0]} = $${index + 1}`;
         })
         .join(", ")} 
       WHERE id = $${Object.entries(details).length + 1} RETURNING * ;`,
      [...valuesArray, userId]
    );

    console.log(user);

    if (user.rows[0].length == 0) {
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
      console.log(error);
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
    let user;
    console.log(query.filter);

    if (query.filter) {
      user = await client.query(
        `
        SELECT first_name,last_name,id FROM user_details
        WHERE 
            first_name=$1 OR last_name=$1
      `,
        [query.filter || null]
      );
    } else {
      user = await client.query(
        `
          SELECT first_name,last_name , id FROM user_details
        `
      );
    }

    if (user.rows.length == 0) {
      return res.json({
        success: false,
        message: "user does not found",
      });
    }

    res.json({
      success: true,
      message: "successfully fetched the user",
      user: user.rows,
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

    const user = await client.query(
      `
      SELECT first_name FROM user_details
      WHERE 
          id=$1
    `,
      [userId]
    );

    if (user.rows.length === 0) {
      return res.json({
        success: false,
        message: "user does not found",
      });
    }

    return res.json({
      success: true,
      message: "successfully fetched the user",
      user: user.rows[0],
    });
  } catch (error) {
    res.json({
      success: false,
      message: "server error",
    });
  }
}
