import { Stack } from "@chakra-ui/react";
import { useState, useEffect } from 'react';
import TypeaheadInput from '../../../../../components/form/TypeaheadInput';
import { fetchVenues } from '../../../../../utils/database/api';
import Row from "../structure/Row.jsx";

// Venue fields component - manages venue name, address, and instagram inputs
export default function VenueFields({ event }) {
  const [venueData, setVenueData] = useState({ names: [], addresses: [], instagrams: [] });
  const [venue, setVenue] = useState({
    name: event?.venue?.name || "",
    address: event?.venue?.address || "",
    instagram: event?.venue?.instagram_handle || ""
  });

  // Fetch venue data when component mounts
  useEffect(() => {
    fetchVenues()
      .then(data => setVenueData(data))
      .catch(err => console.log('[ERROR] Failed to fetch venues:', err));
  }, []);

  const handleVenueChange = (field, value) => {
    setVenue({ ...venue, [field]: value });
  };

  return (
    <Stack gap={0}>
      <Row>
        <TypeaheadInput
          label="Venue Name"
          name="venue_name"
          options={venueData.names}
          value={venue.name}
          onChange={(value) => handleVenueChange('name', value)}
          placeholder=""
        />
        <TypeaheadInput
          label="Venue Instagram"
          name="venue_instagram"
          options={venueData.instagrams}
          value={venue.instagram}
          onChange={(value) => handleVenueChange('instagram', value)}
          placeholder=""
        />
      </Row>
      <TypeaheadInput
        label="Venue Address"
        name="venue_address"
        options={venueData.addresses}
        value={venue.address}
        onChange={(value) => handleVenueChange('address', value)}
        placeholder=""
      />
    </Stack>
  );
}
