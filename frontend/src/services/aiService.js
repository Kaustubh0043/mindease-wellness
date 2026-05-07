import axios from 'axios';

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

export const generateNeuralRevelation = async (baselines, userName) => {
    if (!GROQ_API_KEY) {
        return "GROQ CALIBRATION REQUIRED: Please provide a valid Groq API key in your .env file.";
    }

    const prompt = `
        You are the MindEase Institutional AI. 
        User: ${userName}
        Mental Energy: ${baselines.energy}%
        Mood Stability: ${baselines.stability}
        
        Provide a 2-sentence "Neural Revelation" for their dashboard. 
        Focus on their current frequency and provide one piece of elite, data-driven advice.
        Tone: Professional, supportive, institutional. No emojis.
    `;

    try {
        const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
            model: "llama-3.1-8b-instant",
            messages: [
                { role: "system", content: "You are a sophisticated mental health AI." },
                { role: "user", content: prompt }
            ],
            temperature: 0.7,
            max_tokens: 100
        }, {
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('GROQ LINK FAILED (STR):', JSON.stringify(error.response?.data || error.message, null, 2));
        return "NEURAL LINK INTERRUPTED: Unable to reach the Groq intelligence grid.";
    }
};
