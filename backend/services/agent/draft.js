import { generateEventDescriptions } from "../../openai/agent.js";
const generateDraft = 
    async (prompt) => 
    { 
        // TODO: Change 
        const today = new Date().toISOString().split('T')[0];

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
                venue_address: prompt,
                chef_names: null,
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
