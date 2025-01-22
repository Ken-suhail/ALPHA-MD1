const { keith } = require("../keizzah/keith");
const ai = require('unlimited-ai');

keith({
  nomCom: "gpt",
  aliases: ["gpt4", "ai"],
  reaction: '⚔️',
  categorie: "search"
}, async (context, message, params) => {
  const { repondre, arg } = params;  
  const alpha = arg.join(" ").trim(); // Assuming args is an array of command parts

  if (!alpha) {
    return repondre("Please provide a song name.");
  }

  const text = alpha;  // Text for the AI prompt

  try {
    const model = 'gpt-4-turbo-2024-04-09'; 

    const messages = [
      { role: 'user', content: text },
      { role: 'system', content: 'You are an assistant in WhatsApp. You are called Keith. You respond to user commands.' }
    ];

    const response = await ai.generate(model, messages);
    await repondre(response);  // Send the response back to the user
  } catch (error) {
    console.error("Error generating AI response:", error);
    await repondre("Sorry, I couldn't process your request.");
  }
});

keith({
  nomCom: "gemini",
  aliases: ["gpto4", "gemni", "gpt2", "gpt3"],
  reaction: '⚔️',
  categorie: "search"
}, async (context, message, params) => {
  const { repondre, arg } = params;
  const elementQuery = arg.join(" ").trim(); // Capture the user query

  if (!elementQuery) {
    return repondre("Please provide a song name.");
  }

  try {
    // Dynamically import Gemini AI
    const { default: Gemini } = await import('gemini-ai');
    const gemini = new Gemini("AIzaSyC6Peevj4eFOI2WrAyFQlGgqYTXIetPrbc");

    const chat = gemini.createChat();
    const res = await chat.ask(elementQuery);

    await repondre(res); // Send response back to the user
  } catch (e) {
    console.error("Error with Gemini AI:", e);
    await repondre("I am unable to generate responses. Please try again later.");
  }
});
