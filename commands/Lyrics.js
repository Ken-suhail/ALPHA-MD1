const { keith } = require("../keizzah/keith");
const axios = require("axios");

// Define the command with aliases
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

  // Function to get lyrics data from APIs
  const getLyricsData = async (url) => {
    try {
      const response = await axios.get(url);
      return response.data; // Assuming the API returns { title, artist, lyrics, thumb }
    } catch (error) {
      console.error('Error fetching data from API:', error);
      return null;
    }
  };

  // List of APIs to try
  const apis = [
    `https://api.dreaded.site/api/lyrics?title=${encodeURIComponent(elementQuery)}`,
    `https://some-random-api.com/others/lyrics?title=${encodeURIComponent(elementQuery)}`,
    `https://api.davidcyriltech.my.id/lyrics?title=${encodeURIComponent(elementQuery)}`
  ];

  let lyricsData;
  for (const api of apis) {
    lyricsData = await getLyricsData(api);
    if (lyricsData) break;
  }

  // Check if lyrics data was found
  if (!lyricsData || !lyricsData.lyrics) {
    return sendResponse('Could not find information for the provided song. Please check and try again.');
  }

  const { title, artist, lyrics, thumb } = lyricsData;
  const imageUrl = thumb || "https://files.catbox.moe/6hd2t7.jpg"; // Default image if thumb is missing

  const formattedMessage = `
    *ALPHA-MD LYRICS FINDER*
    *Title:* ${title}
    *Artist:* ${artist}
    
    ${lyrics}
    
    > Regards keithkeizzah`;

  try {
    // Fetch the image (if available)
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const imageBuffer = Buffer.from(response.data, 'binary');

    // Send the message with the image and lyrics
    await zk.sendMessage(
      dest,
      {
        image: imageBuffer,
        caption: formattedMessage
      },
      { quoted: ms }
    );
  } catch (error) {
    console.error('Error fetching or sending image:', error);
    // Fallback to sending just the text if image fetch fails
    await zk.sendMessage(dest, { text: formattedMessage }, { quoted: ms });
  }
});
