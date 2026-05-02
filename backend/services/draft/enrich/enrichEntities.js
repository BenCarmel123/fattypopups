import { getChefByName, findSimilarChef } from '../../entities/chef/operations.js';
import { getVenueByName, findSimilarVenue } from '../../entities/venue/operations.js';
import { fetchVenueAddress } from './google/googleMaps.js';
import { fetchInstagramHandle } from './google/googleSearch.js';

async function enrichChefEntity(name) {
  let entity = await getChefByName(name);
  if (!entity) entity = await findSimilarChef(name);
  if (entity) return entity;
  return { name, instagram_handle: await fetchInstagramHandle(name) };
}

async function enrichChefEntities(chefNames) {
  return Promise.all(chefNames.map(enrichChefEntity));
}

async function enrichVenueEntity(venueName) {
  let venueEntity = await getVenueByName(venueName);
  if (!venueEntity) venueEntity = await findSimilarVenue(venueName);

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

export async function enrichEntities(chefNames, venueName) {
  const [chefEntities, venueEntity] = await Promise.all([
    enrichChefEntities(chefNames),
    enrichVenueEntity(venueName)
  ]);

  return { chefEntities, venueEntity };
}