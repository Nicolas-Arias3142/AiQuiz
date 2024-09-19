const express = require('express');
const serverless = require("serverless-http");
const OpenAI = require('openai'); 
const dotenv = require('dotenv');
const cors = require('cors');

const corsOptions = {
    origin: 'http://192.168.2.11:8080', // Replace with your frontend URL
    methods: ['GET', 'POST'], // Specify allowed methods
    allowedHeaders: ['Content-Type'], // Specify allowed headers
};

dotenv.config();

const app = express();
const port = 8080;
const apiKey = process.env.OPENAI_API_KEY;

// Proper initialization of OpenAI API
const openai = new OpenAI({
    apiKey: apiKey,
});

// Middleware to parse JSON bodies
app.use(express.json());
// Middleware to handle CORS
app.use(cors());
// Middleware to serve static files (CSS, images, etc.) from the public directory
app.use(express.static('public'));

app.post('/generate-quiz', async (req, res) => {
    const { messages } = req.body;

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: messages,
            temperature: 0.7,
            max_tokens: 200,
            frequency_penalty: 1.0
        });

        let quiz_response = completion.choices[0].message.content;
        const quiz_lines = quiz_response.split('\n');

        res.json({ quiz: quiz_lines });
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get("/hello", (req,res) => {
    res.send("Hello World!");
})

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

module.exports.handler = serverless(app); 