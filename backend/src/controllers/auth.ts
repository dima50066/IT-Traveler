import { Request, Response } from "express";
import { env } from "../utils/env";
import https from "https";
import { URLSearchParams } from "url";
import jwt from "jsonwebtoken";
import { getUserById, getAllUsers, findOrCreateUser } from "../services/auth";

const CLIENT_ID = env("GOOGLE_CLIENT_ID");
const CLIENT_SECRET = env("GOOGLE_CLIENT_SECRET");
const REDIRECT_URI = env("GOOGLE_REDIRECT_URI");
const FRONTEND_REDIRECT_URI = env("FRONTEND_REDIRECT_URI");
const JWT_SECRET = env("JWT_SECRET");

export const googleAuthRedirect = async (req: Request, res: Response) => {
  const scope = [
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
  ].join(" ");

  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${scope}&access_type=offline&prompt=consent`;

  res.redirect(url);
};

async function getAccessToken(code: string): Promise<string> {
  const postData = new URLSearchParams({
    code,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uri: REDIRECT_URI,
    grant_type: "authorization_code",
  }).toString();

  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: "oauth2.googleapis.com",
        path: "/token",
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Content-Length": Buffer.byteLength(postData),
        },
      },
      (res) => {
        let data = "";

        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            const parsed = JSON.parse(data);

            if (parsed.access_token) {
              resolve(parsed.access_token);
            } else {
              reject(new Error("No access token in response"));
            }
          } catch (err) {
            reject(err);
          }
        });
      }
    );

    req.on("error", (err) => {
      reject(err);
    });

    req.write(postData);
    req.end();
  });
}

async function getUserInfo(accessToken: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: "www.googleapis.com",
        path: "/oauth2/v2/userinfo",
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
      (res) => {
        let data = "";

        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            const parsed = JSON.parse(data);
            resolve(parsed);
          } catch (err) {
            reject(err);
          }
        });
      }
    );

    req.on("error", (err) => {
      reject(err);
    });

    req.end();
  });
}

export const googleAuthCallback = async (req: Request, res: Response) => {
  const code = req.query.code as string;

  if (!code) {
    return res.status(400).json({ message: "Missing authorization code" });
  }

  try {
    const token = await getAccessToken(code);

    const userInfo = await getUserInfo(token);

    const googleId = userInfo.id || userInfo.sub;
    const email = userInfo.email;
    const name = userInfo.name;
    const picture = userInfo.picture;

    if (!googleId) {
      return res.status(400).json({ message: "Google ID is required" });
    }

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await findOrCreateUser(googleId, email, name, picture);

    const jwtToken = jwt.sign(
      { id: user._id.toString(), email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.redirect(`${FRONTEND_REDIRECT_URI}?token=${jwtToken}`);
  } catch (err: any) {
    res.status(500).json({ message: "Google authentication failed" });
  }
};

export const getGoogleProfile = async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const user = await getUserById(userId);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json({ user });
};

export const getAllUsersHandler = async (req: Request, res: Response) => {
  res.set("Cache-Control", "no-store");

  const users = await getAllUsers();
  res.json({ users });
};
