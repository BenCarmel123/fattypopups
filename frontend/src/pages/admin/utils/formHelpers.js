// Extract form data into event object
export const extractEventDataFromForm = (form) => {
  return {
    title: form.title.value,
    start_datetime: form.start_datetime.value,
    end_datetime: form.end_datetime.value,
    venue_name: form.venue_name.value,
    venue_instagram: form.venue_instagram.value,
    venue_address: form.venue_address.value,
    chef_names: form.chef_names.value,
    chef_instagrams: form.chef_instagrams.value,
    reservation_url: form.reservation_url.value,
    english_description: form.english_description.value,
    hebrew_description: form.hebrew_description.value,
    poster: form.poster.files[0],
    is_draft: form.is_draft ? !!form.is_draft.checked : false,
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

// Check if validation should be skipped (when both old and new are drafts)
export const shouldSkipValidation = (existingEvent, newEventData) => {
  const wasDraft = existingEvent?.is_draft ?? true;
  const isDraft = newEventData.is_draft;
  return wasDraft && isDraft;
};
