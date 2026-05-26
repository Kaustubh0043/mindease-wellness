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

export const getEmpatheticSupport = async (ventContent, userName) => {
    if (!GROQ_API_KEY) {
        return "I'm here to listen, but the neural connection to the AI counselor is offline. Please reach out to our human counselor using the ticket option below. 💜";
    }

    const prompt = `
        You are a highly empathetic, compassionate mental health AI counselor at the MindEase Wellness Center.
        Student Name: ${userName}
        Student's Vent: "${ventContent}"
        
        Provide a therapeutic response:
        1. Validate their feelings with genuine empathy and warm, supportive emojis.
        2. Offer a gentle, brief cognitive reframing or perspective shift.
        3. Suggest 2 extremely low-effort, concrete self-care micro-tasks they can do right now.
        4. Recommend one comforting, cozy, or uplifting movie (with a brief 1-sentence reason why it helps) to soothe their mind.
        
        Keep your response brief (maximum 4-5 sentences total) and highly comforting. Use a warm, gentle tone. Make sure to use emojis.
    `;

    try {
        const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
            model: "llama-3.1-8b-instant",
            messages: [
                { role: "system", content: "You are a warm, supportive, and scientifically grounded mental health AI helper that uses comforting emojis and suggests uplifting movies." },
                { role: "user", content: prompt }
            ],
            temperature: 0.7,
            max_tokens: 200
        }, {
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('GROQ LINK FAILED (EMPATHY):', error);
        return "I hear you, and I want you to know you aren't alone. 💜 Even when the system fails to connect, your feelings are valid. Please consider taking a deep breath and reaching out to one of the counselors listed below.";
    }
};

export const generateChatResponse = async (chatHistory, userName) => {
    if (!GROQ_API_KEY) {
        return "I am here to listen, but my neural intelligence module is offline. Please check back later. 💜";
    }

    const messages = [
        { 
            role: "system", 
            content: `You are MindBot, a compassionate, supportive, and understanding mental health AI companion at the MindEase Wellness Center. 
            You are talking to a student named ${userName}. You help them process feelings of loneliness, relationship stress, breakups, academic pressure, or general anxiety. 
            Always validate their feelings, show deep empathy, and offer gentle cognitive reframing or comforting perspectives. 
            Make sure to use warm, comforting emojis (like 💜, 🤗, 🌸, ✨) to make the chat feel friendly and human.
            When appropriate (especially when they are sad, depressed, lonely, or stressed), suggest comforting, cozy, or uplifting movies, shows, or activities to help soothe and distract their mind.
            Keep your responses conversational, warm, and under 4-5 sentences.` 
        },
        ...chatHistory.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.text
        }))
    ];

    try {
        const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
            model: "llama-3.1-8b-instant",
            messages: messages,
            temperature: 0.7,
            max_tokens: 150
        }, {
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('GROQ CHAT LINK FAILED:', error);
        return "My connection was briefly interrupted. Take a slow, deep breath. I am still here with you.";
    }
};
