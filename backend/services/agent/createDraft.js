import { generateEventDescriptions, extractChefAndVenue } from "./agent.js";
import { extractChefNameNaive, extractVenueNameNaive } from "./extract.js";

const generateDraft = 
    async (prompt) => 
    { 
        const today = new Date().toISOString().split('T')[0];

        // Extract chef names and venue from prompt 
        const rawString = await extractChefAndVenue(prompt);
        const chefName = extractChefNameNaive(rawString)
        const venueName = extractVenueNameNaive(rawString)
        console.log("[DEBUG] chef is " + chefName + " of type " + typeof chefName)
        console.log("[DEBUG] venue is " + venueName + " of type " + typeof venueName)
        
        // Generate Event Embeddings
        let descriptionResponse;
        try {
            descriptionResponse = generateEventDescriptions(chefName, venueName);
        }
        catch (e) {
            console.log("[ERROR] Error Generating event descriptions", e);
            descriptionResponse = prompt
        }
        console.log(descriptionResponse)

        // Return draft 
        return { 
                title: prompt, 
                start_datetime: today, // Done
                end_datetime: today, // Done
                venue_instagram: null, 
                venue_address: venueName ? venueName : null, 
                chef_names: chefName ? chefName : null,
                chef_instagrams: null, 
                reservation_url: null, // Done
                english_description: descriptionResponse, 
                hebrew_description: descriptionResponse, 
                is_draft: true // Done
            }
    }

export { generateDraft };
