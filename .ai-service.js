const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function generateStory(theme) {
    const prompt = `Write a short children's story about ${theme}. The story should be suitable for young and have a positive message.`;
    const response = await openai.createCompletion({
        model: "text-davinci-002",
        prompt: prompt,
        max_tokens: 500
    });

    return response.data.choices[0].text.trim();
}

async function generateImages(childId, theme, storyContent) {
    // For MPV, we'll just return placholder image URLs
    // In a real implementation, you would use DALL-E or midjourney API here
    return [
        "https://via.placeholder.com/200x200/007bff/ffffff?text=Image+1",
        "https://via.placeholder.com/200x200/007bff/ffffff?text=Image+2",
        "https://via.placeholder.com/200x200/007bff/ffffff?text=Image+3"
    ];
}

module.exports = { generateStory, generateImages};