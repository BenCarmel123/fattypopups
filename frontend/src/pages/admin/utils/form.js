
// Parse form into FormData for upload and validation
export const parseFormData = (form) => {
  const chefNames = [];
  const chefInstagrams = [];

  for (let i = 0; i < 5; i++) {
    const nameField = form[`chef_name_${i}`];
    const instaField = form[`chef_instagram_${i}`];

    if (nameField?.value) {
      chefNames.push(nameField.value);
      chefInstagrams.push(instaField?.value || '');
    }
  }

  const fields = {
    title: form.title.value,
    start_datetime: form.start_datetime.value,
    end_datetime: form.end_datetime.value,
    venue_name: form.venue_name.value,
    venue_instagram: form.venue_instagram.value,
    venue_address: form.venue_address.value,
    chef_names: chefNames.join(','),
    chef_instagrams: chefInstagrams.join(','),
    reservation_url: form.reservation_url.value,
    english_description: form.english_description.value,
    hebrew_description: form.hebrew_description.value,
    poster: form.poster.files[0],
    is_draft: form.is_draft ? form.is_draft.value : 'false',
  };

  const formData = new FormData();
  Object.entries(fields).forEach(([key, value]) => formData.append(key, value));
  return formData;
};

// Set is_draft to true when "Save as Draft" button is clicked
export const handleDraftClick = (e) => {
  const form = e.currentTarget.closest('form');
  if (form && form.is_draft) {
    form.is_draft.value = 'true';
  }
};

// Set is_draft to false when "Add"/"Update" button is clicked
export const handleAddClick = (e) => {
  const form = e.currentTarget.closest('form');
  if (form && form.is_draft) {
    form.is_draft.value = 'false';
  }
};

// Parse LLM generated draft data to format expected by form components
export const parseLLMOutput = (draft) => {

  if (!draft) return null;

  // Parse chef names and instagrams from comma-separated strings
  const chefNames = draft.chef_names?.split(',').map(s => s.trim()).filter(Boolean) || [];
  const chefInstagrams = draft.chef_instagrams?.split(',').map(s => s.trim()).filter(Boolean) || [];

  // Build chefs array
  const chefs = chefNames.map((name, i) => ({
    name,
    instagram_handle: chefInstagrams[i] || ''
  }));

  const venue = {
    name: draft.venue_name || '',
    address: draft.venue_address || '',
    instagram_handle: draft.venue_instagram || ''
  };

  return {
    title: draft.title,
    start_datetime: draft.start_datetime,
    end_datetime: draft.end_datetime,
    reservation_url: draft.reservation_url,
    english_description: draft.english_description,
    hebrew_description: draft.hebrew_description,
    poster: draft.poster,
    is_draft: draft.is_draft,
    chefs,
    venue
  };
};
