import type { NextApiRequest, NextApiResponse } from "next";
import { Client } from "appwrite"; // Only Client is needed
import connectDB from "@/lib/mongodb";
import UserModel from "@/models/Users";

type Data = { success: true } | { error: string };

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_API_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_PROJECT_ID!);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Expect token from Authorization header: 'Bearer <token>'
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "No auth token" });

    const token = authHeader.replace("Bearer ", "").trim();
    if (!token) return res.status(401).json({ error: "Invalid auth token" });

    // Verify JWT using Appwrite REST API
    const verifyResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_ENDPOINT}/account/sessions/jwt/verify`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Appwrite-Project": process.env.NEXT_PUBLIC_PROJECT_ID!,
          "X-Appwrite-Key": process.env.APPWRITE_API_KEY!, // Server key only
        },
        body: JSON.stringify({ jwt: token }),
      }
    );

    if (!verifyResponse.ok) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const verifyData = await verifyResponse.json();

    // Now look up the user in MongoDB using the Appwrite user ID
    await connectDB();
    const user = await UserModel.findOne({ appwriteId: verifyData.userId });

    if (!user) return res.status(404).json({ error: "User not found" });

    const { questionId } = req.body;
    if (!questionId || typeof questionId !== "string") {
      return res.status(400).json({ error: "Invalid questionId" });
    }

    if (!user.solvedQuestions) user.solvedQuestions = [];

    if (!user.solvedQuestions.includes(questionId)) {
      user.solvedQuestions.push(questionId);
      await user.save();
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error marking solved question with Appwrite auth:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
