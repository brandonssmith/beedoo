const fs = require('fs').promises;
const path = require('path');

// Storage configuration
const STORAGE_TYPE = process.env.STORAGE_TYPE || 'file'; // 'file' or 'jsonbin'
const JSONBIN_API_KEY = process.env.JSONBIN_API_KEY;
const JSONBIN_BIN_ID = process.env.JSONBIN_BIN_ID;
const JSONBIN_NOTES_BIN_ID = process.env.JSONBIN_NOTES_BIN_ID;

// Debug logging
console.log('=== NOTES FUNCTION ENVIRONMENT ===');
console.log('STORAGE_TYPE:', STORAGE_TYPE);
console.log('JSONBIN_API_KEY:', JSONBIN_API_KEY ? 'SET (' + JSONBIN_API_KEY.substring(0, 10) + '...)' : 'NOT SET');
console.log('JSONBIN_BIN_ID:', JSONBIN_BIN_ID);
console.log('JSONBIN_NOTES_BIN_ID:', JSONBIN_NOTES_BIN_ID);
console.log('================================');

// Debug logging
console.log('Notes function configuration:');
console.log('STORAGE_TYPE:', STORAGE_TYPE);
console.log('JSONBIN_API_KEY:', JSONBIN_API_KEY ? 'SET' : 'NOT SET');
console.log('JSONBIN_BIN_ID:', JSONBIN_BIN_ID);
console.log('JSONBIN_NOTES_BIN_ID:', JSONBIN_NOTES_BIN_ID);

// File storage path (for development)
const DATA_FILE = path.join(process.env.NETLIFY_DEV ? '/tmp' : '/tmp', 'notes.json');

// Ensure data directory exists (for file storage)
async function ensureDataDirectory() {
  if (STORAGE_TYPE === 'file') {
    const dataDir = path.dirname(DATA_FILE);
    try {
      await fs.access(dataDir);
    } catch (error) {
      if (error.code === 'ENOENT') {
        await fs.mkdir(dataDir, { recursive: true });
      } else {
        throw error;
      }
    }
  }
}

// Read notes from storage
async function readNotes() {
  try {
    if (STORAGE_TYPE === 'jsonbin' && JSONBIN_API_KEY && JSONBIN_NOTES_BIN_ID) {
      // Use JSONBin.io for persistent storage
      const response = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_NOTES_BIN_ID}`, {
        headers: {
          'X-Master-Key': JSONBIN_API_KEY,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          console.log('Notes bin does not exist yet, returning empty array');
          return []; // Bin doesn't exist yet
        }
        throw new Error(`JSONBin API error: ${response.status}`);
      }
      
      const data = await response.json();
      return data.record || [];
    } else if (STORAGE_TYPE === 'jsonbin' && JSONBIN_API_KEY) {
      console.log('JSONBIN_NOTES_BIN_ID not configured, using file storage');
      // Fallback to file storage if notes bin not configured
      await ensureDataDirectory();
      const data = await fs.readFile(DATA_FILE, 'utf8');
      return JSON.parse(data);
    } else {
      // Fallback to file storage
      await ensureDataDirectory();
      const data = await fs.readFile(DATA_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    // If file doesn't exist, return empty array
    if (error.code === 'ENOENT') {
      return [];
    }
    console.error('Error reading notes:', error);
    return []; // Return empty array on error to prevent app crash
  }
}

// Write notes to storage
async function writeNotes(notes) {
  console.log('Writing notes to storage:', notes.length, 'notes');
  console.log('Storage type:', STORAGE_TYPE);
  console.log('JSONBIN_NOTES_BIN_ID:', JSONBIN_NOTES_BIN_ID);
  
  try {
    if (STORAGE_TYPE === 'jsonbin' && JSONBIN_API_KEY && JSONBIN_NOTES_BIN_ID) {
      console.log('Using JSONBin for notes storage');
      // Use JSONBin.io for persistent storage
      const response = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_NOTES_BIN_ID}`, {
        method: 'PUT',
        headers: {
          'X-Master-Key': JSONBIN_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(notes)
      });
      
      console.log('JSONBin response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('JSONBin error response:', errorText);
        throw new Error(`JSONBin API error: ${response.status} - ${errorText}`);
      }
      
      console.log('Notes saved successfully to JSONBin');
    } else if (STORAGE_TYPE === 'jsonbin' && JSONBIN_API_KEY) {
      console.log('JSONBIN_NOTES_BIN_ID not configured, using file storage');
      // Fallback to file storage if notes bin not configured
      await ensureDataDirectory();
      await fs.writeFile(DATA_FILE, JSON.stringify(notes, null, 2));
    } else {
      console.log('Using file storage for notes');
      // Fallback to file storage
      await ensureDataDirectory();
      await fs.writeFile(DATA_FILE, JSON.stringify(notes, null, 2));
    }
  } catch (error) {
    console.error('Error writing notes:', error);
    throw error;
  }
}

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
};

exports.handler = async (event, context) => {
  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: ''
    };
  }

  try {
    const { httpMethod, body } = event;

    switch (httpMethod) {
      case 'GET':
        // Get all notes
        const notes = await readNotes();
        const isExport = event.queryStringParameters && event.queryStringParameters.export === '1';
        const headers = {
          ...corsHeaders,
          'Content-Type': 'application/json'
        };
        if (isExport) {
          headers['Content-Disposition'] = 'attachment; filename="notes-backup.json"';
        }
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(notes)
        };

      case 'POST':
        // Save all notes
        const newNotes = JSON.parse(body);
        await writeNotes(newNotes);
        return {
          statusCode: 200,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ message: 'Notes saved successfully', count: newNotes.length })
        };

      default:
        return {
          statusCode: 405,
          headers: corsHeaders,
          body: JSON.stringify({ error: 'Method not allowed' })
        };
    }
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Internal server error', message: error.message })
    };
  }
}; 