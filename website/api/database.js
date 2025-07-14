import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const dbPath = path.join(process.cwd(), 'public', 'DB.csv');

  if (req.method === 'GET') {
    try {
      if (fs.existsSync(dbPath)) {
        const data = fs.readFileSync(dbPath, 'utf8');
        res.status(200).json({ data });
      } else {
        res.status(200).json({ data: 'group_name,completed_by,completion_time\n' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to read database' });
    }
  } else if (req.method === 'POST') {
    try {
      const { groupName, completedBy } = req.body;
      
      if (!groupName || !completedBy) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
      }

      // Read existing data
      let existingData = 'group_name,completed_by,completion_time\n';
      if (fs.existsSync(dbPath)) {
        existingData = fs.readFileSync(dbPath, 'utf8');
      }

      // Check if group already exists
      if (existingData.includes(groupName)) {
        res.status(409).json({ error: 'Group already completed' });
        return;
      }

      // Append new entry
      const timestamp = new Date().toISOString();
      const newEntry = `${groupName},${completedBy},${timestamp}\n`;
      const updatedData = existingData + newEntry;

      // Write back to file
      fs.writeFileSync(dbPath, updatedData);

      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update database' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
