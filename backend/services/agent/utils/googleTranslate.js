
export async function translate(english_description) {
    const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${process.env.GOOGLE_TRANSLATE_API_KEY}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            q: english_description,
            target: 'he',
            format: 'text'
        })
    });
    const data = await response.json();
    return data.data.translations[0].translatedText;
}
