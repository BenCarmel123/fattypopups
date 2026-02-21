import { getChefByName } from '../database/entities/chef/operations.js';
import { getVenueByName } from '../database/entities/venue/operations.js';
import { fetchVenueAddress } from './utils/googleMaps.js';

// Fetches chef entities from DB in parallel, creates placeholders for missing chefs
async function getChefEntities(chefNames) {
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
      chefEntities.push({ name, instagram_handle: null });
    }
  }

  return chefEntities;
}

// Fetches venue entity from DB, creates placeholder with address if missing
async function getVenueEntity(venueName) {
  let venueEntity = await getVenueByName(venueName);

  if (!venueEntity) {
    const address = await fetchVenueAddress(venueName);
    venueEntity = {
      name: venueName,
      instagram_handle: null,
      address: address
    };
  }

  return venueEntity;
}

// Fetches both chef and venue entities in parallel for draft generation
export async function getEntities(chefNames, venueName) {
  const [chefEntities, venueEntity] = await Promise.all([
    getChefEntities(chefNames),
    getVenueEntity(venueName)
  ]);

  return { chefEntities, venueEntity };
}