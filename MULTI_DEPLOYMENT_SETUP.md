# Multi-Deployment Setup Guide

This guide explains how to deploy multiple instances of the Beedoo Task Manager from the same Git repository using Netlify environment variables.

## Environment Variables

The following environment variables can be set in each Netlify deployment to customize the instance:

### Required Variables
- `NAME_VARIABLE`: The name of your application (e.g., "Beedoo", "MyTasks", "WorkManager")

### Optional Variables
- `DESCRIPTION_VARIABLE`: Custom description for the app (defaults to "[NAME_VARIABLE] Task Manager - Organize your tasks with subtasks and next steps")
- `THEME_COLOR_VARIABLE`: Custom theme color in hex format (defaults to "#000000")

## Setting Up Multiple Deployments

### Method 1: Using Netlify UI

1. **Create a new site** in Netlify
2. **Connect to your Git repository**
3. **Set build settings:**
   - Build command: `npm run build`
   - Publish directory: `build`
4. **Add environment variables:**
   - Go to Site settings > Environment variables
   - Add `NAME_VARIABLE` with your desired app name
   - Optionally add `DESCRIPTION_VARIABLE` and `THEME_COLOR_VARIABLE`
5. **Deploy**

### Method 2: Using netlify.toml (per deployment)

Create a separate `netlify.toml` file for each deployment or use Netlify's environment variable UI:

```toml
[build]
  command = "npm run build"
  publish = "build"
  functions = "netlify/functions"

[build.environment]
  NODE_VERSION = "18"
  NAME_VARIABLE = "YourAppName"
  DESCRIPTION_VARIABLE = "Your custom description"
  THEME_COLOR_VARIABLE = "#FF5733"
```

## Example Deployments

### Development Instance
- `NAME_VARIABLE`: "Beedoo Dev"
- `DESCRIPTION_VARIABLE`: "Beedoo Dev - Development instance for testing"
- `THEME_COLOR_VARIABLE`: "#FF6B35"

### Production Instance
- `NAME_VARIABLE`: "Beedoo"
- `DESCRIPTION_VARIABLE`: "Beedoo Task Manager - Organize your tasks with subtasks and next steps"
- `THEME_COLOR_VARIABLE`: "#000000"

### Client Instance
- `NAME_VARIABLE`: "AcmeCorp Tasks"
- `DESCRIPTION_VARIABLE`: "AcmeCorp Task Manager - Professional task organization"
- `THEME_COLOR_VARIABLE`: "#2E86AB"

## How It Works

1. The build process runs `react-scripts build` to create the standard React build
2. Our custom script `scripts/build-with-env.js` then:
   - Reads environment variables from the build environment
   - Customizes the `index.html` file with the specified values
   - Replaces the title, description, and theme color
3. The customized build is deployed to Netlify

## Testing Locally

To test with environment variables locally:

```powershell
# Set environment variables and build in one command
$env:NAME_VARIABLE="TestApp"; $env:DESCRIPTION_VARIABLE="Test Description"; npm run build

# Or set them permanently for your session
$env:NAME_VARIABLE="TestApp"
$env:DESCRIPTION_VARIABLE="Test Description"
npm run build

# Clear environment variables when done testing
Remove-Item Env:NAME_VARIABLE
Remove-Item Env:DESCRIPTION_VARIABLE
```

## Troubleshooting

- **Build fails**: Check that the `scripts` directory exists and the build script is executable
- **Variables not applied**: Ensure environment variables are set in Netlify's build environment, not just runtime
- **Default values showing**: Verify that environment variables are properly set in Netlify's environment variables section 