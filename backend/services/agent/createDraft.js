import { generateEventDescriptions, FindChefAndVenue } from "./agent.js";
import { fetchInstagram, extractChefNameNaive, extractDescriptionNaive, extractInstagramHandle, extractStreetAndNumber, extractVenueAddress, extractVenueNameNaive } from "./extract.js";

const generateDraft = 
    async (prompt) => 
    { 
        // Extract chef names and venue from prompt 
        const rawNames = await FindChefAndVenue(prompt);
        console.log("[DRAFT] found names: " + rawNames);
        const chefName = extractChefNameNaive(rawNames);
        const venueName = extractVenueNameNaive(rawNames);
        console.log("[DRAFT] chef is " + chefName + " of type " + typeof chefName);

        // Extract Venue Address from name 
        const venueAddress = await extractVenueAddress(venueName);
        console.log("[DRAFT] full address is", venueAddress);
        const streetNumber = extractStreetAndNumber(venueAddress)
        console.log("[DRAFT] street and number are", venueAddress);

        // Extract instagram accounts 
        console.log("[DRAFT] finding Instagrams: ");
        const chefQuery = `"${chefName}" site:instagram.com`;
        const venueQuery =`"${venueName}" "${streetNumber}" Tel Aviv instagram`;;
        const chefInstagramSearchResult = await fetchInstagram(chefQuery);
        const venueInstagramSearchResult = await fetchInstagram(venueQuery);
        const chefInstagram = extractInstagramHandle(chefInstagramSearchResult);
        const venueInstagram = extractInstagramHandle(venueInstagramSearchResult);

        // Generate Event Descriptions
        console.log("[DRAFT] Generating event descriptions: ")
        const descriptionResponse = await generateEventDescriptions(chefName, venueName);
        console.log("[DRAFT] Response is: " + descriptionResponse)
        const englishDescription = extractDescriptionNaive("en", descriptionResponse)
        const hebrewDescription = extractDescriptionNaive("he", descriptionResponse)
       
        const today = new Date().toISOString().split('T')[0];

        // Return draft 
        return { 
                title: prompt, 
                start_datetime: today, // Done
                end_datetime: today, // Done
                venue_instagram: venueInstagram, 
                venue_address:  venueAddress ? streetNumber : venueName, // Done
                chef_names: chefName ? chefName : null, // Done 
                chef_instagrams: chefInstagram, // Done 
                reservation_url: null, // Done
                english_description: englishDescription, 
                hebrew_description: hebrewDescription, 
                is_draft: true // Done
            }
    }

export { generateDraft };
