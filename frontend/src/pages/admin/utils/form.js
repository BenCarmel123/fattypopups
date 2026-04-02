
// Builds a chefs array from comma-separated chef_names and chef_instagrams strings
const parseChefs = (draft) => {
  const chefNames = draft.chef_names?.split(',').map(s => s.trim()).filter(Boolean) || [];
  const chefInstagrams = draft.chef_instagrams?.split(',').map(s => s.trim()).filter(Boolean) || [];
  return chefNames.map((name, i) => ({ name, instagram_handle: chefInstagrams[i] || '' }));
};

const extractChefDetails = (form) => {
    let chefNames = [];
    let chefInstagrams = [];

    for (let i = 0; i < 5; i++) {
      const nameField = form[`chef_name_${i}`];
      const instaField = form[`chef_instagram_${i}`];

      if (nameField?.value) {
        chefNames.push(nameField.value);
        chefInstagrams.push(instaField?.value || '');
      }
    }

    chefNames = chefNames.join(',');
    chefInstagrams = chefInstagrams.join(',');
    return [chefNames, chefInstagrams];
}

// Parse LLM generated draft data to format expected by form components
export const parseLLMOutput = (draft) => {

  if (!draft) return null;

  const chefs = parseChefs(draft);

  const venue = { name: draft.venue_name || '', address: draft.venue_address || '', instagram_handle: draft.venue_instagram || '' };

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

// Parse form into FormData for upload and validation
export const parseFormData = (form, isDraft = false) => {
  const chefDetails = extractChefDetails(form)
  const chefNames = chefDetails[0];
  const chefInstagrams = chefDetails[1];

  const fields = {
    title: form.title.value,
    start_datetime: form.start_datetime.value,
    end_datetime: form.end_datetime.value,
    venue_name: form.venue_name.value,
    venue_instagram: form.venue_instagram.value,
    venue_address: form.venue_address.value,
    chef_names: chefNames,
    chef_instagrams: chefInstagrams,
    reservation_url: form.reservation_url.value,
    english_description: form.english_description.value,
    hebrew_description: form.hebrew_description.value,
    poster: form.poster.files[0] || form.poster_url?.value || undefined,
    is_draft: isDraft ? 'true' : 'false',
  };

  if (isDraft) {
    const chefNamesArr = fields.chef_names.split(',').map(s => s.trim()).filter(Boolean);
    const chefInstagramsArr = fields.chef_instagrams.split(',').map(s => s.trim()).filter(Boolean);
    fields.metadata = JSON.stringify({
      venue: {
        name: fields.venue_name,
        instagram: fields.venue_instagram,
        address: fields.venue_address
      },
      chef: {
        names: chefNamesArr,
        instagrams: chefInstagramsArr
      }
    });
  }

  console.log(fields.metadata)

  const formData = new FormData();
  Object.entries(fields).forEach(([key, value]) => formData.append(key, value));
  return formData;
};
