const fs = require('fs');
const path = require('path');

// Configuration templates for different deployment types
const deploymentConfigs = {
  'production': {
    NAME_VARIABLE: 'Beedoo',
    DESCRIPTION_VARIABLE: 'Beedoo Task Manager - Organize your tasks with subtasks and next steps',
    THEME_COLOR_VARIABLE: '#000000'
  },
  'development': {
    NAME_VARIABLE: 'Beedoo Dev',
    DESCRIPTION_VARIABLE: 'Beedoo Dev - Development instance for testing',
    THEME_COLOR_VARIABLE: '#FF6B35'
  },
  'staging': {
    NAME_VARIABLE: 'Beedoo Staging',
    DESCRIPTION_VARIABLE: 'Beedoo Staging - Pre-production testing environment',
    THEME_COLOR_VARIABLE: '#FFA500'
  },
  'client': {
    NAME_VARIABLE: 'AcmeCorp Tasks',
    DESCRIPTION_VARIABLE: 'AcmeCorp Task Manager - Professional task organization',
    THEME_COLOR_VARIABLE: '#2E86AB'
  }
};

function generateEnvFile(config, filename = '.env') {
  const envContent = `# Environment variables for ${config.NAME_VARIABLE} deployment
# Generated on ${new Date().toISOString()}

# Build-time environment variables (used by build script)
NAME_VARIABLE=${config.NAME_VARIABLE}
DESCRIPTION_VARIABLE=${config.DESCRIPTION_VARIABLE}
THEME_COLOR_VARIABLE=${config.THEME_COLOR_VARIABLE}

# React environment variables (for development)
REACT_APP_NAME_VARIABLE=${config.NAME_VARIABLE}
REACT_APP_DESCRIPTION_VARIABLE=${config.DESCRIPTION_VARIABLE}
REACT_APP_THEME_COLOR_VARIABLE=${config.THEME_COLOR_VARIABLE}
`;

  const filePath = path.join(__dirname, '..', filename);
  fs.writeFileSync(filePath, envContent);
  console.log(`✅ Generated ${filename} for ${config.NAME_VARIABLE}`);
  return filePath;
}

function generateNetlifyConfig(config, filename = 'netlify-env.toml') {
  const tomlContent = `# Netlify environment configuration for ${config.NAME_VARIABLE}
# Copy these settings to your netlify.toml or set in Netlify dashboard

[build]
  command = "npm run build"
  publish = "build"
  functions = "netlify/functions"

[build.environment]
  NODE_VERSION = "18"
  # Build-time environment variables
  NAME_VARIABLE = "${config.NAME_VARIABLE}"
  DESCRIPTION_VARIABLE = "${config.DESCRIPTION_VARIABLE}"
  THEME_COLOR_VARIABLE = "${config.THEME_COLOR_VARIABLE}"
  # React environment variables (for development)
  REACT_APP_NAME_VARIABLE = "${config.NAME_VARIABLE}"
  REACT_APP_DESCRIPTION_VARIABLE = "${config.DESCRIPTION_VARIABLE}"
  REACT_APP_THEME_COLOR_VARIABLE = "${config.THEME_COLOR_VARIABLE}"
`;

  const filePath = path.join(__dirname, '..', filename);
  fs.writeFileSync(filePath, tomlContent);
  console.log(`✅ Generated ${filename} for ${config.NAME_VARIABLE}`);
  return filePath;
}

function showUsage() {
  console.log(`
🔧 Beedoo Environment Setup Script
==================================

Usage: node scripts/setup-env.js <deployment-type> [options]

Available deployment types:
${Object.keys(deploymentConfigs).map(type => `  - ${type}`).join('\n')}

Options:
  --env-file <filename>    Generate .env file (default: .env)
  --netlify-file <filename> Generate netlify.toml file (default: netlify-env.toml)
  --both                   Generate both files

Examples:
  node scripts/setup-env.js production --both
  node scripts/setup-env.js development --env-file .env.dev
  node scripts/setup-env.js client --netlify-file netlify-client.toml

For Netlify deployment:
1. Use the generated netlify.toml file, OR
2. Set environment variables in Netlify dashboard:
   - Go to Site settings > Environment variables
   - Add each variable from the generated .env file
`);
}

// Main execution
const args = process.argv.slice(2);
const deploymentType = args[0];

if (!deploymentType || args.includes('--help') || args.includes('-h')) {
  showUsage();
  process.exit(0);
}

if (!deploymentConfigs[deploymentType]) {
  console.error(`❌ Unknown deployment type: ${deploymentType}`);
  console.error(`Available types: ${Object.keys(deploymentConfigs).join(', ')}`);
  process.exit(1);
}

const config = deploymentConfigs[deploymentType];
const generateBoth = args.includes('--both');

// Parse custom filenames
const envFileIndex = args.indexOf('--env-file');
const netlifyFileIndex = args.indexOf('--netlify-file');

const envFilename = envFileIndex !== -1 ? args[envFileIndex + 1] : '.env';
const netlifyFilename = netlifyFileIndex !== -1 ? args[netlifyFileIndex + 1] : 'netlify-env.toml';

console.log(`🚀 Setting up environment for ${deploymentType} deployment...\n`);

// Generate files based on options
if (generateBoth || !args.includes('--netlify-file')) {
  generateEnvFile(config, envFilename);
}

if (generateBoth || !args.includes('--env-file')) {
  generateNetlifyConfig(config, netlifyFilename);
}

console.log(`\n📋 Next steps:`);
console.log(`1. For local development: Use the generated .env file`);
console.log(`2. For Netlify deployment: Set environment variables in Netlify dashboard or use the generated netlify.toml`);
console.log(`3. Test locally: $env:NAME_VARIABLE="${config.NAME_VARIABLE}"; npm run build`); 