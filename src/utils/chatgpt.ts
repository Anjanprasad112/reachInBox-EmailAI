
import OpenAI from 'openai';
interface OpenAIResponse {
    choices: { text: string }[];
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateResponse(classification: 'interested' | 'more information'): Promise<string> {
    let prompt = '';
    if (classification === 'interested') {
        prompt = 'Thank you for showing interest in our product/service. How can we assist you further? write a letter consider my name is Anjan Prasad and I am software developer at ReachInbox Company in Bengaluru';
    } else if (classification === 'more information') {
        prompt = 'I understand you need more information. Please let me know what specific details you are looking for.';
    }

    try {
        const response = await openai.completions.create({
            model: 'gpt-3.5-turbo-instruct', 
            prompt,
            max_tokens: 350
        }) as OpenAIResponse;

        if (response.choices.length > 0) {
            return response.choices[0].text.trim();
        } else {
            throw new Error('Empty response from OpenAI');
        }
    } catch (error) {
        console.error('Error generating response from OpenAI:', error);
        throw new Error('Failed to generate response');
    }
}
