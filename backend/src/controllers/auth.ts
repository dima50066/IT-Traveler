import { Request, Response } from "express";
import { findOrCreateUser } from "../services/auth";
import { env } from "../utils/env";
import https from "https";
import { URLSearchParams } from "url";
import jwt from "jsonwebtoken";
import { getUserById } from "../services/auth";

const CLIENT_ID = env("GOOGLE_CLIENT_ID");
const CLIENT_SECRET = env("GOOGLE_CLIENT_SECRET");
const REDIRECT_URI = "http://localhost:3000/auth/callback";
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
            console.error("🔥 Failed to parse token response:", err);
            reject(err);
          }
        });
      }
    );

    req.on("error", (err) => {
      console.error("🔥 HTTPS error during token request:", err);
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
            console.error("🔥 Failed to parse user info response:", err);
            reject(err);
          }
        });
      }
    );

    req.on("error", (err) => {
      console.error("🔥 HTTPS error during user info request:", err);
      reject(err);
    });

    req.end();
  });
}

export const googleAuthCallback = async (req: Request, res: Response) => {
  const code = req.query.code as string;

  if (!code) {
    console.warn("❌ No code in callback");
    return res.status(400).json({ message: "Missing authorization code" });
  }

  try {
    const token = await getAccessToken(code);

    const userInfo = await getUserInfo(token);

    const { id, email, name, picture } = userInfo;

    if (!email) {
      console.warn("❌ Email missing in Google profile");
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await findOrCreateUser(id, email, name, picture);

    const jwtToken = jwt.sign(
      { id: user._id.toString(), email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.redirect(`http://localhost:5173/auth?token=${jwtToken}`);
  } catch (err: any) {
    console.error("🔥 Google auth error:", err.message || err);
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
    console.warn("❌ User not found by ID:", userId);
    return res.status(404).json({ message: "User not found" });
  }

  res.json({ user });
};
