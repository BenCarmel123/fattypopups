
const generateDraft = 
    async (prompt) => { return { title: null, english_description: typeof prompt === 'string' ? prompt : null }; }

export { generateDraft };