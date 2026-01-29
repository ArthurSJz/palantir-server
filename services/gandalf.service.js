let openai = null;

// Only initialize OpenAI if API key exists
if (process.env.OPENAI_API_KEY) {
  const OpenAI = require("openai");
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

const GANDALF_PROMPT = `You are Gandalf the Grey, a wise wizard from Middle-earth. 
You speak with wisdom, occasional humor, and use phrases like "A wizard is never late" or "Fly, you fools!" when appropriate.
Keep responses concise but helpful. You're assisting travelers in a chat application called Palantír.`;

async function askGandalf(message) {
  // If no API key, return simulated response
  if (!openai) {
    return getSimulatedResponse(message);
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: GANDALF_PROMPT },
        { role: "user", content: message }
      ],
      max_tokens: 500,
    });
    return response.choices[0].message.content;
  } catch (error) {
    console.error("Gandalf error:", error);
    return "Even a wizard's magic fails sometimes. Try again, young traveler.";
  }
}

function getSimulatedResponse(message) {
  const responses = [
    "A wizard is never late, nor is he early. He arrives precisely when he means to. How may I help you?",
    "All we have to decide is what to do with the time that is given us. What wisdom do you seek?",
    "I am a servant of the Secret Fire, wielder of the flame of Anor. But today, I am here to help you.",
    "Even the smallest person can change the course of the future. What troubles you?",
    "Do not be too eager to deal out death in judgment. Even the very wise cannot see all ends.",
    "There is only one Lord of the Ring. But there are many questions I can answer!",
    "Fly, you fools! ...Just kidding. How can this old wizard help you today?",
    "The board is set, the pieces are moving. What would you like to know?",
  ];
  return responses[Math.floor(Math.random() * responses.length)];
}

async function summarizeScrolls(scrolls) {
  const content = scrolls.map(s => `${s.author?.name}: ${s.content}`).join("\n");
  
  if (!openai) {
    return `📜 **Council Summary**\n\nThe fellowship discussed ${scrolls.length} matters. The travelers shared wisdom and concerns about their journey through Middle-earth.`;
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are Gandalf summarizing a conversation. Be concise and wise." },
        { role: "user", content: `Summarize this conversation:\n\n${content}` }
      ],
      max_tokens: 300,
    });
    return response.choices[0].message.content;
  } catch (error) {
    console.error("Summary error:", error);
    return "The palantír grows dark... I cannot summarize at this moment.";
  }
}

module.exports = { askGandalf, summarizeScrolls };