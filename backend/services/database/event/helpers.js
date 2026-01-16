// Compute draft/publish state and what changed for event updates
export function computeUpdateState(body, currentEvent) {
  // Handle both string and boolean is_draft values
  const isDraft = body.is_draft === "true" || body.is_draft === true; 
  const wasDraft = currentEvent.is_draft === true || currentEvent.is_draft === "true"; 
  const toPublish = wasDraft && !isDraft;
  const stillDraft = wasDraft && isDraft;
  const alreadyPublished = !wasDraft;

  // Compute what changed
  const englishChanged = body.english_description !== currentEvent.english_description;
  const hebrewChanged = body.hebrew_description !== currentEvent.hebrew_description;

  console.log("[DEBUG] is_draft values - body:", body.is_draft, "| current:", currentEvent.is_draft);
  console.log("[DEBUG] Flags - isDraft:", isDraft, "| wasDraft:", wasDraft, "| toPublish:", toPublish);
  console.log("[DEBUG] Changes - English:", englishChanged, "| Hebrew:", hebrewChanged);

  return {
    isDraft,
    wasDraft,
    toPublish,
    stillDraft,
    alreadyPublished,
    englishChanged,
    hebrewChanged
  };
}
