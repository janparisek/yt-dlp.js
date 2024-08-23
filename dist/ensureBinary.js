import fs from "node:fs/promises";
import { exec } from "node:child_process";
import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";
const __dirname = dirname(fileURLToPath(import.meta.url));
// Figure out what file to search for
const architecture = process.arch;
const platform = process.platform;
if (architecture !== "x64") {
    throw new Error(`Unsupported architecture: ${architecture}`);
}
function getExecutableName() {
    let build;
    switch (platform) {
        case "win32":
            build = "yt-dlp.exe";
            break;
        case "linux":
            build = "yt-dlp_linux";
            break;
        default:
            throw new Error(`Unsupported platform: ${platform}`);
    }
    return build;
}
async function ensureExecutable(executableName) {
    // Check if the binary exists
    const executableDirectory = path.resolve(__dirname, "../bin");
    const executablePath = path.resolve(executableDirectory, executableName);
    const binaryExists = await fs
        .access(executablePath)
        .then(() => true)
        .catch(() => false);
    if (binaryExists) {
        return executablePath;
    }
    console.log("Binary not found, downloading...");
    // Download the binary
    const url = `https://github.com/yt-dlp/yt-dlp/releases/latest/download/${executableName}`;
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    await fs.mkdir(executableDirectory, { recursive: true });
    await fs.writeFile(executablePath, Buffer.from(buffer));
    // Make the binary executable
    if (platform !== "win32") {
        await fs.chmod(executablePath, 0o755);
    }
    return executablePath;
}
async function update(ytdlp) {
    console.log("Updating yt-dlp...");
    const updateProcess = new Promise((resolve, reject) => {
        exec(`${ytdlp} --update`, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            }
            if (stderr) {
                reject(new Error(stderr));
            }
            resolve(stdout);
        });
    });
    return updateProcess;
}
const executableName = getExecutableName();
const executablePath = await ensureExecutable(executableName);
console.log(executablePath);
export { update, executablePath };
