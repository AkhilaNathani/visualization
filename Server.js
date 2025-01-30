const express = require('express');
const bodyParser = require('body-parser');
const { OpenAI } = require('openai');
const XLSX = require('xlsx');
const cors = require('cors');
const app = express();
app.use(cors());
const port = 3001;
app.use(bodyParser.json());
const openai = new OpenAI({
  apiKey: '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',  // Replace with your actual OpenAI API key
});
const workbook = XLSX.readFile('course_details.xlsx');
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
const data = XLSX.utils.sheet_to_json(sheet);
async function getAnswer(question, data) {
  try {
    const prompt = `
      Given the following course data:
      ${JSON.stringify(data, null, 2)}

      Answer the question: ${question}
    `;
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: prompt },
      ],
    });
    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error fetching answer from OpenAI:', error);
    return null;
  }
}
app.post('/ask-question', async (req, res) => {
  const { question } = req.body;
  const answer = await getAnswer(question, data);
  if (answer) {
    res.json({ response: answer });
  } else {
    res.status(500).json({ response: 'Unable to fetch answer.' });
  }
});
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
