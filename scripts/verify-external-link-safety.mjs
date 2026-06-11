import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const appDir = join(root, "app");
const pageFile = join(appDir, "page.tsx");

function collectTsxFiles(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    const stats = statSync(path);

    if (stats.isDirectory()) {
      return collectTsxFiles(path);
    }

    return path.endsWith(".tsx") ? [path] : [];
  });
}

function lineNumberForOffset(source, offset) {
  return source.slice(0, offset).split(/\r?\n/).length;
}

const failures = [];

for (const file of collectTsxFiles(appDir)) {
  const source = readFileSync(file, "utf8");
  const targetBlankPattern = /<[A-Za-z][\w.:-]*\b(?=[^>]*\btarget=["']_blank["'])[^>]*>/g;

  for (const match of source.matchAll(targetBlankPattern)) {
    const tag = match[0];
    const relMatch = tag.match(/rel=["']([^"']*)["']/);
    const relTokens = new Set(relMatch?.[1].split(/\s+/).filter(Boolean) ?? []);

    if (!relTokens.has("noopener") || !relTokens.has("noreferrer")) {
      failures.push(
        `${file}:${lineNumberForOffset(source, match.index ?? 0)} target="_blank" must include rel="noopener noreferrer".`
      );
    }
  }
}

const pageSource = readFileSync(pageFile, "utf8");

if (!pageSource.includes("\u5916\u90e8\u30b5\u30a4\u30c8\u3078\u79fb\u52d5\u3057\u307e\u3059")) {
  failures.push(`${pageFile}: missing external navigation confirmation text.`);
}

if (!pageSource.includes("setIsExternalLinkConfirmOpen(true)")) {
  failures.push(`${pageFile}: missing external navigation confirmation state transition.`);
}

if (!pageSource.includes('type="button"')) {
  failures.push(`${pageFile}: initial external link control should be a button before confirmation.`);
}

if (!pageSource.includes("aria-expanded={isExternalLinkConfirmOpen}")) {
  failures.push(`${pageFile}: external link confirmation button must expose aria-expanded.`);
}

if (!pageSource.includes("aria-controls={externalLinkConfirmId}")) {
  failures.push(`${pageFile}: external link confirmation button must expose aria-controls.`);
}

if (!pageSource.includes("id={externalLinkConfirmId}")) {
  failures.push(`${pageFile}: external link confirmation UI must have the controlled id.`);
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("External link safety checks passed.");
