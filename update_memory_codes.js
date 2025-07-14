const fs = require('fs');
const path = require('path');

// Function to extract fragment info from a txt file
function extractFragmentInfo(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const lines = content.split('\n');
        
        // Look for the fragment line (usually line 2)
        for (const line of lines) {
            const match = line.match(/fragment (\d) of \d, memory code: (\w+)/);
            if (match) {
                const fragmentNumber = match[1];
                const memoryCode = match[2];
                return `${memoryCode}${fragmentNumber}`;
            }
        }
        return null;
    } catch (error) {
        console.error(`Error reading ${filePath}:`, error.message);
        return null;
    }
}

// Function to update the encrypted memories CSV
function updateEncryptedMemoriesCSV() {
    const rememberDir = path.join(__dirname, 'stages', '6_REMEMBER');
    const csvFile = path.join(__dirname, 'encrypted_memories.csv');
    
    try {
        // Read the current CSV
        const csvContent = fs.readFileSync(csvFile, 'utf8');
        const lines = csvContent.split('\n');
        
        // Process each line (skip header)
        const updatedLines = [lines[0]]; // Keep header with memory_code column
        
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue; // Skip empty lines
            
            // Parse CSV line - extract number and encryption
            const match = line.match(/^(\d+),"([^"]+)"(?:,(.*))?$/);
            if (!match) {
                console.warn(`Could not parse line: ${line}`);
                updatedLines.push(line);
                continue;
            }
            
            const number = match[1];
            const encryption = match[2];
            
            // Get fragment info from corresponding txt file
            const txtFile = path.join(rememberDir, `${number}.txt`);
            const memoryCode = extractFragmentInfo(txtFile);
            
            if (memoryCode) {
                updatedLines.push(`${number},"${encryption}",${memoryCode}`);
                console.log(`✅ Updated ${number} with memory code: ${memoryCode}`);
            } else {
                console.warn(`❌ Could not extract memory code for ${number}`);
                updatedLines.push(`${number},"${encryption}",UNKNOWN`);
            }
        }
        
        // Write updated CSV
        const newContent = updatedLines.join('\n');
        fs.writeFileSync(csvFile, newContent);
        
        console.log(`\n🎉 Successfully updated encrypted_memories.csv with ${updatedLines.length - 1} entries`);
        console.log(`📁 Updated file: ${csvFile}`);
        
    } catch (error) {
        console.error('❌ Error updating CSV:', error.message);
    }
}

// Run the script
if (require.main === module) {
    console.log('🔧 Updating encrypted memories CSV with memory codes...');
    updateEncryptedMemoriesCSV();
}

module.exports = {
    extractFragmentInfo,
    updateEncryptedMemoriesCSV
};
