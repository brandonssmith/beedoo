# Netlify Troubleshooting Guide

## Common Errors and Solutions

### 1. Build Script Not Found
**Error**: `ENOENT: no such file or directory, open 'scripts/build-with-env.js'`

**Solution**: 
- Make sure the `scripts` directory exists in your repository
- Verify the build script file is committed to Git
- Check that the file path in `package.json` is correct

### 2. Build Directory Not Found
**Error**: `Error: build/index.html not found`

**Solution**:
- This usually means the React build failed before our customization script ran
- Check that all dependencies are installed: `npm install`
- Verify that `react-scripts build` completes successfully
- Check for any React build errors in the logs

### 3. Environment Variables Not Applied
**Issue**: Customizations not showing up in the deployed site

**Solutions**:
- **Verify environment variables are set in Netlify**:
  - Go to Site settings > Environment variables
  - Make sure `NAME_VARIABLE` is set
  - Check that variables are set for the correct environment (production/development)
- **Check build logs**: Look for the customization messages in the build output
- **Clear cache**: Try triggering a new deploy with "Clear cache and deploy"

### 4. Permission Errors
**Error**: `EACCES: permission denied`

**Solution**:
- This is rare in Netlify but can happen
- Try using the alternative build script: `scripts/build-with-env-simple.js`
- Check that the build script has proper error handling

### 5. Regex Replacement Issues
**Issue**: Title/description not being replaced correctly

**Solution**:
- The regex patterns might not match the actual HTML structure
- Check the build logs to see what values are being read
- Verify the HTML structure in the built `index.html` file

## Debugging Steps

### 1. Check Build Logs
Look for these messages in your Netlify build logs:
```
Building with customizations:
- App Name: [Your App Name]
- Description: [Your Description]
- Theme Color: [Your Color]
✅ Successfully customized index.html
```

### 2. Test Locally
Test the build process locally to isolate issues:

```powershell
# Clear any existing build
Remove-Item -Recurse -Force build -ErrorAction SilentlyContinue

# Set environment variables and build
$env:NAME_VARIABLE="TestApp"
$env:DESCRIPTION_VARIABLE="Test Description"
npm run build

# Check the result
Get-Content build/index.html | Select-String "title"
```

### 3. Verify Environment Variables
Check that environment variables are accessible during build:

```powershell
# Add this to the build script temporarily for debugging
Write-Host "NAME_VARIABLE: $env:NAME_VARIABLE"
Write-Host "DESCRIPTION_VARIABLE: $env:DESCRIPTION_VARIABLE"
```

## Alternative Solutions

### If the build script continues to fail:

1. **Use Netlify's built-in environment variable substitution**:
   - Set environment variables in Netlify
   - Use `%NAME_VARIABLE%` syntax in your HTML files
   - This requires a different approach but might be more reliable

2. **Use a different build approach**:
   - Create separate branches for different deployments
   - Use Netlify's branch-based environment variables
   - Each branch can have its own `public/index.html` with hardcoded values

3. **Use Netlify Functions**:
   - Create a serverless function that serves customized HTML
   - This is more complex but gives you full control

## Getting Help

If you're still experiencing issues:

1. **Check the exact error message** from Netlify build logs
2. **Verify your environment variables** are set correctly in Netlify
3. **Test the build process locally** to reproduce the issue
4. **Check the build script output** for any error messages

The most common issue is that environment variables aren't set correctly in Netlify's build environment. Make sure to set them in the "Environment variables" section of your site settings, not just in the runtime environment. 