const { keith } = require("../keizzah/keith");
const axios = require('axios');
const ytSearch = require('yt-search');
const { downloadMusic } = require('./scraper'); // Import the scraper code

// Define the command with aliases
keith({
  nomCom: "play",
  aliases: ["song", "ytmp3", "audio", "mp3"],
  categorie: "Search",
  reaction: "🎥"
}, async (dest, zk, commandOptions) => {
  const { arg, ms, repondre } = commandOptions;

  // Check if a query is provided
  if (!arg[0]) {
    return repondre("Please provide a song name or search term.");
  }

  const query = arg.join(" ");

  try {
    // Perform a YouTube search based on the query
    const searchResults = await ytSearch(query);

    // Check if any videos were found
    if (!searchResults || !searchResults.videos.length) {
      return repondre('No videos found for the specified query.');
    }

    const firstVideo = searchResults.videos[0];
    const videoUrl = firstVideo.url;

    // Use the scraper to get the audio download URL
    const audioUrl = await downloadMusic(videoUrl, 'mp3'); // You can change the format to 'mp3', 'ogg', etc.

    // Check if we got a valid audio URL
    if (!audioUrl || audioUrl.error) {
      return repondre('Failed to retrieve audio. Please try again later.');
    }

    // Prepare the message payload with external ad details
    const messagePayload = {
      audio: { url: audioUrl },
      mimetype: 'audio/mp3',  // Specify the format you want
      contextInfo: {
        externalAdReply: {
          title: firstVideo.title,
          body: firstVideo.title,
          mediaType: 1,
          sourceUrl: videoUrl,
          thumbnailUrl: firstVideo.thumbnail,
          renderLargerThumbnail: false,
          showAdAttribution: true,
        },
      },
    };

    // Send the audio message to the user
    await zk.sendMessage(dest, messagePayload, { quoted: ms });

  } catch (error) {
    console.error('Error during download or message process:', error);
    return repondre(`An error occurred: ${error.message || error}`);
  }
});
