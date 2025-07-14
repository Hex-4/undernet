const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

// Secret key for encryption
const SECRET_KEY = process.env.HASH_KEY || 'ORPHEUSFURRY';

// Function to encrypt text using AES-256-CBC
function encryptText(text, secretKey) {
    // Create a hash of the secret key to ensure it's the right length for AES-256
    const key = crypto.createHash('sha256').update(secretKey).digest();
    
    // Generate a random initialization vector
    const iv = crypto.randomBytes(16);
    
    // Create cipher
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    
    // Encrypt the text
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    // Return IV + encrypted data (both in hex)
    return iv.toString('hex') + ':' + encrypted;
}

// Function to decrypt text (for verification purposes)
function decryptText(encryptedData, secretKey) {
    try {
        // Create a hash of the secret key
        const key = crypto.createHash('sha256').update(secretKey).digest();
        
        // Split IV and encrypted data
        const parts = encryptedData.split(':');
        const iv = Buffer.from(parts[0], 'hex');
        const encrypted = parts[1];
        
        // Create decipher
        const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
        
        // Decrypt
        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        
        return decrypted;
    } catch (error) {
        return null; // Decryption failed
    }
}

// Function to process all memory files and create encrypted CSV
function createEncryptedMemoriesCSV() {
    const rememberDir = path.join(__dirname, 'stages', '6_REMEMBER');
    const outputFile = path.join(__dirname, 'encrypted_memories.csv');
    
    try {
        // Read all files in the 6_REMEMBER directory
        const files = fs.readdirSync(rememberDir);
        
        // Filter only .txt files (exclude the Python script)
        const txtFiles = files.filter(file => 
            file.endsWith('.txt') && 
            file !== 'generate_memories.py'
        );
        
        // Sort files by number for consistent ordering
        txtFiles.sort((a, b) => {
            const numA = parseInt(path.parse(a).name);
            const numB = parseInt(path.parse(b).name);
            return numA - numB;
        });
        
        // Generate CSV content
        let csvContent = 'number,encryption\n';
        
        txtFiles.forEach(file => {
            // Extract number from filename (e.g., "0111.txt" -> "0111")
            const number = path.parse(file).name;
            
            // Read the entire file content
            const filePath = path.join(rememberDir, file);
            const fileContent = fs.readFileSync(filePath, 'utf8');
            
            // Encrypt the entire file content
            const encryptedContent = encryptText(fileContent, SECRET_KEY);
            
            // Add to CSV (escape any commas in the encrypted data)
            csvContent += `${number},"${encryptedContent}"\n`;
            
            console.log(`✅ Encrypted ${file} (${fileContent.length} chars)`);
        });
        
        // Write to CSV file
        fs.writeFileSync(outputFile, csvContent);
        
        console.log(`\n🔐 Generated encrypted_memories.csv with ${txtFiles.length} encrypted memory fragments`);
        console.log(`📁 Output file: ${outputFile}`);
        console.log(`🔑 Used secret key: ${SECRET_KEY.substring(0, 3)}***`);
        console.log(`⚠️  Without the secret key, these memories cannot be decrypted!`);
        
    } catch (error) {
        console.error('❌ Error creating encrypted memories:', error.message);
    }
}

// Function to verify encryption/decryption works
function verifyEncryption() {
    const testText = "This is a test memory fragment.";
    const encrypted = encryptText(testText, SECRET_KEY);
    const decrypted = decryptText(encrypted, SECRET_KEY);
    
    console.log('\n🧪 Encryption Test:');
    console.log('Original:', testText);
    console.log('Encrypted:', encrypted.substring(0, 50) + '...');
    console.log('Decrypted:', decrypted);
    console.log('Test passed:', testText === decrypted ? '✅' : '❌');
}

// Run the script
if (require.main === module) {
    console.log('🔧 Encrypting memory fragments with secret key...');
    verifyEncryption();
    createEncryptedMemoriesCSV();
}

module.exports = {
    encryptText,
    decryptText,
    createEncryptedMemoriesCSV
};
