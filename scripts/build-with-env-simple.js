const fs = require('fs');
const path = require('path');

console.log('🔧 Starting build customization script...');

// Read environment variables with fallbacks
const APP_NAME = process.env.NAME_VARIABLE || 'Beedoo';
const APP_DESCRIPTION = process.env.DESCRIPTION_VARIABLE || `${APP_NAME} Task Manager - Organize your tasks with subtasks and next steps`;
const APP_THEME_COLOR = process.env.THEME_COLOR_VARIABLE || '#000000';

console.log(`📝 Building with customizations:`);
console.log(`   - App Name: ${APP_NAME}`);
console.log(`   - Description: ${APP_DESCRIPTION}`);
console.log(`   - Theme Color: ${APP_THEME_COLOR}`);

// Path to the built index.html
const buildPath = path.join(__dirname, '..', 'build', 'index.html');

try {
  console.log(`🔍 Looking for build file at: ${buildPath}`);
  
  // Check if build file exists
  if (!fs.existsSync(buildPath)) {
    console.error('❌ Error: build/index.html not found.');
    console.error('   This usually means the React build failed before our script ran.');
    console.error('   Please check the React build logs above for errors.');
    process.exit(1);
  }

  console.log('✅ Found build/index.html file');

  // Read the current build file
  let html = fs.readFileSync(buildPath, 'utf8');
  console.log(`📄 Read ${html.length} characters from index.html`);
  
  // Apply customizations
  const originalTitle = html.match(/<title>.*?<\/title>/)?.[0] || 'No title found';
  const originalDescription = html.match(/content="[^"]*Beedoo[^"]*"/)?.[0] || 'No description found';
  const originalThemeColor = html.match(/content="#[0-9a-fA-F]{6}"/)?.[0] || 'No theme color found';
  
  console.log(`🔄 Original title: ${originalTitle}`);
  console.log(`🔄 Original description: ${originalDescription}`);
  console.log(`🔄 Original theme color: ${originalThemeColor}`);
  
  html = html.replace(/<title>.*?<\/title>/, `<title>${APP_NAME} Task Manager</title>`);
  html = html.replace(/content="[^"]*Beedoo[^"]*"/, `content="${APP_DESCRIPTION}"`);
  html = html.replace(/content="#[0-9a-fA-F]{6}"/, `content="${APP_THEME_COLOR}"`);
  
  // Write back the customized version
  fs.writeFileSync(buildPath, html);
  
  console.log('✅ Successfully customized index.html');
  console.log(`📝 New title: <title>${APP_NAME} Task Manager</title>`);
  console.log(`📝 New description: content="${APP_DESCRIPTION}"`);
  console.log(`📝 New theme color: content="${APP_THEME_COLOR}"`);
  
} catch (error) {
  console.error('❌ Error during customization:', error.message);
  console.error('   Stack trace:', error.stack);
  process.exit(1);
} 