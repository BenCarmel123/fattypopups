import { generateEventDescriptions, extractChefAndVenue } from "../../openai/agent.js";

function extractChefNameNaive(text) {
  const key = `"chef_name":`;
  const idx = text.indexOf(key);
  if (idx === -1) return null;

  const afterKey = text.slice(idx + key.length).trim();

  if (!afterKey.startsWith(`"`)) return null;

  const endQuoteIdx = afterKey.indexOf(`"`, 1);
  if (endQuoteIdx === -1) return null;

  return afterKey.slice(1, endQuoteIdx);
}

function extractVenueNameNaive(text) {
    const key = `"venue_name":`;
    const idx = text.indexOf(key);
    if (idx === -1) return null;

    const afterKey = text.slice(idx + key.length).trim();

    if (!afterKey.startsWith(`"`)) return null;

    const endQuoteIdx = afterKey.indexOf(`"`, 1);
    if (endQuoteIdx === -1) return null;

    return afterKey.slice(1, endQuoteIdx);
}


const generateDraft = 
    async (prompt) => 
    { 
        // TODO: Change 
        const today = new Date().toISOString().split('T')[0];

        // Extract chef names and venue from prompt 
        const rawString = await extractChefAndVenue(prompt);
        const chefName = extractChefNameNaive(rawString)
        const venueName = extractVenueNameNaive(rawString)
        console.log("[DEBUG] chef is " + chefName + " of type " + typeof chefName)
                console.log("[DEBUG] venue is " + venueName + " of type " + typeof venueName)
        let agentResponse;
        // Generate Event Embeddings
        try {
            agentResponse = await generateEventDescriptions("Eyal Shani", "HaSalon");
        }
        catch (e) {
            console.log("[ERROR] Error Generating event descriptions", e);
            agentResponse = prompt
        }

        console.log(agentResponse)

        return { 
                title: prompt, 
                start_datetime: today, 
                end_datetime: today,
                venue_instagram: null,
                venue_address: venueName ? venueName : prompt,
                chef_names: chefName ? chefName : null,
                chef_instagrams: null,
                reservation_url: null, 
                english_description: agentResponse,
                hebrew_description: prompt,
                is_draft: true
            }
    }

export { generateDraft };


// const generateDraft = 
//     async (prompt) => 
//     { 
//         const venueInfo = generateVenue(prompt)
//         const chefInfo = generateChef(prompt)
//         return { 
//                 title: null, 
//                 start_datetime: Date.now(), 
//                 end_datetime: Date.now(),
//                 venue_instagram: venueInfo.instagram,
//                 venue_address: venueInfo.address,
//                 chef_names: chefInfo.name,
//                 chef_instagrams: chefInfo.instagram,
//                 reservation_url: undefined, 
//                 english_description: generateDescription.english_description,
//                 hebrew_description: generateDescription.hebrew_description,
//                 poster: undefined,
//                 is_draft: true
//             }
//     }

// export { generateDraft };
