// Compute draft/publish state and what changed for event updates
export function computeUpdateState(body, currentEvent, currentVenue, currentChefs) {
  // Handle both string and boolean is_draft values
  const isDraft = body.is_draft === "true" || body.is_draft === true; 
  const wasDraft = currentEvent.is_draft === true || currentEvent.is_draft === "true"; 
  const toPublish = wasDraft && !isDraft;
  const stillDraft = wasDraft && isDraft;
  const alreadyPublished = !wasDraft;

  // Compute description changes
  const englishChanged = body.english_description !== currentEvent.english_description;
  const hebrewChanged = body.hebrew_description !== currentEvent.hebrew_description;

  // Compute venue change (compare venue names)
  const venueChanged = currentVenue?.name !== body.venue_name;

  // Compute chef changes (compare arrays of chef names)
  const currentChefNames = currentChefs?.map(c => c.name).sort().join(',') || '';
  const incomingChefNames = body.chef_names
    ? body.chef_names.split(',').map(s => s.trim()).sort().join(',')
    : '';
  const chefsChanged = currentChefNames !== incomingChefNames;

  console.log("[DEBUG] is_draft values - body:", body.is_draft, "| current:", currentEvent.is_draft);
  console.log("[DEBUG] Flags - isDraft:", isDraft, "| wasDraft:", wasDraft, "| toPublish:", toPublish);
  console.log("[DEBUG] Changes - English:", englishChanged, "| Hebrew:", hebrewChanged, "| Venue:", venueChanged, "| Chefs:", chefsChanged);

  return {
    isDraft,
    wasDraft,
    toPublish,
    stillDraft,
    alreadyPublished,
    englishChanged,
    hebrewChanged,
    venueChanged,
    chefsChanged
  };
}
