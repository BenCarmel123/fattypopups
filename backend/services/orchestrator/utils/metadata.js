import { splitList } from '../../../utils/strings.js';

export function buildMetadata(venueName, venueInstagram, venueAddress, chefNames, chefInstagrams) {
  const chefNamesArr = splitList(chefNames);
  const chefInstagramsArr = splitList(chefInstagrams);
  return {
    venue: { name: venueName, instagram: venueInstagram, address: venueAddress },
    chef: { names: chefNamesArr, instagrams: chefInstagramsArr }
  };
}
