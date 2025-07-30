# Troubleshooting Notes Not Saving

## Quick Checklist

### 1. Environment Variables
Make sure these are set in your Netlify environment variables:

```
STORAGE_TYPE=jsonbin
JSONBIN_API_KEY=your_api_key_here
JSONBIN_BIN_ID=your_tasks_bin_id
JSONBIN_NOTES_BIN_ID=your_notes_bin_id
```

### 2. JSONBin Setup
- ✅ Created a new bin for notes
- ✅ Copied the bin ID correctly
- ✅ API key has access to the new bin
- ✅ Bin is not private (or API key has access if private)

### 3. Test the Function
1. Open `test-notes.html` in your browser
2. Click "Test Notes Function"
3. Check the results for any errors

### 4. Check Browser Console
1. Open browser developer tools (F12)
2. Go to Console tab
3. Create a note in the app
4. Look for any error messages

### 5. Check Netlify Function Logs
1. Go to your Netlify dashboard
2. Navigate to Functions tab
3. Click on the "notes" function
4. Check the logs for any errors

## Common Issues

### Issue: "JSONBIN_NOTES_BIN_ID not configured"
**Solution**: Add the `JSONBIN_NOTES_BIN_ID` environment variable to Netlify

### Issue: "JSONBin API error: 404"
**Solution**: 
- Check that the bin ID is correct
- Make sure the bin exists
- Verify API key has access to the bin

### Issue: "JSONBin API error: 401"
**Solution**: 
- Check that your API key is correct
- Make sure the API key has access to the bin

### Issue: "JSONBin API error: 403"
**Solution**: 
- The bin might be private and your API key doesn't have access
- Make the bin public or use a different API key

## Debug Steps

1. **Test the API directly**:
   ```bash
   curl -X GET "https://api.jsonbin.io/v3/b/YOUR_NOTES_BIN_ID" \
     -H "X-Master-Key: YOUR_API_KEY"
   ```

2. **Check if the bin exists**:
   - Go to JSONBin.io dashboard
   - Look for your notes bin
   - Verify the bin ID in the URL

3. **Test saving manually**:
   ```bash
   curl -X PUT "https://api.jsonbin.io/v3/b/YOUR_NOTES_BIN_ID" \
     -H "X-Master-Key: YOUR_API_KEY" \
     -H "Content-Type: application/json" \
     -d '[{"id":"test","title":"Test","content":"Test content"}]'
   ```

## Still Not Working?

1. Check the browser's Network tab to see the actual HTTP requests
2. Look at the Netlify function logs for detailed error messages
3. Try creating a new bin and updating the environment variable
4. Verify that your API key works with the tasks bin (if that's working) 