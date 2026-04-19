import { Stack } from "@chakra-ui/react";
import { useState, useEffect } from 'react';
import TypeaheadInput from './TypeaheadInput.jsx';
import { fetchVenues } from 'controller/venues.js';
import { logger } from 'utils/logger.js';
import Row from "../structure/Row.jsx";

export default function VenueFields({ event }) {
  const [venueData, setVenueData] = useState([]);
  const [venue, setVenue] = useState({
    name: event?.venue?.name || event?.metadata?.venue?.name || "",
    address: event?.venue?.address || event?.metadata?.venue?.address || "",
    instagram: event?.venue?.instagram_handle || event?.metadata?.venue?.instagram || ""
  });

  useEffect(() => {
    fetchVenues()
      .then(data => setVenueData(data))
      .catch(err => logger.error('Failed to fetch venues:', err));
  }, []);

  const handleVenueChange = (field, value) => {
    const updatedVenue = { ...venue, [field]: value };

    // Auto-fill other fields if this value exists in database
    const matchingVenue = venueData.find(venue => venue[field] === value);

    if (matchingVenue) {
      // Fill all fields from the matching venue
      updatedVenue.name = matchingVenue.name;
      updatedVenue.address = matchingVenue.address;
      updatedVenue.instagram = matchingVenue.instagram;
    }

    setVenue(updatedVenue);
  };

return (
    <Stack gap={0}>
      <Row>
        <TypeaheadInput
          label="Venue Name"
          name="venue_name"
          options={venueData.map(venue => venue.name)}
          value={venue.name}
          onChange={(value) => handleVenueChange('name', value)}
          placeholder=""
        />
        <TypeaheadInput
          label="Venue Instagram"
          name="venue_instagram"
          options={venueData.map(venue => venue.instagram)}
          value={venue.instagram}
          onChange={(value) => handleVenueChange('instagram', value)}
          placeholder=""
        />
      </Row>
      <TypeaheadInput
        label="Venue Address"
        name="venue_address"
        options={venueData.map(venue => venue.address)}
        value={venue.address}
        onChange={(value) => handleVenueChange('address', value)}
        placeholder=""
      />
    </Stack>
  );
}
