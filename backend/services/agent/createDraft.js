import { generateEventDescriptions, FindChefAndVenue, FindInstagrams } from "./agent.js";
import { extractChefInstagram, extractChefNameNaive, extractVenueAddress, extractVenueInstagram, extractVenueNameNaive } from "./extract.js";

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
        console.log("[DRAFT] address is", venueAddress);

        // Extract instagram accounts from prompt
        console.log("[DRAFT] finding Instagrams: ");
        const rawInstagrams = await FindInstagrams(chefName, venueAddress);

        console.log("[DRAFT] found Instagrams: " + rawInstagrams);
        const chefInstagram = extractChefInstagram(rawInstagrams);
        const venueInstagram = extractVenueInstagram(rawInstagrams)

        // Generate Event Descriptions
        let descriptionResponse;
        try {
            console.log("[DRAFT] Generating event descriptions: ")
            descriptionResponse = await generateEventDescriptions(chefName, venueName);
            console.log("[DRAFT] Response is: ")
        }
        catch (e) {
            console.log("[ERROR] Error Generating event descriptions", e);
            descriptionResponse = prompt
        }

        const today = new Date().toISOString().split('T')[0];

        // Return draft 
        return { 
                title: prompt, 
                start_datetime: today, // Done
                end_datetime: today, // Done
                venue_instagram: venueInstagram, 
                venue_address:  venueAddress ? venueAddress : venueName, 
                chef_names: chefName ? chefName : null,
                chef_instagrams: chefInstagram, 
                reservation_url: null, // Done
                english_description: descriptionResponse, 
                hebrew_description: descriptionResponse, 
                is_draft: true // Done
            }
    }

export { generateDraft };
