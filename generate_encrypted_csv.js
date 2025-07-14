const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

// Load secret key from environment
require('dotenv').config();
const SECRET_KEY = process.env.SECRET_KEY || 'ORPHEUSFURRY';

// Directories and files
const REMEMBER_DIR = 'stages/6_REMEMBER';
const CSV_FILE = 'encrypted_memories.csv';

// Function to extract memory code from txt file content
function extractMemoryCode(content) {
    const lines = content.split('\n');
    
    for (const line of lines) {
        const trimmedLine = line.trim();
        // Look for pattern like "(fragment 3 of 5, memory code: DESIGN. the 4 other DESIGN fragments are required to reconstruct)"
        const fragmentMatch = trimmedLine.match(/\(fragment\s+(\d+)\s+of\s+\d+,\s+memory\s+code:\s+(\w+)\./);
        if (fragmentMatch) {
            const fragmentNumber = fragmentMatch[1];
            const fragmentType = fragmentMatch[2];
            return fragmentType + fragmentNumber;
        }
    }
    
    return '';
}

// Function to encrypt data using AES-256-CBC
function encryptData(text, password) {
    const iv = crypto.randomBytes(16);
    const key = crypto.scryptSync(password, 'salt', 32);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return iv.toString('hex') + ':' + encrypted;
}

// Main function to process all memory files and create CSV
function createEncryptedMemoriesCSV() {
    console.log('🔄 Processing memory files to create encrypted_memories.csv...');
    
    // Get all txt files from REMEMBER directory
    const txtFiles = fs.readdirSync(REMEMBER_DIR)
        .filter(file => file.endsWith('.txt'))
        .sort();
    
    console.log(`📁 Found ${txtFiles.length} memory files`);
    
    const csvData = [];
    
    // Add CSV header
    csvData.push('number,encryption,memory_code');
    
    txtFiles.forEach((txtFile, index) => {
        const filePath = path.join(REMEMBER_DIR, txtFile);
        const content = fs.readFileSync(filePath, 'utf8');
        const fileNumber = path.basename(txtFile, '.txt'); // e.g., "0111"
        
        // Extract memory code from file content
        const memoryCode = extractMemoryCode(content);
        
        // Encrypt the entire file content
        const encryptedContent = encryptData(content, SECRET_KEY);
        
        // Add to CSV data: number, encrypted content, memory code
        csvData.push(`${fileNumber},"${encryptedContent}",${memoryCode}`);
        
        console.log(`✅ Processed ${txtFile} -> ${memoryCode}`);
    });
    
    // Write the CSV file
    fs.writeFileSync(CSV_FILE, csvData.join('\n') + '\n');
    console.log(`\n📝 Written ${csvData.length - 1} entries to ${CSV_FILE}`);
    
    // Verification
    const csvContent = fs.readFileSync(CSV_FILE, 'utf8');
    const csvLines = csvContent.trim().split('\n').length;
    console.log(`✓ ${CSV_FILE} contains ${csvLines} lines (including header)`);
    
    // Count by memory types
    const memoryCounts = {};
    csvData.slice(1).forEach(line => {
        const parts = line.split(',');
        const memoryCode = parts[2];
        const type = memoryCode.replace(/\d+$/, ''); // Remove number to get type
        memoryCounts[type] = (memoryCounts[type] || 0) + 1;
    });
    
    console.log('\n📊 Memory Type Breakdown:');
    Object.entries(memoryCounts).forEach(([type, count]) => {
        console.log(`   ${type}: ${count} fragments`);
    });
    
    return {
        totalFiles: txtFiles.length,
        csvEntries: csvData.length - 1,
        memoryTypes: Object.keys(memoryCounts).length
    };
}

// Run the script
if (require.main === module) {
    console.log('🚀 Starting encrypted memories CSV generation...\n');
    
    try {
        const results = createEncryptedMemoriesCSV();
        
        console.log('\n🎉 CSV generation completed successfully!');
        console.log(`📄 Processed ${results.totalFiles} memory files`);
        console.log(`💾 Generated ${results.csvEntries} encrypted entries`);
        console.log(`🔗 Found ${results.memoryTypes} different memory types`);
        
    } catch (error) {
        console.error('❌ Error during processing:', error);
        process.exit(1);
    }
}

module.exports = {
    createEncryptedMemoriesCSV,
    extractMemoryCode,
    encryptData
};
