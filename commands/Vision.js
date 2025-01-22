
const { keith } = require("../keizzah/keith");
const { uploadtoimgur } = require("../keizzah/Imgur"); 
const { GoogleGenerativeAI } = require("@google/generative-ai");
const axios = require("axios");

keith({
  nomCom: "vision",
  aliases: ["analize", "generate"],
  reaction: '⚔️',
  categorie: "search"
}, async (dest, zk, commandeOptions) => {
  const { repondre, msgRepondu, auteurMessage, arg } = commandeOptions;
  const text = arg.join(" ").trim(); 

  if (msgRepondu) {
    console.log(msgRepondu);

    if (msgRepondu.imageMessage) {
      try {
        if (!text) {
          return repondre("Please provide an instruction with the image.");
        }

        await repondre("_A moment, alpha md is analyzing contents of the image..._");

        // Download and save the image
        const fdr = await zk.downloadAndSaveMediaMessage(msgRepondu.imageMessage);

        const fta = await uploadtoimgur(fdr);
        
  const genAI = new GoogleGenerativeAI("AIzaSyDKJa3gs_VDb0r6uGq9Mx7iaQdlqrTtEck");

        // Function to convert URL to generative part
        async function urlToGenerativePart(url, mimeType) {
          const response = await axios.get(url, { responseType: 'arraybuffer' });
          const data = Buffer.from(response.data).toString('base64');

          return { inlineData: { data, mimeType } };
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const imageUrl = fta;
        const image = [await urlToGenerativePart(imageUrl, 'image/jpeg')];

        const result = await model.generateContent([text, ...image]);
        const response = await result.response;
        const resp = response.text();

        await repondre(resp);
      } catch (e) {
        
        repondre("I am unable to analyze images at the moment. Error: " + e.message);
      }
    } else {

      return repondre("Please provide an image to analyze.");
    }
  } else {

    return repondre("No image message received. Please send an image.");
  }
});
