import { update as updateModule } from "./ensureBinary.js";
import searchModule from "./search.js";
import downloadModule from "./download.js";
/**
 * Updates the yt-dlp binary to the latest version
 */
declare function update(): ReturnType<typeof updateModule>;
/**
 * Returns the first 4 search results from YouTube for the given query
 * @param query The search query
 * @returns {Promise<unknown>} A JSON object containing the search results
 */
declare function search(query: string): ReturnType<typeof searchModule>;
/**
 * Downloads the video or audio from the given URL
 * @param query {string} The URL of the video or audio
 */
declare function download(url: string): ReturnType<typeof downloadModule>;
export { update, download, search };
