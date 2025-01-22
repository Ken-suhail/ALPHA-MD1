const { keith } = require("../keizzah/keith");
const { default: axios } = require("axios");

keith({
  nomCom: "lyrics",
  aliases: ["mistari", "lyric"],
  reaction: '⚔️',
  categorie: "search"
}, async (context, message, params) => {
  const { repondre: sendResponse, arg: commandArgs } = params;
  const elementQuery = commandArgs.join(" ").trim();

  if (!elementQuery) {
    return sendResponse("Please provide a song name.");
  }

  try {
    const response = await axios.get(`https://some-random-api.com/others/lyrics?query=${encodeURIComponent(elementQuery)}`);
    
    if (!response.data) {
      return sendResponse("Could not find information for the provided song. Please check and try again.");
    }

    const data = response.data;
    const formattedMessage = `
           *ALPHA-MD LYRICS FINDER*
 *Title* ${data.title}
*Artist* ${data.artist}

${data.lyrics}


> Regards keithkeizzah`;

    await sendResponse(formattedMessage);

  } catch (error) {
    console.error(error);  // Log the error for debugging
    sendResponse("An error occurred while fetching the song lyrics. Please try again later.");
  }
});
