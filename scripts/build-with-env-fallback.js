const fs = require('fs');
const path = require('path');

console.log('🔧 Starting build customization script (fallback mode)...');

// Read environment variables with fallbacks
const APP_NAME = process.env.NAME_VARIABLE || 'Beedoo';
const APP_DESCRIPTION = process.env.DESCRIPTION_VARIABLE || `${APP_NAME} Task Manager - Organize your tasks with subtasks and next steps`;
const APP_THEME_COLOR = process.env.THEME_COLOR_VARIABLE || '#000000';

// Set React environment variables (these need to be available during build time)
process.env.REACT_APP_NAME_VARIABLE = APP_NAME;
process.env.REACT_APP_DESCRIPTION_VARIABLE = APP_DESCRIPTION;
process.env.REACT_APP_THEME_COLOR_VARIABLE = APP_THEME_COLOR;

console.log(`📝 Environment variables:`);
console.log(`   - NAME_VARIABLE: ${process.env.NAME_VARIABLE || 'NOT SET (using default: Beedoo)'}`);
console.log(`   - DESCRIPTION_VARIABLE: ${process.env.DESCRIPTION_VARIABLE || 'NOT SET (using default)'}`);
console.log(`   - THEME_COLOR_VARIABLE: ${process.env.THEME_COLOR_VARIABLE || 'NOT SET (using default: #000000)'}`);

console.log(`📝 Building with customizations:`);
console.log(`   - App Name: ${APP_NAME}`);
console.log(`   - Description: ${APP_DESCRIPTION}`);
console.log(`   - Theme Color: ${APP_THEME_COLOR}`);

// Path to the built index.html
const buildPath = path.join(__dirname, '..', 'build', 'index.html');

// Check if build file exists
if (!fs.existsSync(buildPath)) {
  console.warn('⚠️  Warning: build/index.html not found.');
  console.warn('   The React build may have failed or the file is in a different location.');
  console.warn('   Build will continue without customization.');
  process.exit(0); // Exit successfully to not break the build
}

try {
  console.log('✅ Found build/index.html file');

  // Read the current build file
  let html = fs.readFileSync(buildPath, 'utf8');
  console.log(`📄 Read ${html.length} characters from index.html`);
  
  // Apply customizations with more robust patterns for minified HTML
  const originalTitle = html.match(/<title>.*?<\/title>/)?.[0] || 'No title found';
  const originalDescription = html.match(/content="[^"]*Beedoo[^"]*"/)?.[0] || 'No description found';
  const originalThemeColor = html.match(/content="#[0-9a-fA-F]{6}"/)?.[0] || 'No theme color found';
  
  console.log(`🔄 Original title: ${originalTitle}`);
  console.log(`🔄 Original description: ${originalDescription}`);
  console.log(`🔄 Original theme color: ${originalThemeColor}`);
  
  // More specific replacements for minified HTML
  html = html.replace(/<title>Beedoo Task Manager<\/title>/, `<title>${APP_NAME} Task Manager</title>`);
  html = html.replace(/content="Beedoo Task Manager - Organize your tasks with subtasks and next steps"/, `content="${APP_DESCRIPTION}"`);
  html = html.replace(/content="#000000"/, `content="${APP_THEME_COLOR}"`);
  
  // Write back the customized version
  fs.writeFileSync(buildPath, html);
  
  // Also customize the JavaScript bundle to replace "Beedoo Manager" in the React component
  const jsDir = path.join(__dirname, '..', 'build', 'static', 'js');
  console.log(`🔍 Looking for JavaScript files in: ${jsDir}`);
  
  if (fs.existsSync(jsDir)) {
    const jsFiles = fs.readdirSync(jsDir).filter(file => file.endsWith('.js'));
    console.log(`📁 Found ${jsFiles.length} JavaScript files: ${jsFiles.join(', ')}`);
    
    for (const jsFile of jsFiles) {
      const jsPath = path.join(jsDir, jsFile);
      let jsContent = fs.readFileSync(jsPath, 'utf8');
      
      // Replace "Beedoo Manager" with the custom app name
      const originalJsContent = jsContent;
      const searchPattern = /"Beedoo Manager"/g;
      const replacement = `"${APP_NAME} Manager"`;
      
      console.log(`🔍 Searching for "Beedoo Manager" in ${jsFile}...`);
      const matches = jsContent.match(searchPattern);
      console.log(`📊 Found ${matches ? matches.length : 0} matches`);
      
      jsContent = jsContent.replace(searchPattern, replacement);
      
      if (jsContent !== originalJsContent) {
        fs.writeFileSync(jsPath, jsContent);
        console.log(`✅ Customized JavaScript bundle: ${jsFile}`);
      } else {
        console.log(`⚠️  No changes made to ${jsFile}`);
      }
    }
  } else {
    console.log(`⚠️  JavaScript directory not found: ${jsDir}`);
  }
  
  console.log('✅ Successfully customized index.html');
  console.log(`📝 New title: <title>${APP_NAME} Task Manager</title>`);
  console.log(`📝 New description: content="${APP_DESCRIPTION}"`);
  console.log(`📝 New theme color: content="${APP_THEME_COLOR}"`);
  
} catch (error) {
  console.warn('⚠️  Warning: Error during customization:', error.message);
  console.warn('   Build will continue without customization.');
  console.warn('   This is not a fatal error.');
  process.exit(0); // Exit successfully to not break the build
} 