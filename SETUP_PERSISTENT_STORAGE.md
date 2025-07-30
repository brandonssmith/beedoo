# Fixing Data Loss: Setting Up Persistent Storage

## The Problem
Your tasks are disappearing because Netlify Functions use temporary storage (`/tmp`) that gets cleared between function executions and cold starts.

## Solution Options

### Option 1: Quick Fix - Use JSONBin.io (Recommended)

1. **Sign up for JSONBin.io** (free tier available):
   - Go to https://jsonbin.io/
   - Create a free account
   - Get your API key from the dashboard

2. **Create a new bin**:
   - In your JSONBin dashboard, create a new bin
   - Copy the bin ID (it will look like: `64f1a2b3c4d5e6f7g8h9i0j1`)

3. **Set up environment variables in Netlify**:
   - Go to your Netlify dashboard
   - Navigate to Site settings > Environment variables
   - Add these variables:
     ```
     STORAGE_TYPE=jsonbin
     JSONBIN_API_KEY=your_api_key_here
     JSONBIN_BIN_ID=your_bin_id_here
     ```

4. **Redeploy your site**:
   - Push your changes to GitHub
   - Netlify will automatically redeploy

### Option 2: Use Supabase (More Robust)

1. **Sign up for Supabase** (free tier available):
   - Go to https://supabase.com/
   - Create a new project
   - Get your API key and URL

2. **Create a table**:
   ```sql
   CREATE TABLE tasks (
     id SERIAL PRIMARY KEY,
     data JSONB NOT NULL,
     created_at TIMESTAMP DEFAULT NOW(),
     updated_at TIMESTAMP DEFAULT NOW()
   );
   ```

3. **Update the function** to use Supabase instead of JSONBin

### Option 3: Use MongoDB Atlas (Enterprise)

1. **Sign up for MongoDB Atlas** (free tier available)
2. **Create a cluster and database**
3. **Update the function** to use MongoDB

## Testing the Fix

1. **Deploy the changes**
2. **Create some test tasks**
3. **Close your browser completely**
4. **Wait 30 minutes** (to ensure function goes cold)
5. **Reload the app** - your tasks should still be there!

## Backup Strategy

Even with persistent storage, it's good practice to:
- Export your tasks regularly using the File Manager
- Keep local backups of important data
- Consider using multiple storage backends for redundancy

## Current Status

Your app now supports both:
- **File storage** (for development, still temporary)
- **JSONBin storage** (for production, persistent)

The app will automatically use JSONBin when the environment variables are set, otherwise it falls back to file storage. 