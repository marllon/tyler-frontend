import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const patterns = [
  /\/\* ={2,} \*\//g,
  /\/\/ ={2,}/g,
  /\/\*\*\s*\*\s*[\w\s]+\s*\*\//g,
  /\/\*\*[\s\S]*?\*\//g,
  /^\s*\/\/.*$/gm,
  /^\s*\/\*.*?\*\//gm,
];

function cleanComments(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  
  for (const pattern of patterns) {
    content = content.replace(pattern, '');
  }
  
  content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
  content = content.trim() + '\n';
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Cleaned: ${filePath}`);
  }
}

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.includes('node_modules') && !file.startsWith('.')) {
      processDirectory(filePath);
    } else if (file.endsWith('.ts') || file.endsWith('.vue') || file.endsWith('.js')) {
      cleanComments(filePath);
    }
  }
}

console.log('🧹 Cleaning comments from code files...');
processDirectory(path.join(__dirname, '../src'));
console.log('✨ Done!');