# Setting Up Notes Bin for Beedoo

## Overview
Notes are now stored in a separate JSONBin bin from tasks, providing better data organization and separation.

## Step 1: Create a New JSONBin Bin for Notes

1. **Go to JSONBin.io** and log into your account
2. **Create a new bin**:
   - Click "Create New Bin"
   - Name it something like "beedoo-notes" or "my-notes"
   - Copy the contents from `notes-bin-template.json` (which is just `[]`)
   - Paste it into the bin content
   - Click "Create"

3. **Copy the Bin ID**:
   - After creating the bin, copy the bin ID from the URL
   - It will look like: `64f1a2b3c4d5e6f7g8h9i0j2`

## Step 2: Configure Environment Variables

### For Netlify (Production):
1. Go to your Netlify dashboard
2. Navigate to Site settings > Environment variables
3. Add this new variable:
   ```
   JSONBIN_NOTES_BIN_ID=your_new_notes_bin_id_here
   ```

### For Local Development:
Create a `.env` file in your project root (if it doesn't exist) and add:
```
JSONBIN_NOTES_BIN_ID=your_new_notes_bin_id_here
```

## Step 3: Verify Configuration

Your environment variables should now include:
```
STORAGE_TYPE=jsonbin
JSONBIN_API_KEY=your_existing_api_key
JSONBIN_BIN_ID=your_existing_tasks_bin_id
JSONBIN_NOTES_BIN_ID=your_new_notes_bin_id
```

## How It Works

- **Tasks**: Stored in the original bin (`JSONBIN_BIN_ID`)
- **Notes**: Stored in the new notes bin (`JSONBIN_NOTES_BIN_ID`)
- **Fallback**: If `JSONBIN_NOTES_BIN_ID` is not set, notes will use file storage

## Benefits

1. **Data Separation**: Tasks and notes are completely separate
2. **Independent Management**: You can manage notes separately from tasks
3. **Better Organization**: Clear distinction between different data types
4. **Scalability**: Each data type can grow independently

## Testing

1. Start your development server: `npm run dev`
2. Switch to Notes mode
3. Create a note
4. Check your JSONBin dashboard to see the note appear in the new bin
5. Refresh the page - the note should still be there

## Troubleshooting

- **Notes not saving**: Check that `JSONBIN_NOTES_BIN_ID` is set correctly
- **Notes not loading**: Verify the bin exists and is accessible
- **Permission errors**: Ensure your API key has access to the new bin 