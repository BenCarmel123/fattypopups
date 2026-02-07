// Extract form data into event object
export const extractEventDataFromForm = (form) => {
  // Collect all chef fields (chef_name_0, chef_name_1, etc.)
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

  return {
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
    is_draft: form.is_draft ? form.is_draft.value === 'true' : false,
  };
};

// Convert event data object to FormData for multipart upload
export const eventDataToFormData = (eventData) => {
  const formData = new FormData();

  Object.entries(eventData).forEach(([key, value]) => {
    if (key === 'is_draft') {
      formData.append(key, value ? 'true' : 'false');
    } else {
      formData.append(key, value);
    }
  });

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
