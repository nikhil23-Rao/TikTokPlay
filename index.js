// Packages required to webscrape the TikTok video url and return proper metadata
const axios = require("axios");
const cheerio = require("cheerio");

// Function to call; Takes TikTok video url and returns proper metadata; NOTE: ONLY WORKS WITH VIDEO URL
async function getTikTokVideoData(url) {
  // Object to store the metadata
  let metaData;

  // Get the HTML from TikTok page
  const response = await axios.get(url, {
    headers: {
      // Device that TikTok allows to scrape; NOTE: DO NOT CHANGE
      "User-Agent":
        "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Mobile Safari/537.36",
    },
  });

  // Get HTML from response
  const html = response.data;

  // Load Cheerio to know what to scrape off of TikTok
  const $ = cheerio.load(html);

  // IMPORTANT: Specific element to get the metadata; NOTE: DO NOT CHANGE
  const scraped = $("#__NEXT_DATA__");

  // Get the stats metadata (likes, comments, etc.) that we need, and store it in "stats" object
  const stats = JSON.parse(scraped.get()[0].children[0].data).props.pageProps
    .itemInfo.itemStruct.stats;

  // Get basic author information for metadata
  const author = JSON.parse(scraped.get()[0].children[0].data).props.pageProps
    .itemInfo.itemStruct.author;

  // Get the title for metadata
  let title = JSON.parse(
    scraped.get()[0].children[0].data
  ).props.pageProps.seoProps.metaParams.description.split("): ")[1];

  // If the above format doesn't apply to the video format, use new format
  if (typeof title === "undefined")
    title = JSON.parse(
      scraped.get()[0].children[0].data
    ).props.pageProps.seoProps.metaParams.description.split("). ")[1];

  // Rename the properties of the TikTok metadata to match application and assign to metadata object
  metaData = {
    views: stats.playCount,
    shares: stats.shareCount,
    comments: stats.commentCount,
    likes: stats.diggCount,
    realName: author.nickname,
    username: author.uniqueId,
    videoTitle: title,
  };

  // Return the final result
  return metaData;
}

// Example call using video link
getTikTokVideoData(
  "https://www.tiktok.com/@lilcheesey/video/7024930237809052933?is_copy_url=1&is_from_webapp=v1"
).then((res) => console.log(res));
