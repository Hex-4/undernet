const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

// Load secret key from environment
require('dotenv').config();
const SECRET_KEY = process.env.SECRET_KEY || 'ORPHEUSFURRY';

// Directories
const REMEMBER_DIR = 'stages/6_REMEMBER';
const USB_DIR = 'USBfiles';
const CSV_FILE = 'encrypted_memories.csv';
const HASHES_CSV = path.join(USB_DIR, 'hashes.csv');

// Ensure USB directory exists
if (!fs.existsSync(USB_DIR)) {
    fs.mkdirSync(USB_DIR, { recursive: true });
}

// Function to extract fragment info from txt file
function extractFragmentInfo(content) {
    const lines = content.split('\n');
    let fragmentType = '';
    let fragmentNumber = '';
    
    for (const line of lines) {
        const trimmedLine = line.trim();
        // Look for pattern like "(fragment 5 of 5, memory code: VIRAL. the 4 other VIRAL fragments are required to reconstruct)"
        const fragmentMatch = trimmedLine.match(/\(fragment\s+(\d+)\s+of\s+\d+,\s+memory\s+code:\s+(\w+)\./);
        if (fragmentMatch) {
            fragmentNumber = fragmentMatch[1];
            fragmentType = fragmentMatch[2];
            break;
        }
    }
    
    const memoryCode = fragmentType + fragmentNumber;
    return { fragmentType, fragmentNumber, memoryCode };
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

// Function to generate HMAC hash
function generateHash(content) {
    return crypto.createHmac('sha256', SECRET_KEY).update(content).digest('hex');
}

// Function to process all memory files
function processAllMemoryFiles() {
    console.log('Processing all memory files...');
    
    // Get all txt files from REMEMBER directory
    const txtFiles = fs.readdirSync(REMEMBER_DIR)
        .filter(file => file.endsWith('.txt'))
        .sort();
    
    console.log(`Found ${txtFiles.length} memory files`);
    
    const csvData = [];
    const hashData = [];
    
    // Add CSV header
    csvData.push('number,encryption,memory_code');
    
    // Add hash CSV header
    hashData.push('filename,hash');
    
    txtFiles.forEach((txtFile, index) => {
        const filePath = path.join(REMEMBER_DIR, txtFile);
        const content = fs.readFileSync(filePath, 'utf8');
        const fileNumber = path.basename(txtFile, '.txt');
        
        // Extract fragment info
        const { fragmentType, fragmentNumber, memoryCode } = extractFragmentInfo(content);
        
        // Encrypt the content
        const encryptedContent = encryptData(content, SECRET_KEY);
        
        // Create USB file content (simulated USB data)
        const usbContent = `USB_DEVICE_${fileNumber}\n` +
                          `SERIAL: USB${fileNumber}_${Date.now()}\n` +
                          `CAPACITY: ${Math.floor(Math.random() * 64) + 1}GB\n` +
                          `MANUFACTURER: Orpheus Corp\n` +
                          `MODEL: MemoryStick_v${fragmentNumber}\n` +
                          `TYPE: ${fragmentType}_USB\n` +
                          `DATA_FRAGMENT: ${memoryCode}\n` +
                          `ENCRYPTED_PAYLOAD: ${encryptedContent}\n` +
                          `CHECKSUM: ${crypto.createHash('md5').update(content).digest('hex')}\n` +
                          `TIMESTAMP: ${new Date().toISOString()}\n`;
        
        // Write USB file
        const usbFileName = `usb_${fileNumber}.dat`;
        const usbFilePath = path.join(USB_DIR, usbFileName);
        fs.writeFileSync(usbFilePath, usbContent);
        
        // Generate hash for USB file
        const usbHash = generateHash(usbContent);
        
        // Add to CSV data
        csvData.push(`${fileNumber},"${encryptedContent}",${memoryCode}`);
        
        // Add to hash data
        hashData.push(`${usbFileName},${usbHash}`);
        
        console.log(`Processed ${txtFile} -> ${usbFileName} (${memoryCode})`);
    });
    
    // Write encrypted memories CSV
    fs.writeFileSync(CSV_FILE, csvData.join('\n') + '\n');
    console.log(`\nWritten ${csvData.length - 1} entries to ${CSV_FILE}`);
    
    // Write hashes CSV
    fs.writeFileSync(HASHES_CSV, hashData.join('\n') + '\n');
    console.log(`Written ${hashData.length - 1} hashes to ${HASHES_CSV}`);
    
    // Summary
    console.log('\n=== PROCESSING COMPLETE ===');
    console.log(`Total memory files processed: ${txtFiles.length}`);
    console.log(`Total USB files created: ${txtFiles.length}`);
    console.log(`CSV file: ${CSV_FILE} (${csvData.length} lines including header)`);
    console.log(`Hash file: ${HASHES_CSV} (${hashData.length} lines including header)`);
    
    // Count by memory types
    const memoryCounts = {};
    csvData.slice(1).forEach(line => {
        const memoryCode = line.split(',')[2];
        const type = memoryCode.replace(/\d+$/, '');
        memoryCounts[type] = (memoryCounts[type] || 0) + 1;
    });
    
    console.log('\n=== MEMORY TYPE BREAKDOWN ===');
    Object.entries(memoryCounts).forEach(([type, count]) => {
        console.log(`${type}: ${count} fragments`);
    });
    
    return {
        memoryFiles: txtFiles.length,
        usbFiles: txtFiles.length,
        csvEntries: csvData.length - 1,
        hashEntries: hashData.length - 1
    };
}

// Verification function
function verifyProcessing() {
    console.log('\n=== VERIFICATION ===');
    
    // Check if CSV exists and count lines
    if (fs.existsSync(CSV_FILE)) {
        const csvContent = fs.readFileSync(CSV_FILE, 'utf8');
        const csvLines = csvContent.trim().split('\n').length;
        console.log(`✓ ${CSV_FILE} exists with ${csvLines} lines`);
    } else {
        console.log(`✗ ${CSV_FILE} does not exist`);
    }
    
    // Check if hash file exists
    if (fs.existsSync(HASHES_CSV)) {
        const hashContent = fs.readFileSync(HASHES_CSV, 'utf8');
        const hashLines = hashContent.trim().split('\n').length;
        console.log(`✓ ${HASHES_CSV} exists with ${hashLines} lines`);
    } else {
        console.log(`✗ ${HASHES_CSV} does not exist`);
    }
    
    // Check USB files count
    if (fs.existsSync(USB_DIR)) {
        const usbFiles = fs.readdirSync(USB_DIR).filter(f => f.endsWith('.dat'));
        console.log(`✓ ${USB_DIR} contains ${usbFiles.length} USB files`);
    } else {
        console.log(`✗ ${USB_DIR} does not exist`);
    }
    
    // Check memory files count
    const memoryFiles = fs.readdirSync(REMEMBER_DIR).filter(f => f.endsWith('.txt'));
    console.log(`✓ ${REMEMBER_DIR} contains ${memoryFiles.length} memory files`);
}

// Main execution
if (require.main === module) {
    console.log('🚀 Starting complete USB processing...\n');
    
    try {
        const results = processAllMemoryFiles();
        verifyProcessing();
        
        console.log('\n🎉 All processing completed successfully!');
        console.log(`📁 Created ${results.usbFiles} USB files in ${USB_DIR}/`);
        console.log(`📊 Generated ${results.csvEntries} encrypted memory entries`);
        console.log(`🔐 Generated ${results.hashEntries} secure hashes`);
        
    } catch (error) {
        console.error('❌ Error during processing:', error);
        process.exit(1);
    }
}

module.exports = {
    processAllMemoryFiles,
    extractFragmentInfo,
    encryptData,
    generateHash,
    verifyProcessing
};
