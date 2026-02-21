import 'dotenv/config';
import { generateDraft } from '../services/agent/composeDraft.js';
import express from 'express';
import { handleEventImageUpload } from '../services/s3/upload.js';
import { uploadMemory } from '../config/middleware/multer.js';

const agentRouter = express.Router();

agentRouter.post("/draft", uploadMemory.single('poster'), async (req, res) => {
  console.log("[REQUEST] Reached /draft endpoint\n");
  const prompt = req.body.prompt;
  // Client error
  if (typeof prompt !== "string" || !prompt.trim()) {
    return res.status(400).json({ error: "A non-empty prompt is required" });
  }

  try {
    const imageUrl = await handleEventImageUpload(null, {}, req.file, null);

    // Generate draft data from AI
    const draft = await generateDraft(prompt, imageUrl);
    console.log("[EVENT] Draft generated (not saved to DB)\n");

    // Return draft directly to frontend for admin review
    // Admin will save it via form submission
    return res.status(200).json({ event: draft });

  } catch (err) {
    console.error("[ERROR] Draft or event creation failed:", err, "\n");
    return res.status(500).json({ error: "Draft or event creation failed" });
  }
});


export default agentRouter;