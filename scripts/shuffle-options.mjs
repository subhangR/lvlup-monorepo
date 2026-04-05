/**
 * Shuffle MCQ/MCAQ options in seed config files so correct answers
 * are not always at index 0.
 *
 * Uses a seeded PRNG (mulberry32) for reproducibility.
 * Fisher-Yates shuffle for uniform distribution.
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

// Seeded PRNG — mulberry32
function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Simple string hash for seeding
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  return hash;
}

// Fisher-Yates shuffle with seeded random
function shuffle(arr, rng) {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

const ID_LETTERS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

function processFile(filePath) {
  const content = readFileSync(filePath, 'utf-8');
  const fileName = filePath.split('/').pop();

  // Match each options block: "options: [\n  { ... },\n  ...\n]"
  // We need to find balanced brackets after "options: ["
  let result = content;
  let questionIndex = 0;
  let totalShuffled = 0;

  // Find all "options: [" positions
  const optionsRegex = /options:\s*\[/g;
  let match;
  const positions = [];

  while ((match = optionsRegex.exec(content)) !== null) {
    positions.push(match.index);
  }

  // Process in reverse order so replacements don't shift positions
  for (let pi = positions.length - 1; pi >= 0; pi--) {
    const startPos = positions[pi];
    // Find the opening bracket
    const bracketStart = content.indexOf('[', startPos);

    // Find matching closing bracket
    let depth = 0;
    let bracketEnd = -1;
    for (let i = bracketStart; i < content.length; i++) {
      if (content[i] === '[') depth++;
      if (content[i] === ']') {
        depth--;
        if (depth === 0) {
          bracketEnd = i;
          break;
        }
      }
    }

    if (bracketEnd === -1) continue;

    const optionsBlock = result.substring(bracketStart, bracketEnd + 1);

    // Parse individual option objects within this block
    // Each option looks like: { id: '...', text: '...', isCorrect: true/false }
    // or could have text spanning multiple lines
    const optionObjects = [];
    let objDepth = 0;
    let objStart = -1;

    for (let i = 1; i < optionsBlock.length - 1; i++) {
      if (optionsBlock[i] === '{') {
        if (objDepth === 0) objStart = i;
        objDepth++;
      }
      if (optionsBlock[i] === '}') {
        objDepth--;
        if (objDepth === 0 && objStart !== -1) {
          optionObjects.push(optionsBlock.substring(objStart, i + 1));
          objStart = -1;
        }
      }
    }

    if (optionObjects.length < 2) continue;

    // Create a seed from filename + reverse position index for this question
    const seed = hashString(`${fileName}-q${pi}-shuffle`);
    const rng = mulberry32(seed);

    // Shuffle the option objects
    const shuffled = shuffle(optionObjects, rng);

    // Check if shuffled order is different from original (for stats)
    const changed = shuffled.some((s, i) => s !== optionObjects[i]);

    // Reassign IDs in shuffled options
    const reassigned = shuffled.map((opt, idx) => {
      const newId = ID_LETTERS[idx];
      // Replace the id field value
      return opt.replace(/id:\s*'[a-h]'/, `id: '${newId}'`);
    });

    // Reconstruct the options block
    // Detect indentation from the first option
    const indentMatch = optionsBlock.match(/\[\s*\n(\s+)\{/);
    const indent = indentMatch ? indentMatch[1] : '            ';

    const newOptionsBlock = '[\n' + reassigned.map(o => indent + o.trim()).join(',\n') + ',\n' + indent.slice(0, -2) + ']';

    result = result.substring(0, bracketStart) + newOptionsBlock + result.substring(bracketEnd + 1);
    totalShuffled++;
  }

  if (totalShuffled > 0) {
    writeFileSync(filePath, result, 'utf-8');
  }

  return totalShuffled;
}

// Process all HLD files
const hldDir = join(process.cwd(), 'scripts/seed-configs/hi-hld');
const files = readdirSync(hldDir).filter(f => f.endsWith('-content.ts'));

let totalFiles = 0;
let totalQuestions = 0;

for (const file of files) {
  const filePath = join(hldDir, file);
  const count = processFile(filePath);
  if (count > 0) {
    console.log(`✓ ${file}: ${count} questions shuffled`);
    totalFiles++;
    totalQuestions += count;
  } else {
    console.log(`⚠ ${file}: no options found`);
  }
}

console.log(`\nDone: ${totalQuestions} questions shuffled across ${totalFiles} files`);
