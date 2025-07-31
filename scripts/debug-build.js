const fs = require('fs');
const path = require('path');

console.log('🔍 Build Environment Diagnostic');
console.log('================================');

// Check current directory
console.log(`📁 Current directory: ${process.cwd()}`);

// Check if scripts directory exists
const scriptsDir = path.join(__dirname);
console.log(`📁 Scripts directory: ${scriptsDir}`);
console.log(`📁 Scripts directory exists: ${fs.existsSync(scriptsDir)}`);

// Check if build directory exists
const buildDir = path.join(__dirname, '..', 'build');
console.log(`📁 Build directory: ${buildDir}`);
console.log(`📁 Build directory exists: ${fs.existsSync(buildDir)}`);

// Check if index.html exists
const indexPath = path.join(buildDir, 'index.html');
console.log(`📁 Index.html path: ${indexPath}`);
console.log(`📁 Index.html exists: ${fs.existsSync(indexPath)}`);

// Check environment variables
console.log('\n🔧 Environment Variables:');
console.log(`   - NAME_VARIABLE: ${process.env.NAME_VARIABLE || 'NOT SET'}`);
console.log(`   - DESCRIPTION_VARIABLE: ${process.env.DESCRIPTION_VARIABLE || 'NOT SET'}`);
console.log(`   - THEME_COLOR_VARIABLE: ${process.env.THEME_COLOR_VARIABLE || 'NOT SET'}`);
console.log(`   - NODE_ENV: ${process.env.NODE_ENV || 'NOT SET'}`);

// If index.html exists, show its content
if (fs.existsSync(indexPath)) {
  try {
    const html = fs.readFileSync(indexPath, 'utf8');
    console.log(`\n📄 Index.html content length: ${html.length} characters`);
    console.log(`📄 Index.html first 200 chars: ${html.substring(0, 200)}...`);
    
    // Check for specific patterns
    const titleMatch = html.match(/<title>.*?<\/title>/);
    const descMatch = html.match(/content="[^"]*Beedoo[^"]*"/);
    const themeMatch = html.match(/content="#[0-9a-fA-F]{6}"/);
    
    console.log(`\n🔍 Pattern matches:`);
    console.log(`   - Title found: ${titleMatch ? 'YES' : 'NO'}`);
    console.log(`   - Description found: ${descMatch ? 'YES' : 'NO'}`);
    console.log(`   - Theme color found: ${themeMatch ? 'YES' : 'NO'}`);
    
    if (titleMatch) console.log(`   - Title: ${titleMatch[0]}`);
    if (descMatch) console.log(`   - Description: ${descMatch[0]}`);
    if (themeMatch) console.log(`   - Theme: ${themeMatch[0]}`);
    
  } catch (error) {
    console.error('❌ Error reading index.html:', error.message);
  }
}

console.log('\n✅ Diagnostic complete'); 