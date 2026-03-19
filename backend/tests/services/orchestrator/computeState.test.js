import { computeUpdateState } from '../../../services/orchestrator/utils/computeState.js';

describe('computeUpdateState', () => {
  it('detects draft → publish and sets shouldUpdateVenue', () => {
    const result = computeUpdateState(
      { is_draft: false, english_description: 'desc', hebrew_description: 'תיאור', venue_name: 'Venue A', chef_names: 'Chef A' },
      { is_draft: true, english_description: 'desc', hebrew_description: 'תיאור' },
      { name: 'Venue A' },
      []
    );
    expect(result.toPublish).toBe(true);
    expect(result.shouldUpdateVenue).toBe(true);
  });
});
