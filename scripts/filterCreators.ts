import fs from "fs";
import path from "path";

// 🔥 Hardcoded niche
const NICHE = "Fitness";

// ----- 1. Load creators.json -----
const inputPath = path.join(process.cwd(), "src", "data", "creators.json");
const raw = fs.readFileSync(inputPath, "utf-8");
const creators = JSON.parse(raw);

// ----- 2. Filter creators -----
const filtered = creators.filter((c: any) =>
  c.niche?.toLowerCase().includes(NICHE.toLowerCase())
);

// ----- 3. Save to /src/data/output/<niche>.json -----
const outputDir = path.join(process.cwd(), "src", "data", "output");
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

const outputPath = path.join(outputDir, `${NICHE}.json`);
fs.writeFileSync(outputPath, JSON.stringify(filtered, null, 2), "utf-8");

console.log(`Filtered ${filtered.length} creators → ${outputPath}`);
