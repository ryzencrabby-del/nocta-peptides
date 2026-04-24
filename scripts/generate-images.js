#!/usr/bin/env node
// generate-images.js
// Generates dark cinematic product images via DALL-E 3 and saves to public/images/products/
// Usage: OPENAI_API_KEY=sk-... node scripts/generate-images.js

import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  console.error('Error: OPENAI_API_KEY environment variable is required.');
  console.error('Usage: OPENAI_API_KEY=sk-... node scripts/generate-images.js');
  process.exit(1);
}

const client = new OpenAI({ apiKey });

const OUTPUT_DIR = path.join(__dirname, '../public/images/products');

// Products to generate — filename matches product id from products.ts
const PRODUCTS = [
  { id: 'bpc-157',        name: 'BPC-157' },
  { id: 'tb-500',         name: 'TB-500' },
  { id: 'ghk-cu',         name: 'GHK-Cu' },
  { id: 'retatrutide',    name: 'Retatrutide' },
  { id: 'tesamorlin',     name: 'Tesamorelin' },
  { id: 'ghk-cu-50mg',    name: 'GHK-Cu 50mg' },
  { id: 'glow-blend',     name: 'GLOW Blend' },
  { id: 'klow-blend',     name: 'KLOW Blend' },
];

function buildPrompt(productName) {
  return `dark cinematic product photo of a glass vial labeled '${productName}' on a black surface, electric blue glow emanating from liquid, luxury pharmaceutical aesthetic, dark background, premium supplement brand, 4k`;
}

function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, response => {
      response.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', err => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function generateImage(product) {
  const prompt = buildPrompt(product.name);
  console.log(`\n[${product.id}] Generating: "${product.name}"...`);

  const response = await client.images.generate({
    model: 'dall-e-3',
    prompt,
    n: 1,
    size: '1024x1024',
    quality: 'hd',
    style: 'vivid',
  });

  const imageUrl = response.data[0].url;
  const destPath = path.join(OUTPUT_DIR, `${product.id}.png`);

  console.log(`[${product.id}] Downloading...`);
  await downloadImage(imageUrl, destPath);
  console.log(`[${product.id}] Saved to public/images/products/${product.id}.png`);

  return destPath;
}

async function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  console.log(`Generating ${PRODUCTS.length} product images with DALL-E 3...`);
  console.log(`Output: ${OUTPUT_DIR}\n`);

  const results = [];

  for (const product of PRODUCTS) {
    try {
      const filePath = await generateImage(product);
      results.push({ id: product.id, status: 'ok', file: filePath });
      // Brief pause between requests to respect rate limits
      await new Promise(r => setTimeout(r, 1000));
    } catch (err) {
      console.error(`[${product.id}] Failed: ${err.message}`);
      results.push({ id: product.id, status: 'error', error: err.message });
    }
  }

  console.log('\n── Summary ──────────────────────────────');
  results.forEach(r => {
    const icon = r.status === 'ok' ? '✓' : '✗';
    console.log(`${icon} ${r.id}: ${r.status === 'ok' ? r.file : r.error}`);
  });

  const failed = results.filter(r => r.status === 'error').length;
  console.log(`\n${results.length - failed}/${results.length} images generated successfully.`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
