import { GenerateDraftDetails } from "./modelCalls.js";
import { extractChefNameNaive, extractDescriptionNaive, extractInstagramHandle, extractStreetAndNumber, extractVenueNameNaive } from "./utils/parsers.js";
import { fetchDetails } from "./utils/fetchers.js";

const REMINDER = "!!!DO NOT FORGET TO FILL!!!"
const generateDraft = 
    async (prompt) => 
    { 
        const _startTime = Date.now(); // TIME start

        // Extract chef name, venue and descriptions from prompt 
        const rawOutput = await GenerateDraftDetails(prompt);
        const chefName = extractChefNameNaive(rawOutput);
        const venueName = extractVenueNameNaive(rawOutput);
        const englishDescription = extractDescriptionNaive("en", rawOutput);
        const hebrewDescription = extractDescriptionNaive("he", rawOutput);
        console.log("[DRAFT] chef:", chefName, "| venue:", venueName);
        console.log("[DRAFT] english:", englishDescription, "| hebrew:", hebrewDescription);

        // Extract address and Instagram 
        const { venueAddress, streetNumber, chefInstagram } = await fetchDetails(venueName, chefName);

        const today = new Date().toISOString().split('T')[0];

        const result = { 
            title: REMINDER, // DONE
            start_datetime: today, // DONE
            end_datetime: today, // DONE
            venue_instagram: REMINDER, // DONE 
            venue_address: venueAddress ? streetNumber : venueName, // DONE
            chef_names: chefName, // DONE
            chef_instagrams: chefInstagram, // DONE
            reservation_url: REMINDER, // Done
            english_description: englishDescription, // DONE
            hebrew_description: hebrewDescription, // DONE
            is_draft: true // DONE
        };

        console.log("[TIME]", Date.now() - _startTime, "ms"); // TIME end
        return result;
    }

export { generateDraft };

