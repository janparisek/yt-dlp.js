import { spawn } from "node:child_process";
function download(ytdlp, url) {
    const args = [
        "--hls-use-mpegts",
        "--no-abort-on-error",
        "--format",
        "bestaudio",
        "--no-playlist",
        //"--flat-playlist",
        "--buffer-size",
        "16k",
        //"--quiet", // Deactivated for debugging
        //"--verbose",
        //"--print-traffic",
        "--output",
        "-",
        url,
    ];
    console.debug("Spawning yt-dlp with args:", args);
    const child = spawn(ytdlp, args);
    child.stderr.on("data", (data) => {
        console.error(`${data}`);
    });
    child.on("error", (error) => {
        console.error("Error in openAudio()");
        throw error;
    });
    child.on("close", (code) => {
        console.error(`openAudio() closed with code ${code}`);
    });
    child.on("exit", (code) => {
        console.error(`openAudio() exited with code ${code}`);
    });
    child.on("disconnect", () => {
        console.error("openAudio() disconnected");
    });
    return child.stdout;
}
export default download;
