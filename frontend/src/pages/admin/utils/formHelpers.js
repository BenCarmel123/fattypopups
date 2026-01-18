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

// Get tomorrow's date in YYYY-MM-DD format
export const getTomorrowDate = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split("T")[0];
};

// Generic API submit function
export const submitFormData = async (url, method, formData) => {
  const response = await fetch(url, {
    method: method,
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Unknown error');
  }

  return response.json();
};

