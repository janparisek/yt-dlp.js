import { spawn } from "node:child_process";
function parseSearchOutput(chunks) {
    const output = Buffer.concat(chunks).toString("utf-8");
    const lines = output.split("\n");
    const results = lines
        .map((line) => {
        try {
            return JSON.parse(line);
        }
        catch {
            return null;
        }
    })
        .filter((json) => json !== null);
    return results;
}
async function search(ytdlp, query) {
    const args = [
        "--format",
        "bestaudio",
        "--default-search",
        "ytsearch4",
        "--dump-json",
        "--no-playlist",
        //"--flat-playlist",
        "--skip-download",
        "--quiet",
        query,
    ];
    const child = spawn(ytdlp, args);
    const chunks = [];
    child.stdout.on("data", (chunk) => {
        chunks.push(chunk);
    });
    child.stderr.on("data", (data) => {
        console.debug("!");
        console.error(`${data}`);
    });
    const searchProcess = new Promise((resolve, reject) => {
        child.on("error", (err) => {
            console.debug("Error in search process");
            reject(err);
        });
        child.on("close", (code) => {
            console.debug("Search process closed");
            if (code !== 0) {
                reject(new Error(`Search process exited with code ${code}`));
            }
            const json = parseSearchOutput(chunks);
            resolve(json);
        });
    });
    return searchProcess;
}
export default search;
