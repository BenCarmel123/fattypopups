export function extractTitleNaive(text) {
  if (typeof text !== "string") return null;

  const match = text.match(/event_title:\s*(.+)/i);
  if (!match) return null;

  let value = match[1].trim();

  // extract substring inside quotes if present
  const quoted = value.match(/"([^"]+)"/);
  if (quoted) {
    value = quoted[1];
  }

  return value.toLowerCase() === "null" || value.toLowerCase() === "none"
    ? null
    : value;
}

export function extractChefNamesNaive(text) {
  if (typeof text !== "string") return [];

  const match = text.match(/chef_names:\s*(.+)/i);
  if (!match) return [];

  let value = match[1].trim();

  // Check if it's an array format like ["Chef1", "Chef2"] or ['Chef1', 'Chef2']
  const arrayMatch = value.match(/\[([^\]]+)\]/);
  if (arrayMatch) {
    const arrayContent = arrayMatch[1];
    // Split by comma and extract quoted values
    const chefs = arrayContent
      .split(',')
      .map(item => {
        const quoted = item.trim().match(/["']([^"']+)["']/);
        return quoted ? quoted[1] : item.trim();
      })
      .filter(chef => chef && chef.toLowerCase() !== 'null' && chef.toLowerCase() !== 'none');
    return chefs;
  }

  // Fallback: single quoted value
  const quoted = value.match(/"([^"]+)"/);
  if (quoted) {
    value = quoted[1];
  }

  if (value.toLowerCase() === "null" || value.toLowerCase() === "none") {
    return [];
  }

  return [value];
}

export function extractVenueNameNaive(text) {
  if (typeof text !== "string") return null;

  const match = text.match(/venue_name:\s*(.+)/i);
  if (!match) return null;

 let value = match[1].trim();

  // extract substring inside quotes if present
  const quoted = value.match(/"([^"]+)"/);
  if (quoted) {
    value = quoted[1];
  }

  return value.toLowerCase() === "null" || value.toLowerCase() === "none"
    ? null
    : value;
}

export function extractDescriptionNaive(locale, text) {
  if (typeof text !== "string") return null;

  const key =
    locale === "he" ? "hebrew_description" : "english_description";

  const match = text.match(
    new RegExp(`${key}\\s*:\\s*([^\\n\\r]+)`, "i")
  );

  if (!match) return null;

  let value = match[1].trim();

  // extract substring inside quotes if present
  const quoted = value.match(/"([^"]+)"/);
  if (quoted) {
    value = quoted[1];
  }

  return value.toLowerCase() === "null" || value.toLowerCase() === "none"
    ? null
    : value;
}

export function extractStreetAndNumber(addressResponse) {
    const fullAddress = addressResponse?.places?.[0]?.formattedAddress;
    if (!fullAddress) return null;
    return fullAddress.split(',')[0].trim();
}

export function extractInstagramHandle(googleResponse) {
  if (!googleResponse || !googleResponse.items || googleResponse.items.length === 0) {
    return null;
  }

  const link = googleResponse.items[0].link;
  const match = link.match(/instagram\.com\/([^/?]+)/);
  const handle = match? "@" + match[1] : null;
  return handle;
}
