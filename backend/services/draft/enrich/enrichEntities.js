import { getChefByName } from '../../entities/chef/operations.js';
import { getVenueByName } from '../../entities/venue/operations.js';
import { fetchVenueAddress } from './google/googleMaps.js';
import { fetchInstagramHandle } from './google/googleSearch.js';

// Enrich chef data by looking up in DB, create placeholders for missing chefs
async function enrichChefEntities(chefNames) {
  const chefEntitiesFromDB = await Promise.all(
    chefNames.map(name => getChefByName(name))
  );

  const chefEntities = [];
  for (let i = 0; i < chefNames.length; i++) {
    const name = chefNames[i];
    const entity = chefEntitiesFromDB[i];

    if (entity) {
      chefEntities.push(entity);
    } else {
      chefEntities.push({ name, instagram_handle: await fetchInstagramHandle(name) });
    }
  }

  return chefEntities;
}

// Enrich venue data from DB, fetche address from Google Maps if missing
async function enrichVenueEntity(venueName) {
  let venueEntity = await getVenueByName(venueName);

  if (!venueEntity) {
    const address = await fetchVenueAddress(venueName);
    venueEntity = {
      name: venueName,
      instagram_handle: await fetchInstagramHandle(venueName),
      address: address
    };
  }

  return venueEntity;
}

// Enrich both chef and venue data in parallel for draft generation
export async function enrichEntities(chefNames, venueName) {
  const [chefEntities, venueEntity] = await Promise.all([
    enrichChefEntities(chefNames),
    enrichVenueEntity(venueName)
  ]);

  return { chefEntities, venueEntity };
}