import { splitList } from 'utils/strings.js';

const buildMetadata = (fields) => JSON.stringify({
  venue: { name: fields.venue_name, instagram: fields.venue_instagram, address: fields.venue_address },
  chef: { names: splitList(fields.chef_names), instagrams: splitList(fields.chef_instagrams) }
});

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
    fields.metadata = buildMetadata(fields);
  }

  const formData = new FormData();
  Object.entries(fields).forEach(([key, value]) => formData.append(key, value));
  return formData;
};
