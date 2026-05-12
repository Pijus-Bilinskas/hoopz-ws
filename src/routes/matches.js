import { Router } from "express";
import { createMatchSchema, listMatchesQuerySchema } from "../validation/matches.js";
import { matches } from "../db/schema.js";
import { db } from "../db/db.js";
import { desc } from "drizzle-orm";
import { getMatchStatus } from "../utils/match-status.js";

export const matchesRouter = Router();

const MAX_LIMIT = 100;

matchesRouter.get("/", async (req, res) => {
    const parsed = listMatchesQuerySchema.safeParse(req.query);

    if(!parsed.success) {
        return res.status(400).json({ error: "Invalid query", details: JSON.stringify(parsed.error) });
    }

    const limit = Math.min(parsed.data.limit ?? 50, MAX_LIMIT);

    try{
        const data = await db.select().from(matches).orderBy((desc(matches.createdAt))).limit(limit);
    
        res.json({ data});
    } catch(e){
        res.status(500).json({ error: "Failed to list Matches" })
    }


});

matchesRouter.post("/", async (req, res) => {
    const parsed = createMatchSchema.safeParse(req.body);

    if(!parsed.success) {
        return res.status(400).json({ error: "Invalid payload", details: JSON.stringify(parsed.error.errors) });
    }

    try{
        const [event] = await db.insert(matches).values({
            ...parsed.data,
            startTime: new Date(parsed.data.startTime),
            endTime: new Date(parsed.data.endTime),
            homeScore: parsed.data.homeScore ?? 0,
            awayScore: parsed.data.awayScore ?? 0,
            status: getMatchStatus(parsed.data.startTime, parsed.data.endTime),
        }).returning();

        res.status(201).json({ data: event });
    } catch(e){
        res.status(500).json({ error: "Failed to create Match", details: JSON.stringify(e) });  
    }
});