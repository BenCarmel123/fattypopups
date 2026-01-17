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
