const fs = require('fs').promises;
const path = require('path');

// Storage configuration
const STORAGE_TYPE = process.env.STORAGE_TYPE || 'file'; // 'file' or 'jsonbin'
const JSONBIN_API_KEY = process.env.JSONBIN_API_KEY;
const JSONBIN_BIN_ID = process.env.JSONBIN_BIN_ID;

// File storage path (for development)
const DATA_FILE = path.join(process.env.NETLIFY_DEV ? '/tmp' : '/tmp', 'tasks.json');

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

// Read tasks from storage
async function readTasks() {
  try {
    if (STORAGE_TYPE === 'jsonbin' && JSONBIN_API_KEY && JSONBIN_BIN_ID) {
      // Use JSONBin.io for persistent storage
      const response = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`, {
        headers: {
          'X-Master-Key': JSONBIN_API_KEY,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          return []; // Bin doesn't exist yet
        }
        throw new Error(`JSONBin API error: ${response.status}`);
      }
      
      const data = await response.json();
      return data.record || [];
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
    console.error('Error reading tasks:', error);
    return []; // Return empty array on error to prevent app crash
  }
}

// Write tasks to storage
async function writeTasks(tasks) {
  try {
    if (STORAGE_TYPE === 'jsonbin' && JSONBIN_API_KEY && JSONBIN_BIN_ID) {
      // Use JSONBin.io for persistent storage
      const response = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`, {
        method: 'PUT',
        headers: {
          'X-Master-Key': JSONBIN_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(tasks)
      });
      
      if (!response.ok) {
        throw new Error(`JSONBin API error: ${response.status}`);
      }
    } else {
      // Fallback to file storage
      await ensureDataDirectory();
      await fs.writeFile(DATA_FILE, JSON.stringify(tasks, null, 2));
    }
  } catch (error) {
    console.error('Error writing tasks:', error);
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
        // Get all tasks
        const tasks = await readTasks();
        return {
          statusCode: 200,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(tasks)
        };

      case 'POST':
        // Save all tasks
        const newTasks = JSON.parse(body);
        await writeTasks(newTasks);
        return {
          statusCode: 200,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ message: 'Tasks saved successfully', count: newTasks.length })
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