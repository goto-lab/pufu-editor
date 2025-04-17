import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE_TITLE = "プ譜エディター | Storybook";

const filePath = path.join(__dirname, "../storybook-static/index.html");

fs.readFile(filePath, "utf8", (err, data) => {
  if (err) {
    console.error("Error reading the HTML file:", err);
    return;
  }
  const updatedData = data.replace(
    /<title>.*<\/title>/,
    `<title>${SITE_TITLE}</title>`
  );

  fs.writeFile(filePath, updatedData, "utf8", (writeErr) => {
    if (writeErr) {
      console.error("Error writing the updated HTML file:", writeErr);
      return;
    }
    console.log("Title updated successfully.");
  });
});
