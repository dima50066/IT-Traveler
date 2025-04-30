import { Request, Response } from "express";
import { findOrCreateUser, getUserByAuth0Id } from "../services/auth";

export const authCallback = async (req: Request, res: Response) => {
  const user = req.auth;

  if (!user || !user.sub) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const auth0Id = user.sub;
  const email = user.email || user["https://your-namespace/email"];
  const name = user.name || user.nickname;
  const picture = user.picture;

  if (!email) {
    return res
      .status(400)
      .json({ message: "Email is required to register user." });
  }

  const dbUser = await findOrCreateUser(auth0Id, email, name, picture);

  res.json({ user: dbUser });
};

export const getProfile = async (req: Request, res: Response) => {
  const user = req.auth;

  if (!user || !user.sub) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const dbUser = await getUserByAuth0Id(user.sub);

  if (!dbUser) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json({ user: dbUser });
};
