import express, { Request, Response } from "express";
import User from "../models/user";
import jwt from "jsonwebtoken";
import { check, validationResult } from "express-validator";
import verifyToken from "../middleware/auth";

const router = express.Router();

router.get("/me", verifyToken, async (req: Request, res: Response) => {
  const userId = req.userId;

  try {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
});

router.post(
  "/register",
  [
    check("firstName", "First Name is required").isString(),
    check("lastName", "Last Name is required").isString(),
    check("email", "Email is required").isEmail(),
    check("password", "Password with 6 or more characters required").isLength({
      min: 6,
    }),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }

    try {
      let user = await User.findOne({
        email: req.body.email,
      });

      if (user) {
        return res.status(400).json({ message: "User already exists" });
      }

      user = new User(req.body);
      await user.save();

      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET_KEY as string,
        {
          expiresIn: "1d",
        }
      );

      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 86400000,
        path: "/",
      });
      return res.status(200).send({ message: "User registered OK" });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Something went wrong" });
    }
  }
);
router.post("/wishlist/:hotelId", verifyToken, async (req: any, res) => {
  const userId = req.userId;
  const hotelId = req.params.hotelId;

  try {
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    const exists = user.wishlist.includes(hotelId);

    if (exists) {
      user.wishlist = user.wishlist.filter(
        (id: any) => id.toString() !== hotelId
      );
    } else {
      user.wishlist.push(hotelId);
    }

    await user.save();

    res.json({ wishlist: user.wishlist });
  } catch (error) {
    res.status(500).json({ message: "Error updating wishlist" });
  }
});
router.get("/wishlist", verifyToken, async (req: any, res) => {
  try {
    const user = await User.findById(req.userId).populate("wishlist");

    res.json(user?.wishlist || []);
  } catch {
    res.status(500).json({ message: "Error fetching wishlist" });
  }
});

export default router;
