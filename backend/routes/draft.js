import 'dotenv/config';
import { generateDraft } from '../services/agent/composeDraft.js';
import express from 'express';
import { uploadDraftImages } from '../services/s3/draftUpload.js';
import { uploadMemory } from '../config/middleware/multer.js';
import { logger } from "../utils/logger.js";

const agentRouter = express.Router();

agentRouter.post("/draft", uploadMemory.fields([{ name: 'poster' }, { name: 'context_image' }]), async (req, res) => {
  logger.info("[REQUEST] Reached /draft endpoint\n");

  // Client error
  if (typeof prompt !== "string" || !prompt.trim()) {
    return res.status(400).json({ error: "A non-empty prompt is required" });
  }

  try {
    const { posterUrl, contextUrl } = await uploadDraftImages(
      req.files?.poster?.[0] ?? null,
      req.files?.context_image?.[0] ?? null,
    );
    // Generate draft data from AI
    const draft = await generateDraft(prompt, posterUrl, contextUrl);
    logger.info("[EVENT] Draft generated and event created\n");

    // Return draft directly to frontend for admin review
    // Admin will save it via form submission
    return res.status(200).json({ event: draft });

  } catch (err) {
    logger.error("[ERROR] Draft or event creation failed:", err, "\n");
    return res.status(500).json({ error: "Draft or event creation failed" });
  }
});

export default agentRouter;