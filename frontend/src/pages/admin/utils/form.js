import { UNKNOWN_ERROR } from 'config/index.jsx';

const toFormData = (eventData) => {
  const formData = new FormData();
  Object.entries(eventData).forEach(([key, value]) => { formData.append(key, value); });
  return formData;
};

export const submitFormData = async (url, method, eventData) => {
  const formData = toFormData(eventData);
  const response = await fetch(url, {
    method: method,
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || UNKNOWN_ERROR);
  }

  return response.json();
};

// Extract form data into event object
export const extractEventData = (form) => {
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
  };
};
