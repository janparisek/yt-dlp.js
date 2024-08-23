import fs from "node:fs/promises";
import { exec } from "node:child_process";
import path from "node:path";
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
async function ensureExecutable(build) {
    // Check if the binary exists
    const binaryExists = await fs
        .access(build)
        .then(() => true)
        .catch(() => false);
    if (binaryExists) {
        return;
    }
    console.log("Binary not found, downloading...");
    // Download the binary
    const url = `https://github.com/yt-dlp/yt-dlp/releases/latest/download/${build}`;
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    const packageDir = path.resolve(__dirname, "./bin");
    await fs.mkdir(packageDir, { recursive: true });
    await fs.writeFile(build, Buffer.from(buffer));
    // Make the binary executable
    if (platform !== "win32") {
        await fs.chmod(build, 0o755);
    }
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
const executablePath = path.resolve(__dirname, "./bin", executableName);
await ensureExecutable(executablePath);
export { update, executablePath };
