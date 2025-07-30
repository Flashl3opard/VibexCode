import express, { Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";

interface Clan {
  name: string;
  key: string; // unique identifier
  members: string[]; // list of user identifiers OR for demo, just increment count
}

// In-memory "database"
const clans: { [key: string]: Clan } = {};

function generateKey(name: string) {
  return (
    name.trim().toLowerCase().replace(/[\s]+/g, "-") +
    "-" +
    Math.floor(1000 + Math.random() * 9000)
  );
}

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Create Clan
app.post("/api/clans", (req: Request, res: Response) => {
  const { name, creator } = req.body;
  if (!name) return res.status(400).json({ error: "Name is required" });

  const key = generateKey(name);
  clans[key] = { name, key, members: creator ? [creator] : [] };
  res.status(201).json(clans[key]);
});

// Join Clan
app.post("/api/clans/join", (req: Request, res: Response) => {
  const { key, member } = req.body;
  const clan = clans[key];
  if (!clan) return res.status(404).json({ error: "Clan not found" });

  if (member && !clan.members.includes(member)) {
    clan.members.push(member);
  }
  res.json(clan);
});

// Get Clan
app.get("/api/clans/:key", (req: Request, res: Response) => {
  const { key } = req.params;
  const clan = clans[key];
  if (!clan) return res.status(404).json({ error: "Clan not found" });
  res.json(clan);
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log("API running on port", PORT));
