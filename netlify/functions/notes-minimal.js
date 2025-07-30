const fs = require('fs').promises;
const path = require('path');

// Storage configuration
const STORAGE_TYPE = process.env.STORAGE_TYPE || 'file'; // 'file' or 'jsonbin'
const JSONBIN_API_KEY = process.env.JSONBIN_API_KEY;
const JSONBIN_NOTES_BIN_ID = process.env.JSONBIN_NOTES_BIN_ID;

// Debug logging
console.log('=== NOTES FUNCTION ENVIRONMENT ===');
console.log('STORAGE_TYPE:', STORAGE_TYPE);
console.log('JSONBIN_API_KEY:', JSONBIN_API_KEY ? 'SET (' + JSONBIN_API_KEY.substring(0, 10) + '...)' : 'NOT SET');
console.log('JSONBIN_NOTES_BIN_ID:', JSONBIN_NOTES_BIN_ID);
console.log('================================');

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
  console.log('=== READING NOTES ===');
  console.log('Storage type:', STORAGE_TYPE);
  console.log('JSONBIN_API_KEY available:', !!JSONBIN_API_KEY);
  console.log('JSONBIN_NOTES_BIN_ID:', JSONBIN_NOTES_BIN_ID);
  
  try {
    if (STORAGE_TYPE === 'jsonbin' && JSONBIN_API_KEY && JSONBIN_NOTES_BIN_ID) {
      console.log('Using JSONBin for reading notes');
      const url = `https://api.jsonbin.io/v3/b/${JSONBIN_NOTES_BIN_ID}`;
      console.log('JSONBin URL:', url);
      
      // Use JSONBin.io for persistent storage
      const response = await fetch(url, {
        headers: {
          'X-Master-Key': JSONBIN_API_KEY,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('JSONBin response status:', response.status);
      
      if (!response.ok) {
        if (response.status === 404) {
          console.log('Bin not found, returning empty array');
          return []; // Bin doesn't exist yet
        }
        const errorText = await response.text();
        console.error('JSONBin error response:', errorText);
        throw new Error(`JSONBin API error: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log('JSONBin data received:', data);
      return data.record || [];
    } else {
      console.log('Using file storage for reading notes');
      // Fallback to file storage
      await ensureDataDirectory();
      const data = await fs.readFile(DATA_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    // If file doesn't exist, return empty array
    if (error.code === 'ENOENT') {
      console.log('File not found, returning empty array');
      return [];
    }
    console.error('Error reading notes:', error);
    return []; // Return empty array on error to prevent app crash
  }
}

// Write notes to storage
async function writeNotes(notes) {
  console.log('=== WRITING NOTES ===');
  console.log('Notes to write:', notes.length, 'notes');
  console.log('Storage type:', STORAGE_TYPE);
  console.log('JSONBIN_API_KEY available:', !!JSONBIN_API_KEY);
  console.log('JSONBIN_NOTES_BIN_ID:', JSONBIN_NOTES_BIN_ID);
  
  try {
    if (STORAGE_TYPE === 'jsonbin' && JSONBIN_API_KEY && JSONBIN_NOTES_BIN_ID) {
      console.log('Using JSONBin for writing notes');
      const url = `https://api.jsonbin.io/v3/b/${JSONBIN_NOTES_BIN_ID}`;
      console.log('JSONBin URL:', url);
      
      // Use JSONBin.io for persistent storage
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'X-Master-Key': JSONBIN_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(notes)
      });
      
      console.log('JSONBin write response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('JSONBin write error response:', errorText);
        throw new Error(`JSONBin API error: ${response.status} - ${errorText}`);
      }
      
      console.log('Notes written successfully to JSONBin');
    } else {
      console.log('Using file storage for writing notes');
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
        return {
          statusCode: 200,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          },
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