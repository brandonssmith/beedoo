const fs = require('fs');
const path = require('path');

// Read environment variables with fallbacks
const APP_NAME = process.env.NAME_VARIABLE || 'Beedoo';
const APP_DESCRIPTION = process.env.DESCRIPTION_VARIABLE || `${APP_NAME} Task Manager - Organize your tasks with subtasks and next steps`;
const APP_THEME_COLOR = process.env.THEME_COLOR_VARIABLE || '#000000';

console.log(`Building with customizations:`);
console.log(`- App Name: ${APP_NAME}`);
console.log(`- Description: ${APP_DESCRIPTION}`);
console.log(`- Theme Color: ${APP_THEME_COLOR}`);

// Try to find the index.html file in the build directory
const buildPath = path.join(__dirname, '..', 'build', 'index.html');

// Check if the build file exists
if (!fs.existsSync(buildPath)) {
  console.error('Error: build/index.html not found. Make sure the React build completed successfully.');
  process.exit(1);
}

// Read the built index.html file
const template = fs.readFileSync(buildPath, 'utf8');

// Replace placeholders with environment variables
const customizedHtml = template
  .replace(/<title>.*?<\/title>/, `<title>${APP_NAME} Task Manager</title>`)
  .replace(/content="[^"]*Beedoo[^"]*"/, `content="${APP_DESCRIPTION}"`)
  .replace(/content="#[0-9a-fA-F]{6}"/, `content="${APP_THEME_COLOR}"`);

// Write the customized index.html back to the build directory
fs.writeFileSync(buildPath, customizedHtml);

console.log('Customized index.html written to build directory'); 