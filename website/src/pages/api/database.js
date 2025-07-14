import fs from 'fs';
import path from 'path';

export const prerender = false;

function getDbPath() {
  // Try different possible paths for development vs production
  const possiblePaths = [
    path.join(process.cwd(), 'public', 'DB.csv'),
    path.join(process.cwd(), 'website', 'public', 'DB.csv'),
    path.join(process.cwd(), '..', 'public', 'DB.csv'),
    './public/DB.csv',
    '../public/DB.csv'
  ];
  
  for (const dbPath of possiblePaths) {
    if (fs.existsSync(dbPath)) {
      return dbPath;
    }
  }
  
  // Default to the first path if none exist
  return possiblePaths[0];
}

export async function GET({ params, request }) {
  try {
    const dbPath = getDbPath();
    
    if (fs.existsSync(dbPath)) {
      const data = fs.readFileSync(dbPath, 'utf8');
      return new Response(JSON.stringify({ data }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    } else {
      // Create the file if it doesn't exist
      const defaultData = 'group_name,completed_by,completion_time\n';
      const dir = path.dirname(dbPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(dbPath, defaultData);
      
      return new Response(JSON.stringify({ data: defaultData }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
  } catch (error) {
    console.error('Database GET error:', error);
    return new Response(JSON.stringify({ error: 'Failed to read database', details: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

export async function POST({ params, request }) {
  try {
    let requestBody;
    
    // Handle different content types and empty bodies
    const contentType = request.headers.get('content-type') || '';
    
    if (contentType.includes('application/json')) {
      const bodyText = await request.text();
      if (!bodyText.trim()) {
        return new Response(JSON.stringify({ error: 'Empty request body' }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }
      
      try {
        requestBody = JSON.parse(bodyText);
      } catch (parseError) {
        return new Response(JSON.stringify({ error: 'Invalid JSON in request body', details: parseError.message }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }
    } else {
      return new Response(JSON.stringify({ error: 'Content-Type must be application/json' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    
    const { groupName, completedBy } = requestBody;
    
    if (!groupName || !completedBy) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    const dbPath = getDbPath();

    // Read existing data
    let existingData = 'group_name,completed_by,completion_time\n';
    if (fs.existsSync(dbPath)) {
      existingData = fs.readFileSync(dbPath, 'utf8');
    } else {
      // Create the file if it doesn't exist
      const dir = path.dirname(dbPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    }

    // Check if group already exists
    if (existingData.includes(groupName)) {
      return new Response(JSON.stringify({ error: 'Group already completed' }), {
        status: 409,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // Append new entry
    const timestamp = new Date().toISOString();
    const newEntry = `${groupName},${completedBy},${timestamp}\n`;
    const updatedData = existingData + newEntry;

    // Write back to file
    fs.writeFileSync(dbPath, updatedData);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    console.error('Database POST error:', error);
    return new Response(JSON.stringify({ error: 'Failed to update database', details: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

export async function DELETE({ params, request }) {
  try {
    let requestBody;
    
    // Handle JSON body
    const contentType = request.headers.get('content-type') || '';
    
    if (contentType.includes('application/json')) {
      const bodyText = await request.text();
      if (!bodyText.trim()) {
        return new Response(JSON.stringify({ error: 'Empty request body' }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }
      
      try {
        requestBody = JSON.parse(bodyText);
      } catch (parseError) {
        return new Response(JSON.stringify({ error: 'Invalid JSON in request body' }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }
    } else {
      return new Response(JSON.stringify({ error: 'Content-Type must be application/json' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    
    const { groupName } = requestBody;
    
    if (!groupName) {
      return new Response(JSON.stringify({ error: 'Missing groupName field' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    const dbPath = getDbPath();

    // Read existing data
    let existingData = 'group_name,completed_by,completion_time\n';
    if (fs.existsSync(dbPath)) {
      existingData = fs.readFileSync(dbPath, 'utf8');
    } else {
      return new Response(JSON.stringify({ error: 'Database file not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // Parse CSV and remove the specified group
    const lines = existingData.trim().split('\n');
    const header = lines[0];
    const dataLines = lines.slice(1);
    
    // Filter out the group to be removed
    const filteredLines = dataLines.filter(line => {
      const columns = line.split(',');
      return columns[0] !== groupName;
    });
    
    // Check if the group was actually removed
    if (filteredLines.length === dataLines.length) {
      return new Response(JSON.stringify({ error: 'Group not found in database' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    
    // Rebuild CSV content
    const updatedData = header + '\n' + filteredLines.join('\n') + (filteredLines.length > 0 ? '\n' : '');

    // Write back to file
    fs.writeFileSync(dbPath, updatedData);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    console.error('Database DELETE error:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete from database', details: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
