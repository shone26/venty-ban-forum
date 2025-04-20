// build-css.js
const { execSync } = require('child_process');
const fs = require('fs');

// Ensure the input file exists
const inputPath = './src/assets/styles/tailwind-input.css';
if (!fs.existsSync(inputPath)) {
  fs.writeFileSync(inputPath, `
@tailwind base;
@tailwind components;
@tailwind utilities;
  `);
  console.log(`Created ${inputPath}`);
}

// Run Tailwind CLI
try {
  console.log('Building CSS with Tailwind...');
  execSync(`npx tailwindcss -i ${inputPath} -o ./src/assets/styles/tailwind-output.css`);
  console.log('CSS build completed successfully!');
} catch (error) {
  console.error('Error building CSS:', error.message);
  process.exit(1);
}