// Call first, because it makes sure the binary is up to date
import { executablePath, update as updateModule } from "./ensureBinary.js";
//
import searchModule from "./search.js";
import downloadModule from "./download.js";
/**
 * Updates the yt-dlp binary to the latest version
 */
function update() {
    const result = updateModule(executablePath);
    return result;
}
/**
 * Returns the first 4 search results from YouTube for the given query
 * @param query The search query
 * @returns {Promise<unknown>} A JSON object containing the search results
 */
function search(query) {
    const result = searchModule(executablePath, query);
    return result;
}
/**
 * Downloads the video or audio from the given URL
 * @param query {string} The URL of the video or audio
 */
function download(url) {
    const result = downloadModule(executablePath, url);
    return result;
}
export { update, download, search };
