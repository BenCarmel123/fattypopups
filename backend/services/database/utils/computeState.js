import { isTrue } from '../../utils.js';
import { logger } from "../../../utils/logger.js";

// Helper: Compute draft/publish state transitions
function computeStateTransitions(body, currentEvent) {
  const isDraft = isTrue(body.is_draft);
  const wasDraft = isTrue(currentEvent.is_draft);

  return {
    isDraft,
    wasDraft,
    toPublish: wasDraft && !isDraft,        // Draft → Published
    toUnpublish: !wasDraft && isDraft,      // Published → Draft
    stillDraft: wasDraft && isDraft,        // Draft → Draft
    alreadyPublished: !wasDraft && !isDraft // Published → Published
  };
}

// Helper: Detect what content changed
function computeContentChanges(body, currentEvent, currentVenue, currentChefs) {
  const englishChanged = body.english_description !== currentEvent.english_description;
  const hebrewChanged = body.hebrew_description !== currentEvent.hebrew_description;
  const venueChanged = currentVenue?.name !== body.venue_name;

  // Compute chef changes by comparing sorted name lists
  const currentChefNames = currentChefs?.map(c => c.name).sort().join(',') || '';
  const incomingChefNames = body.chef_names
    ? body.chef_names.split(',').map(s => s.trim()).sort().join(',')
    : '';
  const chefsChanged = currentChefNames !== incomingChefNames;

  return { englishChanged, hebrewChanged, venueChanged, chefsChanged };
}

// Helper: Compute action flags for venue/chef/embedding updates
function computeActionFlags(stateFlags, changeFlags, currentChefs) {
  const { toPublish, alreadyPublished } = stateFlags;
  const { venueChanged, chefsChanged } = changeFlags;

  // Only update when publishing or updating already-published content
  const shouldUpdateVenue = toPublish || (alreadyPublished && venueChanged);
  const shouldUpdateChefs = toPublish || (alreadyPublished && chefsChanged);

  // Unlink chefs when republishing (was published before) or updating published content
  const hasExistingChefs = currentChefs && currentChefs.length > 0;
  const isRepublishing = toPublish && hasExistingChefs;
  const shouldUnlinkChefs = chefsChanged && (isRepublishing || alreadyPublished);

  return { shouldUpdateVenue, shouldUpdateChefs, shouldUnlinkChefs };
}

// Main: Compute draft/publish state and what changed for event updates
export function computeUpdateState(body, currentEvent, currentVenue, currentChefs) {
  const stateFlags = computeStateTransitions(body, currentEvent);
  const changeFlags = computeContentChanges(body, currentEvent, currentVenue, currentChefs);
  const actionFlags = computeActionFlags(stateFlags, changeFlags, currentChefs);

  logger.debug(`is_draft - body: ${body.is_draft} | current: ${currentEvent.is_draft} | State:`, { stateFlags, changeFlags, actionFlags });

  return {
    ...stateFlags,
    ...changeFlags,
    ...actionFlags
  };
}
