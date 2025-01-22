
const { keith } = require("../keizzah/keith");
const axios = require("axios");

keith({
  nomCom: "lyrics",
  aliases: ["mistari", "lyric"],
  reaction: '⚔️',
  categorie: "search"
}, async (dest, zk, params) => {
  const { repondre: sendResponse, arg: commandArgs, ms } = params;
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
    const { title, artist, thumb, lyrics } = data;
    const imageUrl = thumb || "https://i.imgur.com/Cgte666.jpeg";

    const formattedMessage = `
      *ALPHA-MD LYRICS FINDER*
      *Title:* ${title}
      *Artist:* ${artist}

      ${lyrics}

      𝐏𝐎𝐖𝐄𝐑𝐄𝐃 𝐁𝐘 𝐀𝐋𝐏𝐇𝐀 𝐌𝐃
      > Regards keithkeizzah`;

    try {
      // Fetch the image
      const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
      const imageBuffer = Buffer.from(imageResponse.data, 'binary');

      // Send the message with the image and lyrics
      await zk.sendMessage(
        dest,
        {
          image: imageBuffer,
          caption: formattedMessage
        },
        { quoted: ms }
      );
    } catch (imageError) {
      console.error('Error fetching or sending image:', imageError);
      // Fallback to sending just the text if image fetch fails
      await sendResponse(formattedMessage);
    }

  } catch (error) {
    console.error(error);  // Log the error for debugging
    sendResponse("An error occurred while fetching the song lyrics. Please try again later.");
  }
});
