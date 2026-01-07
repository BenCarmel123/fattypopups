import { GenerateDraftDetails } from "./modelCalls.js";
import { extractChefNameNaive, extractDescriptionNaive, extractVenueNameNaive } from "./utils/parsers.js";
import { fetchSpecificDetails } from "./utils/fetchers.js";

const REMINDER = "!!!DO NOT FORGET TO FILL!!!"
const generateDraft = 
    async (prompt) => 
    { 
        const _startTime = Date.now(); // TIME start

        // Details from prompt 
        const rawOutput = await GenerateDraftDetails(prompt);

        // Extract names from output
        const chefName = extractChefNameNaive(rawOutput);
        const venueName = extractVenueNameNaive(rawOutput);

        // Extract descriptions from output
        const englishDescription = extractDescriptionNaive("en", rawOutput);
        const hebrewDescription = extractDescriptionNaive("he", rawOutput);
        console.log("[DRAFT] chef:", chefName, "| venue:", venueName);
        console.log("[DRAFT] english:", englishDescription, "| hebrew:", hebrewDescription);

        // Extract Date
        const today = new Date().toISOString().split('T')[0];

        // Extract address and Instagram 
        const { venueAddress, streetNumber, chefInstagram, venueInstagram } = await fetchSpecificDetails(venueName, chefName);

        const result = { 
            title: REMINDER, // DONE
            start_datetime: today, // DONE
            end_datetime: today, // DONE
            venue_instagram: venueInstagram || REMINDER, // DONE 
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

